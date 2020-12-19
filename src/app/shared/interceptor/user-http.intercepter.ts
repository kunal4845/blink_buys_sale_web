import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class UserInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, newRequest: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header to request
        // Get Token data from local storage
        let tokenInfo = localStorage.getItem('usertoken');
        if (tokenInfo) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${tokenInfo}`
                }
            });
        }
        return newRequest.handle(request);
    }
}