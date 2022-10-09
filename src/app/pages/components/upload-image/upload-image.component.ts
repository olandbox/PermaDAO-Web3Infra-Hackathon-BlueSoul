import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/service/alert.service';
import { HttpService } from 'src/app/service/http.service';


@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.less']
})
export class UploadImageComponent implements OnInit {

  @Input() maxSize: number = 1024*1000*2 // 2MB
  @Input() maxWidth: number = 300;
  @Input() maxHeight: number = 300;
  @Output() urlEvent = new EventEmitter<string>()
  url: string = '';
  isUploading: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private httpService: HttpService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {

  }


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

    // 宽高限制
    // const reader = new FileReader();
    // reader.onload = (e: any) => {
    //     const image = new Image();
    //     image.src = e.target.result;
    //     image.onload = rs => {
    //       const img_height = rs.currentTarget['height'];
    //       const img_width = rs.currentTarget['width'];

    //       if (img_height > this.maxHeight && img_width > this.maxWidth) {
    //           this.alertService.create({
    //             body: `Maximum dimentions allowed ${this.maxWidth} * ${this.maxHeight} px`,
    //             color: 'danger',
    //             time: 4000
    //           })
    //           return false;
    //       } else {
    //         this.httpService.uploadImg(fileToUpload).subscribe((res: any) => {
    //           this.url = res.data.url || '';
    //           this.urlEvent.emit(this.url);
    //         })
    //       }
    //     };
    // };
    // reader.readAsDataURL(fileToUpload);

    
  }
}
