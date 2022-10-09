import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AlertService } from 'src/app/service/alert.service';
import { HttpService } from 'src/app/service/http.service';

import { BaseData } from '../baseData';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.less']
})
export class IntroComponent implements OnInit, OnChanges {
  @Input() loader = false;
  @Input() suffix;
  @Input() baseData: BaseData;
  @Input() edit: boolean;
  @Input() language: string = 'en';

  @Output() outData: EventEmitter<BaseData> = new EventEmitter<BaseData>();

  langBaseData: any;
  introEditing: boolean = false;

  

  constructor(
    private httpService: HttpService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.language) {
      const suffix = this.language === 'en' ? '' : `_${this.language}`;
      this.langBaseData = {
        intro: this.baseData['intro' + suffix],
        introStatus: this.baseData['introStatus' + suffix],
      }
    }
  }

  updateBaseData() {
    const suffix = this.language === 'en' ? '' : `_${this.language}`;
    let data = {};
    data['intro' + suffix] = this.langBaseData.intro;
    data['introStatus' + suffix] = this.langBaseData.introStatus;
    this.outData.emit(data)
  }

  introEdit() {
    if (!this.edit) return;

    if (this.introEditing) {
      const property = this.language === 'en' ? 'intro' : `intro_${this.language}`; 
      const matchQuery = this.httpService.updateLand(this.baseData.id, property, this.langBaseData.intro || '');
      this.httpService.updateDatabase(matchQuery).subscribe(res => {
        if (res.length > 0) {
          this.updateBaseData()
          this.alertService.create({
            body: 'Changing successfully.',
            time: 2000,
            color: 'success'
          })
        } else {
          this.alertService.create({
            body: 'Changing failed.',
            time: 2000,
            color: 'danger'
          })
        }
      })
    }

    this.introEditing = !this.introEditing
    
  }

  changeIntroStatus(e) {
    const introStatus = e.currentTarget.checked ? 1 : 0;
    const property = this.language === 'en' ? 'introStatus' : `introStatus_${this.language}`; 
    const matchQuery = this.httpService.updateLand(this.baseData.id, property, introStatus, true);
    this.httpService.updateDatabase(matchQuery).subscribe(res => {
      this.langBaseData.introStatus = introStatus;
      this.updateBaseData();
      if (res.length > 0) {
        this.alertService.create({
          body: introStatus ? 'Allowed to display on Profile.' : 'Prohibited from displaying on Profile.',
          time: 2000,
          color: 'success'
        })
      } else {
        this.alertService.create({
          body: 'Changing failed.',
          time: 2000,
          color: 'danger'
        })
      }
    })
  }

}
