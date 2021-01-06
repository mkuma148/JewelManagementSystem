export class AssetExchange {

    constructor(public assetExchangeId:number,
        public assetName:string,
        public description:string,
        public assetHallmark:string,
        public assetUnit:string,
        public assetQW:number,
        public assetRate:number,
        public assetMargin:number,
        public amount:number){}
    
}