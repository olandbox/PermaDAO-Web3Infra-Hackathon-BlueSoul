import { Injectable } from '@angular/core';
import { Observable, Observer, of } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class FilesService {
  constructor() {}

  public getBase64ImageFromURL(url: string) {
    return new Observable((observer: Observer<string>) => {
      const img: HTMLImageElement = new Image();
      img.crossOrigin = "anonymous";
      img.src = url + '?time=' + new Date().valueOf();
      if (!img.complete) {
        img.onload = () => {
          observer.next(this.getBase64Image(img));
          observer.complete();
        };
        img.onerror = err => {
          observer.error(err);
        };
      } else {
        observer.next(this.getBase64Image(img));
        observer.complete();
      }
    });
  }

  public getBase64Image(img: HTMLImageElement) {
    const canvas: HTMLCanvasElement = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const dataURL: string = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  }

}