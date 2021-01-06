import {Address} from './Address'
import { Users } from './Users';
import { Invoice } from './Invoice';
export class Customer {

    constructor(public customerId:number,
        public customerFirstName:string,
        public customerLastName:string,
        public email:string,
        public customerType:string,
        public address:Address,
        public customerStatus:string, 
        public mobNumber:number,
        public imagePath:string,
        public language:string,
        public customerAddedBy:Users,
        public customerAddedOn:Date,
        public invoice:Invoice){}
    
    
}