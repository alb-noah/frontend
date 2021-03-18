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

 private url = environment.SERVER_URL;
  constructor(private http: HttpClient) { }

  // FETCH ALL PRODUCT FROM BACKEND

  getAllproducts(limitOfResults = 10): Observable<ServerResponse>{
   return this.http.get<ServerResponse>(this.url + 'products', {
     params: {
       limit: limitOfResults.toString()
     }
   });

  }
// get single product from server

  getSingleProduct(id: number): Observable<ProductModelserver>{
  return this.http.get<ProductModelserver>(this.url + 'products/' + id);
  }

  // get product from one category
  getProductsFromCategory(catName: string): Observable<ProductModelserver[]> {
   return this.http.get<ProductModelserver[]>(this.url + '/products/category/' + catName);
  }
}

