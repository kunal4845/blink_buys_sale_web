import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { User } from './login.interface';
import { APIURL } from '../shared/globalConstants'

@Injectable({ providedIn: 'root' })
export class LoginService {

  constructor(private http: HttpClient) { }

  checkEmailExists(email: string): Observable<HttpResponse<User>> {
    return this.http.get<User>(`${APIURL}/account/email-exists/${email}`, {
      observe: "response"
    });
  }

  register(user: User): Observable<HttpResponse<User>> {
    return this.http.post<User>(`${APIURL}/account/signUp`, user, {
      observe: "response"
    });
  }

  login(user: User): Observable<HttpResponse<User>> {
    return this.http.post<User>(`${APIURL}/account/signIn`, user, {
      observe: "response"
    });
  }

  resetPassword(email: string): Observable<HttpResponse<User>> {
    return this.http.get<User>(`${APIURL}/account/resetPassword/${email}`, {
      observe: "response"
    });
  }

  getUser(): Observable<HttpResponse<User>> {
    return this.http.get<User>(`${APIURL}/user`, {
      observe: "response"
    });
  }

  userRegister(user: User): Observable<HttpResponse<User>> {
    return this.http.post<User>(`${APIURL}/user/signUp`, user, {
      observe: "response"
    });
  }
}
