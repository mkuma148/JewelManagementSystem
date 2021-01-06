import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';  
import pdfMake from "pdfmake/build/pdfmake";  
import pdfFonts from "pdfmake/build/vfs_fonts";  
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { URLModel } from '../URLModel';
import { UserService } from '../user.service';
import { Customer } from '../Customer';
import { Address } from '../Address';
import { Invoice } from '../Invoice';
import { ItemSold } from '../ItemSold';
import { InstalledPay } from '../InstalledPay';
import {CustomerService} from '../customer.service';
import {InvoiceService} from '../Invoice.service';
import {Users} from '../Users';
import {Message} from '../Message';
import { timer } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { AssetExchange } from '../AssetExchange';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ErrorComponent } from '../error/error.component';
import { NgForm } from '@angular/forms';

class Item{    
  name: string;
  hallMark: string = "NA";    
  price: number = 0;    
  qty: number = 0;
  making: number = 0; 
  discountIfAny:number = 0;
  selectedValue: string="grm"; 
  // anything3: string="";  
  // anything4: string="";
}    
class OldGS{    
  name: string; 
  hallMark: string = "NA";   
  rate: number = 0;    
  weight: number = 0;
  margin:number = 0;
  selectedValue: string="grm";  
  // anything1: string=""; 
  // anything2: string="";
}
class InvoicePDF{    
  customerName: string;    
  address: string;    
  contactNo: number;
  email: string;    
      
  items: Item[] = []; 
  oldGS: OldGS[] = [];   
  additionalDetails: string;    
    
  constructor(){    
    // Initially one empty product row we will show     
    this.items.push(new Item()); 
    // this.oldGS.push(new OldGS());    
  }    
}    

interface Unit {
  value: string;
  viewValue: string;
}

interface HallMark {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css']
})
export class ViewProductComponent implements OnInit {

  public imageURL;
  public urlModel;
  public registerUserData;
  public time:Date;
  public totalAmount:number = 0;
  public dueAmount:number = 0;
  public paidAmount:number = 0;
  public showRate:boolean=false;

  public user = new Users(0,"","","","","","","",0,"");

  @Output() public childEvent = new EventEmitter();

  units: Unit[] = [
    {value: 'pcs', viewValue: 'pcs'},
    {value: 'grm', viewValue: 'grm'},
    {value: 'Kg', viewValue: 'kg'},
    {value: 'line', viewValue: 'line'},
    {value: 'DR', viewValue: 'DR'}
  ];

  bisHallMark: HallMark[] = [
    {value: 'NA', viewValue: 'NA'},
    {value: 'BIS 916', viewValue: 'BIS 916'},
    {value: 'BIS 958', viewValue: 'BIS 958'},
    {value: 'BIS 750', viewValue: 'BIS 750'},
  ];

  invoice = new InvoicePDF();

  constructor(public dialog: MatDialog, public _user:UserService, public _customer:CustomerService, public _invoice:InvoiceService, private http: HttpClient, private router:Router) { 
    this._invoice.getClock().subscribe((now: Date) =>{
        this.time = now;
    } 
   );
  }

