import {Users} from './Users'
import {Item} from './Item'
export class Product {

    constructor(public productId:number,
        public productName:string,
        public description:string,
        public quantity:number,
        public totalRate:number,
        public isAvailable:boolean,
        public createdOn:Date,
        public items:Item[],
        public user:Users){    
}
}