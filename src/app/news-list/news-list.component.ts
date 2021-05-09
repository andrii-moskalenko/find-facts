import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppService } from '../app.service';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.less']
})
export class NewsListComponent implements OnInit {

  news: Observable<Array<any>>;

  constructor(private appService: AppService) { }

  ngOnInit() {
    this.news = this.appService.getNews().pipe(map(news => news.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())));
  }

}
