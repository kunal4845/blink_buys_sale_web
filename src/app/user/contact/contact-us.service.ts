import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { APIURL } from '../../shared/globalConstants';
import { ContactUsModel } from './contact-us.model';

@Injectable({ providedIn: "root" })
export class ContactUsService {
    constructor(private http: HttpClient) { }

    post(contactUs: ContactUsModel): Observable<HttpResponse<ContactUsModel>> {
        return this.http.post<ContactUsModel>(`${APIURL}/contactUs`, contactUs, {
            observe: "response"
        });
    }
}
