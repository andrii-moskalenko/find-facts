import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({providedIn: 'root'})
export class AppService {
    constructor(private http: HttpClient) {
    }

    public getNews() {
        return this.http.get('/proxy/news');
    }
}
