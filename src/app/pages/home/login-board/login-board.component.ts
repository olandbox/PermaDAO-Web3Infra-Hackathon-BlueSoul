import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login-board',
  templateUrl: './login-board.component.html',
  styleUrls: ['./login-board.component.less']
})
export class LoginBoardComponent implements OnInit {

  @Input() levelObj: any = null;


  constructor() {}

  ngOnInit(): void {


  }


}
