export enum BoardStatus {
    default,
    search,
    offLine,
}

export class LandInfo {
    standardName: string = ''; // 转化后的land名
    logicLength: number = null; // land逻辑长度
    originPrice: string = ''; // 原价
    owner: string = ''; // mint所有人
    img: string = ''; // mint图片
    disabled: boolean = true; // 是否不可mint
    selectedCardId: string = ''; // 已选voucher的ID
    offPrice: string = ''; // 优惠价
    voucherBalance: number = null; // 已选voucher的数量
    selectedCardLength: number = null; // 已选voucher的长度
    selectedCardPercent: number = null; // 已选voucher的优惠百分比 
    constructor() {}
}

export interface SearchInfo {
    standardName?: string;
    logicLength?: number;

    owner?: string;
    img?: string;

    selectedCardId?: string;

    originPrice?: string;

}
export enum CardStatus {
    notSelected,
    invalidSelected,
    validSelected
}
export interface Card {
    cardId: number;
    length: number;
    name: string;
    priceOff: number;
    balance: number;
    disabled: boolean;
    selected: boolean;
}
export interface Cards {
    cards: Card[];
}
export enum SearchBoard {
    notSearch,
    notOpen,
    minted,
    notMint
}

