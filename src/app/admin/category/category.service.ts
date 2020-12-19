import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { SubCategoryModel } from './sub-category/sub-category.model';
import { APIURL } from 'src/app/shared/globalConstants';
import { CategoryModel } from './category.model';

@Injectable()
export class CategoryService {
    constructor(private http: HttpClient) { }

    getSubCategoryList(subCategoryId: string): Observable<HttpResponse<SubCategoryModel[]>> {
        return this.http.get<SubCategoryModel[]>(`${APIURL}/category/subCategory/${subCategoryId}`, {
            observe: "response"
        });
    }

    getSubCategoryByService(serviceId: number): Observable<HttpResponse<SubCategoryModel[]>> {
        return this.http.get<SubCategoryModel[]>(`${APIURL}/category/subCategory/${serviceId}`, {
            observe: "response"
        });
    }

    deleteSubCategory(subCategoryId: number): Observable<HttpResponse<SubCategoryModel>> {
        return this.http.delete<SubCategoryModel>(`${APIURL}/category/subCategory/${subCategoryId}`, {
            observe: "response"
        });
    }

    postSubCategory(category: SubCategoryModel) {
        return this.http.post<SubCategoryModel>(`${APIURL}/category/subCategory/add`, category, {
            observe: "response"
        });
    }

    getProductCategory(categoryId: string): Observable<HttpResponse<CategoryModel[]>> {
        return this.http.get<CategoryModel[]>(`${APIURL}/category/${categoryId}`, {
            observe: "response"
        });
    }
}
