import { Component, OnInit } from '@angular/core';
import {ProductService} from '../../services/product.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  products: any[] = [];

  constructor(private productservice: ProductService,
              private router: Router) { }

  ngOnInit(): void {
    this.productservice.getAllproducts().subscribe((prods: {count: Number, products: any[]}) => {
        this.products = prods.products;
    });
  }

  selectProduct(id: Number) {
    this.router.navigate(['/product', id]).then();
  }
}
