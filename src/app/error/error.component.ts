import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { CustomerDetailsComponent } from '../customer-details/customer-details.component';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<ErrorComponent>, private parentDialogRef: MatDialogRef<CustomerDetailsComponent>) { }

  ngOnInit(): void {
  }

  confirm() {
    // send data to parent component
    this.dialogRef.close({ data: 'cancelled' });
    if(this.data.parent != undefined){
      this.data.parent.close();
    }
  }

}
