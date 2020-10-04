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

  register(user: User, selectedIdFile, selectedChequeFile): Observable<HttpResponse<User>> {

    const formData = new FormData();
    formData.append('Name', user.name);
    formData.append('Email', user.email);
    formData.append('Password', user.password);
    formData.append('CompanyName', user.companyName);
    formData.append('ContactNumber', user.contactNumber);
    formData.append('Address', user.address);
    formData.append('StreetAddress', user.streetAddress);
    formData.append('ZipCode', user.zipCode);
    formData.append('ProductCategoryId', user.productCategoryId);
    formData.append('IsGstAvailable', user.isGstAvailable);
    formData.append('GstNumber', user.gstNumber);
    formData.append('AccountHolderName', user.accountHolderName);
    formData.append('AccountNumber', user.accountNumber);
    formData.append('IfscCode', user.ifscCode);
    formData.append('IdProof', selectedIdFile);
    formData.append('CancelledCheque', selectedChequeFile);

    return this.http.post<User>(`${APIURL}/account/signUp`, formData, {
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
    return this.http.post<User>(`${APIURL}/account/user-register`, user, {
      observe: "response"
    });
  }

  getUserByUserName(email: string): Observable<HttpResponse<User>> {
    return this.http.get<User>(`${APIURL}/account/getUserByUserName/${email}`, {
      observe: "response"
    });
  }
}
