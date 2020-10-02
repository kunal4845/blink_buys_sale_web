import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { take, map } from 'rxjs/operators';
import { Product } from 'src/app/admin/products/product.model';

@Injectable({
    providedIn: 'root',
})

export class CartService {
    constructor() {
        debugger
        let existingCartItems = JSON.parse(localStorage.getItem('products'));
        if (!existingCartItems) {
            existingCartItems = [];
        }
        this.itemsSubject.next(existingCartItems);
    }

    private itemsSubject = new BehaviorSubject<Product[]>([]);
    items$ = this.itemsSubject.asObservable();

    addToCart(product: Product) {
        debugger
        try {
            this.items$.pipe(
                take(1),
                map((products) => {
                    products.push(product);
                    localStorage.setItem('products', JSON.stringify(products));
                }),
            ).subscribe();
        }
        catch (e) {
            console.log("Local Storage is full, Please empty data");
            // fires When localstorage gets full
            // you can handle error here or empty the local storage
        }
    }
}
