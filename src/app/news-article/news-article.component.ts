import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { INews } from '../app.consts';
import { AppService } from '../app.service';

@Component({
  selector: 'app-news-article',
  templateUrl: './news-article.component.html',
  styleUrls: ['./news-article.component.less']
})
export class NewsArticleComponent implements OnInit {

  article: Observable<INews>;
  constructor(private route: ActivatedRoute, private appService: AppService) { }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => this.article = this.appService.getArticle(params?.title));
  }

}
