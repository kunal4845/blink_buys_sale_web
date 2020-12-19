import { Injectable } from '@angular/core';
import { State } from './state.model';
import { City } from './city.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { APIURL } from 'src/app/shared/globalConstants';

@Injectable({ providedIn: "root" })
export class LocationService {
    constructor(private http: HttpClient) { }

    getStates(): Observable<HttpResponse<State[]>> {
        return this.http.get<State[]>(`${APIURL}/location/states`, {
            observe: "response"
        });
    }

    getCities(): Observable<HttpResponse<City[]>> {
        return this.http.get<City[]>(`${APIURL}/location/cities`, {
            observe: "response"
        });
    }
}
