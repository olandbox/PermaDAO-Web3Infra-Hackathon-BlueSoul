import { Component, Input, OnInit } from '@angular/core';
import { SearchBoard, SearchInfo } from "../home.model";

@Component({
  selector: 'app-search-tip',
  templateUrl: './search-tip.component.html',
  styleUrls: ['./search-tip.component.less']
})
export class SearchTipComponent implements OnInit {

  @Input() searchInfo: SearchInfo;
  @Input() searchBoard: SearchBoard;

  SearchBoard = SearchBoard;
  constructor() { }

  ngOnInit(): void {
  }

}
