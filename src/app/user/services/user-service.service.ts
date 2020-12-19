import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ServiceModel } from 'src/app/admin/services/admin-services.model';
import { APIURL } from 'src/app/shared/globalConstants';

@Injectable({ providedIn: "root" })
export class UserService {
    constructor(private http: HttpClient) { }

    get(serviceId: string): Observable<HttpResponse<ServiceModel[]>> {
        return this.http.get<ServiceModel[]>(`${APIURL}/service/${serviceId}`, {
            observe: "response"
        });
    }
}
