import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { throwError as _throw} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from './Customer';
import {environment} from '../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

   baseUrl = environment.baseUrl;
  _saveCustomerUrl = `${this.baseUrl}/saveCustomer`;
  _getAllCustomerUrl = `${this.baseUrl}/getAllCustomer`;
  _getAllEnglishCustomerUrl = `${this.baseUrl}/getAllEnglishCustomer`;
  _getAllHindiCustomerUrl = `${this.baseUrl}/getAllHindiCustomer`;
  _deleteCustomerUrl = `${this.baseUrl}/deleteCustomer`;

  constructor(private http:HttpClient) { }

  saveCustomer(customer):Observable<Customer>{
    return this.http.post<Customer>(this._saveCustomerUrl, customer).pipe(
      catchError(this.handleError)
    );
  }

  getAllCustomer():Observable<Customer[]>{
    return this.http.get<Customer[]>(this._getAllCustomerUrl).pipe(
      catchError(this.handleError)
    );
  }

  getAllEnglishCustomer():Observable<Customer[]>{
    return this.http.get<Customer[]>(this._getAllEnglishCustomerUrl).pipe(
      catchError(this.handleError)
    );
  }

  getAllHindiCustomer():Observable<Customer[]>{
    return this.http.get<Customer[]>(this._getAllHindiCustomerUrl).pipe(
      catchError(this.handleError)
    );
  }

  deleteCustomer(customer){
    return this.http.post(this._deleteCustomerUrl, customer).pipe(
      catchError(this.handleError)
    );
  }

  handleError(error: HttpErrorResponse){
    console.log("error.message "+error.error.message);
    return _throw(error || "Server Error");
 }

}
