import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router, Data, ActivationStart } from '@angular/router';
import { url } from 'inspector';
import { filter } from 'rxjs/operators';
import { HttpService } from './service/http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  isShare: boolean = false;

  constructor(
    private titleService: Title, 
    private router: Router, 
    private activedRoute: ActivatedRoute,
    private httpService: HttpService
    ) {

      this.router.events.subscribe(event => {
        if (event instanceof ActivationStart) {
          let data = event.snapshot.data;
          if (data.hide) {
            this.isShare = true;
          } else {
            this.isShare = false;
          }

          this.titleService.setTitle('OLand ');
        }
      })

  }

  ngOnInit(): void {
    this.httpService.configFromDatabase.subscribe()
  }


}
