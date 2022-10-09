import { Component, OnInit, OnDestroy } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import { ContractService } from 'src/app/service/contract.service';



import { SearchInfo ,SearchBoard, Card, Cards } from "./home.model";


import { Observable, Subject  } from 'rxjs';
import { HttpService } from 'src/app/service/http.service';
import { AlertService } from 'src/app/service/alert.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeService } from './home.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit, OnDestroy {

  // statuEnum = BoardStatus;
  // boardStatus: BoardStatus = BoardStatus.offLine;
  // isSearching: boolean = false;
  // isSubmitting: boolean = false;
  // isMinting: boolean = false;
  // rise: string = '0.1';

  // chainStatus: boolean;
  // account: string;
  // defaultInfo: any;
  // landName: string;

  // landInfo: LandInfo = new LandInfo();
  // verifyTip: boolean = false;
  // mintSlipToggle: boolean = false;

  // // -----
  
  // account$: Observable<string>;
  // chainStatus$: Observable<boolean>;
  // rightChain$: Observable<boolean>;
  // onDestroy$: Subject<boolean> = new Subject();

  account: string;
  chainStatus: boolean = false;


  searchName: string;
  searchedName: string;
  searchDisable: boolean = true;
  searchLoading: boolean = false;
  searchVerify: boolean = true;
  SearchBoard = SearchBoard;
  searchBoard: SearchBoard = SearchBoard.notSearch;
  searchInfo: SearchInfo;

  mintDisable: boolean = true;
  mintLoading: boolean = false;
  
  constructor(
    private router: Router,
    private  modalService: NgbModal,
    private contractService: ContractService,
    private httpService: HttpService,
    private alertService: AlertService,
    private activatedRoute: ActivatedRoute,
    private homeService: HomeService
    ) {
      // 检查链是否正确，如果不正确，就禁止搜索
    this.contractService.chainStatus$.subscribe(status => {
      if (!status) {
        this.searchDisable = true;
      } else {
        this.searchDisable = false;
      }
    })
    // 获取登录账号
    this.contractService.account$.subscribe(account => {
      this.account = account;
    })
    // 获取url的param?v=xx&s=xx | voucherId 和 nameString
    this.activatedRoute.queryParams.subscribe(async (queryParams) => {
      this.clearSearch();

      if (queryParams.voucher) {
        this.searchInfo.selectedCardId = queryParams.voucher;
      }
      if (queryParams.s) {
        this.searchName = decodeURI(queryParams.s).trim().replace(/\s+/g," ");
      } else {
        this.searchName = '';
      }
      this.search(this.searchName);
    })
     
    }

  private clearSearch() {
    this.searchInfo = {};
    this.searchVerify = true;
  }

  ngOnInit(): void {

  }


  ngOnDestroy(): void {
    // this.onDestroy$.next(true);
    // this.onDestroy$.unsubscribe();
  }

  async getSearchBoard(standardName: string) {
    if (standardName === '') {
      this.searchBoard = SearchBoard.notSearch;
      return;
    }

    const verify = this.homeService.searchVerify(standardName);
    if (!verify) {
      this.searchVerify = false;
      this.searchBoard = SearchBoard.notSearch;
      return;
    }
      
    const inside = this.homeService.searchInside(standardName);
    if (!inside) {
      this.searchBoard = SearchBoard.notOpen;
      return;
    }

    const minted = await this.contractService.isExist(standardName);
    if (minted) {
      this.searchBoard = SearchBoard.minted;
    } else {
      this.searchBoard = SearchBoard.notMint;
    }
  }

  goSearch(searchName) {
    
    const url = this.router.url.split('?')[0];
    this.router.navigate([url], {queryParams: {s: searchName, voucher: this.searchInfo.selectedCardId}});
  }

  async search(searchName: string) {

    this.searchLoading = true;
    this.searchDisable = true;
    this.searchedName = searchName;

    this.searchInfo.standardName = this.homeService.searchToStandard(searchName);
    this.searchInfo.logicLength = this.homeService.searchLength(this.searchInfo.standardName);

    await this.getSearchBoard(this.searchInfo.standardName);
    if (this.searchBoard === SearchBoard.minted) {
      this.searchInfo.owner = await this.contractService.getOwner(this.searchInfo.standardName);
      try {
        const metaDataUrl = await this.contractService.getMetadataUrl(this.searchInfo.standardName);
        const imgUrl = await this.httpService.getMetadata('/img/' + metaDataUrl)
        this.searchInfo.img = imgUrl.image
      } catch (error) {
        this.searchInfo.img = (await this.contractService.getMetadataUrl(this.searchInfo.standardName)).replace('data.json', 'image.png');
      }
      

      
    }
    if (this.searchBoard === SearchBoard.notMint) {
      this.searchInfo.originPrice = await this.contractService.getPriceByLen(this.searchInfo.logicLength);
    }

    this.searchLoading = false;
    this.searchDisable = false;
  }



  async mint() {

  }



  // -----------------------------------

  


  async goDetail(searchName: string) {
    this.router.navigate([searchName + '.verify'])
  }


}
