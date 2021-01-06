import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
// import {Question} from './Question';
import {Users} from './Users';
// import {UserSurveyQuestions} from './UserSurveyQuestions';
// import {Survey} from './Survey';
// import {UserSurveyQuestions} from './UserSurveyQuestions';
import {UserWithToken} from './UserWithToken';
// import 'rxjs/add/operator/catch';
// import 'rxjs/add/observable/throw';
import { catchError, map } from 'rxjs/operators';
import { throwError as _throw} from 'rxjs';
import { interval, timer } from "rxjs";
import { switchMap, flatMap } from 'rxjs/operators';
import {environment} from '../environments/environment'
import { HttpHeaders } from '@angular/common/http';
import { share } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = environment.baseUrl;

  _registerUrl = `${this.baseUrl}/register`;
  _loginUrl = `${this.baseUrl}/login`;
  _updateUrl = `${this.baseUrl}/user`;
  _passwordUrl = `${this.baseUrl}/password`;
  _getImageBase64 = `${this.baseUrl}/convertImageToBase64`; 
  _exportDB = `${this.baseUrl}/exportDB`;
  _testAuthorization = `${this.baseUrl}/testAuthorization`;
  _goldPrice = `${this.baseUrl}/getGoldPrice`;
  

  private price: Observable<string>;

  constructor(private http:HttpClient) { 
  //   this.price = interval(5000)
  //   .pipe(() => {
  //     // return your http call here
  //     return this.http.get(this._goldPrice, {responseType:'text'}).pipe(
  //       catchError(this.handleError)
  //     );
  //  })

  this.price = timer(0,1000 * 60 * 30)
    .pipe(
         flatMap(() => { return this.http.get(this._goldPrice, {responseType:'text'})}
    ));
  }



  



  registerUser(user){
    return this.http.post<any>(this._registerUrl, user).pipe(
      catchError(this.handleError)
    );
  }

  // getUserByEmail(user){
  //   return this.http.post<Users>(this._getUserAuth, user).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  // getSurveyByEmail(userSurvey){
  //   return this.http.post<UserSurveyQuestions[]>(this._attemptSurveyByEmail, userSurvey).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  passwordReset(user){
    return this.http.post<any>(this._passwordUrl, user).pipe(
      catchError(this.handleError)
    );
  }

  updateUser(user){
    return this.http.post<any>(this._updateUrl, user).pipe(
      catchError(this.handleError)
    );
  }

  loginUser(user): Observable<UserWithToken>{
    return this.http.post<UserWithToken>(this._loginUrl, user).pipe(
      catchError(this.handleError)
    );
  }

  convertImageToBase64(urlModel){
    return this.http.post(this._getImageBase64, urlModel, {responseType: 'text'}).pipe(
      catchError(this.handleError)
    );
  }

  exportDB(){
    return this.http.get(this._exportDB).pipe(
      catchError(this.handleError)
    );
  }

  testAuthorization(){
    return this.http.get(this._testAuthorization).pipe(
      catchError(this.handleError)
    );
  }

  getToken(){
    // console.log('local Storage '+localStorage.getItem('token'))
    return localStorage.getItem('token')
  }
  
  loggedIn(){
    // console.log('local Storage '+localStorage.getItem('token'))
    return !!localStorage.getItem('token')
  }

  getGoldPrice(): Observable<string> {
    console.log("this.price "+this.price)
    return this.price;
  }

  handleError(error: HttpErrorResponse){
     return _throw(error || "Server Error")
  }
}
