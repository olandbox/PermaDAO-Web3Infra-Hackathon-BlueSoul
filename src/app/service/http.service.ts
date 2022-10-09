import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Cypher } from "../pages/lands/cypher";
import { catchError, map, share, tap } from 'rxjs/operators';
import { Observable, of, Subject, throwError } from 'rxjs';
import { AlertService } from "./alert.service";
import { environment } from "src/environments/environment";
import { RequestService, RootObject, RootObjectList } from "./request.service";
import { ext, lang } from "../constants/lands";


const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': ' application/x-www-form-urlencoded;charset=utf-8' }),
};


@Injectable({
    providedIn: 'root'
})

export class HttpService {

    // add community
    private subjectCommunity = new Subject();
    public communityListen = this.subjectCommunity.asObservable();
    public emitCommunity(value: number, type: string) { // 1-增加 0-增加结束
        this.subjectCommunity.next({value, type});
    }
    private subjectData = new Subject();
    public dataListen = this.subjectData.asObservable();
    public emitData(isEnd: boolean) {
        this.subjectData.next(isEnd);
    }

    private configData: any;
    private configData$: Observable<any>;
    // 全局配置
    get configFromDatabase() {
        if (this.configData) {
            return of(this.configData);
        } else if (this.configData$) {
            return this.configData$;
        } else {
            this.configData$ = this.requestService.get('/a/oland/config').pipe(
                map((res: any) => {
                    this.configData$ = null
                    if (res.code === 0) {
                        this.configData = res.data;
                        return this.configData;
                    }
                    else {
                        return {};
                    }
                }),
                share()
            )
            return this.configData$;
        }
    }

    constructor(private alertService: AlertService, private requestService: RequestService) {}

    

    // 获取polygon当前gas费
    public getPolygonGas(): Promise<any> {
        return this.requestService.get(environment.polygonGasApi).toPromise();
    }

    // 获取土地元数据
    public getMetadata(path: string): Promise<any> {
        return this.requestService.get(path).toPromise()
    }

    // 获取历史数据
    public getMintHistory(): Promise<any> {
        return this.requestService.get('/api/v1/mintedHistory').toPromise();
    }

    // 上传图片
    public uploadImg(fileToUpload: File) {
        const url = '/home/a/img/img';
        const formData: FormData = new FormData();
        formData.append('file', fileToUpload);
        return this.requestService.post(url, formData)
    }

    //登陆与验证
    public isLogin() {
        return this.requestService.post('/a/v/address','').toPromise()
    }
    public noncestr(address) {
        const body = new HttpParams().set('address', address)
        return this.requestService.post('/a/oland/noncestr', body, httpOptions).toPromise()
    }
    public login(address: string, signature: string, hexmessage: string, noncestr: string) {
        const body = new HttpParams()
        .set('address', address)
        .set('signature', signature)
        .set('hexmessage', hexmessage)
        .set('noncestr', noncestr)
        return this.requestService.post('/a/oland/login', body, httpOptions).toPromise()
    }

    public updateDatabase(matchQuery: string): Observable<any> {
        return this.requestService.post('a/v/oland/execute', matchQuery).pipe(
            map((res: any) => {
                if (res.code === 0) {
                    this.alertService.create({
                        body: 'Changing successfully.',
                        time: 2000,
                        color: 'success'
                    })
                    return res.data
                }
                else {
                    this.alertService.create({
                        body: 'Changing failed: ' + res.message,
                        color: 'danger',
                        time: 2000
                    })
                    return null;
                }
            })
        )
    }

    public updateRelationV2Api(params: any) {
        return this.requestService.put('/a/v/oland/rels/properties', params)
    }
    public updateLandV2Api(params: any) {
        return this.requestService.put('/a/v/oland/nodes/properties', params)
    }

    // 查询land 升级版本 返回page size等
    public getLandV2Api(params: any) {
        return this.requestService.post('/a/v2/oland/query', params)
    }

    // 创建link
    public createLinkApi(startNodeId, propertyObj) {
        const body = {
            "startNodeId": startNodeId,
            "properties": propertyObj
        }
        return this.requestService.post('/a/v/oland/create/link', body).pipe(
            map((res:RootObject) => {
                if (res.code !== 0) {
                    this.alertService.create({body: 'Create link failed: ' + res.message,time: 2000,color: 'danger'})
                    return false;
                }
                return res.data;
            })
        )
    }
    // 更新link
    public updateLinkApi(id, propertyObj) {
        const body = {
            "id": id,
            "properties": propertyObj
        }
        return this.requestService.post('/a/v/oland/update/link', body).pipe(
            map((res:RootObject) => {
                if (res.code !== 0) {
                    this.alertService.create({body: 'Update link failed: ' + res.message,time: 2000,color: 'danger'})
                    return false;
                }
                return res;
            })
        )
    }
    // 删除link
    public deleteLinkApi(id) {
        const body = {
            "id": id
        }
        return this.requestService.post('/a/v/oland/delete/link', body).pipe(
            map((res:RootObject) => {
                if (res.code !== 0) {
                    this.alertService.create({body: 'Delete link failed: ' + res.message,time: 2000,color: 'danger'
                    })
                    return false;
                }
                return res;
            })
        )
    }
    // 添加语言默认链接
    public createLanguageLinksApi(id, language) {
        const body = new HttpParams().set('id', id).set('language', language)
        return this.requestService.post('/a/v/oland/init/link', body, httpOptions).pipe(
            map((res:RootObject) => {
                return res.data;
            })
        )
    }

    
   
    




