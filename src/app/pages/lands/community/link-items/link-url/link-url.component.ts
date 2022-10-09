import { Component, Input, OnInit } from '@angular/core';

import { CommunityActionService } from '../../community-action.service';
import { Link } from '../../community.model';

@Component({
  selector: 'app-link-url',
  templateUrl: './link-url.component.html',
  styleUrls: ['../../community.component.less']
})
export class LinkUrlComponent implements OnInit {
  @Input() link: Link;

  constructor(
    public communityActionService: CommunityActionService
    ) { 
    
  }

  ngOnInit(): void {
  }

}
