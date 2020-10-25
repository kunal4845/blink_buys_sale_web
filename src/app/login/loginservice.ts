import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { User } from './login.interface';
import { APIURL } from '../shared/globalConstants'

@Injectable({ providedIn: 'root' })
export class LoginService {

  constructor(private http: HttpClient) { }

  checkEmailExists(email: string, roleId: number): Observable<HttpResponse<User>> {
    return this.http.get<User>(`${APIURL}/account/email-exists/${email}/${roleId}`, {
      observe: "response"
    });
  }

  register(user: User, selectedIdFile, selectedImageFile): Observable<HttpResponse<User>> {
    debugger
    const formData = new FormData();
    formData.append('StateId', user.stateId.toString());
    formData.append('CityId', user.cityId.toString());
    formData.append('Name', user.name);
    formData.append('CompanyName', user.companyName);
    formData.append('ContactNumber', user.contactNumber);
    formData.append('Email', user.email);
    formData.append('Address', user.address);
    formData.append('StreetAddress', user.streetAddress);
    formData.append('ZipCode', user.zipCode);
    formData.append('ProductCategoryId', user.productCategoryId);
    formData.append('IsGstAvailable', user.isGstAvailable);
    formData.append('GstNumber', user.gstNumber);
    formData.append('AccountNumber', user.accountNumber);
    formData.append('AccountHolderName', user.accountHolderName);
    formData.append('IfscCode', user.ifscCode);
    formData.append('RoleId', user.roleId.toString());
    formData.append('Password', user.password);
    formData.append('IdProofPath', selectedIdFile);
    formData.append('Image', selectedImageFile);

    return this.http.post<User>(`${APIURL}/account/signUp`, formData, {
      observe: "response"
    });
  }

  registerServiceProvider(user: User, selectedIdFile, selectedImageFile): Observable<HttpResponse<User>> {
    debugger
    const formData = new FormData();
    formData.append('StateId', user.stateId.toString());
    formData.append('CityId', user.cityId.toString());
    formData.append('Name', user.name);
    formData.append('FatherName', user.fatherName);
    formData.append('Gender', user.gender);
    formData.append('ContactNumber', user.contactNumber);
    formData.append('Email', user.email);
    formData.append('Address', user.address);
    formData.append('Qualification', user.qualification);
    formData.append('ServiceId', user.serviceId.toString());
    formData.append('ServiceSubCategoryId', user.serviceSubCategoryId.toString());
    formData.append('RoleId', user.roleId.toString());
    formData.append('Password', user.password);
    formData.append('IdProofPath', selectedIdFile);
    formData.append('Image', selectedImageFile);

    return this.http.post<User>(`${APIURL}/account/service-provider-register`, formData, {
      observe: "response"
    });
  }

  login(user: User): Observable<HttpResponse<User>> {
    return this.http.post<User>(`${APIURL}/account/signIn`, user, {
      observe: "response"
    });
  }

  resetPassword(email: string, roleId: number): Observable<HttpResponse<User>> {
    return this.http.get<User>(`${APIURL}/account/resetPassword/${email}/${roleId}`, {
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

  getUserByUserName(email: string, roleId: number): Observable<HttpResponse<User>> {
    return this.http.get<User>(`${APIURL}/account/getUserByUserName/${email}/${roleId}`, {
      observe: "response"
    });
  }
}
