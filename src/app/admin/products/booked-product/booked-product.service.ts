import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APIURL } from '../../../shared/globalConstants';
import { BookedProductModel } from './booked-product.model';

@Injectable({
    providedIn: "root"
})
export class BookedProductService {
    constructor(private http: HttpClient) { }

    getBookedProducts(id: string): Observable<HttpResponse<BookedProductModel[]>> {
        return this.http.get<BookedProductModel[]>(`${APIURL}/BookedProduct/list/${id}`, {
            observe: "response"
        });
    }
}
