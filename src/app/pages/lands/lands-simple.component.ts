import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Clipboard } from '@angular/cdk/clipboard';
import { AlertService } from "src/app/service/alert.service";
import { ContractService } from "src/app/service/contract.service";
import { HttpService } from "src/app/service/http.service";
import { BaseData } from "./baseData";
import { MatDialog } from "@angular/material/dialog";
import { ShareDialog } from "./lands-footer/lands-footer.component";
import { LanguageDialog } from "./language-dialog";
import { ZeroHttpService } from "src/app/service/zero-http.service";
import { ext, lang } from "src/app/constants/lands";
import { combineLatest, forkJoin } from "rxjs";
import { last, take, takeLast } from "rxjs/operators";


@Component({
    selector: 'app-lands-simple',
    templateUrl: './lands-simple.component.html',
    styleUrls: ['./lands-simple.component.less']
  })
export class LandsSimpleComponent implements OnInit{
    EXT = ext;
    LANG = lang;
    account: string = '';
    nameArray: string[];
    name: string; // 通过url获取land名
    suffix: string = ''; 
    isAnalysisPage = false;
    analysisData: any[] = [];
    isLoading: boolean = false;
    rights: -1 | 0 | 1 = -1; // 无人有权 | 我有权 | 别人有权编辑
    seconds: number = -1; // 倒计时
    baseData: BaseData = null;
    language: string;
    owners: string[] = [];
    
    constructor(
        private router: Router,
        private activeRoute: ActivatedRoute,
        private contractService: ContractService,
        private httpService: HttpService,
        private zeroHttpService: ZeroHttpService,
        private alertService: AlertService,
        private _matDialog: MatDialog,
        private clipboard: Clipboard
    ) {

    }

    async ngOnInit(): Promise<void> {

        // combineLatest([this.contractService.account, this.activeRoute.paramMap]).subscribe(([account, paramsMap]) => {
        //     console.log(account, paramsMap)
        // })

        // this.contractService.account.subscribe(res => console.log(res))

        this.activeRoute.paramMap.subscribe(async(res: any) => {
            const paramsName = res.params.path;

            if (paramsName) {
                this.nameArray = await this.zeroHttpService.convertShareParam2Array(paramsName);
    
                this.name = this.nameArray[0];
                this.suffix = this.nameArray[1];
    
                this.isLoading = true;
                if (this.nameArray.length > 2) {
    
                    this.isAnalysisPage = true;
                    this.language = this.nameArray[3];
    
                    this.getLandInfoByUrlParam();
    
                } else {
                    this.isAnalysisPage = false;
                    this.language = this.zeroHttpService.landLanguage;
    
                    this.contractService.account$.subscribe(account => {
                        this.account = account;
                        this.rights = this.owners.includes(this.account) ? 0 : 1;
                    });
    
                    this.getTheLand();
                }
            } else {
                this.router.navigate(['oland/r/mint'])
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


    getLandInfoByUrlParam() {
        this.analysisData = [];
        forkJoin([this.zeroHttpService.getZeroKownlege(this.nameArray, 'link'), this.zeroHttpService.getZeroKownlege(this.nameArray, 'property')]).subscribe(([resLinks, land]) => {

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


    getTheLand() {
        this.baseData = null;

        let params: any = {};
        if (this.nameArray[1] === ext.share_verify) { // verify land
            params = this.httpService.getVerifyLandParams(this.name);
        }
        else if (this.nameArray[1] === ext.share_private_soul) { // private land
            params = this.httpService.getOwnerLandParams(this.name);
        }
        else if (this.nameArray[1] === ext.share_private) { // mapping land
            params = this.httpService.getMappingLandParams(this.name);
        }
        else if (this.nameArray[1] === ext.share_public) {
            params = this.httpService.getPublicLandParams(this.name);
        } else {
            this.router.navigate(['oland/r/404'])
        }

        this.httpService.getLandV2Api(params).subscribe(res => {
            if (res.data.length === 0) {
                if (this.nameArray[1] === ext.share_private) {
                    this.mappingRedirect();
                } else {
                    this.landShowNull();
                }
            } else {
                this.landShowData(res.data);
            }
            this.isLoading = false;
        });
    }

    mappingRedirect() {
        this.seconds = 3;
        this.rights = -1;
        this.baseData = {};
        let timeDown = setInterval(() => {
        this.seconds--;
        if (this.seconds === 0) {
            clearInterval(timeDown);
            this.router.navigate([this.name+'.' + ext.detail_private]);
        }
        }, 1000)
    }

    landShowNull() {
        this.baseData = {};
        this.rights = -1;
    }

    landShowData(data) {
        this.baseData = data[0][0].properties;
        this.baseData.id = data[0][0].id;
        this.baseData.languages = JSON.parse(this.baseData.languages || `"['${this.language}']"`);

        if (!this.baseData.hasOwnProperty('introStatus')) {this.baseData.introStatus = 1}
        if (!this.baseData.hasOwnProperty('logoStatus')) {this.baseData.logoStatus = 1}

        let o = [];
        data.forEach(element => {
            if (element[1]) {
                o.push(element[1].properties.metadata)
            }
        });
        this.owners = o;
        this.rights = this.owners.includes(this.account) ? 0 : 1;
    }



    copy() {
        this.clipboard.copy(decodeURI(window.location.href));
        this.alertService.create({
            body: `Copy successfully, go and share your profile link`,
            color: 'success',
            time: 2000
        })
    }
    share() {
        const addRef = this._matDialog.open(ShareDialog, {
            panelClass: 'recommend-dialog',
            width: 'calc(100vw - 30px)',
            maxWidth: '546px'
        })
    }
    changeLanguage() {
        const language = this._matDialog.open(LanguageDialog, {
            panelClass: 'lands-add-dialog',
            width: 'calc(100vw - 30px)',
            maxWidth: '546px',
            data: {name: this.language, languages: this.baseData.languages}
        })
        language.afterClosed().subscribe(result => {
            if (result) {
                this.language = result ? result : lang.default;
            }
        })
    }

    goDetail() {
        if (this.suffix === ext.share_verify) {
            if (this.rights === 0) {
                this.router.navigate([this.name + '.' + ext.detail_verify, 'edit']);
            } else {
                this.router.navigate([this.name + '.' + ext.detail_verify]);
            }
            
        }
        else if (this.suffix === ext.share_public) {
            this.router.navigate([this.baseData.name + '.' + ext.detail_public]);
        }
        else if (this.suffix === ext.share_private) {
            this.router.navigate([this.baseData.name + '.' + ext.detail_verify]);
        } else {
            this.router.navigate([this.name + '.' + ext.detail_private]);
        }
      }
}