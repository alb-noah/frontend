import { Component, OnInit } from '@angular/core';
import {ProductService} from '../../services/product.service';
import {Router} from '@angular/router';
import {ProductModelserver, ServerResponse} from '../../models/product.model';
import {CartService} from '../../services/cart.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  products: ProductModelserver[] = [];

  constructor(private productService: ProductService,
              private router: Router,
              private cartService: CartService) { }

  ngOnInit(): void {
    this.productService.getAllproducts().subscribe((prods: ServerResponse) => {
        this.products = prods.products;
        console.log(this.products);
    });
  }

  selectProduct(id: number) {
    this.router.navigate(['/product', id]).then();
  }

  AddToCart(id: number) {
    this.cartService.AddProductToCart(id);
  }
}