  ngOnInit():void{
    this._user.testAuthorization().subscribe(res =>{
    this.registerUserData = localStorage.getItem('user');
    this.user = JSON.parse(this.registerUserData);
    console.log("user.imagePath "+JSON.stringify(this.user));

    // this.urlModel = new URLModel("https","firebasestorage.googleapis.com","v0/b/camp-9ee59.appspot.com/o/RoomsImages%2F1603902029437?alt=media&token=85ede2e6-9f79-4105-b204-76d08073ba07");
    // this._user.convertImageToBase64(this.urlModel).subscribe(res=>{
    //   this.imageURL = res;
    //   console.log("Base 64 "+this.imageURL);
    // });

    this.http.get('assets/Base64.txt', { responseType: 'text' })
    .subscribe(res => {
      this.imageURL = res;
      console.log("Base 64 "+this.imageURL)
    });
  },
  err =>{
    const dialogRef = this.dialog.open(ErrorComponent, {data:{message:'You are unauthorized user or you session has been expired. Please try login again.'}});
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      sessionStorage.clear();
      localStorage.clear();
      this.router.navigate(['']);
    });
  }); 
  }

       
      
  generatePDF(invoiceId) {  
    let docDefinition = {  
      footer: {
              columns: [
                       'Left part',
                        { text: 'Right part', alignment: 'center' }
                       ]
      },
      watermark: {text:'OMI JEWELLERS', color: 'blue', opacity: 0.3, bold: true, italics: false, angle: -30, fontSize: 20},  
      content: [  
        {
          // you can also fit the image inside a rectangle
          image: 'data:image/jpeg;base64,'+this.imageURL+'',
          fit: [100,100]
        },
        
        {  
          text: 'OMI JEWELLERS',  
          fontSize: 16,  
          alignment: 'center',  
          color: '#047886',
 
        },  
        {  
          text: 'ROUGH ESTIMATE',  
          fontSize: 20,  
          bold: true,  
          alignment: 'center',  
          decoration: 'underline',  
          color: 'skyblue'  
        },
        {  
          text: 'Customer Details',  
          style: 'sectionHeader'  
      },
      {  
        columns: [  
            [  
                {  
                    text: this.invoice.customerName,  
                    bold: true  
                },  
                { text: this.invoice.address },  
                { text: this.invoice.email },  
                 this.invoice.contactNo == undefined?{ text: '' }:{ text: '+91'+this.invoice.contactNo }  
            ],  
            [   
               {  
                text: `Date: ${new Date().toLocaleString()}`,  
                alignment: 'right'  
               },
                {
                  text: `+91${this.user.mobNumber}`,  
                  alignment: 'right' 
                },
                {  
                    text: "Bill No : "+ invoiceId,  
                    alignment: 'right'  
                }  
            ]  
        ]  
    }, 
    {  
      text: 'Order Details',  
      style: 'sectionHeader'  
  },
    
  {  
      table: !this.showRate?{  
          headerRows: 1,
          widths: ['*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
          body: [  
              ['Product', 'Hallmark', 'Rate', 'Q/W', 'Unit', 'Making Charge', 'Amount'],  
              ...this.invoice.items.map(p => ([p.name, p.hallMark, p.price, p.qty, p.selectedValue, p.making,{text: ((p.price * p.qty)+(p.qty*p.making)).toFixed(2), alignment: 'right'}])),  
              [{ text: 'Total Amount', colSpan: 6 }, {}, {}, {}, {}, {},{text: this.invoice.items.reduce((sum, item) => sum + (item.qty*item.price)+(item.qty*item.making), 0).toFixed(2), alignment: 'right'}],
              [{ text: 'Asset Exchange', colSpan: 6 }, {}, {}, {}, {}, {},{text: this.invoice.oldGS.reduce((sum, p) => sum + (p.weight * p.rate)-p.margin, 0).toFixed(2), alignment: 'right' }],
              [{ text: 'Amount after asset deduction', colSpan: 6 }, {}, {}, {}, {}, {},{text: (parseFloat(this.invoice.items.reduce((sum, item) => sum + (item.qty*item.price)+(item.qty*item.making), 0).toFixed(2)) - parseFloat(this.invoice.oldGS.reduce((sum, p) => sum + (p.weight * p.rate)-p.margin, 0).toFixed(2))).toFixed(2), alignment: 'right'}],
              [{ text: 'Discount', colSpan: 6 }, {}, {}, {}, {}, {},{text: this.invoice.items.reduce((sum, p) => sum + p.discountIfAny, 0).toFixed(2), alignment: 'right' }],
              [{ text: 'Payable Amount', colSpan: 6 }, {}, {}, {}, {}, {},{text: (parseFloat(this.invoice.items.reduce((sum, item) => sum + ((item.qty*item.price)+(item.qty*item.making)), 0).toFixed(2)) - parseFloat(this.invoice.oldGS.reduce((sum, p) => sum + (p.weight * p.rate)-p.margin, 0).toFixed(2)) - parseFloat(this.invoice.items.reduce((sum, p) => sum + p.discountIfAny, 0).toFixed(2))).toFixed(2), alignment: 'right'}],
              [{ text: 'Amount Paid', colSpan: 6 }, {}, {}, {}, {}, {},{text: this.paidAmount.toFixed(2), alignment: 'right'}],
              [{ text: 'Amount Due', colSpan: 6 }, {}, {}, {}, {}, {},{text: this.dueAmount.toFixed(2), alignment: 'right'}] 

          ]  
      } : {  
        headerRows: 1,
        widths: ['*', 'auto', 'auto', 'auto', 'auto', 'auto'],
        body: [  
            ['Product', 'Hallmark', 'Q/W', 'Unit', 'Making Charge', 'Amount'],  
            ...this.invoice.items.map(p => ([p.name, p.hallMark, p.qty, p.selectedValue, p.making,{text: ((p.price * p.qty)+(p.qty*p.making)).toFixed(2), alignment: 'right'}])),  
            [{ text: 'Total Amount', colSpan: 5 }, {}, {}, {}, {},{text: this.invoice.items.reduce((sum, item) => sum + (item.qty*item.price)+(item.qty*item.making), 0).toFixed(2), alignment: 'right'}],
            [{ text: 'Asset Exchange', colSpan: 5 }, {}, {}, {}, {},{text: this.invoice.oldGS.reduce((sum, p) => sum + (p.weight * p.rate)-p.margin, 0).toFixed(2), alignment: 'right' }],
            [{ text: 'Amount after asset deduction', colSpan: 5 }, {}, {}, {}, {},{text: (parseFloat(this.invoice.items.reduce((sum, item) => sum + (item.qty*item.price)+(item.qty*item.making), 0).toFixed(2)) - parseFloat(this.invoice.oldGS.reduce((sum, p) => sum + (p.weight * p.rate)-p.margin, 0).toFixed(2))).toFixed(2), alignment: 'right'}],
            [{ text: 'Discount', colSpan: 5 }, {}, {}, {}, {},{text: this.invoice.items.reduce((sum, p) => sum + p.discountIfAny, 0).toFixed(2), alignment: 'right' }],
            [{ text: 'Payable Amount', colSpan: 5 }, {}, {}, {}, {},{text: (parseFloat(this.invoice.items.reduce((sum, item) => sum + ((item.qty*item.price)+(item.qty*item.making)), 0).toFixed(2)) - parseFloat(this.invoice.oldGS.reduce((sum, p) => sum + (p.weight * p.rate)-p.margin, 0).toFixed(2)) - parseFloat(this.invoice.items.reduce((sum, p) => sum + p.discountIfAny, 0).toFixed(2))).toFixed(2), alignment: 'right'}],
            [{ text: 'Amount Paid', colSpan: 5 }, {}, {}, {}, {},{text: this.paidAmount.toFixed(2), alignment: 'right'}],
            [{ text: 'Amount Due', colSpan: 5 }, {}, {}, {}, {},{text: this.dueAmount.toFixed(2), alignment: 'right'}] 

        ]  
    }
  },
  {  
    text: 'Additional Details',  
    style: 'sectionHeader'  
},
{  
  text: this.invoice.additionalDetails, 
  style: 'nextLine'  
},
  {  
    columns: [ 
        [{ qr: 'Name ' +this.invoice.customerName+' Bill No. '+invoiceId+' Total '+
        (parseFloat(this.invoice.items.reduce((sum, item) => sum + ((item.qty*item.price)+(item.qty*item.making)), 0).toFixed(2)) - parseFloat(this.invoice.oldGS.reduce((sum, p) => sum + (p.weight * p.rate)-p.margin, 0).toFixed(2)) - parseFloat(this.invoice.items.reduce((sum, p) => sum + p.discountIfAny, 0).toFixed(2))).toFixed(2)+' Paid Amount'+
        this.paidAmount.toFixed(2), fit: '50' }],  
        [{ text: 'Signature', alignment: 'right', italics: true }],  
    ]  
},
{  
  text: 'Term and condition',
  style: 'sectionHeader'  
},
{  
  ul: [  
    'Warrenty of the product will be subject to the manufacturer terms and conditions.',  
    'This is system generated invoice.', 

  ],  
}   
      ],
      styles: {  
        sectionHeader: {  
            bold: true,  
            decoration: 'underline',  
            fontSize: 14,  
            margin: [0, 15, 0, 15]  
        },
        nextLine: {  
          // bold: true,  
          // decoration: 'underline',  
          // fontSize: 14,  
          margin: [0, 0, 0, 15]  
      }  
    },
    };  
    
    pdfMake.createPdf(docDefinition).print();  
  }


  saveCustomer(){
    let address = new Address(null,this.invoice.address,this.invoice.address,null,null,null,null,null,null);
    let invoice = new Invoice(null,null,null,null,null,null,null,null,null,null,null,null,null);
    let customer = new Customer(null,this.invoice.customerName,"",this.invoice.email,"",address,"",this.invoice.contactNo,"","Eng",this.user,new Date(),invoice);
    this._customer.saveCustomer(customer).subscribe(res => {
      let customerResponse:Customer = res;
      console.log("Res "+JSON.stringify(res.invoice.invoiceId));
      
         
      let itemSold:ItemSold[] = [];
      for(let item of this.invoice.items){
        console.log("item.hallMark "+item.hallMark+" item.selectedValue "+item.selectedValue)
        itemSold.push( new ItemSold(null, item.name,null,null,item.hallMark,item.selectedValue,
          item.price,
          item.qty,
          item.making,
          (item.price*item.qty)+(item.making*item.qty),
          item.discountIfAny,
          null));
      }

      // let installedpay:InstalledPay[] = [];

      let installedpay:InstalledPay[] = [{
                                           "payId":null,
                                           "amountPaid":parseFloat(this.paidAmount.toFixed(2)),
                                           "paidOn":new Date(),
                                           "paidToo":this.user.userFirstName

      }];

      let assetExchange:AssetExchange[] = [];
      for(let oldGS of this.invoice.oldGS){
        console.log("item.hallMark "+oldGS.hallMark+" item.selectedValue "+oldGS.selectedValue)
        assetExchange.push( new AssetExchange(null,oldGS.name,null,oldGS.hallMark,oldGS.selectedValue,oldGS.weight,oldGS.rate,oldGS.margin,
          parseFloat(((oldGS.weight*oldGS.rate) - oldGS.margin).toFixed(2))));
      }

      let invoice:Invoice = new Invoice(res.invoice.invoiceId,
                                                     itemSold,
                                                     assetExchange,
                                                     null,
                                                     parseFloat(itemSold.reduce((sum, item) => sum + (item.makingChargeIfAny*item.quantity), 0).toFixed(2)),
                                                     parseFloat(itemSold.reduce((sum, item) => sum + item.amount, 0).toFixed(2)),
                                                     parseFloat(assetExchange.reduce((sum, oldGS) => sum + oldGS.amount, 0).toFixed(2)),
                                                     parseFloat(itemSold.reduce((sum, item) => sum + item.discountIfAny, 0).toFixed(2)),
                                                     parseFloat(this.paidAmount.toFixed(2)),
                                                     parseFloat(this.dueAmount.toFixed(2)),
                                                     parseFloat(itemSold.reduce((sum, item) => sum + item.margin, 0).toFixed(2)), 
                                                     installedpay,
                                                     this.invoice.additionalDetails)
      this._invoice.saveInvoice(invoice).subscribe(res=>{
           console.log(res);
      },
      err =>{
        // console.log(err.status); 
        
        const dialogRef = this.dialog.open(ErrorComponent, {data:{message:'You are unauthorized user or you session has been expired. Please try login again.'}});
         dialogRef.afterClosed().subscribe(result => {
           console.log(`Dialog result: ${result}`);
           sessionStorage.clear();
           localStorage.clear();
           this.router.navigate(['']);
         });
       });
      let message = new Message("OMIJWL","Thank you for visiting OMI Jewellers. Please visit again",this.invoice.contactNo+"");
      this._invoice.sendBulkSMS(message).subscribe(res=>{
        console.log("SMS Response "+res);
      })
      this.generatePDF(customerResponse.invoice.invoiceId);
    },
    err =>{
      // console.log(err.status); 
      
      const dialogRef = this.dialog.open(ErrorComponent, {data:{message:'You are unauthorized user or you session has been expired. Please try login again.'}});
       dialogRef.afterClosed().subscribe(result => {
         console.log(`Dialog result: ${result}`);
         sessionStorage.clear();
         localStorage.clear();
         this.router.navigate(['']);
       });
     } );
    
  }

  

  validate(evt) {
    try{
      var charCode = (evt.which) ? evt.which : evt.keyCode;

      if(charCode==46){
          var txt=evt.target.value;
          if(!(txt.indexOf(".") > -1)){
              return true;
          }
      }
      if (charCode > 31 && (charCode < 48 || charCode > 57) )
          return false;
   
      return true;
}catch(w){
  alert(w);
}
}

isNumber(evt) {
  evt = (evt) ? evt : window.event;
  var charCode = (evt.which) ? evt.which : evt.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
  }
  return true;
}

