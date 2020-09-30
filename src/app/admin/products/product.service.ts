import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APIURL } from "../../shared/globalConstants";
import { Product } from './product.model';
import { ProductCategory } from './productCategory.model';

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

    getProductById(productId: number): Observable<HttpResponse<Product>> {
        return this.http.get<Product>(`${this.APIURL}/${productId}`, {
            observe: "response"
        });
    }


    getProductCategory(): Observable<HttpResponse<ProductCategory[]>> {
        return this.http.get<ProductCategory[]>(`${this.APIURL}/category`, {
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
