import { AfterViewInit, Component, ElementRef, HostListener, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { HttpService } from 'src/app/service/http.service';
import { BaseData } from '../baseData';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { AlertService } from 'src/app/service/alert.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FilesService } from 'src/app/service/files.service';
import { ext, category } from 'src/app/constants/lands';
import { CommunityApiService } from './community-api.service';
import { CommunityStoreService } from './community-store.service';
import { Link } from './community.model';
import { CommunityActionService } from './community-action.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.less'],
})
export class CommunityComponent implements OnInit, OnChanges, OnDestroy {

  CATEGORY = category;

  name: string;
  _baseData: BaseData;

  @Input() loader = false;
  @Input() suffix;
  @Input() edit: boolean;
  @Input() language: string;
  @Input()
  set baseData(value: BaseData) {
    this._baseData = {...value};
    
  }
  get baseData(): BaseData {
    return this._baseData;
  }

  linksSub?: Subscription;

  links: Link[];
  linksShow: Link[];

  isAdding: boolean = false;
  serviceCommunityListen: any;

  constructor(
    private httpService: HttpService,
    private matDialog: MatDialog,
    private filesService: FilesService,
    private alertService: AlertService,
    private communityApiService: CommunityApiService,
    private communityActionService: CommunityActionService,
    private communityStoreService: CommunityStoreService
  ) { }

  ngOnInit(): void {

    // init links from api
    if (!this._baseData.languages.includes(this.language) && this.edit) {
      this.communityApiService.createLinks(this._baseData.id, this.language).subscribe((links: Link[]) => {
        this.communityStoreService.setLinks(links);
      })
    } else {
      this.communityApiService.getLinks(this._baseData.id, this.language).subscribe((links: Link[]) => {
        this.communityStoreService.setLinks(links);
      })
    }


    // get links from store
    this.linksSub = this.communityStoreService.getLinks().subscribe((links: Link[]) => {
      this.links = links;
      this.linksShow = this.links.filter((link: Link) => link.properties.status == 1 && !this.communityActionService.validLinkToHide(link));
    })
  }
  ngOnDestroy(): void {
    if (this.linksSub) this.linksSub.unsubscribe(); 
    // this.serviceCommunityListen.unsubscribe();
  }
  ngOnChanges(changes: SimpleChanges): void {

  }

  drop(event: CdkDragDrop<unknown>) {
    moveItemInArray(this.links, event.previousIndex, event.currentIndex);
    this.links.map((link: Link, i: number) => {
      link.properties.sort = this.links.length - i;
    })
    this.communityApiService.batchUpdateLinks(this.links).subscribe(res => {
      if (res.code === 0) {
        this.alertService.create({
          body: 'The sequence has been adjusted successfully.',
          color: 'success',
          time: 2000
        });
        this.communityStoreService.setLinks(this.links);
      } else {
        this.alertService.create({
          body: 'Changing failed.',
          color: 'danger',
          time: 2000
        })
      }
    })
  }




  add (category: string) {
    // let maxSort = 0;
    // this.communities.forEach(item => {
    //   if (item.sort > maxSort) {
    //     maxSort = item.sort + 1
    //   }
    // })
    // let propertyObj = {
    //   category: category,
    //   alias: '',
    //   url: '',
    //   logo: '',
    //   language: this.language,
    //   sort: maxSort,
    //   status: 1,
    //   type: category
    // }
    // this.httpService.createLinkApi(this.baseData.id, propertyObj).subscribe((data: any) => {
    //   if (!data) {
    //     this.httpService.emitCommunity(0, '');
    //     return;
    //   };
    //   const params = {
    //     id: data.relationship.id,
    //     endId: data.relationship.endNodeId,
    //     alias: data.relationship.properties.alias,
    //     logo: data.relationship.properties.logo,
    //     url: data.relationship.properties.url,
    //     status: data.relationship.properties.status,
    //     sort: data.relationship.properties.sort,
    //     type: data.relationship.properties.type,
    //     category: data.relationship.properties.category
    //   }
    //   this.communities.unshift(new Community(params));
    //   this.httpService.emitCommunity(0, '');
    // });
  }


  download(url, alias) {
    const index = url.lastIndexOf(".");
    const suffix = url.substr(index + 1);

    this.filesService.getBase64ImageFromURL(url).subscribe(base64data => {

      const base64Image = `data:image/${suffix};base64,${base64data}`;

      // save image to disk
      var link = document.createElement("a");
      document.body.appendChild(link); // for Firefox

      link.setAttribute("href", base64Image);
      link.setAttribute("download", `${alias}.${suffix}`);
      link.click();
    })
  }


  


}


