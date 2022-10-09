import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, UrlSegment } from '@angular/router';
import { HttpService } from 'src/app/service/http.service';
import { ContractService } from 'src/app/service/contract.service';
import { forkJoin } from "rxjs";
import { BaseData } from './baseData';
import { MatDialog } from '@angular/material/dialog';
import { LanguageDialog } from './language-dialog';
import { ZeroHttpService } from 'src/app/service/zero-http.service';
import { ext, lang } from 'src/app/constants/lands';

@Component({
  selector: 'app-lands',
  templateUrl: './lands.component.html',
  styleUrls: ['./lands.component.less']
})
export class LandsComponent implements OnInit {
  EXT = ext;
  LANG = lang;
  account: string = '';
  owners: string[] = [];
  nameArray: string[];
  name: string; // 通过url获取land名
  isLoading: boolean = false;
  isSign: boolean = false; // 是否已签名
  rights: -1 | 0 | 1 = -1; // 无人有权 | 我有权 | 别人有权编辑
  // p | owner | verify : detail页-公共，私有，官方
  suffix: string = 'verify'; 
  edit: boolean = null; // 是否编辑状态
  editTab: '1' | '2' | '3' = '1' // 编辑tab，1,2,3 - basic | link | mapping;
  language: string = 'en';
  analysisData: any[] = [];
  

  baseData: BaseData = null;


  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private contractService: ContractService,
    private httpService: HttpService,
    private zeroHttpService: ZeroHttpService,
    private _matDialog: MatDialog,
  ) { 
    
    

    
    this.activeRoute.paramMap.subscribe(async(res: any) => {
      if (res.params.path) {
        this.nameArray = await this.zeroHttpService.convertDetailParam2Array(res.params.path);
        this.name = this.nameArray[0];
        this.suffix = this.nameArray[1];

        this.isLoading = true;

        if (this.nameArray.length > 2) {
          this.language = this.nameArray[3];

          this.getLandInfoByUrlParam();
        } else {
          this.language = this.zeroHttpService.landLanguage;

          this.contractService.account$.subscribe(account => {
            this.account = account;
            this.rights = this.owners.includes(this.account) ? 0 : 1;
        });
          this.getLand();
        }

      } else {
        this.router.navigate(['oland/r/404'])
      }
    })

    
    
  }

  async ngOnInit(): Promise<void> {
  }

  get objectStatus() {
    if (this.baseData === null || this.baseData === undefined ) {
      return -1;
    } else {
      return Object.keys(this.baseData).length;
    }
  }

  getLandInfoByUrlParam() {
    this.analysisData = [];
    forkJoin([this.zeroHttpService.getZeroKownlege(this.nameArray, 'link'), this.zeroHttpService.getZeroKownlege(this.nameArray, 'property')]).subscribe(async ([resLinks, land]) => {

        resLinks.data.forEach(item => {
            this.analysisData.push(item[0].properties);
        })

        if (this.analysisData.length == 1 && this.analysisData[0].category == 'url' && /^(http|https):\/\//.test(this.analysisData[0].url)) {
            global.window.location = this.analysisData[0].url;
            return;
        }



        // land本身属性处理
        if (land.data.length > 0) {
            let type = this.nameArray[2];
            const landProperties = land.data[0][0].properties;
            const landPropertiesArray: string[] = Object.keys(landProperties);
            const category = type === 'logo' ? 'image' : 'text';
            if (this.language) {
             
                if (this.language !== lang.default) {
                    type = type + '_' + this.language;
                }
                if (landPropertiesArray.includes(type)) {
                    this.analysisData.push({category: category, alias: landProperties.name, logo: landProperties[type], url: landProperties[type]});
                }
            } else {
                landPropertiesArray.forEach(property => {
                    if (property.indexOf(type)  === 0 && property.indexOf('Status') < 0) {
                        const languageAbbr = property.indexOf('_') < 0 ? lang.default : property.replace(type + '_', '');
                        this.analysisData.push({category: category, alias: landProperties.name, logo: landProperties[property], url: landProperties[property], language: languageAbbr});
                    }
                })
            }

        }

        if (this.analysisData.length == 0) {
            // this.router.navigate(['oland/r/404'])
        }
        this.isLoading = false;
    })
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

  switchTab(suffix) {
    this.suffix = suffix;
    let url = decodeURI(this.router.url);
    url.split('.')[0] + '.' + suffix;
    this.httpService.emitData(false);
    this.router.navigate([url.split('.')[0] + '.' + suffix])
  }

  changeLanguage() {
    const language = this._matDialog.open(LanguageDialog, {
        panelClass: 'lands-add-dialog',
        width: 'calc(100vw - 30px)',
        maxWidth: '1110px',
        data: {name: this.language, languages: this.baseData.languages}
    })
    language.afterClosed().subscribe(result => {
      if (result) {
        this.language = result ? result : 'en';
      }
    })
  }

  goDc() {
    global.window.open('https://discord.gg/2pgsTcfyDH', '_blank');
  }

}
