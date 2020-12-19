import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { APIURL } from '../../shared/globalConstants';
import { BookedProductModel } from '../../admin/products/booked-product/booked-product.model';
import { BookedServiceModel } from '../../admin/services/admin-services.model';

@Injectable({ providedIn: "root" })
export class MyOrdersService {
    constructor(private http: HttpClient) { }

    get(id: string): Observable<HttpResponse<BookedProductModel[]>> {
        return this.http.get<BookedProductModel[]>(`${APIURL}/bookedProduct/list/${id}`, {
            observe: "response"
        });
    }

    getOrderedServices(id: string): Observable<HttpResponse<BookedServiceModel[]>> {
        return this.http.get<BookedServiceModel[]>(`${APIURL}/bookedProduct/service/${id}`, {
            observe: "response"
        });
    }


    cancelOrder(bookedProductId: number): Observable<HttpResponse<boolean>> {
        return this.http.get<boolean>(`${APIURL}/bookedProduct/cancel/${bookedProductId}`, {
            observe: "response"
        });
    }

    cancelService(bookedServiceId: number): Observable<HttpResponse<boolean>> {
        return this.http.get<boolean>(`${APIURL}/bookedProduct/cancelService/${bookedServiceId}`, {
            observe: "response"
        });
    }
}
