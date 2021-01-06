import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ErrorComponent } from '../error/error.component';
import { UserService } from '../user.service';
import {Users} from '../Users';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  panelOpenState = false;
  public registerUserData;
  public user = new Users(0,"","","","","","","",0,"");

  @Output() public childEvent = new EventEmitter();

  constructor(private router:Router, private userService:UserService,public dialog: MatDialog) { }

  ngOnInit(): void {
    this.userService.testAuthorization().subscribe(res =>{
       this.registerUserData = localStorage.getItem('user');
       this.user = JSON.parse(this.registerUserData);
      console.log("user.imagePath "+this.user.imagePath)
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

}
