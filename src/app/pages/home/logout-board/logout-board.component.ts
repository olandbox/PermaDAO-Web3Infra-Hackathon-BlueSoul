import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { ContractService } from 'src/app/service/contract.service';


@Component({
  selector: 'app-logout-board',
  templateUrl: './logout-board.component.html',
  styleUrls: ['./logout-board.component.less']
})
export class LogoutBoardComponent implements OnInit, AfterViewInit {



  defaultInfo:any = null;

  constructor(public contractService: ContractService) {}

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.getDefaultInfo();
  }

  async getDefaultInfo() {
    this.defaultInfo = {
      'sixPrice': await this.contractService.getPriceByLen(6),
      'sevenPrice': await this.contractService.getPriceByLen(7),
      'eightPrice': await this.contractService.getPriceByLen(8),
      'amount': await this.contractService.getTotal()
    }
  }

}
