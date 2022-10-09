import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpService } from 'src/app/service/http.service';
import { DateRangeDialog } from '../../../dialogs/date-range-dialog/date-range-dialog';
import { EventDialog } from '../../../dialogs/event-dialog/event-dialog';
import { CommunityActionService } from '../../community-action.service';
import { CommunityApiService } from '../../community-api.service';
import { CommunityStoreService } from '../../community-store.service';
import { Link } from '../../community.model';

@Component({
  selector: 'app-link-event-edit',
  templateUrl: './link-event-edit.component.html',
  styleUrls: ['../../community.component.less', './link-event-edit.component.less']
})
export class LinkEventEditComponent implements OnInit {
  @Input() link: Link;
  baseLogo: string;

  constructor(
    public communityActionService: CommunityActionService, 
    private communityApiService: CommunityApiService,
    private communityStoreService: CommunityStoreService,
    private httpService: HttpService,
    private matDialog: MatDialog) { }

  ngOnInit(): void {
    this.getBaseLogo();
  }

  getBaseLogo() {
    this.httpService.configFromDatabase.subscribe(res => {
      const eventsData = JSON.parse(res.properties.events);
      this.baseLogo = eventsData.baseEvent.default.logo;
    })
  }


  openEventDialog() {
    const eventDialog = this.matDialog.open(EventDialog, {
      panelClass: 'recommend-dialog',
      width: 'calc(100vw - 30px)',
      maxWidth: '1110px'
    })
    eventDialog.afterClosed().subscribe(result => {
      if (!result) {return}
      this.link.properties.type = result.type;
      this.link.properties.logo = result.logo;
      this.link.properties.alias = result.alias;
      this.communityApiService.updateLink(this.link).subscribe((updateLink: Link) => {
        this.communityStoreService.replaceLink(this.link, updateLink)
        // link.actions.isChanging = false;
      }) 
    })
  }
  openDateDialog() {
    const dateDialog = this.matDialog.open(DateRangeDialog, {
      panelClass: 'recommend-dialog',
      width: 'calc(100vw - 30px)',
      maxWidth: '1110px',
      data: {startDate: this.link.properties.startDate, endDate: this.link.properties.endDate}
    })
    if (this.link.properties.startDate && this.link.properties.endDate) {
      dateDialog.componentInstance.startDate = this.communityActionService.toIsoString(new Date(+this.link.properties.startDate));
      dateDialog.componentInstance.endDate = this.communityActionService.toIsoString(new Date(+this.link.properties.endDate));
    }
    dateDialog.afterClosed().subscribe(result => {
      if (!result) {return}
      this.link.properties.startDate = new Date(result.startDate).valueOf().toString();
      this.link.properties.endDate = new Date(result.endDate).valueOf().toString();
      this.communityApiService.updateLink(this.link).subscribe((updateLink: Link) => {
        this.communityStoreService.replaceLink(this.link, updateLink)

      }) 
    })
  }
}
