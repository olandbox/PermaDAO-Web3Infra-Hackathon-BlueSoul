import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: 'zoom-dialog',
  template: `
    <h2 mat-dialog-title class="text-white text-center">
        View
        <mat-icon class="float-right" (click)="close()">close</mat-icon>
    </h2>
    <mat-dialog-content class="mat-typography">
        <img src="{{data.url}}" alt="" class="w-100">
    </mat-dialog-content>
  `,
})
export class ZoomDialog {
  constructor(
    public dialogRef: MatDialogRef<ZoomDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  close() {
    this.dialogRef.close()
  }

}


export interface DialogData {
    url: string;
  }