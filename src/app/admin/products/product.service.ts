import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APIURL } from "../../shared/globalConstants";
import { CategoryModel } from '../category/category.model';
import { Product } from './product.model';

@Injectable({
    providedIn: "root"
})
export class ProductService {
    private APIURL: string = APIURL + "/product/";
    constructor(private http: HttpClient) { }

    post(product: Product): Observable<HttpResponse<Product>> {
        return this.http.post<Product>(`${this.APIURL}`, product, {
            observe: "response"
        });
    }

    uploadProductImages(files: any[], productId: number, masterImage: string): Observable<HttpResponse<Product>> {
        const formData = new FormData();
        for (var i = 0; i < files.length; i++) {
            formData.append('file', files[i], files[i].name);
        }

        return this.http.post<Product>(this.APIURL + "/upload/" + `${productId}/${masterImage}`, formData, { observe: "response" });
    }

    getProductList(): Observable<HttpResponse<Product[]>> {
        return this.http.get<Product[]>(`${this.APIURL}/list`, {
            observe: "response"
        });
    }

    getRecommendedProducts(): Observable<HttpResponse<Product[]>> {
        return this.http.get<Product[]>(`${this.APIURL}/list/recommended`, {
            observe: "response"
        });
    }

    getProductById(productId: number): Observable<HttpResponse<Product>> {
        return this.http.get<Product>(`${this.APIURL}/list/${productId}`, {
            observe: "response"
        });
    }


    // getProductCategory(): Observable<HttpResponse<CategoryModel[]>> {
    //     return this.http.get<CategoryModel[]>(`${this.APIURL}/category`, {
    //         observe: "response"
    //     });
    // }

    getProductCategory(categoryId: string): Observable<HttpResponse<CategoryModel[]>> {
        return this.http.get<CategoryModel[]>(`${APIURL}/category/${categoryId}`, {
            observe: "response"
        });
    }

    verifyProduct(productId: number): Observable<HttpResponse<Product>> {
        debugger;
        return this.http.get<Product>(`${this.APIURL}/verify/${productId}`, {
            observe: "response"
        });
    }

    deleteProduct(productId: number): Observable<HttpResponse<Product>> {
        debugger;
        return this.http.delete<Product>(`${this.APIURL}/delete/${productId}`, {
            observe: "response"
        });
    }

}
