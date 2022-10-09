import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class HomeService {

    
    constructor() {}

    

    // 去掉多余空格+转小写
    searchToStandard(searchName: string): string {
        if (searchName == null || searchName == undefined || searchName == '') return '';
        return searchName.trim().replace(/\s+/g," ").toLowerCase();
    }

    // 校验是否仅为字母数字和空格
    searchVerify(standardName: string): boolean {
        const dPattern = /^[a-zA-Z0-9\s]*$/;
        return dPattern.test(standardName);
    }

    // 长度是否界内
    searchInside(standardName: string): boolean {
        const withoutSpaceName = standardName.replace(/\s+/g,"");
        const dPattern = /^.{5,50}$/;
        return dPattern.test(withoutSpaceName);
    }

    // 逻辑长度
    searchLength(standardName: string): number {
        const withoutSpaceName = standardName.replace(/\s+/g,"");
        return withoutSpaceName.length;
    }

   // 精度减法
    priceSub(num1, num2) {
        var baseNum, baseNum1, baseNum2;
        var precision;// 精度
        try {
        baseNum1 = num1.toString().split(".")[1].length;
        } catch (e) {
        baseNum1 = 0;
        }
        try {
        baseNum2 = num2.toString().split(".")[1].length;
        } catch (e) {
        baseNum2 = 0;
        }
        baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
        precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;
        return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision);
    }

    




}