import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { Product } from 'src/app/admin/products/product.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  @Input() model: any;   // instead of any, specify your type
  productList: Product[] = [];

  constructor() {
  }

  ngOnInit(): void {
    debugger
    let product = JSON.parse(localStorage.getItem("products"));
    this.productList.push(product);
  }

  ngOnChanges(changes: SimpleChange) {
    debugger
    // code here
    if (changes.currentValue !== undefined) {
      this.productList.push(changes.currentValue);
    }
  }

  addMore() { }

  delete() { }

}
