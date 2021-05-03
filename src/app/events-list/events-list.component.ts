import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { INews } from '../app.consts';
import { AppService } from '../app.service';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.less']
})
export class EventsListComponent implements OnInit {

  searchValue: string;
  aciveItem: string;
  articles: Observable<INews[]>;

  events: Array<string>;
  eventsCache: Array<string>;
  fallback = this.appService.fallbackPicture;

  constructor(private appService: AppService) { }

  ngOnInit(): void {
    this.appService.getEvents()
      .subscribe(res => this.events = this.eventsCache = res);
  }

  searchChanged(value) {
    this.events = this.eventsCache.filter(event => event.includes(value));
  }

  getNewsByEvent(event) {
    this.aciveItem = event;
    this.articles = this.appService.getNewsByEvent(event);
  }

}
