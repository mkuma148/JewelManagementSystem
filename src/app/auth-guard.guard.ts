import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {
  constructor(private _authService:UserService, private _router:Router){}

  canActivate(): boolean{
    if(this._authService.loggedIn()){
      return true;
    }else{
       this._router.navigate([''])
       return false;
    }
  }
  
}
