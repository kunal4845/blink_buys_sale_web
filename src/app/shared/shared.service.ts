import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductCategory } from '../admin/products/productCategory.model';
import { User } from '../login/login.interface';
import { APIURL } from './globalConstants';

@Injectable({
    providedIn: "root"
})
export class SharedService {
    private isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject(null);

    constructor(private http: HttpClient) { }
    private APIURL: string = APIURL + "/product/";

    getValue(): Observable<boolean> {
        return this.isLoggedIn$.asObservable();
    }

    setValue(isLoggedIn: boolean) {
        this.isLoggedIn$.next(isLoggedIn);
    }


    setLocalStorage(key: string, data: any): void {
        localStorage.setItem(key, JSON.stringify(data));
    }

    getLocalStorage(key: string) {
        return JSON.parse(localStorage.getItem(key));
    }

    checkMediaType(media: string): string {
        if (media != null && media != "") {
            return media.split(":")[1].split("/")[0];
        }
    }

    getProductCategory(): Observable<HttpResponse<ProductCategory[]>> {
        return this.http.get<ProductCategory[]>(`${this.APIURL}/category`, {
            observe: "response"
        });
    }

    getUser(): Observable<HttpResponse<User>> {
        return this.http.get<User>(`${APIURL}/user`, {
            observe: "response"
        });
    }
}
