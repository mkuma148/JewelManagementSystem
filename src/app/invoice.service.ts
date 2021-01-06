import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { throwError as _throw} from 'rxjs';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import { Invoice } from './Invoice';
import { Observable, interval } from "rxjs";
import { share } from "rxjs/operators";
import {environment} from '../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  baseUrl = environment.baseUrl;
  _saveInvoiceUrl = `${this.baseUrl}/saveInvoice`;
  _sendBulkSMS = `${this.baseUrl}/sendMessage`;

  private clock: Observable<Date>;

  constructor(private http:HttpClient) { 
    this.clock = interval(1000)
        .pipe(
            map(tick => new Date()),
            share()
        );
  }

  getClock(): Observable<Date> {
    return this.clock;
  }

  saveInvoice(invoice):Observable<Invoice>{
    return this.http.post<Invoice>(this._saveInvoiceUrl, invoice).pipe(
      catchError(this.handleError)
    );
  }

  sendBulkSMS(message):Observable<string>{
    return this.http.post<string>(this._sendBulkSMS, message).pipe(
      catchError(this.handleError)
    );
  }
  

  handleError(error: HttpErrorResponse){
    return _throw(error.message || "Server Error")
 }
}
