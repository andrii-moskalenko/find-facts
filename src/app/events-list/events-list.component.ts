import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService } from '../app.service';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.less']
})
export class EventsListComponent implements OnInit {

  events: Observable<any>;
  constructor(private appService: AppService) { }

  ngOnInit(): void {
    this.events = this.appService.getEvents();
  }

}
