import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { throwError as _throw} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Product } from './Product';
import { Observable } from 'rxjs';
import {environment} from '../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  baseUrl = environment.baseUrl;
  _saveProductUrl = `${this.baseUrl}/saveProduct`;
  _getAllProductsUrl = `${this.baseUrl}/getAllProducts`;
  _deleteProductUrl = `${this.baseUrl}/deleteProduct`;

  constructor(private http:HttpClient) { }

  saveProduct(product){
    return this.http.post<Product>(this._saveProductUrl, product).pipe(
      catchError(this.handleError)
    );
  }

  getAllProducts():Observable<Product[]>{
    return this.http.get<Product[]>(this._getAllProductsUrl).pipe(
      catchError(this.handleError)
    );
  }

  deleteProduct(product){
    return this.http.post(this._deleteProductUrl, product).pipe(
      catchError(this.handleError)
    );
  }

  handleError(error: HttpErrorResponse){
    return _throw(error.message || "Server Error")
 }
}
