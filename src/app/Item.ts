import {Users} from './Users'
export class Item {

    constructor(public itemId:number,
        public itemName:string,
        public description:string,
        public quantity:number,
        public piece:number,
        public rate:number,
        public sumOfRate:number,
        public customerRate:number,
        public makingCharge:number,
        public discountIfAny:number,
        public isAvailable:boolean){    
}
}