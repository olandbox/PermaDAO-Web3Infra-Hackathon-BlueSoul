import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { HttpService } from "src/app/service/http.service";

@Component({
    selector: 'chain-dialog',
    templateUrl: 'chain-dialog.html',
  })
  export class ChainDialog {
  
    links: any[] = [];
  
    constructor(
      public dialogRef: MatDialogRef<ChainDialog>,
      private httpService: HttpService,
    ) {
      this.httpService.configFromDatabase.subscribe(data => {
        let publicChains = JSON.parse(data.properties.publicChains);
        let publicNodes = JSON.parse(data.properties.nodes);
        publicChains.forEach((element: string) => {
          const pureKey = element.replace(/ /g, '');
          let item = publicNodes[pureKey]
          item.type = element;
          this.links.push(item)
        });
      })
    }
  
    close() {
      this.dialogRef.close()
    }
  }