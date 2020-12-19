import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIURL } from '../../shared/globalConstants';
import { BillingAddress } from '../checkout/billingAddress.model';
import { UserCart } from './userCart.model';

@Injectable({
    providedIn: 'root',
})

export class CartService {
    constructor(private http: HttpClient) { }

    addToCart(userCart: UserCart): Observable<HttpResponse<UserCart>> {
        return this.http.post<UserCart>(`${APIURL}/cart`, userCart, {
            observe: "response"
        });
    }

    getCart(): Observable<HttpResponse<UserCart[]>> {
        return this.http.get<UserCart[]>(`${APIURL}/cart`, {
            observe: "response"
        });
    }

    deleteCart(cartId: number): Observable<HttpResponse<UserCart>> {
        return this.http.delete<UserCart>(`${APIURL}/cart/${cartId}`, {
            observe: "response"
        });
    }

    checkout(userCart: UserCart[]): Observable<HttpResponse<UserCart>> {
        return this.http.post<UserCart>(`${APIURL}/cart/checkout`, userCart, {
            observe: "response"
        });
    }

    addBillingAddress(billingAddress: BillingAddress): Observable<HttpResponse<BillingAddress>> {
        return this.http.post<BillingAddress>(`${APIURL}/cart/billingAddress`, billingAddress, {
            observe: "response"
        });
    }

    getBillingAddress(): Observable<HttpResponse<BillingAddress>> {
        return this.http.get<BillingAddress>(`${APIURL}/cart/billingAddress`, {
            observe: "response"
        });
    }
}
