import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class SharedService {
    constructor(private http: HttpClient) { }

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
}
