import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ProductService} from './product.service';
import {OrderService} from './order.service';
import {environment} from '../../environments/environment';
import {CartModelpublic, CartModelServer} from '../models/cart.model';
import {BehaviorSubject} from 'rxjs';
import {NavigationExtras, Router} from '@angular/router';
import {ProductModelserver} from '../models/product.model';
import {ToastrModule, ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private serverURL = environment.SERVER_URL;

  // data variable to store the cart info on the cient's local storage

  private cartDataClient: CartModelpublic = {
    total: 0,
    prodData: [{
      incart: 0,
      id: 0
    }]
  };

// data variable to store cart info on the server
private CartDataServer: CartModelServer = {
  total: 0,
  data: [{
    numInCart: 0,
    product: undefined
  }]
};

// observable for the components to subscribe

  cartTotal$ = new BehaviorSubject<number>(0);
  cartData$ = new BehaviorSubject<CartModelServer>(this.CartDataServer);
  constructor(private http: HttpClient,
              private productService: ProductService,
              private orderService: OrderService,
              private router: Router,
              private toast: ToastrService,
              private spinner: NgxSpinnerService) {
    this.cartTotal$.next(this.CartDataServer.total);
    this.cartData$.next(this.CartDataServer);

    // Get the info rom local storage (f any)

    let info: CartModelpublic = JSON.parse(localStorage.getItem('cart'));

    // CHECK IF THE INFO VARIABLE IS NULL OR HAS SOME DATA IN IT

    if (info !== null && info !== undefined && info.prodData[0].incart !== 0){

      // local storage not empty and has some info
      this.cartDataClient = info;

      // loop through each entry and put it in the cartDataServer object
      this.cartDataClient.prodData.forEach(p => {
        this.productService.getSingleProduct(p.id).subscribe((actualProductInfo: ProductModelserver) => {
           if (this.CartDataServer.data[0].numInCart !== 0){
              this.CartDataServer[0].numInCart = p.incart;
              this.CartDataServer[0].product = actualProductInfo;

              // todo create calculate total function and replace it here
              this.cartDataClient.total = this.CartDataServer.total;
              localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
           } else {
             // cartDataServer already has some entry on it
             this.CartDataServer.data.push({
               numInCart: p.incart,
               product: actualProductInfo
             });

             // todo create calculate total function and replace it here
             this.cartDataClient.total = this.CartDataServer.total;
             localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
           }
           this.cartData$.next({... this.CartDataServer});
        });
      });


    }
  }

  // tslint:disable-next-line:typedef
  AddProductToCart(id: number, quantity ?: number){
    this.productService.getSingleProduct(id).subscribe(prod => {
      // 1. if the cart is empty
      if (this.CartDataServer[0].product === undefined){
        this.CartDataServer.data[0].product = prod;
        this.CartDataServer.data[0].numInCart = quantity !== undefined ? quantity : 1;

        // todo calculate total amount
        this.cartDataClient.prodData[0].incart = this.CartDataServer.data[0].numInCart;
        this.cartDataClient.prodData[0].id = prod.id;
        this.cartDataClient.total = this.CartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        this.cartData$.next({ ... this.CartDataServer});


        this.toast.success(` الي السلة${prod.name}تم اضافة المنتج `,'Aroduct Added', {
          timeOut: 1500,
          progressBar : true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-left'
        });

      }
      // 2. if the cart has some items
      else {
        let  index = this.CartDataServer.data.findIndex( p => p.product.id === prod.id); // -1 or positive value

        // a. if the item is already in the cart => index is positive value
        if (index !== -1){
          if (quantity !== undefined && quantity <= prod.quantity){
            this.CartDataServer.data[index].numInCart = this.CartDataServer.data[index].numInCart
            < prod.quantity ? quantity : prod.quantity;
          } else {
            this.CartDataServer.data[index].numInCart < prod.quantity ? this.CartDataServer.data[index].numInCart++ : prod.quantity;
          }

          this.cartDataClient.prodData[index].incart =  this.CartDataServer.data[index].numInCart;
          this.CalculateTotal();
          this.cartDataClient.total = this.CartDataServer.total;
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          this.toast.info(` في السلة${prod.name}تم تحديت كمية `,'Product Updated', {
            timeOut: 1500,
            progressBar : true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-left'
          });

        }// end of if

        // if product not in the cart array
        else {
          this.CartDataServer.data.push({
            numInCart: 1,
            product: prod
          });
          this.cartDataClient.prodData.push({
            incart: 1,
            id: prod.id
          });
          // localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          this.toast.success(` الي السلة${prod.name}تم اضافة المنتج `,'product Added', {
            timeOut: 1500,
            progressBar : true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-left'
          });

          //  calculate total amount
          this.CalculateTotal();
          this.cartDataClient.total = this.CartDataServer.total;
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          this.cartData$.next( { ... this.CartDataServer});
        } // end of else
      }
    });
  }

  // tslint:disable-next-line:typedef
  UpdateCartItem(index:number, increase: boolean){
    let data = this.CartDataServer.data[index];
    if (increase){
      data.numInCart < data.product.quantity ? data.numInCart++ : data.product.quantity;
      this.cartDataClient.prodData[index].incart = data.numInCart;

      // todo calculate total amount
      this.cartDataClient.total = this.CartDataServer.total;
      localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      this.cartData$.next( { ... this.CartDataServer});
    } else {
      data.numInCart--;

      if (data.numInCart < 1){
        // todo Delete the product from cart
        this.cartData$.next( { ... this.CartDataServer});
      } else {
        this.cartData$.next( { ... this.CartDataServer});
        this.cartDataClient.prodData[index].incart = data.numInCart;
        // todo calculate total amount
        this.cartDataClient.total = this.CartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }
    }
  }
  // tslint:disable-next-line:typedef
  DeleteProductFromCart(index: number){
    if (window.confirm('هل انت متاكد من رغبتك في حذف المنتج ؟')){
      this.CartDataServer.data.splice(index, 1);
      this.cartDataClient.prodData.splice(index, 1);
      // todo calculate total amount
      this.cartDataClient.total = this.CartDataServer.total;

      if (this.cartDataClient.total === 0) {
          this.cartDataClient = {total: 0, prodData: [{ incart: 0, id: 0}]};
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient));

      } else {
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }

      if (this.CartDataServer.total === 0) {
        this.CartDataServer = {total: 0, data: [{numInCart: 0, product: undefined}]};
        this.cartData$.next( { ... this.CartDataServer});
      } else {
        this.cartData$.next( { ... this.CartDataServer});
      }
    }
    else {
      // if the user click th cancel button
      return;
    }
  }

  // tslint:disable-next-line:typedef
  private CalculateTotal() {
    let Total = 0;
    this.CartDataServer.data.forEach(p => {
      const {numInCart} = p;
      const {price} = p.product;

      Total += numInCart * price;
    });

    this.CartDataServer.total = Total;
    this.cartTotal$.next(this.CartDataServer.total);
  }

  // tslint:disable-next-line:typedef
   CheckOutFromCart(userId: number){
    this.http.post(`${this.serverURL}/orders/payment`, null).subscribe((res: {success: boolean} ) => {
        if (res.success){
          this.resetServerData();
          this.http.post(`${this.serverURL}/orders/new`, {
            userId: userId,
            products: this.cartDataClient.prodData
          }).subscribe((data: OrderResponse) => {
            this.orderService.getSingleOrder(data.order_id).then(prods => {
              if (data.success){
                const navigationExtras: NavigationExtras = {
                  state: {
                    message: data.message,
                    product: prods,
                    orderId: data.order_id,
                    total: this.cartDataClient.total
                  }
                };
                //  hide spinner
                this.spinner.hide();

                this.router.navigate(['/thankyou'], navigationExtras).then(p => {
                  this.cartDataClient = {total: 0, prodData: [{ incart: 0, id: 0}]};
                  this.cartTotal$.next(0);
                  localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
                });
              }
            });
          });
        } else {
          this.spinner.hide();
          this.router.navigateByUrl('/checkout').then();
          this.toast.error(` نأسف , فشلت عملية اضافة الطلب الرجاء المحاولة مرة اخري `,'order status', {
            timeOut: 1500,
            progressBar : true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-left'
          });
        }
    });
  }
  // tslint:disable-next-line:typedef
  private resetServerData(){
    this.CartDataServer = {
      total: 0,
      data: [{
        numInCart: 0,
        product: undefined
      }]
    };
    this.cartData$.next({ ... this.CartDataServer});
  }

  CalculateSubTotal(index): number {
    let subTotal = 0;
    const  p = this.CartDataServer[index];
    subTotal = p.product.price * p.numInCart;
    return subTotal;
  }
}
interface OrderResponse {
  order_id: number;
  success: boolean;
  message: string;
  products: [{
    id: string ,
    numInCart: string
  }];
}
