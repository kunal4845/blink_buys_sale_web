import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { APIURL } from '../../shared/globalConstants';
import { User } from '../../login/login.interface';
import { ServiceProviderAvailability } from './service-provider-availability.model';

@Injectable({
    providedIn: "root"
})
export class ServiceProviderService {
    constructor(private http: HttpClient) { }

    getServiceProviders(): Observable<HttpResponse<User[]>> {
        return this.http.get<User[]>(`${APIURL}/shared/listUsers`, {
            observe: "response"
        });
    }

    verifyServiceProvider(userId: number): Observable<HttpResponse<User>> {
        return this.http.get<User>(`${APIURL}/serviceProvider/verify/${userId}`, {
            observe: "response"
        });
    }

    deleteServiceProvider(userId: number): Observable<HttpResponse<User>> {
        return this.http.delete<User>(`${APIURL}/serviceProvider/${userId}`, {
            observe: "response"
        });
    }

    blockServiceProvider(userId: number): Observable<HttpResponse<User>> {
        return this.http.get<User>(`${APIURL}/serviceProvider/block/${userId}`, {
            observe: "response"
        });
    }

    submitAvailability(serviceProviderAvailability: ServiceProviderAvailability): Observable<HttpResponse<ServiceProviderAvailability>> {
        return this.http.post<ServiceProviderAvailability>(`${APIURL}/serviceProvider/availability`, serviceProviderAvailability, {
            observe: "response"
        });
    }

    getServiceProviderAvailability(serviceProviderId: number): Observable<HttpResponse<ServiceProviderAvailability>> {
        return this.http.get<ServiceProviderAvailability>(`${APIURL}/serviceProvider/availability/${serviceProviderId}`, {
            observe: "response"
        });
    }

}
