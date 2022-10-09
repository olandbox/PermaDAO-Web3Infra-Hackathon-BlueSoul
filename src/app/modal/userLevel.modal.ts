export class UserLevelItem {
    mintLimit: string; // 个数限制
    mintCount: string; // 已铸造数
    mintPrice: string; // 该长度价格
    priceOff: string; // 促销价
    constructor(mintLimit: string, mintCount: string, mintPrice?: string, priceOff?: string) {
        this.mintLimit = mintLimit || '0';
        this.mintCount = mintCount || '0';
        this.mintPrice = mintPrice || '--';
        this.priceOff = priceOff || '0';
    }
    setPrice(price: string) {
        this.mintPrice = price;
    }
}

