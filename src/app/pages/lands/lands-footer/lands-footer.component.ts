import { ChangeDetectorRef, Component, HostListener, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/service/http.service';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ext } from 'src/app/constants/lands';
import { CommunityApiService } from '../community/community-api.service';
import { Link, LinkProperties } from '../community/community.model';
import { Subscription } from 'rxjs';
import { CommunityStoreService } from '../community/community-store.service';
import { BaseData } from '../baseData';

@Component({
  selector: 'app-lands-footer',
  templateUrl: './lands-footer.component.html',
  styleUrls: ['./lands-footer.component.less']
})
export class LandsFooterComponent implements OnInit, OnChanges, OnDestroy {

  @Input() tab;
  @Input() language;
  @Input()
  set baseData(value: BaseData) {
    this._baseData = {...value};
    
  }
  get baseData(): BaseData {
    return this._baseData;
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    this.calScroll()
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.calScroll()
  }
  
  _baseData: BaseData;
  linksSub?: Subscription;

  links: Link[];
  name: string;
  suffix: string;
  isAdding: boolean = false;
  isCoverFooter: boolean = true;
  serviceCommunityListen: any;
  servicDataListen: any;
  

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private httpService: HttpService,
    private communityApiService: CommunityApiService,
    private communityStoreService: CommunityStoreService,
    private _bottomSheet: MatBottomSheet,
    private _matDialog: MatDialog
    ) { 
      this.activeRoute.params.subscribe(param => {
        let nameArray = decodeURI(param.name).split('.');
        this.name = nameArray[0].trim().replace(/\s{2,}/g, ' ').toLowerCase();
        this.suffix = nameArray[1];
      })
    }

  ngOnInit(): void {
    this.servicDataListen = this.httpService.dataListen.subscribe(isEnd => {
      if (isEnd) {
        this.calScroll();
      }
    })

    this.linksSub = this.communityStoreService.getLinks().subscribe((links: Link[]) => {
      this.links = links;
    })
  }
  ngOnDestroy(): void {
    if (this.linksSub) this.linksSub.unsubscribe(); 
    this.servicDataListen.unsubscribe();
  }
  ngOnChanges(changes: SimpleChanges) {
    this.isCoverFooter = true;
  }



  share() {
    const addRef = this._matDialog.open(ShareDialog, {
      panelClass: 'recommend-dialog',
      width: 'calc(100vw - 30px)',
      maxWidth: '1110px'
    })
  }

  cancelEdit() {
    let name = this.suffix === ext.detail_verify ? `${this.name}.${ext.share_verify}` : `${this.name}.${ext.share_private_soul}`
    this.router.navigate([name])
  }

  openAdd() {
    const addRef = this._matDialog.open(AddDialog, {
      panelClass: 'lands-add-dialog',
      width: 'calc(100vw - 30px)',
      maxWidth: '1110px'
    })
    addRef.afterClosed().subscribe(result => {
      this._matDialog.closeAll();
      
      let maxSort = 0;
      this.links.forEach((link: Link) => {
        if (link.properties.sort > maxSort) {
          maxSort = link.properties.sort + 1
        }
      })
      const property: LinkProperties = {
        category: result,
        alias: '',
        url: '',
        logo: '',
        language: this.language,
        sort: maxSort,
        status: 1,
        type: result,
        startDate: '',
        endDate: ''
      }

      this.isAdding = true;
      this.communityApiService.addLink(this._baseData.id, property).subscribe((link: Link) => {
        if (link.id !== null ) {
          this.communityStoreService.addLink(link);
        }
        this.isAdding = false;
      })
    })
  }


  calScroll() {
    // 文档距顶
    var scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0;
    if(document.body){
      bodyScrollTop = document.body.scrollTop;
    }
    if(document.documentElement){
      documentScrollTop = document.documentElement.scrollTop;
    }
    scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
    // 文档高度
    var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
    if(document.body){
      bodyScrollHeight = document.body.scrollHeight;
    }
    if(document.documentElement){
      documentScrollHeight = document.documentElement.scrollHeight;
    }
    scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
    // 视窗高度
    var windowHeight = 0;
    if(document.compatMode == "CSS1Compat"){
      windowHeight = document.documentElement.clientHeight;
    }else{
      windowHeight = document.body.clientHeight;
    }
    // 
    if (scrollTop + windowHeight + 60 >= scrollHeight) {
      this.isCoverFooter = true;
    } else {
      this.isCoverFooter = false;
    }
  }
    

}


@Component({
  selector: 'add-dialog',
  templateUrl: 'add-dialog.html',
})
export class AddDialog {
  constructor(
    public dialogRef: MatDialogRef<AddDialog>,
  ) {}
  close() {
    this.dialogRef.close()
  }
}

@Component({
  selector: 'share-dialog',
  templateUrl: 'share-dialog.html',
})
export class ShareDialog {
  shareLink: string;
  constructor(
    public dialogRef: MatDialogRef<ShareDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private httpService: HttpService,
  ) {
    if (data?.url) {
      this.shareLink = data.url
    } else {
      this.httpService.configFromDatabase.subscribe(res => {
        let href = new URL(window.location.href);
        this.shareLink = res.properties.host + href.pathname.replace('erify/edit', '').replace('owner/edit', 's');
      })
    }
  }
  close() {
    this.dialogRef.close()
  }
}


