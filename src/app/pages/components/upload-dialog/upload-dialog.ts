import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { AlertService } from "src/app/service/alert.service";
import { HttpService } from "src/app/service/http.service";

@Component({
    selector: 'upload-dialog',
    styleUrls: ['upload-dialog.less'],
    templateUrl: 'upload-dialog.html',
  })
  export class UploadDialog {
    @Input() maxSize: number = 1024*1000*2 // 2MB
    @Output() urlEvent = new EventEmitter<string>()
    url: string = '';
    isUploading: boolean = false;

    constructor(
      public dialogRef: MatDialogRef<UploadDialog>,
      private httpService: HttpService,
      private alertService: AlertService
    ) {}

    async upload(files: FileList) {
        this.isUploading = true;
        const fileToUpload: File = files.item(0);
    
        // 大小限制
        if (fileToUpload.size >= this.maxSize) {
          const size = Math.floor(this.maxSize / 1024000);
          this.alertService.create({
            body: `The image size is over ${size}MB`,
            color: 'danger',
            time: 2000
          })
          this.isUploading = false;
          return;
        }
    
        this.httpService.uploadImg(fileToUpload).subscribe((res: any) => {
          this.url = res.data.url || '';
          this.urlEvent.emit(this.url);
          this.isUploading = false;
        })
    }
  
    close() {
      this.dialogRef.close()
    }
  
  }