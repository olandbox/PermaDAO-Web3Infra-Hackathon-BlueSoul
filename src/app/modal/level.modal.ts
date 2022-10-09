export class LevelItem {
    level: number;
    max: number;
    min: number;
    quantitativeLimit: number;
    price: string;
    mintCount: number;

    constructor(
        level: number,
        max: number,
        min: number,
        quantitativeLimit: number,

    ) {
        this.level = level;
        this.max = max;
        this.min = min;
        this.quantitativeLimit = quantitativeLimit;
    }

    setPrice(price: string) {
        this.price = price;
    }
    setMintCount(count: number) {
        this.mintCount = count;
    }
}
