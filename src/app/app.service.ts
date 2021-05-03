import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { INews } from './app.consts';
import { environment } from 'src/environments/environment';
@Injectable({providedIn: 'root'})
export class AppService {
    fallbackPicture = 'https://raw.githubusercontent.com/koehlersimon/fallback/master/Resources/Public/Images/placeholder.jpg';
    constructor(private http: HttpClient) {
    }

    public getNews(): Observable<INews[]> {
        return this.http.get<INews[]>(`${environment.baseUrl}/news`);
    }

    public getArticle(title): Observable<INews> {
        return this.http.get<INews>(`${environment.baseUrl}/news/article?title=${title}`);
    }

    public getEvents() {
        return this.http.get<Array<string>>(`${environment.baseUrl}/events`);
    }

    public getNewsByEvent(event: string) {
        return this.http.post<INews[]>(`${environment.baseUrl}/news/related`, { body: event});
    }
}
