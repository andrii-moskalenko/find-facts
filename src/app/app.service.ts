import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { INews } from './app.consts';
@Injectable({providedIn: 'root'})
export class AppService {
    constructor(private http: HttpClient) {
    }

    public getNews(): Observable<INews[]> {
        return this.http.get<INews[]>('/proxy/news');
    }

    public getArticle(title): Observable<INews> {
        return this.http.get<INews>(`/proxy/news/article?title=${title}`);
    }

    public getEvents() {
        return this.http.get<INews[]>('/proxy/events');
    }
}
