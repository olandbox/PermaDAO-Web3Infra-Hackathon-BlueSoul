import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { Interface } from 'ethers/lib/utils';
import { combineLatest, concat, merge } from 'rxjs';
import { ContractService } from 'src/app/service/contract.service';
import { HttpService } from 'src/app/service/http.service';
import { environment } from 'src/environments/environment.prod';


export interface Land {
  description: string;
  image: string;
  name: string;
  pids: string;
  cids: string;
  gene: string;
  url: string;
  level: string;
  length: string;
}

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.less']
})
export class DetailComponent implements OnInit {

  landName: string = '';
  landData: Land;
  landOwner: string = '';

  constructor(
    private activedRoute: ActivatedRoute, 

    private contractService: ContractService,
    private httpService: HttpService
  ) {
    
    this.landName = activedRoute.snapshot.paramMap.get('name');
    contractService.mainContract$.subscribe(isOk => {
      if (isOk) {
        this.initData();
        
      }
    })

  }

  ngOnInit(): void {
    global.window.scrollTo(0, 0);
  }

  async initData() {
    const standardName = await this.contractService.convertToStandard(this.landName);
    console.log(standardName)
    this.getMetaData(standardName);
    this.getOwner(standardName)
  }

  async getMetaData(name: string) {
    if (!name) return;
    try {
      const urlStr = await this.contractService.getMetadataUrl(name);
      const url = new URL(urlStr);
      const path = `/meta${url.pathname}`;
      this.landData = await this.httpService.getMetadata(path);
    } catch(e) {
      console.log('land not exist')
    }
    

  }

  async getOwner(name: string) {
    if (!name) return;
    try {
      this.landOwner = await this.contractService.getOwner(name);
    } catch(e) {
      console.log('have no owner')
    }
  }

  async goOpensea(name: string) {
    const standardName = await this.contractService.convertToStandard(this.landName);
    let uri = await this.contractService.getOpenseaUriByName(standardName);
    global.window.open(uri);
  }




}
