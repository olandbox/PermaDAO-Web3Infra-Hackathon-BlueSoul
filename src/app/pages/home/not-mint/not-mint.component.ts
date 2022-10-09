import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { AlertService } from 'src/app/service/alert.service';
import { ContractService } from 'src/app/service/contract.service';
import { CardStatus, LandInfo, SearchInfo } from '../home.model';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-not-mint',
  templateUrl: './not-mint.component.html',
  styleUrls: ['./not-mint.component.less']
})
export class NotMintComponent implements OnInit {
  @Input() searchInfo: SearchInfo;
  @Input() searchName: string;

  account: string;
  cardExist: boolean = false;
  offPrice: string;
  reducePrice: string;
  CardStatus = CardStatus;
  cardStatus: CardStatus = CardStatus.notSelected;
  rise: string = '0.1';
  mintLoading: boolean = false;
  mintSlipToggle: boolean = false;
  

  constructor(
    private router: Router,
    private contractService: ContractService,
    private activatedRoute: ActivatedRoute,
    private homeService: HomeService,
    private alertService: AlertService
  ) { 
    // this.activatedRoute.queryParams.subscribe(queryParams => {

    //   this.cardStatus = CardStatus.notSelected;
    //   this.offPrice = '';
    //   this.reducePrice = '';

    //   if (queryParams.voucher) {
    //     this.verifyCard(queryParams.voucher)
    //   }
    // })
    // this.contractService.account$.subscribe(account => {
    //   this.account = account;
    // })


    combineLatest([this.contractService.account$, this.activatedRoute.queryParams]).subscribe(([accout, queryParams]) => {
      this.account = accout;

      this.cardStatus = CardStatus.notSelected;
      this.offPrice = '';
      this.reducePrice = '';

      if (queryParams.voucher) {
        this.verifyCard(queryParams.voucher)
      }
    })
  }

  ngOnInit(): void {
    if (this.searchInfo.logicLength == 5) {
      this.rise = '0.9'
    }
    if (this.searchInfo.logicLength == 6) {
      this.rise = '0.5'
    }
    if (this.searchInfo.logicLength == 7) {
      this.rise = '0.3'
    }
  }

  async verifyCard(voucherId: string) {
    const owned = await this.contractService.getBalanceOf(this.account, +voucherId);
    let cardLength = +voucherId.slice(0, -2);
    if (+voucherId === 6100) cardLength = 6; // 特殊券
    if (owned <= 0) {
      this.cardStatus = CardStatus.notSelected;
    } else if (owned > 0 && cardLength != this.searchInfo.logicLength) {
      this.cardStatus = CardStatus.invalidSelected;
    } else if (owned > 0 && cardLength == this.searchInfo.logicLength) {
      this.cardStatus = CardStatus.validSelected;
      this.offPrice = await this.contractService.getPriceByCard(+voucherId); 
      console.log(this.offPrice)
      const originPrice = await this.contractService.getPriceByLen(this.searchInfo.logicLength);
      this.reducePrice = this.homeService.priceSub(originPrice, this.offPrice);
      console.log(originPrice, this.reducePrice)
    }
  }

  get mintDisable() {
    if (this.searchInfo.logicLength < 8 && this.cardStatus != CardStatus.validSelected) {
      return true;
    } 
    return false;
  }

  async mint() {
    if (!this.account) {
      await this.contractService.connectAccount();
      return;
    }
    this.mintLoading = true;
    try {
      // 判断是否授权
      const isApproved = await this.contractService.isApproved(this.account)
      console.log('isApproved', isApproved)
      if (!isApproved) {
        const setApproved = await this.contractService.setApprove(true);
        if (!setApproved.status) return;
      }

      let mint: any;
      if (this.cardStatus == CardStatus.validSelected) {
        const nowPrice = await this.contractService.getPriceByCard(+this.searchInfo.selectedCardId);
        const nowSlipPrice = await this.contractService.getSlipPriceWei(nowPrice);
        mint = await this.contractService.mintByCard(this.searchName, nowSlipPrice, +this.searchInfo.selectedCardId);
      } else {
        const nowPrice = await this.contractService.getPriceByStr(this.searchInfo.standardName);
        const nowSlipPrice = await this.contractService.getSlipPriceWei(nowPrice);
        mint = await this.contractService.mint(this.searchName, nowSlipPrice);
      }
      if (mint.status) {
        this.clearSearch();
      }
    } catch (error) {
      console.error(error)
      this.alertService.create({
        body: 'Mint Failed',
        color: 'danger',
        time: 5000
      })
    } finally {
      this.mintLoading = false;
    }

  }

  clearSearch() {
    this.router.navigate(['oland/r', 'mint'])
  }

  async goDetail(searchName: string) {
    this.router.navigate([searchName + '.verify'])
  }

  
}
