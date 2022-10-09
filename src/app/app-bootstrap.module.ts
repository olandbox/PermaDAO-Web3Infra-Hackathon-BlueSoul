import { NgModule } from '@angular/core';
import {NgbAlertModule, NgbButtonsModule, NgbDropdownModule, NgbModalModule, NgbNavModule, NgbCollapseModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  // imports: [
  //   NgbAlertModule, NgbButtonsModule, NgbDropdownModule, NgbModalModule, NgbNavModule, NgbCollapseModule, NgbModule
  // ],
  exports: [
    NgbAlertModule, 
    NgbButtonsModule, 
    NgbDropdownModule,
    NgbModalModule, 
    NgbNavModule, 
    NgbCollapseModule, 
    NgbModule
  ]
})
export class AppBootstrapModule { }
