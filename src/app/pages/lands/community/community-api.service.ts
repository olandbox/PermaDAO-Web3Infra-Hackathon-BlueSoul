import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { AlertService } from "src/app/service/alert.service";
import { RequestService, RootObject } from "../../../service/request.service";
import { Link, LinkNode, LinkProperties } from "./community.model";

@Injectable({
    providedIn: 'root'
})
export class CommunityApiService {

    constructor(
        private requestService: RequestService,
        private alertService: AlertService
        ) {}

    getLinks(startId: number, language = 'en'): Observable<Link[]> {
        const params = {
            match: `(pn)-[r:LinkTo]->(cn)`,
            query: `r`,
            conditions: {
                'id(pn)&=': startId,
                'r.language': language,
            },
            order: 'r.sort desc',
            page: 1,
            size: 999
        }
        return this.requestService.post('/a/v2/oland/query', params).pipe(
            map(response => {
                const data = response.data;
                return data.map(value => {
                    let link: Link = {
                        id: value[0].id,
                        properties: value[0].properties,
                        actions: {
                            aliasEditing: false,
                            urlEditing: false,
                            urlValid: true,
                            swiped: false,
                            isChanging: false
                        }
                    };
                    return link;
                })
            })
        )
    }


    createLinks(startId: number, language: string): Observable<Link[]> {
        const body = new HttpParams().set('id', startId).set('language', language);
        return this.requestService.post('/a/v/oland/init/link', body, this.requestService.httpOptionsForm).pipe(
            map(response => {
                const data = response.data;
                return data.map(value => {
                    let link: Link = {
                        id: value[0].id,
                        properties: value[0].properties,
                        actions: {
                            aliasEditing: false,
                            urlEditing: false,
                            urlValid: true,
                            swiped: false,
                            isChanging: false
                        }
                    };
                    return link;
                })
            })
        )
    }

    addLink(startId: number, properties: LinkProperties): Observable<Link> {
        const body = {
            "startNodeId": startId,
            "properties": properties
        }
        return this.requestService.post('/a/v/oland/create/link', body).pipe(
            map((res:RootObject) => {
                if (res.code !== 0) {
                    this.alertService.create({body: 'Create link failed: ' + res.message,time: 2000,color: 'danger'})
                    return {id: null, properties: null, actions: null};
                }
                const link: Link = {
                    id: res.data.relationship.id,
                    properties: res.data.relationship.properties,
                    actions: {
                        aliasEditing: false,
                        urlEditing: false,
                        urlValid: true,
                        swiped: false,
                        isChanging: false
                    }
                }
                return link;
            })
        )
    }

    updateLink(link: Link): Observable<Link> {
        let linkNode = JSON.parse(JSON.stringify(link));
        delete linkNode.actions;
        return this.requestService.post('/a/v/oland/update/link', linkNode).pipe(
            map((res:RootObject) => {
                if (res.code !== 0) {
                    this.alertService.create({body: 'Changing failed: ' + res.message, time: 2000, color: 'danger'})
                    return link;
                } else {
                    this.alertService.create({body: 'Update link Changing successfully.', time: 2000, color: 'success'})
                }
                const updateLink: Link = {
                    id: res.data.relationship.id,
                    properties: res.data.relationship.properties,
                    actions: {
                        aliasEditing: false,
                        urlEditing: false,
                        urlValid: true,
                        swiped: false,
                        isChanging: false
                    }
                }
                return updateLink;
            })
        )
    }

    deleteLink(link: Link) {
        const body = {
            "id": link.id
        }
        return this.requestService.post('/a/v/oland/delete/link', body).pipe(
            map((res:RootObject) => {
                if (res.code !== 0) {
                    this.alertService.create({body: 'Delete link failed: ' + res.message,time: 2000,color: 'danger'})
                } else {
                    this.alertService.create({body: 'Update link Changing successfully.', time: 2000, color: 'success'})
                }
                return res;
            })
        )
    }

    batchUpdateLinks(links: Link[]): Observable<RootObject> {
        let linkNodes = JSON.parse(JSON.stringify(links));
        linkNodes.map((link: Link) => {
            delete link.actions;
            return link;
        })
        const body = {
            "relationships": linkNodes
        }
        return this.requestService.put('/a/v/oland/rels/properties', body)
    }
}