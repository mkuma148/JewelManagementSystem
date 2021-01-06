import { Injectable, Injector } from '@angular/core';
import {HttpInterceptor, HttpRequest, HttpHandler} from '@angular/common/http';
import {UserService} from './user.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor{

  token:string;

  constructor(private injector:Injector) { }


  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let adminService = this.injector.get(UserService);
    if(adminService.getToken() == null){
       this.token = 'Bearer ';
    }else{
      this.token = `Bearer ${adminService.getToken()}`;
    }
    let tokenizedReq = req.clone({
      setHeaders:{
        
            Authorization: this.token
          
      }
    })
    return next.handle(tokenizedReq)
    }
}
