import { Component, Input, OnInit } from '@angular/core';
import { CommunityActionService } from '../../community-action.service';
import { Link } from '../../community.model';

@Component({
  selector: 'app-link-web3-edit',
  templateUrl: './link-web3-edit.component.html',
  styleUrls: ['../../community.component.less', '../link-event-edit/link-event-edit.component.less']
})
export class LinkWeb3EditComponent implements OnInit {

  @Input() link: Link;

  constructor(public communityActionService: CommunityActionService) { }

  ngOnInit(): void {
  }

}
