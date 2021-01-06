import { Component, OnInit, Output, EventEmitter, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Users } from '../Users';
import { MatDialog } from '@angular/material/dialog';
import { CustomerDetailsComponent } from '../customer-details/customer-details.component';
import { Customer } from '../Customer';
import { CustomerService } from '../customer.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ErrorComponent } from '../error/error.component';

@Component({
  selector: 'app-view-customer',
  templateUrl: './view-customer.component.html',
  styleUrls: ['./view-customer.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ViewCustomerComponent implements OnInit {
  public registerUserData;
  public user = new Users(0, "", "", "", "", "", "", "", 0, "");
  public customers: Customer[] = [];
  columnsToDisplay: string[] = ['customerFirstName', 'customerAddedOn', 'email', 'mobNumber', 'delete'];
  expandedElement: null;
  public dataSource;
  public showFilter: boolean = true;
  public tableLoaded: boolean = true;

  @ViewChild('firstSort', { static: false }) sort: MatSort;
  @ViewChild('FirstPaginator', { static: false }) paginator: MatPaginator;

  @Output() public childEvent = new EventEmitter();

  constructor(public dialog: MatDialog, private _customer: CustomerService, private router: Router) { }

  ngOnInit(): void {
    this.registerUserData = localStorage.getItem('user');
    this.user = JSON.parse(this.registerUserData);
    console.log("user.imagePath " + this.user.imagePath)

    this._customer.getAllHindiCustomer().subscribe(res => {
      this.customers = res;
      console.log(JSON.stringify(this.customers.map))
      this.dataSource = new MatTableDataSource(this.customers);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.tableLoaded = false;
    },
      err => {
        // console.log(err.status); 

        const dialogRef = this.dialog.open(ErrorComponent, { data: { message: 'आप अनधिकृत उपयोगकर्ता हैं या आपका सत्र समाप्त हो चुका है। कृपया पुनः लॉगिन करने का प्रयास करें।' } });
        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
          sessionStorage.clear();
          localStorage.clear();
          this.router.navigate(['']);
        });
      });
  }

  delete(customer) {
    this.expandedElement = customer;
    const dialogRef = this.dialog.open(MyAlertDialogComponent, { data: { customer: customer } });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result.data !== 'cancelled') {
        customer.spinner = true;
        this._customer.deleteCustomer(customer).subscribe(res => {
          if (customer.language === 'Hin') {
            this._customer.getAllHindiCustomer().subscribe(res => {
              this.customers = res
              this.dataSource = new MatTableDataSource(this.customers);
              this.dataSource.sort = this.sort;
              this.dataSource.paginator = this.paginator;
            });
          } else {
            this._customer.getAllEnglishCustomer().subscribe(res => {
              this.customers = res
              this.dataSource = new MatTableDataSource(this.customers);
              this.dataSource.sort = this.sort;
              this.dataSource.paginator = this.paginator;
            });
          }
        }, err => {
          customer.spinner = false;
          if(customer.language === 'Hin'){
            const dialogRef = this.dialog.open(ErrorComponent, { data: { message: 'आप अनधिकृत उपयोगकर्ता हैं या आपका सत्र समाप्त हो चुका है। कृपया पुनः लॉगिन करने का प्रयास करें।' } });
            dialogRef.afterClosed().subscribe(result => {
              console.log(`Dialog result: ${result}`);
              sessionStorage.clear();
              localStorage.clear();
              this.router.navigate(['']);
            }); 
          }else{
            const dialogRef = this.dialog.open(ErrorComponent, { data: { message: 'You are unauthorized user or you session has been expired. Please try login again.' } });
            dialogRef.afterClosed().subscribe(result => {
              console.log(`Dialog result: ${result}`);
              sessionStorage.clear();
              localStorage.clear();
              this.router.navigate(['']);
            });
          }
         
        });
      } else {

      }
    });


  }

  getEnglishCustomer() {
    this._customer.getAllEnglishCustomer().subscribe(res => {
      this.customers = res;
      console.log(JSON.stringify(this.customers.map))
      this.dataSource = new MatTableDataSource(this.customers);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.showFilter = false;
    },
      err => {
        // console.log(err.status); 

        const dialogRef = this.dialog.open(ErrorComponent, { data: { message: 'You are unauthorized user or you session has been expired. Please try login again.' } });
        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
          sessionStorage.clear();
          localStorage.clear();
          this.router.navigate(['']);
        });
      });
  }

  getHindiCustomer() {
    this._customer.getAllHindiCustomer().subscribe(res => {
      this.customers = res;
      console.log(JSON.stringify(this.customers.map))
      this.dataSource = new MatTableDataSource(this.customers);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.showFilter = true;
    },
      err => {
        // console.log(err.status); 

        const dialogRef = this.dialog.open(ErrorComponent, { data: { message: 'आप अनधिकृत उपयोगकर्ता हैं या आपका सत्र समाप्त हो चुका है। कृपया पुनः लॉगिन करने का प्रयास करें।' } });
        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
          sessionStorage.clear();
          localStorage.clear();
          this.router.navigate(['']);
        });
      });
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  customerInfo(element) {
    const dialogRef = this.dialog.open(CustomerDetailsComponent, { data: { customer: element } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}

@Component({
  selector: 'AlerBox',
  template: `
  <div *ngIf="data.customer.language==='Eng'; else Hindi">
  <div>Deleting customer would delete all it's related Address and Invoice. 
             <br>Are you sure of deleting <b>{{this.data.customer.customerFirstName}}</b>? .
  <mat-dialog-actions align="end">
  <button mat-raised-button (keydown.space)="$event.preventDefault()"  (click)="confirm()" color="warn">Yes</button>
  <button mat-raised-button mat-dialog-close  (click)="cancel()" color="primary">No</button>
</mat-dialog-actions></div>
</div>
<ng-template #Hindi>
<div>ग्राहक को हटाने से उनके सभी संबंधित पते और चालान हटा दिए जाएंगे। 
<br>क्या आप <small style="font-family: arjunFont;font-size: 18px;font-weight: bold;">{{this.data.customer.customerFirstName}}</small> को हटाने के बारे में सुनिश्चित हैं? .
<mat-dialog-actions align="end">
<button mat-raised-button  (keydown.space)="$event.preventDefault()" (click)="confirm()" color="warn">हटाएं</button>
<button mat-raised-button mat-dialog-close (click)="cancel()" color="primary">अभी नहीं</button>
</mat-dialog-actions></div>
</ng-template>
`
})
export class MyAlertDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<MyAlertDialogComponent>) { }

  cancel() {
    // send data to parent component
    this.dialogRef.close({ data: 'cancelled' })
  }

  confirm() {
    this.dialogRef.close({ data: this.data.customer })
  }
}



