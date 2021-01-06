import { InstalledPay } from './InstalledPay';
import {ItemSold} from './ItemSold';
import {Users} from './Users';
import {AssetExchange} from './AssetExchange';

export class Invoice {

    constructor(public invoiceId:number,
        public itemSold:ItemSold[],
        public assetExchange:AssetExchange[],
        public totalQuantities:number,
        public totalMakingCharge:number,
        public totalAmount:number,
        public totalAssetAmount:number,
        public totalDiscount:number,
        public amountPaid:number,
        public amountDue:number,
        public totalMargin:number, 
        public installedPay:InstalledPay[],
        public additionalComments:string){}
    
    
}