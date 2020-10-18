import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { APIURL } from '../shared/globalConstants'
import { ServiceModel } from './services/admin-services.model';
import { CategoryModel } from './category/category.model';
import { User } from '../login/login.interface';

@Injectable({ providedIn: "root" })
export class AdminService {
  constructor(private http: HttpClient) { }

  getTestMessage(serviceId: string): Observable<string> {
    debugger
    const headers = new HttpHeaders({ 'Content-Type': 'text/plain' });
    return this.http.get(`${APIURL}/service/${serviceId}`, { responseType: 'text', headers });
  }


  get(serviceId: string): Observable<HttpResponse<ServiceModel[]>> {
    return this.http.get<ServiceModel[]>(`${APIURL}/service/${serviceId}`, {
      observe: "response"
    });
  }

  delete(serviceId: number): Observable<HttpResponse<ServiceModel>> {
    return this.http.delete<ServiceModel>(`${APIURL}/service/${serviceId}`, {
      observe: "response"
    });
  }

  post(formData) {
    return this.http.post<ServiceModel>(`${APIURL}/service`, formData, {
      observe: "response"
    });
  }

  postService(service: ServiceModel) {
    return this.http.post<ServiceModel>(`${APIURL}/service/add`, service, {
      observe: "response"
    });
  }

  getCategoryList(categoryId: string): Observable<HttpResponse<CategoryModel[]>> {
    return this.http.get<CategoryModel[]>(`${APIURL}/category/${categoryId}`, {
      observe: "response"
    });
  }

  deleteCategory(categoryId: number): Observable<HttpResponse<CategoryModel>> {
    return this.http.delete<CategoryModel>(`${APIURL}/category/${categoryId}`, {
      observe: "response"
    });
  }

  postCategory(category: CategoryModel) {
    return this.http.post<CategoryModel>(`${APIURL}/category/add`, category, {
      observe: "response"
    });
  }

  getUser(): Observable<HttpResponse<User>> {
    return this.http.get<User>(`${APIURL}/user`, {
      observe: "response"
    });
  }


  updatePassword(userObj: User): Observable<HttpResponse<boolean>> {
    return this.http.post<boolean>(`${APIURL}/user/update-password`, userObj, {
      observe: "response"
    });
  }

}
