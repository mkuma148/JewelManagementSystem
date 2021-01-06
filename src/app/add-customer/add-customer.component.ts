import { Component, OnInit, Output, EventEmitter, ViewEncapsulation, ChangeDetectorRef, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Users} from '../Users';
import {MatDialog} from '@angular/material/dialog';
import { CustomerDetailsComponent } from '../customer-details/customer-details.component';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { Product } from '../Product';
import { ProductService } from '../product.service';
import { Item } from '../Item';
import pdfMake from "pdfmake/build/pdfmake";  
import pdfFonts from "pdfmake/build/vfs_fonts";  
import { UserService } from '../user.service';
import {CustomerService} from '../customer.service';
import {InvoiceService} from '../Invoice.service';
import { URLModel } from '../URLModel';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as $ from 'jquery';
import { Customer } from '../Customer';
import { Address } from '../Address';
import { Invoice } from '../Invoice';
import { ItemSold } from '../ItemSold';
import { ItemService } from '../item.service';
import { StepperOptions } from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material/stepper';
import { InstalledPay } from '../InstalledPay';
import {Message} from '../Message';
import { AssetExchange } from '../AssetExchange';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AddCustomerComponent implements OnInit {

  @ViewChild('stepper') resetStepper: MatStepper;

  myControl = new FormControl();
  // options = [ {name: 'AAA' , proId :'11'},
  // {name: 'BBB', proId :'22'},
  // {name: 'CCC', proId : '33'}];
  products: Product[] = [
    
  ];
  items: Item[] = [
    
  ];
  itemsSession: Item[] = [
    
  ];

  public totalAmount:number = 0;
  public dueAmount:number = 0;
  public paidAmount:number = 0;
  public urlModel;
  public imageURL;
  public disableShoppingCart:boolean = true;

  filteredOptions: Observable<Object[]>;
  public itemCount:number=0;
  public description="";
  public pageLoad:boolean = true;
  public pieceAdded:number=0;
  public hidden:boolean=true;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  // addressFormGroup: FormGroup;
  registerUserData;
  

  //Product
  productName = new FormControl('',[]);
  productDescription = new FormControl('',[]);
  productQuantity = new FormControl('',[]);
  productAvailable:boolean = true;

  //Item
  itemName = new FormControl('',[]);
  itemDescription = new FormControl('',[]);
  itemAvailableQuantity = new FormControl('',[]);
  itemRate = new FormControl('',[]);
  itemDispatchQuantity = new FormControl('',[]);
  itemAvailable:boolean = true;
  itemPiece = new FormControl('1',[]);
  itemPieceInCart = new FormControl('1',[]);

  //Customer
  customerFirstName = new FormControl('',[]);
  customerLastName = new FormControl('',[]);
  customerEmail = new FormControl('',[]);
  customerMobNumber = new FormControl('',[]);
  customerAddress = new FormControl('',[]);
  customerImage = new FormControl('',[]);

  //Address
  customerAddress1 = new FormControl('',[]);
  customerAddress2 = new FormControl('',[]);
  streetName = new FormControl('',[]);
  landMark = new FormControl('',[]);
  district = new FormControl('',[]);
  state = new FormControl('',[]);
  country = new FormControl('',[]);
  pincode = new FormControl(null,[]);

  // customerName = new FormControl('', Validators.required);


  itemsColumnsToDisplay: string[] = ['itemName', 'description', 'quantity', 'rate', 'piece', 'addToCart'];
  expandedItemElement : Item | null;

  constructor(private _formBuilder: FormBuilder, public dialog: MatDialog, public _product:ProductService, public _user:UserService, public _customer:CustomerService, public _invoice:InvoiceService, public _item:ItemService) { }

  ngOnInit(): void {
    
    this.firstFormGroup = this._formBuilder.group({
      productName: this.productName,
      productDescription: this.productDescription,
      productQuantity: this.productQuantity,
      itemPiece: this.itemPiece,
      itemName: this.itemName,
      itemPieceInCart: this.itemPieceInCart
    });
    this.secondFormGroup = this._formBuilder.group({
      customerFirstName: this.customerFirstName,
      customerLastName: this.customerLastName,
      email: this.customerEmail,
      mobNumber: this.customerMobNumber,
      address: this._formBuilder.group({
        address1: this.customerAddress1,
        address2: this.customerAddress2,
        streetName: this.streetName,
        landMark: this.landMark,
        dist: this.district,
        state: this.state,
        country: this.country,
        pincode: this.pincode
      }),
    });

    this.registerUserData = localStorage.getItem('user');
    this.user = JSON.parse(this.registerUserData);
    console.log("user.imagePath "+JSON.stringify(this.user));

    this._product.getAllProducts().subscribe(res => 
      {
        // console.log("Products "+res[0].productName)
        
        this.products = res
        this.urlModel = new URLModel("https","firebasestorage.googleapis.com","v0/b/camp-9ee59.appspot.com/o/RoomsImages%2F1603902029437?alt=media&token=85ede2e6-9f79-4105-b204-76d08073ba07");
        this._user.convertImageToBase64(this.urlModel).subscribe(res=>{
          this.imageURL = res;
        });
        this.filteredOptions = this.myControl.valueChanges
        .pipe(
         startWith(''),
         map(value => this._filter(value))
         );
        this.pageLoad = false;
        console.log("Log "+this.products[0].productName);
      }
    );

    
  }



  public user = new Users(0,"","","","","","","",0,"");

  @Output() public childEvent = new EventEmitter();



  columnsToDisplay: string[] = ['position', 'name', 'weight', 'symbol'];
  public dataSource;
  expandedElement: Item | null;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  customerInfo(element){
  const dialogRef = this.dialog.open(CustomerDetailsComponent, {data:{surveyObject:this.user}});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  private _filter(value: string): Product[] {
    const filterValue = value.toLowerCase()

    return this.products.filter(option => option.productName.toLowerCase().includes(filterValue));
  }

  selectedProduct(product){
    this.itemCount = product.items.length;
    this.description = product.description;
    this.dataSource = new MatTableDataSource(product.items);
  }

  addItem(element){
    let item:Item;
    item = this.items.find(item => item.itemId === element.itemId);
    let piece:number = parseInt(this.firstFormGroup.value['itemPiece']);
    if(item !== undefined){
      console.log("item.piece + piece "+item.piece + piece)
       item = new Item(item.itemId,item.itemName,item.description,item.quantity,item.piece + piece,item.rate,item.sumOfRate+(element.rate*this.firstFormGroup.value['itemPiece']),null,null,null,true);
       this.items = this.items.filter(itm => itm.itemId !== item.itemId);
    }else{
       item = new Item(element.itemId,element.itemName,element.description,element.quantity,piece,element.rate,element.rate*this.firstFormGroup.value['itemPiece'],null,null,null,true);
       this.itemsSession.push(element);
      //  this.itemPieceInCart.setValue(piece);
    }
    element.quantity = element.quantity - this.firstFormGroup.value['itemPiece'];
    this.firstFormGroup.controls['itemPiece'].setValue(1);
    this.items.push(item);
    this.hidden=false;

    //Set to session
    localStorage.setItem("products",JSON.stringify(this.products));
    localStorage.setItem("items",JSON.stringify(this.items));
    localStorage.setItem("itemsSession",JSON.stringify(this.itemsSession));
  }

  setQuantity(element){
    if(this.itemPiece.value > element.quantity){
      alert("Only "+element.quantity+" piece in stock.")
      this.firstFormGroup.controls['itemPiece'].setValue(1);
    }else if(this.itemPiece.value < 1){
      alert("Please enter valid number of piece")
      this.firstFormGroup.controls['itemPiece'].setValue(1);
    } 
      
  }

  reviewCartCall(reviewItem, pieceInCart){
    console.log("pieceInCart "+pieceInCart)
    let item:Item;
    item = this.itemsSession.find(item => item.itemId === reviewItem.itemId);
    item.quantity = reviewItem.quantity - parseInt(pieceInCart);
    reviewItem.piece = parseInt(pieceInCart);
    reviewItem.sumOfRate = parseInt(pieceInCart) * reviewItem.rate;

    //Set to session
    localStorage.setItem("products",JSON.stringify(this.products));
    localStorage.setItem("items",JSON.stringify(this.items));
    localStorage.setItem("itemsSession",JSON.stringify(this.itemsSession));
  }

  deleteItemFromCart(deleteItem){
    const index = this.items.indexOf(deleteItem);
    this.items.splice(index, 1);
    let item:Item;
    item = this.itemsSession.find(item => item.itemId === deleteItem.itemId);
    item.quantity = deleteItem.quantity;

    //Set to session
    localStorage.setItem("products",JSON.stringify(this.products));
    localStorage.setItem("items",JSON.stringify(this.items));
    localStorage.setItem("itemsSession",JSON.stringify(this.itemsSession));
  }

  selectionChange(stepper){
    if(stepper.selectedIndex === 0){
      this.disableShoppingCart = true;
    }else{
      this.disableShoppingCart = false;
    }
    console.log("stepper "+stepper.selectedIndex)
    if(stepper.selectedIndex === 2){
    //Total Amount
    this.totalAmount = parseFloat(this.items.reduce((sum, item) => sum + ((item.piece*item.customerRate)+(item.piece*item.makingCharge)), 0).toFixed(2))
                      - parseFloat(this.items.reduce((sum, item) => sum + (item.piece*item.discountIfAny), 0).toFixed(2));
    }
  }

  moveDone(){
//Total Amount
this.totalAmount = parseFloat(this.items.reduce((sum, item) => sum + ((item.piece*item.customerRate)+(item.piece*item.makingCharge)), 0).toFixed(2))
                 - parseFloat(this.items.reduce((sum, item) => sum + (item.piece*item.discountIfAny), 0).toFixed(2));
  }
  
  
  saveCustomer(){
    let address = new Address(null,this.customerAddress1.value,this.customerAddress1.value,this.streetName.value,this.landMark.value,this.district.value,this.state.value,this.country.value,this.pincode.value);
    let invoice = new Invoice(null,null,null,null,null,null,null,null,null,null,null,null,null);
    let customer = new Customer(null,this.customerFirstName.value,this.customerLastName.value,this.customerEmail.value,"",address,"",this.customerMobNumber.value,"","Eng",this.user,new Date(),invoice);
    this._customer.saveCustomer(customer).subscribe(res => {
      let customerResponse:Customer = res;
      console.log("Res "+JSON.stringify(res.invoice.invoiceId));
      
         
      let itemSold:ItemSold[] = [];
      for(let item of this.items){
        itemSold.push( new ItemSold(null, item.itemName,
          item.description,
          item.rate,
          null,null,
          item.customerRate,
          item.piece,
          item.makingCharge, 
          (item.customerRate*item.piece)+(item.makingCharge*item.piece),
          item.discountIfAny*item.piece,
          (((item.customerRate*item.piece)+(item.makingCharge*item.piece))-0)- item.sumOfRate));
      }

      let installedpay:InstalledPay[] = [{
                                           "payId":null,
                                           "amountPaid":parseFloat(this.paidAmount.toFixed(2)),
                                           "paidOn":new Date(),
                                           "paidToo":this.user.userFirstName

      }];

      let assetExchange:AssetExchange[] = [];
 
      let invoice:Invoice = new Invoice(res.invoice.invoiceId,
                                                     itemSold,
                                                     assetExchange,
                                                     itemSold.reduce((sum, item) => sum + item.quantity, 0),
                                                     parseFloat(itemSold.reduce((sum, item) => sum + (item.makingChargeIfAny*item.quantity), 0).toFixed(2)),
                                                     parseFloat(itemSold.reduce((sum, item) => sum + item.amount, 0).toFixed(2)),
                                                     null,
                                                     parseFloat(itemSold.reduce((sum, item) => sum + item.discountIfAny, 0).toFixed(2)),
                                                     parseFloat(this.paidAmount.toFixed(2)),
                                                     parseFloat(this.dueAmount.toFixed(2)),
                                                     parseFloat(itemSold.reduce((sum, item) => sum + item.margin, 0).toFixed(2)), 
                                                     installedpay,
                                                     "")
      this._invoice.saveInvoice(invoice).subscribe(res=>{
           console.log(res);
           for(let item of this.items){
               item.quantity = item.quantity - item.piece;
           }
           this._item.saveAllItem(this.items).subscribe(res =>{
           this.items.splice(0,this.items.length);
           this.paidAmount = parseFloat("0");
           this.dueAmount = parseFloat("0");
           this.hidden = true;
           this.resetStepper.reset();
           this.resetStepper.selectedIndex = 0;
           this.firstFormGroup.controls['itemPiece'].setValue(1);
           });
      });
      let message = new Message("JEWELM","Thank you for visiting OMI Jewellers. Please visit again",this.customerMobNumber.value);
      this._invoice.sendBulkSMS(message).subscribe(res=>{
        console.log("SMS Response "+res);
      })
      this.generatePDF(customerResponse.invoice.invoiceId);
    });
    
  }
   

  generatePDF(invoiceId) {  
    let docDefinition = {  
      header: 'Final Invoice',
      watermark: {text:'OM JEWELLERS', color: 'blue', opacity: 0.3, bold: true, italics: false, angle: -30, fontSize: 20},  
      content: [  
        {
          // you can also fit the image inside a rectangle
          image: 'data:image/jpeg;base64,'+this.imageURL+'',
          fit: [100,100]
        },
        
        {  
          text: 'OM JEWELLERY',  
          fontSize: 16,  
          alignment: 'center',  
          color: '#047886',
 
        },  
        {  
          text: 'INVOICE',  
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
                    text: this.customerFirstName.value,  
                    bold: true  
                },  
                { text: this.streetName.value },  
                { text: this.customerEmail.value },  
                { text: '+91'+this.customerMobNumber.value }  
            ],  
            [  
                {  
                    text: `Date: ${new Date().toLocaleString()}`,  
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
      table: {  
          headerRows: 1,  
          widths: ['*', 'auto', 'auto', 'auto', 'auto'],
          body: [  
              ['Product', 'Price', 'Quantity', 'Making Charge', 'Amount'],  
              ...this.items.map(p => ([p.itemName, p.customerRate, p.piece, p.makingCharge, {text: ((p.customerRate * p.piece)+(p.makingCharge * p.piece)).toFixed(2), alignment: 'right'}])),  
              [{ text: 'Total Amount', colSpan: 4 }, {}, {}, {}, {text: this.items.reduce((sum, item) => sum + ((item.piece*item.customerRate)+(item.piece*item.makingCharge)), 0).toFixed(2), alignment: 'right'}],
              [{ text: 'Discount', colSpan: 4 }, {}, {}, {}, {text: this.items.reduce((sum, p) => sum + (p.piece * p.discountIfAny), 0).toFixed(2), alignment: 'right' }],
              [{ text: 'Payable Amount', colSpan: 4, }, {}, {}, {}, {text: (parseFloat(this.items.reduce((sum, item) => sum + ((item.piece*item.customerRate)+(item.piece*item.makingCharge)), 0).toFixed(2)) - parseFloat(this.items.reduce((sum, p) => sum + (p.piece * p.discountIfAny), 0).toFixed(2))).toFixed(2), alignment: 'right'}],
              [{ text: 'Amount Paid', colSpan: 4, }, {}, {}, {}, {text: this.paidAmount.toFixed(2), alignment: 'right'}],
              [{ text: 'Amount Due', colSpan: 4, }, {}, {}, {}, {text: this.dueAmount.toFixed(2), alignment: 'right'}] 

          ]  
      }  
  },
  {  
    text: 'Additional Details',  
    style: 'sectionHeader'  
},
{  
  text: 'Order can be return in max 10 days.', 
  style: 'nextLine'  
},
  {  
    columns: [  
        [{ qr: 'Mukesh', fit: '50' }],  
        [{ text: 'Signature', alignment: 'right', italics: true }],  
    ]  
},
{  
  text: 'Term and condition',  
  style: 'sectionHeader'  
},
{  
  ul: [  
    'Order can be return in max 10 days.',  
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

setCustomerRate(event, item){
  var txt=event.target.value;
  item.customerRate = parseFloat(txt);
  if(isNaN(item.customerRate)){
    item.customerRate = 0;
  }
  this.totalAmount = parseFloat(this.items.reduce((sum, item) => sum + ((item.piece*item.customerRate)+(item.piece*item.makingCharge)), 0).toFixed(2))
                     - parseFloat(this.items.reduce((sum, item) => sum + (item.piece*item.discountIfAny), 0).toFixed(2));
}

setMakingCharge(event, item){
  var txt=event.target.value;
  item.makingCharge = parseFloat(txt)
  if(isNaN(item.makingCharge)){
    item.makingCharge = 0;
  }
  this.totalAmount = parseFloat(this.items.reduce((sum, item) => sum + ((item.piece*item.customerRate)+(item.piece*item.makingCharge)), 0).toFixed(2))
                     - parseFloat(this.items.reduce((sum, item) => sum + (item.piece*item.discountIfAny), 0).toFixed(2));
}

setDiscount(event, item){
  var txt=event.target.value;
  item.discountIfAny = parseFloat(txt)
  if(isNaN(item.discountIfAny)){
    item.discountIfAny = 0;
  }
  this.totalAmount = parseFloat(this.items.reduce((sum, item) => sum + ((item.piece*item.customerRate)+(item.piece*item.makingCharge)), 0).toFixed(2))
                     - parseFloat(this.items.reduce((sum, item) => sum + (item.piece*item.discountIfAny), 0).toFixed(2));
                    //  console.log("this.totalAmount "+this.totalAmount)
}

setPaidAmount(event, item){
  var txt=event.target.value;
  if(txt === ""){
    this.paidAmount = parseFloat("0");
  }else{
    this.paidAmount = parseFloat(txt);
  }
  this.dueAmount = this.totalAmount - this.paidAmount;
}

}


//https://www.fast2sms.com/dev/bulk?authorization=1jnt4aDB6PgYQw7So9FJZcMLu3r8TGyHXeb2KhNRpd5IlvOfkskQCsuWYhcxgfpUEr60RPBFMN2a8OIn&sender_id=FSTSMS&message=This is test message&language=english&route=p&numbers=7026627713