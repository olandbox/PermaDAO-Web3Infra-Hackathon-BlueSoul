import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { RequestService } from './request.service';
import { api, ext, lang } from '../constants/lands';
import { HttpService } from './http.service';

/**
 * 零知识访问的uri处理和数据获取
 */


@Injectable({ providedIn: 'root' })
export class ZeroHttpService {

    landLanguage: string = lang.default;

    constructor(
        private requestService: RequestService,
        private httpService: HttpService,
    ) {}


    /**
     * 
     * @param paramsName The activeRoute params name
     * @returns Array split by '.' as [alias, space type]
     */
     async convertDetailParam2Array(paramsName: string) {
        let nameArray = decodeURI(paramsName).split('.');
        nameArray[0] = nameArray[0].trim().replace(/\s{2,}/g, ' ');

        if (nameArray[2] === lang.property) {
            if (!nameArray[3]) {
                this.landLanguage = lang.default;
            } else {
                this.landLanguage = nameArray[3];
            }
            return nameArray.slice(0, 2);
        }

        if (nameArray[2]) {
            nameArray[2] = await this.convertAbbr2Full(nameArray[2]);
        }

        return nameArray;
    }

    /**
     * convert share page route params name to array.
     * @param paramsName The activeRoute params name
     * @returns Array split by '.' as [alias, space type, type?, language?]
     */
     async convertShareParam2Array(paramsName: string) {
        let nameArray = decodeURI(paramsName).split('.');
        nameArray[0] = nameArray[0].trim().replace(/\s{2,}/g, ' ');

        if (![ext.share_private, ext.share_private_soul, ext.share_public, ext.share_verify].includes(nameArray[1])) {
            nameArray.splice(1, 0, ext.share_verify);
        }
        
        if (nameArray[2] === lang.property) {
            if (!nameArray[3]) {
                this.landLanguage = lang.default;
            } else {
                this.landLanguage = nameArray[3];
            }
            return nameArray.slice(0, 2);
        }

        if (nameArray[2]) {
            nameArray[2] = await this.convertAbbr2Full(nameArray[2]);
        }

        return nameArray;
    }


    /**
     * convert abbr to full name
     * @param abbr The link type abbr
     * @returns full name
     */
    async convertAbbr2Full(abbr: string): Promise<string> {
        const configData = await this.httpService.configFromDatabase.toPromise();
        let recommendLinks: any[] = JSON.parse(configData.properties.recommendLink);
        let links: any[] = [];
        recommendLinks.forEach((element: string) => {
            let s = configData.properties[element]
            let item = JSON.parse(s)
            item.type = element;
            links.push(item)
        });

        let linkItem = links.find(element => element.abbr === abbr)
        if (linkItem != undefined) {
            return linkItem.type.toLowerCase();
        } else {
            return abbr;
        }

    }


    /**
     * Get land info by uri
     * @param nameArray []
     * @param nodeType The land links or land space
     * @returns 
     */
    getZeroKownlege(nameArray: string[], nodeType: 'link' | 'property'): Observable<any> {
        const metadata = nameArray[0].toLocaleLowerCase();
        const suffix = nameArray[1];
        const type = nameArray[2];
        let language = nameArray[3];

        if (!language) {
            language = lang.default;
        }
        if (language === lang.all) {
            language = undefined;
        }

        let params: any = {};
        if (suffix === ext.share_verify || suffix === ext.detail_verify) {
            if (nodeType === 'link') {
                params = {
                    match: `(n:VerifyLand)-[r:LinkTo]->(b)`,
                    query: `r`,
                    conditions: {
                        'n.metadata': metadata,
                        'toLower(r.type)': type,
                        'r.status': 1,
                    },
                    page: 1,
                    size: 99
                };
                if (language) {params.conditions['r.language'] = language;}
            }
            if (nodeType === 'property') {
                params = {
                    match: `(n:VerifyLand)`,
                    query: `n`,
                    conditions: {
                        'n.metadata': metadata,
                    }
                };
            }
            
        }
        if (suffix === ext.share_private_soul || suffix === ext.detail_private) {
            if (nodeType === 'link') {
                params = {
                    match: `(n:OwnerLand)-[r:LinkTo]->(b)`,
                    query: `r`,
                    conditions: {
                        'n.metadata': metadata,
                        'toLower(r.type)': type,
                        'r.status': 1,
                    },
                    page: 1,
                    size: 99
                };
                if (language) {params.conditions['r.language'] = language;}
            }
            if (nodeType === 'property') {
                params = {
                    match: `(n:OwnerLand)`,
                    query: `n`,
                    conditions: {
                        'n.metadata': metadata,
                    }
                };
            }
            
        }
        if (suffix === ext.share_private) {
            if (nodeType === 'link') {
                params = {
                    match: "(n:PublicLand)<-[r:Owner]-(w:PublicLand)-[:VerifyLand]->(v:VerifyLand)-[l:LinkTo]->(a)",
                    query: `l`,
                    conditions: {
                        'n.metadata': metadata,
                        'toLower(l.type)': type,
                        'l.status': 1,
                    }
                };
                if (language) {params.conditions['l.language'] = language;}
            }
            if (nodeType === 'property') {
                params = {
                    match: "(n:PublicLand)<-[r:Owner]-(w:PublicLand)-[:VerifyLand]->(v:VerifyLand)-[l:LinkTo]->(a)",
                    query: `v`,
                    conditions: {
                        'n.metadata': metadata,
                    }
                };
            }
        }
        if (suffix === ext.share_public || suffix === ext.detail_public) {
            if (nodeType === 'link') {
                params = {
                    match: `(n:PublicLand)-[r:LinkTo]->(b)`,
                    query: `r`,
                    conditions: {
                        'n.metadata': metadata,
                        'toLower(r.type)': type,
                        'r.status': 1,
                    },
                    page: 1,
                    size: 99
                };
                if (language) {params.conditions['r.language'] = language;}
            }
            if (nodeType === 'property') {
                params = {
                    match: "(n:PublicLand)",
                    query: `n`,
                    conditions: {
                        'n.metadata': metadata,
                    }
                };
            }
        }

        return this.requestService.post(api.neoV2, params);

    }


    getZeroKownlegeParams() {

    }
}