setCustomerRate(event, item){
  var txt=event.target.value;
  item.price = parseFloat(txt);
  if(isNaN(item.price)){
    item.price = 0;
  }
  this.setTotalAmount();
}

setMakingCharge(event, item){
  var txt=event.target.value;
  item.making = parseFloat(txt)
  if(isNaN(item.making)){
    item.making = 0;
  }
  this.setTotalAmount();
}

setDiscount(event, item){
  var txt=event.target.value;
  item.discountIfAny = parseFloat(txt)
  if(isNaN(item.discountIfAny)){
    item.discountIfAny = 0;
  }
  this.setTotalAmount();
}

setQuantity(event, item){
  var txt=event.target.value;
  item.qty = parseFloat(txt)
  console.log("item.qty "+item.qty)
  if(isNaN(item.qty)){
    item.qty = 0;
  }
  this.setTotalAmount();
}

setWeight(event, oldGS){
  var txt=event.target.value;
  oldGS.weight = parseFloat(txt)
  if(isNaN(oldGS.weight)){
    oldGS.weight = 0;
  }
  this.setTotalAmount();
}

setRate(event, oldGS){
  var txt=event.target.value;
  oldGS.rate = parseFloat(txt)
  if(isNaN(oldGS.rate)){
    oldGS.rate = 0;
  }
  this.setTotalAmount();
}

