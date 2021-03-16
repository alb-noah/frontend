import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private  products: ProductResponeModel[] = [];
  private serverUrl = environment.SERVER_URL;


  constructor(private http: HttpClient) { }

  getSingleOrder(orderId: number){
    return this.http.get<ProductResponeModel[]>(this.serverUrl + '/orders/' + orderId).toPromise();
  }
}


interface ProductResponeModel{
  id: number;
  title: string;
  description: string;
  price: number;
  quantityOrdered: number;
  image: string;
}
