import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from '../Product';
import {Item} from '../Item';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent implements OnInit {

  itemId:number;
  public item:Item = new Item(null,"","",null,null,null,null,0,0,0,false);
  public product:Product;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<AddItemComponent>, public _product:ProductService) {
    for(let p of this.data.productObject.items){
      console.log("data Id "+p.itemId)
   }
   }

  ngOnInit(): void {
  }

  cancel() {
    // send data to parent component
    this.dialogRef.close({ data: 'cancelled' })
  }

  confirm() {
    this.data.productObject.items.push(this.item);
    this._product.saveProduct(this.data.productObject).subscribe(
      res => 
      {
          this.product = res;
          this.dialogRef.close({ data: this.product })
      });
      
    
  }

}
