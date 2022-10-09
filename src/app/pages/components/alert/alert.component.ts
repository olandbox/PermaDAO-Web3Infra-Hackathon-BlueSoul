import { Component, OnInit } from '@angular/core';
import{ trigger, transition, style, state, animate  } from '@angular/animations';
import { AlertService } from 'src/app/service/alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.less']
})
export class AlertComponent implements OnInit {

  title: string;
  body: string;
  color: string;
  time: number;
  haveClose: boolean;
  alertStatus: boolean;

  constructor(
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.alertService.alertSetting$.subscribe(data => {
      if (data === null) {
        this.alertStatus = false;
        return;
      }
      this.title = data.title ? data.title : '';
      this.body = data.body;
      this.color = data.color ? data.color : 'primary';
      this.time = data.time ? data.time : null;
      this.haveClose = data.haveClose ? data.haveClose : false;

      this.alertStatus = true;

      if (this.time) {
        setTimeout(() => {
          this.alertStatus = false;
        }, this.time)
      }

    })

    
  }
  resolve() {
    this.alertStatus = false;
  }

}
