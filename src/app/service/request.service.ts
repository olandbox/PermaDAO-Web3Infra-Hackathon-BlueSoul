import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { AlertService } from "./alert.service";


export interface RootObject {
    data: any;
    code: number;
    message: string;
}
export interface RootObjectList {
    data: any;
    code: number;
    message: string;
    page: number;
    size: number;
    total: number;
}

@Injectable({
    providedIn: 'root'
})

export class RequestService {

    httpOptionsForm = {
        headers: new HttpHeaders({ 'Content-Type': ' application/x-www-form-urlencoded;charset=utf-8' }),
    };

    constructor(
        private http: HttpClient,
        private alertService: AlertService
        ) {}

    get(url: string, options?): Observable<any> {
        return this.http.get(url, this.requestOptions(options)).pipe(
            catchError(err => this.catchAuthError(err)),
            map(res => this.catchCodeError(res))
        )
    }

    post(url: string, body: any | null, options?): Observable<any> {
        return this.http.post(url, body).pipe(
            catchError(err => this.catchAuthError(err)),
            map(res => this.catchCodeError(res))
        )
    }

    delete(url: string, options?): Observable<any> {
        return this.http.delete(url, this.requestOptions(options)).pipe(
            catchError(err => this.catchAuthError(err)),
            map(res => this.catchCodeError(res))
        )
    }

    put(url: string, body: any | null, options?): Observable<any> {
        return this.http.put(url, body, this.requestOptions(options)).pipe(
            catchError(err => this.catchAuthError(err)),
            map(res => this.catchCodeError(res))
        )
    }


    /**
     * Get request options.
     * @param options method
     * @returns RequestOptionsArgs
     * {
     *    headers?: HttpHeaders | { [header: string]: string | string[] };
     *    observe?: "body";
     *    params?: HttpParams | { [param: string]: string | string[] };
     *    reportProgress?: boolean;
     *    responseType: "arraybuffer";
     *    withCredentials?: boolean;
     * };
     */
    private requestOptions(options) {
        let tmpOptions = options;
        if (!tmpOptions) {
            tmpOptions = {};
        }

        let headers;
        if (tmpOptions.headers) {
            headers = tmpOptions.headers;
        } else {
            headers = new HttpHeaders();
            headers = headers.append('Context-Type', 'application/json;charset=utf-8');
        }

        tmpOptions.headers = headers;
        return tmpOptions;
    }

    /**
     * Catches the auth error
     * @param error The error response
     * @returns 
     */
    catchAuthError(error): Observable<Response> {
        if (error && error.error && error.error.message) {
            this.alertService.create({
                body: 'Client-side error: ' + error.error.message,
                color: 'danger',
                time: 2000
            })
        } else if (error && error.message) {
            this.alertService.create({
                body: 'Service-side error: ' + error.message,
                color: 'danger',
                time: 2000
            })
        } else {
            this.alertService.create({
                body: JSON.stringify(error),
                color: 'danger',
                time: 2000
            })
        }
        return throwError(error);
    }

    catchCodeError(res): Observable<any> {
        if (res.code !== undefined && res.code !== 0) {
            this.alertService.create({
                body: 'Code error: ' + res.message,
                time: 2000,
                color: 'danger'
            })
        }
        return res;
    }


}