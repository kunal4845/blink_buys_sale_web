import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { APIURL } from '../../shared/globalConstants';
import { User } from '../../login/login.interface';

@Injectable({
    providedIn: "root"
})
export class DealerService {
    constructor(private http: HttpClient) { }

    getDealers(): Observable<HttpResponse<User[]>> {
        return this.http.get<User[]>(`${APIURL}/shared/listUsers`, {
            observe: "response"
        });
    }

    verifyDealer(userId: number): Observable<HttpResponse<User>> {
        return this.http.get<User>(`${APIURL}/dealer/verify/${userId}`, {
            observe: "response"
        });
    }

    deleteDealer(userId: number): Observable<HttpResponse<User>> {
        return this.http.delete<User>(`${APIURL}/dealer/${userId}`, {
            observe: "response"
        });
    }

    blockDealer(userId: number): Observable<HttpResponse<User>> {
        return this.http.get<User>(`${APIURL}/dealer/block/${userId}`, {
            observe: "response"
        });
    }
}
