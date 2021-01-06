import { Component, OnInit, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Users} from '../Users';
import {MatDialog} from '@angular/material/dialog';
import { CustomerDetailsComponent } from '../customer-details/customer-details.component';
import { Product } from '../Product';
import { ProductService } from '../product.service';
import { DataSource } from '@angular/cdk/table';
import { AddItemComponent } from '../add-item/add-item.component';
import { Item } from '../Item';
import {ItemService} from '../item.service';
import { EditItemComponent } from '../edit-item/edit-item.component';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AddProductComponent implements OnInit {

  @ViewChild('firstSort', {static: false}) sort: MatSort;
  @ViewChild('FirstPaginator', {static: false}) paginator: MatPaginator;
  @ViewChild('secondSort', {static: false}) secondSort: MatSort;
  @ViewChild('secondPaginator', {static: false}) secondPaginator: MatPaginator;

  public registerUserData;
  public user = new Users(0,"","","","","","","",0,"");
  public product = new Product(0,"","",0,0,false,new Date(),[],this.user)
  public dataSource:MatTableDataSource<Product>;
  public addClicked:boolean=true;
  public showSpinner:boolean=false;
  public deleteClicked=true;
  public showDeleteSpinner=false;
  public tableLoaded:boolean=true;
  public filter:boolean=false;
  public filterItem:boolean=false;

  products: Product[] = [
  
  ];

  public itemDataSource;
  public item = new Item(0,"","",0,0,0,0,0,0,0,false)
  items: Item[] = [
  
  ];

  @Output() public childEvent = new EventEmitter();

  columnsToDisplay: string[] = ['productName', 'description', 'quantity', 'createdOn', 'delete', 'addItem'];
  expandedElement: Product | null;
  itemsColumnsToDisplay: string[] = ['itemName', 'description', 'quantity', 'rate', 'delete', 'editItem'];
  expandedItemElement : Item | null

  constructor(public dialog: MatDialog, public _product:ProductService, public _itemService:ItemService) { }

  ngOnInit(): void {
    this.registerUserData = localStorage.getItem('user');
    this.user = JSON.parse(this.registerUserData);
    console.log("user.imagePath "+this.user.userFirstName)
    
    this._product.getAllProducts().subscribe(res => 
      {
        // console.log("Products "+res[0].productName)
        
        this.products = res
        this.product = new Product(0,"","",0,0,false,new Date(),[],this.user)
        this.dataSource = new MatTableDataSource(this.products);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator; 
        this.tableLoaded=false;
        console.log("Products "+this.products[0].isAvailable)
      }
    );
  }

  // ngAfterViewInit() {
  //   this.dataSource.sort = this.sort;
  //   this.dataSource.paginator = this.paginator; 
  // }

  
  setupFilter(column: string) {
    let textToSearch:any;
    this.dataSource.filterPredicate = (d: Product, filter: string) => {
      if(column === 'quantity'){
        textToSearch = d[column] || 0;
        textToSearch = textToSearch == filter;
      }else{
        textToSearch = d[column] && d[column].toLowerCase() || '';
        textToSearch = textToSearch.indexOf(filter) !== -1;
      }
      
      return textToSearch;
    };
  }
  
  applyFilter(event: Event) {
    
    const filterValue:any = (event.target as HTMLInputElement).value;
    console.log("filterValue "+filterValue);
    // if(filterValue instanceof Number){
      // this.dataSource.filter = filterValue;
    // }else{
      this.dataSource.filter = filterValue.trim().toLowerCase();
    // }
    
    console.log(" File "+this.dataSource.filter)
  }

  setupItemFilter(column: string) {
    let textToSearch:any;
    this.itemDataSource.filterPredicate = (d: Item, filter: string) => {
      if(column === 'quantity' || column === 'rate'){
        textToSearch = d[column] || 0;
        textToSearch = textToSearch == filter;
      }else{
        textToSearch = d[column] && d[column].toLowerCase() || '';
        textToSearch = textToSearch.indexOf(filter) !== -1;
      }
      
      return textToSearch;
    };
  }

  applyItemFilter(event: Event){
    const filterValue:any = (event.target as HTMLInputElement).value;
    console.log("filterValue "+filterValue);
    if(filterValue instanceof Number){
      this.itemDataSource.filter = filterValue;
    }else{
      this.itemDataSource.filter = filterValue.trim().toLowerCase();
    }
    
    console.log(" File "+this.itemDataSource.filter)
  }



  // applyFreeFilter(event){
  //   const filterValue:any = (event.target as HTMLInputElement).value;
  //   console.log("filterValue "+filterValue);
  //   if(filterValue instanceof Number){
  //     this.dataSource.filter = filterValue;
  //   }else{
  //     this.dataSource.filter = filterValue.trim().toLowerCase();
  //   }
    
  //   console.log(" File "+this.dataSource.filter)
  // }

  customerInfo(element){
  const dialogRef = this.dialog.open(CustomerDetailsComponent, {data:{surveyObject:this.user}});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result.product.productName}`);
    });
  }

  addProduct(){
    this.addClicked=false;
    this.showSpinner=true;
    this.product.createdOn = new Date();
    this.product.items = [];
    this.product.user = this.user;
    console.log("this.product.createdOn "+this.product.createdOn)
    this._product.saveProduct(this.product).subscribe(
      res => 
      {
        this.products.splice(0, 0, res);
        this.dataSource = new MatTableDataSource(this.products);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator; 
        this.product = new Product(0,'','',0,0,false,new Date(),[],this.user)
        this.addClicked=true;
        this.showSpinner=false;
      })
   
  }

  hideFilter(){
    this.filter = false;
  }
  showFilter(){
    this.filter = true;
  }

  hideItemFilter(){
    this.filterItem = false;
  }
  showItemFilter(){
    this.filterItem = true;
  }

  delete(product){
   product.spinner=true;
   this.expandedElement = product;
   this._product.deleteProduct(product).subscribe(res => {
    this._product.getAllProducts().subscribe(res => 
      {
        this.products = res
        this.dataSource = new MatTableDataSource(this.products);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator; 
        this.product = new Product(0,"","",0,0,false,new Date(),[],this.user)
      }
    );
   });
  }

  addItem(product){  
      const dialogRef = this.dialog.open(AddItemComponent, {data:{productObject:product}});
        dialogRef.afterClosed().subscribe(result => {
          if(result.data !== 'cancelled'){
            const index = this.products.indexOf(product);
            this.products[index] = result.data;
            this.dataSource = new MatTableDataSource(this.products);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator; 
            this.product = new Product(0,"","",0,0,false,new Date(),[],this.user);
          }
        });
  }

  deleteItem(product, item){
    console.log("Log "+product.productName)
    console.log("Log "+item.itemName) 
    this._itemService.deleteItem(item).subscribe(res => {
      const index = product.items.indexOf(item);
      console.log("index "+index)
      product.items.splice(index, 1);
      this.expanded(product);
    });
    
  }

  editItem(product, item){
    if(this.expandedElement === product){
      this.expandedElement = product;
    }else{
      this.expandedElement = null;
    }
      
      const dialogRef = this.dialog.open(EditItemComponent, {data:{itemObject:item}});
        dialogRef.afterClosed().subscribe(result => {
          this.expanded(product);
        });
  }

  expanded(product){
    // if(this.expandedElement === null){
    //   this.expandedElement = product;
    // }else{
    //   this.expandedElement = null;
    // }
    this.itemDataSource = new MatTableDataSource<Item>();
        if(product.items.length === 0){
          this.itemDataSource = new MatTableDataSource<Item>();
        }else{
           this.itemDataSource = new MatTableDataSource<Item>(product.items);
        }
        this.itemDataSource.sort = this.secondSort;
        this.itemDataSource.paginator = this.secondPaginator; 
  }

}

 