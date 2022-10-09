import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpService } from "src/app/service/http.service";


@Component({
    selector: 'add-dialog',
    template: `
    <h2 mat-dialog-title class="text-white text-center">
        Choose Language
        <mat-icon class="float-right" (click)="close()">close</mat-icon>
    </h2>
    <mat-dialog-content class="mat-typography text-center">
        <button *ngFor="let item of languages" class="btn btn-block" [ngClass]="{'btn-primary': item.name === data.name, 'btn-outline-primary': item.name !== data.name}" [mat-dialog-close]="item.name" cdkFocusInitial>
            {{item.value}}
        </button>
    </mat-dialog-content>
    `,
  })
  export class LanguageDialog {
    languages = [{"name":"en","value":"english"}];
    constructor(
      public dialogRef: MatDialogRef<LanguageDialog>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private httpService: HttpService
    ) {

      this.httpService.configFromDatabase.subscribe(res => {
        this.languages = JSON.parse(res.properties.defaultLanguages);
        // 传入languages才会过滤
        if (data.languages) { 
          const savedLanguages: string[] = data.languages;
          this.languages = this.languages.filter(element => savedLanguages.includes(element.name))
        }
      })
    }

    close() {
      this.dialogRef.close()
    }
  }
  