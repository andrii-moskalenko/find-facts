import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
      .subscribe(
        params => this.article = this.appService.getArticle(params?.title)
      .pipe(map(article => ({ innerHtml: this.highlightEvents(article), ...article})))
      );
  }

  private highlightEvents(article: INews) {
    let innerHtml = article.text;
    console.log(article.events[0]);
    console.log(innerHtml)
    console.log(innerHtml.includes(article.events[0]));
    article.events.forEach(action =>
      innerHtml = innerHtml.replace(action, '<span class="highlight">' + action + '</span>')
    );
    return innerHtml;
  }

}
