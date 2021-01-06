export class InstalledPay {

    constructor(public payId:number,
        public amountPaid:number,
        public paidOn:Date,
        public paidToo:string){}
}