import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchInfo } from "../home.model";

@Component({
  selector: 'app-not-open',
  templateUrl: './not-open.component.html',
  styleUrls: ['./not-open.component.less']
})
export class NotOpenComponent implements OnInit {
  @Input() searchInfo: SearchInfo;
  @Input() searchName: string;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goDetail(standardName: string) {
    this.router.navigate([standardName + '.verify'])
  }
}
