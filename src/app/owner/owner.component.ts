import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {Router} from '@angular/router';
import { UserService } from '../user.service';
import {Users} from '../Users';
import {ErrorComponent} from '../error/error.component';

@Component({
  selector: 'app-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.css']
})
export class OwnerComponent implements OnInit {

  public registerUserData;
  public user = new Users(0,"","","","","","","",0,"");
  showPortal = false;
  public imageURL;
  public tab;
  public EnglishTab:boolean=false;
  public HindiTab:boolean=true;
  public goldPrice;
  public hl="No Internet";

  constructor(private router:Router, private http:HttpClient, private userService:UserService,public dialog: MatDialog) { 

    this.userService.getGoldPrice().subscribe(price =>{
      if(price === 'failed'){
        this.hl="No Internet";
      }else{
        var splitted = price.split("|", 2);
        this.goldPrice = splitted[0];
        this.hl = splitted[1];
      }
      console.log("this.goldPrice "+this.hl);
  },
  err =>{
    const dialogRef = this.dialog.open(ErrorComponent, {data:{message:'You are an unauthorized user or you session has been expired. Please try login again.'}});
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      sessionStorage.clear();
      localStorage.clear();
      this.router.navigate(['']);
    });
  });
    
    // userService.testAuthorization().subscribe(res =>{
      this.http.get('assets/Base64.txt', { responseType: 'text' })
      .subscribe(res => {
          this.imageURL = res;
      });
      this.router.navigate(['owner/userProfile']);
    // },
    // err =>{
    //   const dialogRef = this.dialog.open(ErrorComponent, {data:{message:'You are unauthorized user or you session has been expired. Please try login again.'}});
    //   dialogRef.afterClosed().subscribe(result => {
    //     console.log(`Dialog result: ${result}`);
    //     sessionStorage.clear();
    //     localStorage.clear();
    //     this.router.navigate(['']);
    //   });
    // });  
    
  }

  ngOnInit(): void {
    this.registerUserData = localStorage.getItem('user');
    this.user = JSON.parse(this.registerUserData);
  }

  title = 'CampaignManagementSystem';
  notifications = 0;
  showSpinner = false;
  opened = true;

  onActivate(componentRef){
    componentRef.childEvent.subscribe((data) =>{
         this.tab = data;
         if(this.tab === 'English'){
            this.EnglishTab = true;
            this.HindiTab = false;
         }else{
            this.HindiTab = true;
            this.EnglishTab = false;
         }
    })
  }

  navGoldPrice(){
    window.open('goldPrice', "_blank");
    // this.router.navigate(['goldPrice']);
  }

  loadData(){
     this.showSpinner = true;
     setTimeout(() => {
        this.showSpinner = false;
     }, 5000)
  }

  log(state){
    console.log(state);
  }

  logout(){
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['']);
  }

}
