import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { NewsArticleComponent } from './news-article/news-article.component';
import { AppRoutingModule } from './app.routing';
import { NewsListComponent } from './news-list/news-list.component';
import { EventsListComponent } from './events-list/events-list.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    NewsArticleComponent,
    NewsListComponent,
    EventsListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
