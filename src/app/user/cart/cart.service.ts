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
                map(() => {
                    debugger
                    let productList = JSON.parse(localStorage.getItem("products"));
                    if (productList) {
                        productList.forEach(element => {
                            if (element.id !== product.id) {
                                productList.push(product);
                            } else {
                                product.quantity = product.quantity + 1;
                                let updateItem = productList.find(this.findIndexToUpdate, product.id);
                                let index = productList.indexOf(updateItem);
                                productList[index] = product;
                            }
                        });
                    }

                    if (productList === null) {
                        productList = [];
                        productList.push(product);
                    }

                    localStorage.removeItem("products");
                    localStorage.setItem('products', JSON.stringify(productList));
                }),
            ).subscribe();
        }
        catch (e) {
            console.log("Local Storage is full, Please empty data");
            // fires When localstorage gets full
            // you can handle error here or empty the local storage
        }
    }

    findIndexToUpdate(newItem) {
        return newItem.id === this;
    }
}
