import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { HttpService } from "src/app/service/http.service";

@Component({
    selector: 'event-dialog',
    templateUrl: 'event-dialog.html',
  })
  export class EventDialog {
  
    events: any[] = [];
  
    constructor(
      public dialogRef: MatDialogRef<EventDialog>,
      private httpService: HttpService,
    ) {
      this.getDefaultEvents();
    }

    getDefaultEvents() {
      this.httpService.configFromDatabase.subscribe(res => {
        const eventsData = JSON.parse(res.properties.events);
        const eventsType = eventsData.eventType;
        eventsType.forEach((item: string) => {
          this.events.push(eventsData[item].default);
        })
      })
    }
  
    close() {
      this.dialogRef.close()
    }
  }