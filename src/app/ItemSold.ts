export class ItemSold {

    constructor(public itemSoldId:number,
        public itemName:string,
        public description:string,
        public actualRate:number,
        public hallMark:string,
        public unit:string,
        public soldRate:number,
        public quantity:number,
        public makingChargeIfAny:number, 
        public amount:number,
        public discountIfAny:number,
        public margin:number){}
    
    
}