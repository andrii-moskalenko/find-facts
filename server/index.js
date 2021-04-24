const express = require('express');
const path = require('path');
const pos = require('pos');
const cors = require('cors');

const cheerio = require('cheerio');
const fetch = require('node-fetch');
const app = express();
app.use(express.static('dist/find-facts'));
app.use(cors());
app.disable('etag');
let newsData = [];
let linksData = [];

const scrapeLinks = async () => {


    const url = 'https://www.nbcnews.com/politics';


          
    const res = await fetch(url, {
        method: 'get',
        headers: { 
        'Content-Type': 'text/plain; charset=windows-1252',

        },
    });

    const html = await res.text();
    const $ = cheerio.load(html);
    const links = [];
    const getLinks = () => {
        return $('.feeds__items-wrapper > .wide-tease-item__wrapper > a')
        .each((i, item) => {
            links.push($(item).attr('href'));
        });
    }
    getLinks();
    return links;
}

const scrapeNews = async (urls) => {
    const requests = urls.map(async url => {
          
                  const res = await fetch(url, {
                    method: 'get',
                    headers: { 
                        'Content-Type': 'text/plain; charset=windows-1252',
        
                    },
                });
                
                  const html = await res.text();
                  const $ = cheerio.load(html);

                  const text = $('.article-body__content').text();
                  const events = [];

                  const words = new pos.Lexer().lex(text);
                  const tagger = new pos.Tagger();
                  const taggedWords = tagger.tag(words);

                  const NOUNS = {
                    NN: true,
                    NNP: true,
                    NNPS: true,
                    NNS: true
                  };

                  const VERBS = {
                    VB: true,
                    VBD: true,
                    VBG: true,
                    VBN: true,
                    VBP: true,
                    VBZ: true,
                  }

                  for (let i = 0; i < taggedWords.length - 2; i++) {
                      const taggedWord = taggedWords[i];
                      const word = taggedWord[0];
                      const tag = taggedWord[1];
                      
                      if(NOUNS[tag] && VERBS[taggedWords[i + 1][1]] && NOUNS[taggedWords[i + 2][1]]) {
                        if(word.length > 2 && taggedWords[i + 1][0].length > 2 && taggedWords[i + 2][0].length > 2) {
                            events.push(`${word} ${taggedWords[i + 1][0]} ${taggedWords[i + 2][0]}`);
                        }
                      }
                  }

                  return {
                      title: $('header h1').text(),
                      text,
                      events
                  }
              });
          
          
              return Promise.all(requests);
} 

const extractEvents = (news) => {
    let events = []
    news.forEach(item => {
        events = events.concat(item.events);
    });
    return events;
}

scrapeLinks().then(links => {
    linksData = links;
    scrapeNews(links)
        .then(news => newsData = news);
})
const scrapeData = async () => {
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

app.get('/events', (req, res) => {
    scrapeData()
    .then(data => res.send(extractEvents(data)))
})

app.get('/*', function(req,res) {
  res.sendFile(path.join(__dirname+
    '/dist/find-facts/index.html'));});
app.listen(process.env.PORT || 8080);


// 1. getBBC
// map news links, return text, title, id, source
// 1. getCNN
// map news links, return text, title, id, source

// get events

// set news api

// set events api

// set filter events api
