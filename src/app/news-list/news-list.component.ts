import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
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
    this.news = this.appService.getNews();
  }

}
