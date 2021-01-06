import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
// import pdfMakeUnicode from 'pdfmake-unicode';
// this part is crucial
// pdfMake.vfs = pdfMakeUnicode.pdfMake.vfs;
import { strGnuMICR } from '../GnuMICR.ttf.Base64.encoded';
import { UserService } from '../user.service';
import { URLModel } from '../URLModel';
import { InstalledPay } from '../InstalledPay';
import { InvoiceService } from '../Invoice.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { parseJSON } from 'jquery';
import { stringify } from '@angular/compiler/src/util';
import { HttpClient } from '@angular/common/http';
import { Users } from '../Users';
import { DecimalPipe } from '@angular/common';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DatePipe } from '@angular/common'
import { ErrorComponent } from '../error/error.component';
import { Router } from '@angular/router';

//  instPay: InstalledPay[] = [

// ];

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css'],
  providers: [DatePipe]
})
export class CustomerDetailsComponent implements OnInit {

  public urlModel;
  public imageURL;
  public totalAmount: number = 0;
  public dueAmount: number = 0;
  public paidAmount: number = 0;
  public registerUserData;
  public user = new Users(0, "", "", "", "", "", "", "", 0, "");
  locale = 'en-US';
  decimalPipe = new DecimalPipe(this.locale);
  public showRate: boolean = false;
  public font = strGnuMICR;
  public test;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public _user: UserService, public _invoice: InvoiceService, private _snackBar: MatSnackBar, private _bottomSheet: MatBottomSheet,public dialog: MatDialog, private router:Router, private http: HttpClient, private datePipe: DatePipe
  ,private parentDialogRef:MatDialogRef<CustomerDetailsComponent>) { }

  ngOnInit(): void {
    // this.urlModel = new URLModel("https","firebasestorage.googleapis.com","v0/b/camp-9ee59.appspot.com/o/RoomsImages%2F1601647988452?alt=media&token=45de4844-5c80-4ad0-a903-6cf17dfcfdc2");
    //     this._user.convertImageToBase64(this.urlModel).subscribe(res=>{
    //       this.imageURL = res;
    //       console.log("this.imageURL "+this.imageURL);
    //       // this.generatePDF(this.data.customer.invoice.invoiceId);
    //     });

    this.registerUserData = localStorage.getItem('user');
    this.user = JSON.parse(this.registerUserData);
    console.log("user.imagePath " + this.user.userFirstName)

    this.http.get('assets/Base64.txt', { responseType: 'text' })
      .subscribe(res => {
        this.imageURL = res;
        console.log("Base 64 " + this.imageURL)
      });

  }

  payRemainingAmount() {
    if (this.paidAmount > 0) {
      this.data.customer.invoice.amountPaid = this.data.customer.invoice.amountPaid + this.paidAmount;
      this.data.customer.invoice.amountDue = this.data.customer.invoice.amountDue - this.paidAmount;
      let installedPay = new InstalledPay(null, this.paidAmount, new Date(), this.user.userFirstName);
      this.data.customer.invoice.installedPay.push(installedPay);
      this._invoice.saveInvoice(this.data.customer.invoice).subscribe(res => {
        this.data.customer.invoice = res;
      }, err => {
        const dialogRef = this.dialog.open(ErrorComponent, { data: { message: 'आप अनधिकृत उपयोगकर्ता हैं या आपका सत्र समाप्त हो चुका है। कृपया पुनः लॉगिन करने का प्रयास करें।',parent:this.parentDialogRef } });
        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
          sessionStorage.clear();
          localStorage.clear();
          this.router.navigate(['']);
        });
      });
    } else {
      this._invoice.saveInvoice(this.data.customer.invoice).subscribe(res => {
        this.data.customer.invoice = res;
      }, err => {
        const dialogRef = this.dialog.open(ErrorComponent, { data: { message: 'आप अनधिकृत उपयोगकर्ता हैं या आपका सत्र समाप्त हो चुका है। कृपया पुनः लॉगिन करने का प्रयास करें।',parent:this.parentDialogRef } });
        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
          sessionStorage.clear();
          localStorage.clear();
          this.router.navigate(['']);
        });
      });
    }
    this.paidAmount = 0;
    if (this.data.customer.language === 'Eng') {
      this.generatePDF();
    } else {
      this.generateHindiPDF();
    }
  }

  generatePDF() {

    let docDefinition = {
      watermark: { text: 'OMI JEWELLERS', color: 'blue', opacity: 0.3, bold: true, italics: false, angle: -30, fontSize: 20 },
      content: [
        {
          // you can also fit the image inside a rectangle
          image: 'data:image/jpeg;base64,' + this.imageURL + '',
          fit: [100, 100]
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
                text: this.data.customer.customerFirstName,
                bold: true
              },
              { text: this.data.customer.address.address1 },
              { text: this.data.customer.email },
              { text: '+91' + this.data.customer.mobNumber }
            ],
            [

              {
                text: `Date: ${new Date().toLocaleString()}`,
                alignment: "right"
              },
              {
                text: `+91${this.user.mobNumber}`,
                alignment: "right"
              },

              {
                text: "Bill No : " + this.data.customer.invoice.invoiceId,
                alignment: "right"

              }

            ]
          ]
        },
        {
          text: 'Order Details',
          style: 'sectionHeader'
        },

        {
          table: !this.showRate ? {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: [
              ['Product', 'Hallmark', 'Rate', 'Q/W', 'Unit', 'Making Charge', 'Amount'],
              ...this.data.customer.invoice.itemSold.map(p => ([p.itemName, p.hallMark, p.soldRate, p.quantity, p.unit, p.makingChargeIfAny, { text: ((p.soldRate * p.quantity) + (p.makingChargeIfAny * p.quantity)).toFixed(2), alignment: 'right' }])),
              [{ text: 'Total Amount', colSpan: 6 }, {}, {}, {}, {}, {}, { text: this.data.customer.invoice.totalAmount.toFixed(2), alignment: 'right' }],
              [{ text: 'Asset Exchange', colSpan: 6 }, {}, {}, {}, {}, {}, { text: this.data.customer.invoice.totalAssetAmount.toFixed(2), alignment: 'right' }],
              [{ text: 'Amount after asset deduction', colSpan: 6 }, {}, {}, {}, {}, {}, { text: (this.data.customer.invoice.totalAmount.toFixed(2) - this.data.customer.invoice.totalAssetAmount.toFixed(2)).toFixed(2), alignment: 'right' }],
              [{ text: 'Discount', colSpan: 6 }, {}, {}, {}, {}, {}, { text: this.data.customer.invoice.totalDiscount.toFixed(2), alignment: 'right' }],
              [{ text: 'Payable Amount', colSpan: 6 }, {}, {}, {}, {}, {}, { text: (this.data.customer.invoice.totalAmount - this.data.customer.invoice.totalAssetAmount.toFixed(2) - this.data.customer.invoice.totalDiscount).toFixed(2), alignment: 'right' }],
              [{ text: 'Amount Paid', colSpan: 6 }, {}, {}, {}, {}, {}, { text: this.data.customer.invoice.amountPaid.toFixed(2), alignment: 'right' }],
              [{ text: 'Amount Due', colSpan: 6 }, {}, {}, {}, {}, {}, { text: this.data.customer.invoice.amountDue.toFixed(2), alignment: 'right' }]

            ]
          } : {
              headerRows: 1,
              widths: ['*', 'auto', 'auto', 'auto', 'auto', 'auto'],
              body: [
                ['Product', 'Hallmark', 'Q/W', 'Unit', 'Making Charge', 'Amount'],
                ...this.data.customer.invoice.itemSold.map(p => ([p.itemName, p.hallMark, p.quantity, p.unit, p.makingChargeIfAny, { text: ((p.soldRate * p.quantity) + (p.makingChargeIfAny * p.quantity)).toFixed(2), alignment: 'right' }])),
                [{ text: 'Total Amount', colSpan: 5 }, {}, {}, {}, {}, { text: this.data.customer.invoice.totalAmount.toFixed(2), alignment: 'right' }],
                [{ text: 'Asset Exchange', colSpan: 5 }, {}, {}, {}, {}, { text: this.data.customer.invoice.totalAssetAmount.toFixed(2), alignment: 'right' }],
                [{ text: 'Amount after asset deduction', colSpan: 5 }, {}, {}, {}, {}, { text: (this.data.customer.invoice.totalAmount.toFixed(2) - this.data.customer.invoice.totalAssetAmount.toFixed(2)).toFixed(2), alignment: 'right' }],
                [{ text: 'Discount', colSpan: 5 }, {}, {}, {}, {}, { text: this.data.customer.invoice.totalDiscount.toFixed(2), alignment: 'right' }],
                [{ text: 'Payable Amount', colSpan: 5 }, {}, {}, {}, {}, { text: (this.data.customer.invoice.totalAmount - this.data.customer.invoice.totalAssetAmount.toFixed(2) - this.data.customer.invoice.totalDiscount).toFixed(2), alignment: 'right' }],
                [{ text: 'Amount Paid', colSpan: 5 }, {}, {}, {}, {}, { text: this.data.customer.invoice.amountPaid.toFixed(2), alignment: 'right' }],
                [{ text: 'Amount Due', colSpan: 5 }, {}, {}, {}, {}, { text: this.data.customer.invoice.amountDue.toFixed(2), alignment: 'right' }]

              ]
            }
        },
        {
          text: 'Additional Details',
          style: 'sectionHeader'
        },
        {
          text: this.data.customer.invoice.additionalComments,
          style: 'nextLine'
        },
        {
          columns: [
            [{
              qr: 'Name ' + this.data.customer.invoice.customerName + ' Bill No. ' + this.data.customer.invoiceId + ' Total ' +
                (parseFloat(this.data.customer.invoice.itemSold.reduce((sum, item) => sum + ((item.quantity * item.soldRate) + (item.quantity * item.makingChargeIfAny)), 0).toFixed(2)) - parseFloat(this.data.customer.invoice.assetExchange.reduce((sum, p) => sum + (p.assetQW * p.assetRate) - p.assetMargin, 0).toFixed(2)) - parseFloat(this.data.customer.invoice.itemSold.reduce((sum, p) => sum + p.discountIfAny, 0).toFixed(2))).toFixed(2) + ' Paid Amount' +
                this.paidAmount.toFixed(2), fit: '50'
            }],
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
          ]
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
    //npm install pdfmake-unicode --save
  }

  validate(evt) {
    try {
      var charCode = (evt.which) ? evt.which : evt.keyCode;

      if (charCode == 46) {
        var txt = evt.target.value;
        if (!(txt.indexOf(".") > -1)) {
          return true;
        }
      }
      if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;

      return true;
    } catch (w) {
      alert(w);
    }
  }

  setPaidAmount(event) {
    var txt = event.target.value;
    if (txt === "") {
      this.paidAmount = parseFloat("0");
    } else {
      this.paidAmount = parseFloat(txt);
    }
    console.log("this.paidAmount > this.data.customer.invoice.amountDue " + this.paidAmount + " " + this.data.customer.invoice.amountDue + " "
      + parseFloat(parseFloat(this.data.customer.invoice.amountDue).toFixed(2)))
    if (this.paidAmount > parseFloat(parseFloat(this.data.customer.invoice.amountDue).toFixed(2))) {
      this.paidAmount = 0;
      event.target.value = "";
      this._snackBar.openFromComponent(PizzaPartyComponent, {
        duration: 5000,
        horizontalPosition: "center",
        verticalPosition: "top",
      });
    } else {
      this.dueAmount = this.totalAmount - this.paidAmount;
    }
  }



  viewPaidAmount() {
    sessionStorage.setItem("installedPay", JSON.stringify(this.data.customer.invoice.installedPay));
    this._bottomSheet.open(BottomSheet);
  }

  viewAssetEx() {
    sessionStorage.setItem("assetExchange", JSON.stringify(this.data.customer.invoice.assetExchange));
    sessionStorage.setItem("language", JSON.stringify(this.data.customer.language));
    this._bottomSheet.open(AssetExchange);
  }


  generateHindiPDF() {

    pdfFonts.pdfMake.vfs['GnuMICR_b64'] = strGnuMICR

    // you're going to wipe out the standard stuff when you create this
    // variable, so we need to add the stock Roboto fonts back in. I 
    // set all fonts to the same thing, as "italic MICR" would be silly. 
    pdfMake.fonts = {
      Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Medium.ttf',
        italics: 'Roboto-Italic.ttf',
        bolditalics: 'Roboto-MediumItalic.ttf'
      },
      GnuMICR: {
        normal: 'GnuMICR_b64',
        bold: 'GnuMICR_b64',
        italics: 'GnuMICR_b64',
        bolditalics: 'GnuMICR_b64'
      },
    }

    let docDefinition = {
      // footer: {
      //   columns: [
      //            'Left part',
      //             { text: 'Right part', alignment: 'right' }
      //            ]
      // },  
      watermark: { text: 'vkseh TosylZ', font: 'GnuMICR', color: 'blue', opacity: 0.3, bold: true, italics: false, angle: -30, fontSize: 40 },
      content: [
        {
          // you can also fit the image inside a rectangle
          image: 'data:image/jpeg;base64,' + this.imageURL + '',
          fit: [100, 100]
        },

        //   {
        //     columns: [
        //         { width: '*', text: '' },
        //         {
        //             width: 'auto',
        //             height:'auto',
        //             layout: 'noBorders',
        //                 table: {
        //                 body: [
        //                   [
        //                     { text: "OMI", fontSize: 20,  
        //                     alignment: 'right',  
        //                     color: '#047886'  },
        //                     { text: 'TosylZ',
        //                     bold:true,  
        //                     fontSize: 26,  
        //                     font:'GnuMICR',
        //                     alignment: 'left',  
        //                     color: '#047886' }
        //                   ],
        //                 ],
        //                 alignment: "center"
        //                 }
        //         },
        //         { width: '*', text: '' },
        //     ]
        // },

        {
          text: 'vkseh TosylZ',
          fontSize: 26,
          font: 'GnuMICR',
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
                text: this.data.customer.customerFirstName, style: 'micrSmall',
                bold: true
              },
              { text: this.data.customer.address.address1, style: 'micrSmall', },
              // { text: this.data.customer.email },  
              { text: '+91' + this.data.customer.mobNumber }
            ],
            [

              {
                text: `fnukad% ${this.datePipe.transform(new Date(), 'dd&MM&yyyy HH%mm%ss')}`,
                alignment: "right",
                style: 'micrSmall'
              },
              {
                text: `$91${this.user.mobNumber}`,
                alignment: "right",
                style: 'micrSmall'
              },

              {
                text: "chy la[;k % " + this.data.customer.invoice.invoiceId,
                alignment: "right",
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
          table: !this.showRate ? {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: [
              [{ text: 'oLrq', style: 'micrSmallBold', bold: true }, { text: 'Ckkuxh', style: 'micrSmallBold' }, { text: 'eqY;', style: 'micrSmallBold' }, { text: 'ek=kk@otu', style: 'micrSmallBold' }, { text: 'ek=kd', style: 'micrSmallBold' }, { text: 'fufeZr ykxr', style: 'micrSmallBold' }, { text: 'jde', style: 'micrSmallBold' }],
              ...this.data.customer.invoice.itemSold.map(p => ([{ text: p.itemName, style: 'micrSmall' }, p.hallMark, p.soldRate, p.quantity, p.unit, p.makingChargeIfAny, { text: ((p.soldRate * p.quantity) + (p.makingChargeIfAny * p.quantity)).toFixed(2), alignment: 'right' }])),
              [{ text: 'dqy jde', style: 'micrSmallBold', colSpan: 6 }, {}, {}, {}, {}, {}, { text: this.data.customer.invoice.totalAmount.toFixed(2), alignment: 'right' }],
              [{ text: 'vkHkq"k.k fofue;', style: 'micrSmallBold', colSpan: 6 }, {}, {}, {}, {}, {}, { text: this.data.customer.invoice.totalAssetAmount.toFixed(2), alignment: 'right' }],
              [{ text: 'Xkgus dVkSrh ds ckn jkf\'k', style: 'micrSmallBold', colSpan: 6 }, {}, {}, {}, {}, {}, { text: (this.data.customer.invoice.totalAmount.toFixed(2) - this.data.customer.invoice.totalAssetAmount.toFixed(2)).toFixed(2), alignment: 'right' }],
              [{ text: 'NwV', style: 'micrSmallBold', colSpan: 6 }, {}, {}, {}, {}, {}, { text: this.data.customer.invoice.totalDiscount.toFixed(2), alignment: 'right' }],
              [{ text: 'ns; jkf\'k', style: 'micrSmallBold', colSpan: 6 }, {}, {}, {}, {}, {}, { text: (this.data.customer.invoice.totalAmount - this.data.customer.invoice.totalAssetAmount.toFixed(2) - this.data.customer.invoice.totalDiscount).toFixed(2), alignment: 'right' }],
              [{ text: 'Hkqxrku dh xbZ jkf\'k', style: 'micrSmallBold', colSpan: 6 }, {}, {}, {}, {}, {}, { text: this.data.customer.invoice.amountPaid.toFixed(2), alignment: 'right' }],
              [{ text: 'cdk;k jkf\'k', style: 'micrSmallBold', colSpan: 6 }, {}, {}, {}, {}, {}, { text: this.data.customer.invoice.amountDue.toFixed(2), alignment: 'right' }]

            ]
          } : {
              headerRows: 1,
              widths: ['*', 'auto', 'auto', 'auto', 'auto', 'auto'],
              body: [
                [{ text: 'oLrq', style: 'micrSmallBold', bold: true }, { text: 'Ckkuxh', style: 'micrSmallBold' }, { text: 'ek=kk@otu', style: 'micrSmallBold' }, { text: 'ek=kd', style: 'micrSmallBold' }, { text: 'fufeZr ykxr', style: 'micrSmallBold' }, { text: 'jde', style: 'micrSmallBold' }],
                ...this.data.customer.invoice.itemSold.map(p => ([{ text: p.itemName, style: 'micrSmall' }, p.hallMark, p.quantity, p.unit, p.makingChargeIfAny, { text: ((p.soldRate * p.quantity) + (p.makingChargeIfAny * p.quantity)).toFixed(2), alignment: 'right' }])),
                [{ text: 'dqy jde', style: 'micrSmallBold', colSpan: 5 }, {}, {}, {}, {}, { text: this.data.customer.invoice.totalAmount.toFixed(2), alignment: 'right' }],
                [{ text: 'vkHkq"k.k fofue;', style: 'micrSmallBold', colSpan: 5 }, {}, {}, {}, {}, { text: this.data.customer.invoice.totalAssetAmount.toFixed(2), alignment: 'right' }],
                [{ text: 'Xkgus dVkSrh ds ckn jkf\'k', style: 'micrSmallBold', colSpan: 5 }, {}, {}, {}, {}, { text: (this.data.customer.invoice.totalAmount.toFixed(2) - this.data.customer.invoice.totalAssetAmount.toFixed(2)).toFixed(2), alignment: 'right' }],
                [{ text: 'NwV', style: 'micrSmallBold', colSpan: 5 }, {}, {}, {}, {}, { text: this.data.customer.invoice.totalDiscount.toFixed(2), alignment: 'right' }],
                [{ text: 'ns; jkf\'k', style: 'micrSmallBold', colSpan: 5 }, {}, {}, {}, {}, { text: (this.data.customer.invoice.totalAmount - this.data.customer.invoice.totalAssetAmount.toFixed(2) - this.data.customer.invoice.totalDiscount).toFixed(2), alignment: 'right' }],
                [{ text: 'Hkqxrku dh xbZ jkf\'k', style: 'micrSmallBold', colSpan: 5 }, {}, {}, {}, {}, { text: this.data.customer.invoice.amountPaid.toFixed(2), alignment: 'right' }],
                [{ text: 'cdk;k jkf\'k', style: 'micrSmallBold', colSpan: 5 }, {}, {}, {}, {}, { text: this.data.customer.invoice.amountDue.toFixed(2), alignment: 'right' }]

              ]
            }
        },
        {
          text: 'vfrfjDr fooj.k',
          style: 'micr'
        },
        {
          text: this.data.customer.invoice.additionalComments,
          style: 'micrSmall'
        },
        {
          columns: [
            [{
              qr: 'Name ' + this.data.customer.invoice.customerName + ' Bill No. ' + this.data.customer.invoiceId + ' Total ' +
                (parseFloat(this.data.customer.invoice.itemSold.reduce((sum, item) => sum + ((item.quantity * item.soldRate) + (item.quantity * item.makingChargeIfAny)), 0).toFixed(2)) - parseFloat(this.data.customer.invoice.assetExchange.reduce((sum, p) => sum + (p.assetQW * p.assetRate) - p.assetMargin, 0).toFixed(2)) - parseFloat(this.data.customer.invoice.itemSold.reduce((sum, p) => sum + p.discountIfAny, 0).toFixed(2))).toFixed(2) + ' Paid Amount' +
                this.paidAmount.toFixed(2), fit: '50'
            }],
            [{ text: 'gLrk{kj', alignment: 'right', italics: true, font: 'GnuMICR', fontSize: 16 }],
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
          style: 'micrSmall'
        }
      ],
      styles: {
        micr: {
          bold: true,
          font: 'GnuMICR',
          decoration: 'underline',
          fontSize: 18,
          margin: [0, 5, 0, 5]
        },

        micrSmall: {
          font: 'GnuMICR',
          fontSize: 16,
          margin: [0, -2, 0, -2]
        },
        micrSmallBold: {
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
    //npm install pdfmake-unicode --save
  }

}


@Component({
  selector: 'app-discount',
  template: `
  <span class="snackBar">
    paying amount should be less than or equal to due amount.
  </span>
  `,
  styles: [`
    .snackBar {
      color: hotpink;
    }
  `],
})
export class PizzaPartyComponent { }


@Component({
  selector: 'app-sheet',
  template: `
     <table border="1" width="500px">
     <thead>
                        <th>Paid</th>
                        <th>Paid On</th>
                        <th>Paid Too</th>
                    
                      </thead>
                      <tbody *ngFor="let install of installPay">
       
       <tr>
         <td>&#8377;{{ install.amountPaid}}</td><td>{{install.paidOn | date:'dd-MMM-yyyy HH:mm:ss'}}</td><td>{{install.paidToo}}</td>
         </tr>
       </tbody>
       </table>
  `,
})
export class BottomSheet {
  public installPay: InstalledPay[] = [];

  constructor(private _bottomSheetRef: MatBottomSheetRef<BottomSheet>) {
    console.log("sessionStorage.getItem" + sessionStorage.getItem("installedPay"))
    this.installPay = JSON.parse(sessionStorage.getItem("installedPay"));
    this.installPay.sort(function (a, b) {
      let date1 = new Date(a.paidOn);
      let date2 = new Date(b.paidOn);
      if (date1 > date2) return -1;
      if (date1 < date2) return 1;
    });

  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}


@Component({
  selector: 'assetExchange',
  template: `
     <table border="1" width="500px">
     <thead *ngIf="language==='Eng'">
                        <th>Asset Name</th>
                        <th>Hallmark</th>
                        <th>Unit</th>
                        <th>Q/W</th>
                        <th>Rate</th>
                        <th>Margin</th>
                        <th>Amount</th>
                    
                      </thead>
                      <thead *ngIf="language==='Hin'">
                        <th>गहने का नाम</th>
                        <th>बानगी</th>
                        <th>मात्रक</th>
                        <th>मात्रा/वजन</th>
                        <th>मूल्य</th>
                        <th>नफ़ा</th>
                        <th>रकम</th>
                    
                      </thead>
                      <tbody *ngFor="let asset of assetExchange">
       
       <tr>
         <td *ngIf="language==='Eng'">{{asset.assetName}}</td>
         <td *ngIf="language==='Hin'" style="font-family: arjunFont;font-size: 18px;font-weight: bold;">{{asset.assetName}}</td>
         <td>{{asset.assetHallmark}}</td><td>{{asset.assetUnit}}</td><td>{{asset.assetQW}}</td><td>{{asset.assetRate}}</td><td>{{asset.assetMargin}}</td><td>{{asset.amount | number:'.2-2'}}</td>
         </tr>
       </tbody>
       </table>
  `,
})
export class AssetExchange {
  public assetExchange: AssetExchange[] = [];
  public language: string = null;

  constructor(private _bottomSheetRef: MatBottomSheetRef<BottomSheet>) {
    console.log("sessionStorage.getItem" + sessionStorage.getItem("installedPay"))
    this.assetExchange = JSON.parse(sessionStorage.getItem("assetExchange"));
    this.language = JSON.parse(sessionStorage.getItem("language"));
  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }




}
