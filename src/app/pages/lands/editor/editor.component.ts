import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'src/app/service/cookie.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.less']
})
export class EditorComponent implements OnInit {

  constructor(
    private router: Router,
    private cookieService: CookieService
  ) { }

  ngOnInit(): void {
  }

  toEdit() {
    const url = this.router.url;
    this.router.navigate([url, 'edit']);
  }

  goLand() {
    this.router.navigate(['oland/r', 'land'])
  }
}
