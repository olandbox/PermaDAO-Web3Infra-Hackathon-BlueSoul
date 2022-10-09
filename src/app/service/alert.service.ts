import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Alert } from "../interface/alert";

@Injectable({
    providedIn: 'root'
})
export class AlertService {

    alertSetting$ = new Subject<Alert>()

    constructor() {}

    create(params: Alert | null) {
        this.alertSetting$.next(params)
    }
}