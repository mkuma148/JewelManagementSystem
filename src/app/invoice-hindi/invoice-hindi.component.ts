import { Component, OnInit, Output, EventEmitter } from '@angular/core';  
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
import { strGnuMICR } from '../GnuMICR.ttf.Base64.encoded';
import { DatePipe } from '@angular/common'
import { MatDialog } from '@angular/material/dialog';
import {ErrorComponent} from '../error/error.component';

class Item{    
  name: string;
  hallMark: string = "NA";    
  price: number = 0;    
  qty: number = 0;
  making: number = 0; 
  discountIfAny:number = 0;
  selectedValue: string="grm";   
}    
class OldGS{    
  name: string; 
  hallMark: string = "NA";   
  rate: number = 0;    
  weight: number = 0;
  margin:number = 0;
  selectedValue: string="grm";   
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
  selector: 'app-invoice-hindi',
  templateUrl: './invoice-hindi.component.html',
  styleUrls: ['./invoice-hindi.component.css'],
  providers:[DatePipe]
})
export class InvoiceHindiComponent implements OnInit {

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

  constructor(public _user:UserService, public _customer:CustomerService, public _invoice:InvoiceService, private userService:UserService,public dialog: MatDialog, private http: HttpClient, private router:Router, private datePipe:DatePipe) { 
    this._invoice.getClock().subscribe((now: Date) =>{
        this.time = now;
    } 
   );
  }

