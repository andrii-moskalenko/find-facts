import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
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
  eventsMatches: any = {};
  eventsCache: Array<string>;
  fallback = this.appService.fallbackPicture;

  constructor(private appService: AppService) { }

  ngOnInit(): void {
    this.appService.getEvents()
      .pipe(
        tap(events => events.forEach(event => this.eventsMatches[event] = this.eventsMatches[event] ?  this.eventsMatches[event] + 1 : 1)),
        map(events => Array.from(new Set(events)))
      )
      .subscribe(res => this.events = this.eventsCache = res);
  }

  searchChanged(value) {
    this.events = this.eventsCache.filter(event => event.includes(value));
  }

  getNewsByEvent(event) {
    this.aciveItem = event;
    this.articles = this.appService.getNewsByEvent(event);
    window.scroll(0, 0);
  }

}
