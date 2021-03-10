import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {ProductModelserver, ServerResponse} from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

 private SERVER_URL = environment.SERVER_URL;
  constructor(private http: HttpClient) { }

  // FETCH ALL PRODUCT FROM BACKEND

  getAllproducts(numberOfResults = 10): Observable<ServerResponse>{
   return this.http.get<ServerResponse>(this.SERVER_URL + '/products', {
     params: {
       limit: numberOfResults.toString()
     }
   });

  }
// get single product from server

  getSingleProduct(id: number): Observable<ProductModelserver>{
  return this.http.get<ProductModelserver>(this.SERVER_URL + 'products' + id);
  }

  // get product from one category
  getProductsFromCategory(catName: string): Observable<ProductModelserver[]> {
   return this.http.get<ProductModelserver[]>(this.SERVER_URL + '/products/category/' + catName);
  }
}

