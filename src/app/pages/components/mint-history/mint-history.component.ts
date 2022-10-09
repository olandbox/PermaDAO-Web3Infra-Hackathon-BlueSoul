import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { HttpService } from 'src/app/service/http.service';

export class History {
  registrant: string;
  originalName: string;
  time: string; // 秒
  tokenId: string;
}

@Component({
  selector: 'app-mint-history',
  templateUrl: './mint-history.component.html',
  styleUrls: ['./mint-history.component.less']
})
export class MintHistoryComponent implements OnInit, OnDestroy {

  @Input() lengthLimit: number = 5;

  pollTimer = null;


  historyList: History[] = [];
  pollHistoryList: History[] = [];

  constructor(private httpService: HttpService) { }

  ngOnInit(): void {
    this.initList();
  }
  ngOnDestroy(): void {
    // this.clearPolling();
  }


  initList() {
    this.httpService.getMintHistory().then(res => {
      this.historyList = res.reverse();

      // this.polling();
    })
  }


  polling() {
    this.pollTimer = setInterval(() => {
      this.httpService.getMintHistory().then(res => {
        this.historyList = res.reverse();
      })
    }, 10000)
  }

  clearPolling() {
    console.log('clear')
    clearInterval(this.pollTimer)
  }

}
