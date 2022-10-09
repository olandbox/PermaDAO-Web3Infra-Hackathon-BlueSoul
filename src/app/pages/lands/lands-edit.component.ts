
import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertService } from "src/app/service/alert.service";
import { ContractService } from "src/app/service/contract.service";
import { HttpService } from "src/app/service/http.service";
import { BaseData } from "./baseData";
import { ext, lang}  from "src/app/constants/lands";
import { LanguageDialog } from "./language-dialog";
import { ZeroHttpService } from "src/app/service/zero-http.service";


@Component({
    selector: 'app-lands-edit',
    templateUrl: './lands-edit.component.html',
    styleUrls: ['./lands-edit.component.less']
  })
export class LandsEditComponent implements OnInit, OnDestroy {

    EXT = ext;
    editTab: '1' | '2' | '3' = '1' // 编辑tab，1,2,3 - basic | link | mapping;
    account: string = '';
    name: string; // 通过url获取land名
    suffix: string = ext.detail_verify; 
    isSign: boolean = null; // 是否已签名
    rights: -1 | 0 | 1 = -1; // 无人有权 | 我有权 | 别人有权编辑
    isLoading: boolean = false;
    baseData: BaseData = null;
    combineService: any = null;
    language: string = lang.default;
    owners: string[] = [];
    

    constructor(
        private router: Router,
        private activeRoute: ActivatedRoute,
        private contractService: ContractService,
        private httpService: HttpService,
        private zeroHttpService: ZeroHttpService,
        private alertService: AlertService,
        private _matDialog: MatDialog,
    ) {

        this.activeRoute.params.subscribe(async (params: any) => {
            if (params.name) {
                let nameArray = await this.zeroHttpService.convertDetailParam2Array(params.name);
                this.name = nameArray[0];
                this.suffix = nameArray[1];

                if (this.suffix !== ext.detail_verify && this.suffix !== ext.detail_private) {
                    this.router.navigate(['oland/r/404'])
                }

                this.contractService.account$.subscribe(async (account) => {
                    this.isLoading = true;
                    this.account = account;
        
                    if (this.account) {
                        await this.getIsLogin();
                        if (this.isSign) {
                            this.getLand();
                        } else {
                            this.isLoading = false;
                        }
                    } else {
                        this.isLoading = false;
                    }
                })

            } else {
                this.router.navigate(['oland/r/404'])
            }
        })
        
       
        
    }

    get objectStatus() {
        if (this.baseData === null || this.baseData === undefined ) {
          return -1;
        } else {
          return Object.keys(this.baseData).length;
        }
    }


    ngOnInit(): void {

        
    }
    ngOnDestroy(): void {

    }

    async getIsLogin() {
        const data:any = await this.httpService.isLogin();
        this.isSign = data.code === 0;
    }
    async sign() {
        const noncestr: any = await this.httpService.noncestr(this.account);
        const hexMessage = await this.contractService.hexMessage(noncestr.data);
        const signature = await this.contractService.signature(hexMessage, this.account);
        if (signature) {
            const data: any = await this.httpService.login(this.account, signature, hexMessage, noncestr.data);
            if (data.code !== 0) {
                this.alertService.create({
                body: 'Error: ' + data.message,
                color: 'danger',
                time: 2000
                });
                this.isSign = false;
            } else {
                this.isSign = true;
                this.getLand();
            }
        } else {
            this.isSign = false;
        }
    }

    switchTab(suffix) {
        this.suffix = suffix;
        let urlArray = this.router.url.split('/')
        urlArray.shift();
        urlArray[1] = urlArray[1].split('.')[0] + '.' + suffix
        urlArray[1] = decodeURI(urlArray[1]);
        this.httpService.emitData(false);
        this.router.navigate(urlArray)
    }


    async getLand() {
        this.baseData = null;
    
        let params: any = {};
        if (this.suffix === ext.detail_private) { 
          params = this.httpService.getOwnerLandParams(this.name);
        }
        if (this.suffix === ext.detail_verify) { 
          params = this.httpService.getVerifyLandParams(this.name); 
        }
        if (this.suffix === ext.detail_public) {
          params = this.httpService.getPublicLandParams(this.name);
        }
        
    
        this.httpService.getLandV2Api(params).subscribe(async(res) => {
          if (res.data.length === 0) {
            this.baseData = {};
            this.rights = -1;
          } else {
            this.baseData = res.data[0][0].properties;
            this.baseData.languages = JSON.parse(this.baseData.languages || `"['${this.language}']"`);
            this.baseData.id = res.data[0][0].id;
            this.setLandStatus();
    
            this.owners = [];
            res.data.forEach(element => {
              if (element[1]) {
                this.owners.push(element[1].properties.metadata)
              }
            });
            this.rights = this.owners.includes(this.account) ? 0 : 1;
          }
          this.isLoading = false;
        })
      }
    setLandStatus() {
        if (!this.baseData.hasOwnProperty('introStatus')) {this.baseData.introStatus = 1}
        if (!this.baseData.hasOwnProperty('logoStatus')) {this.baseData.logoStatus = 1}
    }

    updateData($event) {
        this.baseData = Object.assign(this.baseData, $event);
    }

    changeLanguage() {
        const language = this._matDialog.open(LanguageDialog, {
            panelClass: 'lands-add-dialog',
            width: 'calc(100vw - 30px)',
            maxWidth: '1110px',
            data: {
                name: this.language,
                // languages: this.baseData.languages
            }
        })
        language.afterClosed().subscribe(result => {
            if (result) {
                this.language = result ? result : lang.default;
            }
        })
    }


}