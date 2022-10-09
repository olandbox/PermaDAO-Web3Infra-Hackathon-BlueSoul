import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {Clipboard} from '@angular/cdk/clipboard';
import { ContractService } from 'src/app/service/contract.service';
import { HttpService } from 'src/app/service/http.service';
import { environment } from 'src/environments/environment';
import { BaseData } from '../baseData';
import { Cypher } from '../cypher';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/service/alert.service';
import { faThemeisle } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.less']
})
export class MappingComponent implements OnInit, OnChanges {

  @Input() baseData: BaseData;
  @Input() suffix;
  baseUrl = '';
  account: string = '';
  lands: any[] = null;
  privatePage = {
    length: 29,
    pageSize: 30,
    pageIndex: 0
  }

  constructor(
    private router: Router,
    private contractService: ContractService,
    private httpService: HttpService,
    private clipboard: Clipboard,
    private alertService: AlertService
  ) {
    this.httpService.configFromDatabase.subscribe(res => {
      this.baseUrl = res.properties.host + '/';
    })
   }

  ngOnInit(): void {
    this.contractService.account$.subscribe(account => {
      this.account = account;
    })
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.baseData.currentValue) {
      this.getLands()
    }
  }

  async getLands() {
    const params = this.httpService.getOwnLandsParams(this.baseData.name, this.privatePage.pageIndex, this.privatePage.pageSize);
    this.httpService.getLandV2Api(params).subscribe(res => {
      this.lands = [];
      if (!res) return;
      res.data.forEach(item => {
        this.lands.push({
          id: item[0].id,
          name: item[0].properties.name,
          mapping: item[0].properties.mapping ? true: false
        });
      });
      setTimeout(() => {
        this.httpService.emitData(true);
      });
      this.privatePage.length = res.total;
      this.privatePage.pageIndex = res.page - 1;
    })
  }

  privatePageChange(e) {
    this.privatePage = e;
    this.getLands();
  }

  getAccount(name) {
    if (name.length > 12) {
      return name.slice(0,6) + '...' + name.slice(name.length - 4)
    } else {
      return name
    }
  }
  randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  mappingChange(e, item) {
    const status = e.currentTarget.checked ? 1 : 0;
    const matchQuery = this.httpService.updateOwnerLandMapping(item.id, status);
    this.httpService.updateDatabase(matchQuery).subscribe(res => {
      if (res.length > 0) {
        let message = status ? `Domain mapping is open, you can access your personal profile though "${item.name}.o"` : `Domain mapping is closed.`
        this.alertService.create({
          body: message,
          color: 'success',
          time: 2000
        })
      } else {
        this.alertService.create({
          body: 'Domain mapping failed.',
          color: 'danger',
          time: 2000
        })
      }
      
    })
  }

  copy(name: string) {
    this.httpService.configFromDatabase.subscribe(res => {
      const link = res.properties.host + '/' + encodeURI(name)
      this.clipboard.copy(link);
      this.alertService.create({
        body: `Copy successfully, go and share your profile link`,
        color: 'success',
        time: 2000
      })
    })

  }

  cancelEdit() {
    this.router.navigate([this.baseData.name + '.' + this.suffix]);
  }
}
