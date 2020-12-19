import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIURL } from '../../../shared/globalConstants';
import { PaymentModel } from './payment.model';

@Injectable({
    providedIn: 'root',
})

export class PaymentService {
    constructor(private http: HttpClient) { }

    makePayment(payment: PaymentModel): Observable<HttpResponse<PaymentModel>> {
        return this.http.post<PaymentModel>(`${APIURL}/payment`, payment, {
            observe: "response"
        });
    }

    getPaymentDetail(paymentId: number): Observable<HttpResponse<PaymentModel>> {
        return this.http.get<PaymentModel>(`${APIURL}/payment/${paymentId}`,  {
            observe: "response"
        });
    }
}
