import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContractService } from 'src/app/service/contract.service';
import { SearchInfo } from "../home.model";

@Component({
  selector: 'app-minted',
  templateUrl: './minted.component.html',
  styleUrls: ['./minted.component.less']
})
export class MintedComponent implements OnInit {
  @Input() searchInfo: SearchInfo;
  @Input() searchName: string;

  constructor(private router: Router,
    private contractService: ContractService
    ) { }

  ngOnInit(): void {
    console.log(this.searchInfo)
  }

  goDetail(standardName) {
    this.router.navigate([standardName + '.verify']);
  }

  async goOpensea() {
    let uri = await this.contractService.getOpenseaUriByName(this.searchInfo.standardName);
    global.window.open(uri);
  }
}