  ngOnInit():void{
    this.userService.testAuthorization().subscribe(res =>{
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
      });
    },
    err =>{
      const dialogRef = this.dialog.open(ErrorComponent, {data:{message:'आप अनधिकृत उपयोगकर्ता हैं या आपका सत्र समाप्त हो चुका है। कृपया पुनः लॉगिन करने का प्रयास करें।'}});
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
        sessionStorage.clear();
        localStorage.clear();
        this.router.navigate(['']);
      });
    }); 


   
  }

       
      
  generatePDF(invoiceId) { 
    
    pdfFonts.pdfMake.vfs['GnuMICR_b64']=strGnuMICR
 
    // you're going to wipe out the standard stuff when you create this
    // variable, so we need to add the stock Roboto fonts back in. I 
    // set all fonts to the same thing, as "italic MICR" would be silly. 
    pdfMake.fonts = {
        Roboto: {
            normal:      'Roboto-Regular.ttf',
            bold:        'Roboto-Medium.ttf',
            italics:     'Roboto-Italic.ttf',
            bolditalics: 'Roboto-MediumItalic.ttf'
        },
        GnuMICR:{
            normal:      'GnuMICR_b64',
            bold:        'GnuMICR_b64',
            italics:     'GnuMICR_b64',
            bolditalics: 'GnuMICR_b64'
        },
    }

    let docDefinition = {  
      // footer: {
      //         columns: [
      //                  'Left part',
      //                   { text: 'Right part', alignment: 'right' }
      //                  ]
      // },
      watermark: {text:'vkseh TosylZ', font:'GnuMICR', color: 'blue', opacity: 0.3, bold: true, italics: false, angle: -30, fontSize: 20},  
      content: [  
        {
          // you can also fit the image inside a rectangle
          image: 'data:image/jpeg;base64,'+this.imageURL+'',
          fit: [100,100]
        },
        
        {  
          text: 'vkseh TosylZ',  
          fontSize: 26,  
          font:'GnuMICR',
          alignment: 'center',  
          color: '#047886',
 
        },  
        {  
          text: 'LFkwy vuqeku',
          font: 'GnuMICR',  
          fontSize: 30,    
          bold: true,  
          alignment: 'center',  
          decoration: 'underline',  
          color: 'skyblue'  
        },
        {  
          text: 'Xkzkgd fooj.k',  
          style: 'micr'   
      },
      {  
        columns: [  
            [  
                {  
                    text: this.invoice.customerName, style:'micrSmall',   
                    bold: true  
                },  
                { text: this.invoice.address,style:'micrSmall'},  
                // { text: this.invoice.email },  
                 this.invoice.contactNo == undefined?{ text: '' }:{ text: '+91'+this.invoice.contactNo }  
            ],  
            [   
               {  
                text: `fnukad% ${ this.datePipe.transform(new Date(), 'dd&MM&yyyy HH%mm%ss')}`,  
                alignment: 'right',
                style: 'micrSmall'  
               },
                {
                  text: `$91${this.user.mobNumber}`,  
                  alignment: 'right',
                  style: 'micrSmall' 
                },
                {  
                    text: "chy la[;k % "+ invoiceId,  
                    alignment: 'right',
                    style: 'micrSmall'   
                }  
            ]  
        ]  
    }, 
    {  
      text: 'vkWMZj dk fooj.k',  
      style: 'micr'  
  },
    
  {  
      table: !this.showRate?{  
          headerRows: 1,
          widths: ['*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
          body: [  
              [{text:'oLrq',style:'micrSmallBold', bold:true}, {text:'Ckkuxh',style:'micrSmallBold'}, {text:'eqY;',style:'micrSmallBold'}, {text:'ek=kk@otu',style:'micrSmallBold'}, {text:'ek=kd',style:'micrSmallBold'}, {text:'fufeZr ykxr',style:'micrSmallBold'}, {text:'jde',style:'micrSmallBold'}],  
              ...this.invoice.items.map(p => ([{text:p.name,style:'micrSmall'}, p.hallMark, p.price, p.qty, p.selectedValue, p.making,{text: ((p.price * p.qty)+(p.qty*p.making)).toFixed(2), alignment: 'right'}])),  
              [{ text: 'dqy jde', style: 'micrSmallBold', colSpan: 6 }, {}, {}, {}, {}, {},{text: this.invoice.items.reduce((sum, item) => sum + (item.qty*item.price)+(item.qty*item.making), 0).toFixed(2), alignment: 'right'}],
              [{ text: 'vkHkq"k.k fofue;', style: 'micrSmallBold', colSpan: 6 }, {}, {}, {}, {}, {},{text: this.invoice.oldGS.reduce((sum, p) => sum + (p.weight * p.rate)-p.margin, 0).toFixed(2), alignment: 'right' }],
              [{ text: 'Xkgus dVkSrh ds ckn jkf\'k', style: 'micrSmallBold', colSpan: 6 }, {}, {}, {}, {}, {},{text: (parseFloat(this.invoice.items.reduce((sum, item) => sum + (item.qty*item.price)+(item.qty*item.making), 0).toFixed(2)) - parseFloat(this.invoice.oldGS.reduce((sum, p) => sum + (p.weight * p.rate)-p.margin, 0).toFixed(2))).toFixed(2), alignment: 'right'}],
              [{ text: 'NwV', style: 'micrSmallBold', colSpan: 6 }, {}, {}, {}, {}, {},{text: this.invoice.items.reduce((sum, p) => sum + p.discountIfAny, 0).toFixed(2), alignment: 'right' }],
              [{ text: 'ns; jkf\'k', style: 'micrSmallBold', colSpan: 6 }, {}, {}, {}, {}, {},{text: (parseFloat(this.invoice.items.reduce((sum, item) => sum + ((item.qty*item.price)+(item.qty*item.making)), 0).toFixed(2)) - parseFloat(this.invoice.oldGS.reduce((sum, p) => sum + (p.weight * p.rate)-p.margin, 0).toFixed(2)) - parseFloat(this.invoice.items.reduce((sum, p) => sum + p.discountIfAny, 0).toFixed(2))).toFixed(2), alignment: 'right'}],
              [{ text: 'Hkqxrku dh xbZ jkf\'k', style: 'micrSmallBold', colSpan: 6 }, {}, {}, {}, {}, {},{text: this.paidAmount.toFixed(2), alignment: 'right'}],
              [{ text: 'cdk;k jkf\'k', style: 'micrSmallBold', colSpan: 6 }, {}, {}, {}, {}, {},{text: this.dueAmount.toFixed(2), alignment: 'right'}] 

          ]  
      } : {  
        headerRows: 1,
        widths: ['*', 'auto', 'auto', 'auto', 'auto', 'auto'],
        body: [  
            [{text:'oLrq',style:'micrSmallBold', bold:true}, {text:'Ckkuxh',style:'micrSmallBold'}, {text:'ek=kk@otu',style:'micrSmallBold'}, {text:'ek=kd',style:'micrSmallBold'}, {text:'fufeZr ykxr',style:'micrSmallBold'}, {text:'jde',style:'micrSmallBold'}],  
            ...this.invoice.items.map(p => ([{text:p.name,style:'micrSmall'}, p.hallMark, p.qty, p.selectedValue, p.making,{text: ((p.price * p.qty)+(p.qty*p.making)).toFixed(2), alignment: 'right'}])),  
            [{ text: 'dqy jde', style: 'micrSmallBold', colSpan: 5 }, {}, {}, {}, {},{text: this.invoice.items.reduce((sum, item) => sum + (item.qty*item.price)+(item.qty*item.making), 0).toFixed(2), alignment: 'right'}],
            [{ text: 'vkHkq"k.k fofue;', style: 'micrSmallBold', colSpan: 5 }, {}, {}, {}, {},{text: this.invoice.oldGS.reduce((sum, p) => sum + (p.weight * p.rate)-p.margin, 0).toFixed(2), alignment: 'right' }],
            [{ text: 'Xkgus dVkSrh ds ckn jkf\'k', style: 'micrSmallBold', colSpan: 5 }, {}, {}, {}, {},{text: (parseFloat(this.invoice.items.reduce((sum, item) => sum + (item.qty*item.price)+(item.qty*item.making), 0).toFixed(2)) - parseFloat(this.invoice.oldGS.reduce((sum, p) => sum + (p.weight * p.rate)-p.margin, 0).toFixed(2))).toFixed(2), alignment: 'right'}],
            [{ text: 'NwV', style: 'micrSmallBold', colSpan: 5 }, {}, {}, {}, {},{text: this.invoice.items.reduce((sum, p) => sum + p.discountIfAny, 0).toFixed(2), alignment: 'right' }],
            [{ text: 'ns; jkf\'k', style: 'micrSmallBold', colSpan: 5 }, {}, {}, {}, {},{text: (parseFloat(this.invoice.items.reduce((sum, item) => sum + ((item.qty*item.price)+(item.qty*item.making)), 0).toFixed(2)) - parseFloat(this.invoice.oldGS.reduce((sum, p) => sum + (p.weight * p.rate)-p.margin, 0).toFixed(2)) - parseFloat(this.invoice.items.reduce((sum, p) => sum + p.discountIfAny, 0).toFixed(2))).toFixed(2), alignment: 'right'}],
            [{ text: 'Hkqxrku dh xbZ jkf\'k', style: 'micrSmallBold', colSpan: 5 }, {}, {}, {}, {},{text: this.paidAmount.toFixed(2), alignment: 'right'}],
            [{ text: 'cdk;k jkf\'k', style: 'micrSmallBold', colSpan: 5 }, {}, {}, {}, {},{text: this.dueAmount.toFixed(2), alignment: 'right'}] 

        ]  
    }
  },
  {  
    text: 'vfrfjDr fooj.k',  
    style: 'micr'   
},
{  
  text: this.invoice.additionalDetails, 
  style:'micrSmall' 
},
  {  
    columns: [ 
        [{ qr: 'Name ' +this.invoice.customerName+' Bill No. '+invoiceId+' Total '+
        (parseFloat(this.invoice.items.reduce((sum, item) => sum + ((item.qty*item.price)+(item.qty*item.making)), 0).toFixed(2)) - parseFloat(this.invoice.oldGS.reduce((sum, p) => sum + (p.weight * p.rate)-p.margin, 0).toFixed(2)) - parseFloat(this.invoice.items.reduce((sum, p) => sum + p.discountIfAny, 0).toFixed(2))).toFixed(2)+' Paid Amount'+
        this.paidAmount.toFixed(2), fit: '50' }],  
        [{ text: 'gLrk{kj', alignment: 'right', italics: true, font:'GnuMICR', fontSize: 16}],
    ],
    margin: [0, 5, 0, 5]  
},
{  
  text: 'fu;e vkSj \'krsZa',  
  style: 'micr'
},
{  
  ul: [  
    'vkHkq"k.kksa dh okjaVh fuekZrk ds fu;eksa vkSj \'krsZa ds v/khu gksxh',
    ';g flLVe tujsVsM buokWbl gS' 
  ],
  style:'micrSmall'   
}   
      ],
      styles: {
        micr:{
          bold: true,
          font: 'GnuMICR',
          decoration: 'underline',  
          fontSize: 18,  
          margin: [0, 5, 0, 5] 
          },

          micrSmall:{
            font: 'GnuMICR', 
            fontSize: 16,  
            margin: [0, -2, 0, -2]
            },
            micrSmallBold:{
              font: 'GnuMICR', 
              fontSize: 18,
              margin: [0, -2, 0, -2]
              // bolditalics:true,
              },  
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
    console.log("this.invoice.customerName "+this.invoice.customerName);
    let address = new Address(null,this.invoice.address,this.invoice.address,null,null,null,null,null,null);
    let invoice = new Invoice(null,null,null,null,null,null,null,null,null,null,null,null,null);
    let customer = new Customer(null,this.invoice.customerName,"",this.invoice.email,"",address,"",this.invoice.contactNo,"","Hin",this.user,new Date(),invoice);
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
        
        const dialogRef = this.dialog.open(ErrorComponent, {data:{message:'आप अनधिकृत उपयोगकर्ता हैं या आपका सत्र समाप्त हो चुका है। कृपया पुनः लॉगिन करने का प्रयास करें।'}});
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
      
      const dialogRef = this.dialog.open(ErrorComponent, {data:{message:'आप अनधिकृत उपयोगकर्ता हैं या आपका सत्र समाप्त हो चुका है। कृपया पुनः लॉगिन करने का प्रयास करें।'}});
       dialogRef.afterClosed().subscribe(result => {
         console.log(`Dialog result: ${result}`);
         sessionStorage.clear();
         localStorage.clear();
         this.router.navigate(['']);
       });
     });
    
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

switchToEnglish(){
  this.router.navigateByUrl('/owner/viewProduct');
  this.childEvent.emit('English');
}

customProduct(index, item) {
  return index + ' - ' + item.id;
}

customOldGS(index, item) {
  return index + ' - ' + item.id;
}

}
