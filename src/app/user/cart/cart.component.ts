import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Product } from 'src/app/admin/products/product.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  private eventsSubscription: Subscription;
  @Input() events: Observable<void>;
  productList: Product[] = [];

  constructor() {
  }

  ngOnInit(): void {
    this.eventsSubscription = this.events.subscribe(() => {
      this.initializeCart()
    });
  }

  initializeCart() {
    let products = JSON.parse(localStorage.getItem("products"));
    if (products) {
      this.productList = [];
      products.forEach(element => {
        this.productList.push(element);
      });
    }
    console.log(this.productList);
  }

  addMore() {

  }

  addLess() {

  }

  delete() {

  }

  checkout() {

  }
  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }
}
