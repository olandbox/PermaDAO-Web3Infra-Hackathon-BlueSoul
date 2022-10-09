import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { HttpService } from 'src/app/service/http.service';
import { BaseData } from '../baseData';
import { ext, lang } from 'src/app/constants/lands';

@Component({
  selector: 'app-thumb-simple',
  templateUrl: './thumb-simple.component.html',
  styleUrls: ['./thumb-simple.component.less']
})
export class ThumbSimpleComponent implements OnInit, OnChanges {
  @Input() suffix;
  @Input() baseData: BaseData;
  @Input() language: string = lang.default;
  langBaseData: any;
  constructor(
    private httpService: HttpService
  ) { }

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.language) {
      const suffix = this.language === lang.default ? '' : `_${this.language}`;
      this.langBaseData = {
        logo: this.baseData['logo' + suffix],
        logoStatus: this.baseData['logoStatus' + suffix],
        name: this.baseData.name,
        alias: this.baseData['alias' + suffix],
      }
      if (this.suffix === ext.share_verify) {
        this.getIsVip()
      }
    }
  }

  getIsVip() {
    const matchQuery = this.httpService.isVipParams(this.langBaseData.name);
    this.httpService.getLandV2Api(matchQuery).subscribe((res: any) => {
        let controler = 0;
        res.data.forEach(item => {
            controler += item[0];
        })
        this.langBaseData.isVip = controler > 0 ? true : false;
    })
  }
 

}
