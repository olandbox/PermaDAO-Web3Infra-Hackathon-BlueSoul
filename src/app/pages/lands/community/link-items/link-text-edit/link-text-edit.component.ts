import { Component, Input, OnInit } from '@angular/core';
import { CommunityActionService } from '../../community-action.service';
import { Link } from '../../community.model';

@Component({
  selector: 'app-link-text-edit',
  templateUrl: './link-text-edit.component.html',
  styleUrls: ['../../community.component.less', '../link-event-edit/link-event-edit.component.less']
})
export class LinkTextEditComponent implements OnInit {
  @Input() link: Link;

  constructor(public communityActionService: CommunityActionService) { }

  ngOnInit(): void {
  }

}
