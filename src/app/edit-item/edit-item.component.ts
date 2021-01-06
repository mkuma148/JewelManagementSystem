import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from '../Product';
import {Item} from '../Item';
import { ProductService } from '../product.service';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.css']
})
export class EditItemComponent implements OnInit {

  itemId:number;
  public item:Item = new Item(null,"","",null,null,null,null,0,0,0,false);


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<EditItemComponent>, public _itemService:ItemService) {
    this.item.itemId = data.itemObject.itemId;
    this.item.itemName = data.itemObject.itemName;
    this.item.description = data.itemObject.description;
    this.item.quantity = data.itemObject.quantity;
    this.item.rate = data.itemObject.rate;
  }

  ngOnInit(): void {
  }

  cancel() {
    // send data to parent component
    // this.data.itemObject.
    this.dialogRef.close({ data: 'cancelled' })
  }

  confirm() {
    console.log("Inside Confirm")
    console.log("JSON "+JSON.stringify(this.item));
    this._itemService.saveItem(this.item).subscribe(
      res => 
      {
        this.data.itemObject.itemName = this.item.itemName;
        this.data.itemObject.description = this.item.description;
        this.data.itemObject.quantity = this.item.quantity;
        this.data.itemObject.rate = this.item.rate;
        this.dialogRef.close({ data: res })
      });
      
    
  }

}
