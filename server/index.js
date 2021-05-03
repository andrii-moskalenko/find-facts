const express = require('express');
const path = require('path');
const cors = require('cors');
const url = require('url');
const app = express();
app.use(express.static('dist/find-facts'));
app.use(cors());
app.disable('etag');
app.use(express.json()) 
const scrapeModule = require('./scrape.js');
const scrapeLinks = scrapeModule.scrapeLinks;
const scrapeNews = scrapeModule.scrapeNews;

let newsData = [];
let linksData = [];

scrapeLinks().then(links => {
    linksData = links;
    scrapeNews(links)
        .then(news => newsData = news);
});

app.get('/*', function(req, res, next){ 
    res.setHeader('Last-Modified', (new Date()).toUTCString());
    next(); 
  });

app.get('/tags', (req, res) => {
    scrapeData()
    .then(data => res.json(data.map(news => news.tags)))
})

app.get('/news', (req, res) => {
    scrapeData()
    .then(data => res.json(data))
})

app.get('/news/article', (req, res) => {
    scrapeData()
    .then(data => res.json(getArticle(req, data)))
})

app.get('/events', (req, res) => {
    scrapeData()
    .then(data => res.send(extractEvents(data)))
})

app.post('/news/related', (req, res) => {
    scrapeData()
    .then(data => res.json(getArticlesByEvent(data, req.body.body)))
})

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname+
    '/dist/find-facts/index.html'));});
app.listen(process.env.PORT || 8080);


function extractEvents(news) {
    let events = []
    news.forEach(item => {
        events = events.concat(item.events);
    });
    return events;
}

function getArticlesByEvent(news, event) {
    return news.filter(article => 
        article.events.some(articleEvent => articleEvent.trim() === event.trim())
    )
}

async function scrapeData() {
    if(linksData.length) {
        if(newsData.length) {
            return newsData;
        } else {
            const newsResponse = await scrapeNews(linksData);
            return newsResponse;
        }
    } else {
        const linksResponse = await scrapeLinks();
        const newsResponse = await scrapeNews(linksResponse);
        return newsResponse;
    }
}

function getArticle(req, data) {
  const queryParams = url.parse(req.url, true).query;
  return data.find(article => article.title.trim() === queryParams.title.trim());
}

// 1. getBBC
// map news links, return text, title, id, source
// 1. getCNN
// map news links, return text, title, id, source

// get events

// set news api

// set events api

// set filter events api
