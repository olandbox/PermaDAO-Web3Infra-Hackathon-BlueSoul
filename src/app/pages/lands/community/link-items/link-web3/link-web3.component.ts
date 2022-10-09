import { Component, Input, OnInit } from '@angular/core';
import { CommunityActionService } from '../../community-action.service';
import { Link } from '../../community.model';

@Component({
  selector: 'app-link-web3',
  templateUrl: './link-web3.component.html',
  styleUrls: ['../../community.component.less']
})
export class LinkWeb3Component implements OnInit {
  @Input() link: Link;

  constructor(public communityActionService: CommunityActionService) { }

  ngOnInit(): void {
  }

}
