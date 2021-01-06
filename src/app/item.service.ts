import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { throwError as _throw} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Product } from './Product';
import { Observable } from 'rxjs';
import { Item } from './Item';
import {environment} from '../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  baseUrl = environment.baseUrl;
  _deleteItemUrl = `${this.baseUrl}/deleteItem`;
  _saveItemUrl = `${this.baseUrl}/saveItem`;
  _saveAllItemUrl = `${this.baseUrl}/saveAllItem`;

  constructor(private http:HttpClient) { }

  deleteItem(item){
    return this.http.post(this._deleteItemUrl, item).pipe(
      catchError(this.handleError)
    );
  }

  saveItem(item):Observable<Item>{
    return this.http.post<Item>(this._saveItemUrl, item).pipe(
      catchError(this.handleError)
    );
  }

  saveAllItem(items):Observable<Item[]>{
    return this.http.post<Item[]>(this._saveAllItemUrl, items).pipe(
      catchError(this.handleError)
    );
  }

  handleError(error: HttpErrorResponse){
    return _throw(error.message || "Server Error")
 }
}
