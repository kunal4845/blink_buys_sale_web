import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from 'src/app/admin/products/product.model';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isOpen: boolean = false;
  productList: Product[] = [];
  data: any;

  private itemsSubject = new BehaviorSubject<Product[]>([]);
  items$ = this.itemsSubject.asObservable();

  constructor() { }

  ngOnInit(): void {
  }

  clickEvent() {
    this.isOpen = !this.isOpen;
  }

  openCart() {
    debugger
    let product = JSON.parse(localStorage.getItem("products"));
    this.productList.push(product);

    this.itemsSubject.next(this.productList);
    $('#cartModal').modal('show');
  }
}
