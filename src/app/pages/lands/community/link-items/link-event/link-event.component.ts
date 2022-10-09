import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommunityActionService } from '../../community-action.service';
import { Link } from '../../community.model';

@Component({
  selector: 'app-link-event',
  templateUrl: './link-event.component.html',
  styleUrls: ['../../community.component.less', './link-event.component.less']
})
export class LinkEventComponent implements OnInit, OnDestroy {
  startSeconds: number = 0;
  endSeconds: number = 0;
  isEventStart: boolean = false;
  isEventEnd: boolean = false;
  timeStyle: string;
  interval;

  @Input() link: Link;

  constructor(
    public communityActionService: CommunityActionService,
    ) {
      
  }

  ngOnInit(): void {
    this.startSeconds = (+this.link.properties.startDate - new Date().valueOf()) / 1000;
    this.endSeconds = (+this.link.properties.endDate - new Date().valueOf()) / 1000;
  }
  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  eventEnd(e) {
    this.interval = setInterval(() => {
      this.endSeconds--;
      if (this.endSeconds < 0) {
        this.isEventEnd = true;
        clearInterval(this.interval);
      }
    }, 1000);
  }
  eventTick(e) {
    if (e.tick_count <= 0) {
      this.isEventStart = true;
    }
    if (e.days >= 7) {
      this.timeStyle = 'time-board-7'
    } else if (e.days >=3) {
      this.timeStyle = 'time-board-3'
    } else if (e.days >= 0 && e.tick_count > 0) {
      this.timeStyle = 'time-board-0'
    }
  }
}
