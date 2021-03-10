import { Component, OnInit } from '@angular/core';
import {ProductService} from '../../services/product.service';
import {Router} from '@angular/router';
import {ProductModelserver, ServerResponse} from '../../models/product.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  products: ProductModelserver[] = [];

  constructor(private productservice: ProductService,
              private router: Router) { }

  ngOnInit(): void {
    this.productservice.getAllproducts().subscribe((prods: ServerResponse) => {
        this.products = prods.products;
    });
  }

  selectProduct(id: number) {
    this.router.navigate(['/product', id]).then();
  }
}
