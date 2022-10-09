import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { HttpService } from "src/app/service/http.service";

@Component({
    selector: 'link-dialog',
    templateUrl: 'link-dialog.html',
  })
  export class LinkDialog {
  
    links: any[] = [];
  
    constructor(
      public dialogRef: MatDialogRef<LinkDialog>,
      private httpService: HttpService,
    ) {
      this.httpService.configFromDatabase.subscribe(data => {
        let defaultLinks = JSON.parse(data.properties.recommendLink);
        defaultLinks.forEach((element: string) => {
          let s = data.properties[element]
          let item = JSON.parse(s)
          item.type = element;
          this.links.push(item)
        });
      })
    }
  
    close() {
      this.dialogRef.close()
    }
  }