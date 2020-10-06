import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from 'src/app/admin/products/product.model';
import { APIURL } from 'src/app/shared/globalConstants';
import { UserCart } from './userCart.model';

@Injectable({
    providedIn: 'root',
})

export class CartService {
    private APIURL: string = APIURL + "/product/";
    constructor(private http: HttpClient) { }

    addToCart(userCart: UserCart): Observable<HttpResponse<UserCart>> {
        return this.http.post<UserCart>(`${this.APIURL}/cart`, userCart, {
            observe: "response"
        });
    }


    getCart(userId: number): Observable<HttpResponse<UserCart[]>> {
        return this.http.get<UserCart[]>(`${this.APIURL}/cart/${userId}`, {
            observe: "response"
        });
    }

    deleteCart(cartId: number): Observable<HttpResponse<UserCart>> {
        return this.http.delete<UserCart>(`${this.APIURL}/cart/${cartId}`, {
            observe: "response"
        });
    }
}