setMargin(event, oldGS){
  var txt=event.target.value;
  oldGS.margin = parseFloat(txt)
  if(isNaN(oldGS.margin)){
    oldGS.margin = 0;
  }
 this.setTotalAmount();
}

addProduct(){
  this.invoice.items.push(new Item());
}
 
deleteProduct(item){
  const index = this.invoice.items.indexOf(item);
  console.log("index "+index)
  this.invoice.items.splice(index, 1);
  this.setTotalAmount();
}

addItem(){
  this.invoice.oldGS.push(new OldGS());
}

deleteItem(oldGS){
  const index = this.invoice.oldGS.indexOf(oldGS);
  console.log("index "+index)
  this.invoice.oldGS.splice(index, 1);
  this.setTotalAmount();
}

setTotalAmount(){
  this.totalAmount = (parseFloat(this.invoice.items.reduce((sum, item) => sum + ((item.qty*item.price)+(item.qty*item.making)), 0).toFixed(2))
  - parseFloat(this.invoice.items.reduce((sum, item) => sum + item.discountIfAny, 0).toFixed(2)))
  - (parseFloat(this.invoice.oldGS.reduce((sum, item) => sum + (item.weight*item.rate), 0).toFixed(2))-parseFloat(this.invoice.oldGS.reduce((sum, item) => sum + item.margin, 0).toFixed(2)));
this.dueAmount = this.totalAmount - this.paidAmount;
}

setPaidAmount(event){
  var txt=event.target.value;
  if(txt === ""){
    this.paidAmount = parseFloat("0");
  }else{
    this.paidAmount = parseFloat(txt);
  } 
  this.dueAmount = this.totalAmount - this.paidAmount;
}

switchToHindi(){
  this.router.navigateByUrl('/owner/invoiceHindi');
  this.childEvent.emit('Hindi');
}

customProduct(index, item) {
  return index + ' - ' + item.id;
}

customOldGS(index, item) {
  return index + ' - ' + item.id;
}

}
