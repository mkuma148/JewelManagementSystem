import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {UserService} from '../user.service';
import {Router} from '@angular/router';
import {Users} from '../Users';
import {MatDialog} from '@angular/material/dialog';
import {ErrorComponent} from '../error/error.component';
import { Observable } from "rxjs";
import { AngularFireStorage } from "@angular/fire/storage";
import { map, finalize } from "rxjs/operators";

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  public registerUserData;
  public user = new Users(0,"","","","","","","",0,"");
  title = "cloudsSorage";
  selectedFile: File = null;
  fb;
  downloadURL: Observable<string>;
  public event;
  showSpinner = false;

  constructor( private router:Router,private _userService:UserService, public dialog: MatDialog, private storage: AngularFireStorage) { }

  @Output() public childEvent = new EventEmitter();

  ngOnInit(): void {
    this.registerUserData = localStorage.getItem('user');
    this.user = JSON.parse(this.registerUserData);
  }

  regUser(){
    this._userService.updateUser(this.user)
    .subscribe(
       res => 
       {
         console.log(res)
         localStorage.setItem('user', JSON.stringify(res));
    //     localStorage.setItem('token', res.token)
        //  this.router.navigateByUrl('/surveyor')
        this.showSpinner = false;
        const dialogRef = this.dialog.open(ErrorComponent, {data:{message:'User updated successfully'}});
        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
          
        });
         this.childEvent.emit(this.user.userFirstName);
      },
       err => {console.log()
        this.showSpinner = false;
        const dialogRef = this.dialog.open(ErrorComponent, {data:{message:'Username/email already exist'}});
        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
      }
    )
  }

  submit(){
    this.showSpinner = true;
    console.log("uploadImage")
    var n = Date.now();
    console.log("this.event.target "+this.event)
    if(this.event != undefined ){
    const file = this.event.target.files[0];
    const filePath = `RoomsImages/${n}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`RoomsImages/${n}`, file);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url) {
              this.fb = url;
              this.user.imagePath = this.fb;
              console.log("this.user "+this.user.imagePath)
              this.regUser();
            }
            console.log("FB "+this.fb);
          });
        })
      )
      .subscribe(url => {
        if (url) {
          console.log("What app"+url);
        }
      });
      console.log("uploadImage  mmm")
    }else{
      this.regUser();
    }
   
  }

  onFileSelected(event) {
    this.event = event;
    console.log("Inside "+event)
    
  }

}
