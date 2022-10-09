import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { HttpService } from "src/app/service/http.service";

@Component({
    selector: 'contract-dialog',
    templateUrl: 'contract-dialog.html',
  })
  export class ContractDialog {
  
    links: any[] = [];
  
    constructor(
      public dialogRef: MatDialogRef<ContractDialog>,
      private httpService: HttpService,
    ) {
      this.httpService.configFromDatabase.subscribe(data => {
        let publicChains = JSON.parse(data.properties.publicChains);
        let publicNodes = JSON.parse(data.properties.nodes);
        publicChains.forEach((element: string) => {
          let item = publicNodes[element]
          item.type = element;
          this.links.push(item)
        });
      })
    }
  
    close() {
      this.dialogRef.close()
    }
  }