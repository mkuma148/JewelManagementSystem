import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../user.service';
import {Users} from '../Users';
import {UserWithToken} from '../UserWithToken';
import {MatDialog} from '@angular/material/dialog';
import {ErrorComponent} from '../error/error.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public _user = new Users(0,"","","","","","","",0,"");
  public token = "";
  public _userWithtoken = new UserWithToken(this._user,this.token);
  public msg = "";
  hide = true;
  
  ngOnInit(): void { 
    this.token = localStorage.getItem('token');
    this._user = JSON.parse(localStorage.getItem('user'));
    if(this.token != null){
      console.log('Admin  '+this._user.userType)
       if(this._user.userType === 'owner'){
        this.router.navigateByUrl('/owner');
       }else{
        this.router.navigateByUrl('/surveyor');
       } 
    }else{
      this.router.navigateByUrl('');
    }
  }

  public loginUserData = {"userFirstName":"", "userLastName":"", "email":"", "password":"", "confPassword":"", "mobNumber":""}
 
  constructor(private router:Router,private _userService:UserService, public dialog: MatDialog){
    // this.router.navigate(['/userProfile']);
    // this._userService.testAuthorization().subscribe(res =>{},
    //   err =>{
    //     const dialogRef = this.dialog.open(ErrorComponent, {data:{message:'आप अनधिकृत उपयोगकर्ता हैं या आपका सत्र समाप्त हो चुका है। कृपया पुनः लॉगिन करने का प्रयास करें।'}});
    //     dialogRef.afterClosed().subscribe(result => {
    //       console.log(`Dialog result: ${result}`);
    //       sessionStorage.clear();
    //       localStorage.clear();
    //       this.router.navigate(['']);
    //     });
    //   });
  };

  // loadData(){
  //    this.showSpinner = true;
  //    setTimeout(() => {
  //       this.showSpinner = false;
  //    }, 5000)
  // }

  // log(state){
  //   console.log(state);
  // }

  // login(){
  //   // this._auth.registerUser(this.registerUserData)
  //   // .subscribe(
  //   //    res => 
  //   //    {console.log(res)
  //   //     localStorage.setItem('token', res.token)
  //       this.router.navigateByUrl('/surveyor')
  //   //   },
  //   //    err => console.log(err)
  //   // )
  // }

  login(){
    this._userService.loginUser(this.loginUserData)
    .subscribe(
      res => 
      {
        console.log(res)
      
        this._userWithtoken = res;
        if(this._userWithtoken.user.userType === "owner" && this._userWithtoken.user.userStatus === "Active"){
         this.router.navigateByUrl('/owner')
        }else if(this._userWithtoken.user.userType === "admin" && this._userWithtoken.user.userStatus === "Active"){
         this.router.navigateByUrl('/admin')
        }else{
        this.router.navigateByUrl('')
        this.msg = "Your are not a active user. Please provide valid username/password"
       }
        localStorage.setItem('token', this._userWithtoken.token);
        localStorage.setItem('user', JSON.stringify(this._userWithtoken.user));
      //  console.log('User '+this._userWithtoken.user)
      //  console.log('Hi '+res.jwttoken);
      this._userService.exportDB().subscribe(res=>{

      });
     },
      err =>{
        console.log(err)
        const dialogRef = this.dialog.open(ErrorComponent, {data:{message:'Username/Password incorrect'}});
         dialogRef.afterClosed().subscribe(result => {
           console.log(`Dialog result: ${result}`);
         });
       } 
    )
  }

  register(){
    // this.router.navigateByUrl('/register')
    var url = "view-source:https://www.goldpriceindia.com/gold-price-kolkata.php";
var xmlHttp = new XMLHttpRequest();
xmlHttp.open("POST", url, true);
xmlHttp.send();
alert(xmlHttp.responseText);
  }

}