    // 修改空间属性
    public updateLand(id: number, property: string, value: any, notString?: boolean) {
        if (notString) {
            return `MATCH (p) WHERE id(p)=${id} SET p.${property}=${value} RETURN p`;
        } else {
            return `MATCH (p) WHERE id(p)=${id} SET p.${property}='${value}' RETURN p`;
        }
    }


    // 获取link
    public getLinksParams(id, language = 'en') {
        return {
            match: `(pn)-[r:LinkTo]->(cn)`,
            query: `r`,
            conditions: {
                'id(pn)&=': id,
                'r.language': language,
            },
            order: 'r.sort desc',
            page: 1,
            size: 99
        }  
    }

    // 更新link的sort
    public updateLinkSort(batch: any[]) { // [{id:80, sort:2}, {id:84, sort: 1}]
        const batchStr = JSON.stringify(batch);
        const batchStrUnquoted = batchStr.replace(/"([^"]+)":/g, '$1:');
        return `UNWIND ${batchStrUnquoted} as row MATCH (p)-[r]->(c) WHERE id(r)=row.id SET r.sort=row.sort RETURN r;`
    }
    public updateLink(id: number, key: string, value: string | number | boolean) {
        if (typeof(value) === 'string') {
            return `MATCH (p)-[r]->(c) WHERE id(r)=${id} SET r.${key}='${value}' RETURN r;`
        } else {
            return `MATCH (p)-[r]->(c) WHERE id(r)=${id} SET r.${key}=${value} RETURN r;`
        }
    }
    public updateLinkParams(id: number) {

    }



    // 获取土地信息
    public getMappingLandParams(alias: string) {
        const metadata = alias.toLocaleLowerCase();
        return {
            match: `(a:OwnerLand)<-[:OwnerLand]-(:PublicLand)<-[or:Owner]-(b:PublicLand)-[vl:VerifyLand]->(v:VerifyLand)`,
            query: `v`,
            conditions: {
                'a.metadata': metadata, 
                'a.mapping': 1
            },
        }  
    }
    public getPublicLandParams(alias: string) {
        const metadata = alias.toLocaleLowerCase();
        return {
            match: `(a:PublicLand)`,
            query: `a`,
            conditions: {'a.metadata': metadata}
        }
    }
    public getVerifyLandParams(alias: string) {
        const metadata = alias.toLocaleLowerCase();
        return {
            match: `(p)-[:Verify]->(a:PublicLand)-[:VerifyLand]->(b)`,
            query: `b,p`,
            conditions: {'a.metadata': metadata}
        }
    }
    public getOwnerLandParams(alias: string) {
        const metadata = alias.toLocaleLowerCase();
        return {
            match: `(p)-[:Owner]->(a:PublicLand)-[:OwnerLand]->(b)`,
            query: `b,p`,
            conditions: {'a.metadata': metadata}
        }
    }
    // 修改私有土地映射
    public updateOwnerLandMapping(id: number, mappingStatus: 0 | 1) {
        return `MATCH (p) WHERE id(p)=${id} SET p.mapping=${mappingStatus} RETURN p `
    }

    // 判断是否vip
    public isVipParams(name: string) { 
        return {
            match: `(n:PublicLand)-[r:Verify]->(b:PublicLand{metadata:'${name.toLocaleLowerCase()}'})`,
            query: `count(n)`,
            conditions: {
                'b&<>n': ''
            },
        }
    }

    // 获取land的私人land列表
    public getOwnLandsParams(name: string, pageIndex: number = 0, size: number = 10) {
        return {
            match: `(p:PublicLand{metadata: '${name.toLowerCase()}'})-[:Owner]->(c:PublicLand)-[:OwnerLand]->(cn)`,
            query: `cn`,
            conditions: {},
            page: pageIndex + 1,
            size: size
        }
    }

    // 获取land的官方land列表
    public getVerifyLandsParams(name: string, pageIndex: number = 0, size: number = 10) {
        return {
            match: `(p:PublicLand{metadata: '${name.toLocaleLowerCase()}'})-[:Verify]->(c)`,
            query: `c`,
            conditions: {},
            page: pageIndex + 1,
            size: size
        }
    }



}