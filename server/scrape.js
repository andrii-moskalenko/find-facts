const cheerio = require('cheerio');
const pos = require('pos');
const fetch = require('node-fetch');
const constsModule = require('./consts.js');

const scrapeNbcNews = async (urls) => {
    const requests = urls
    .map(async url => {
          
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

        for (let i = 0; i < taggedWords.length - 2; i++) {
            const newIndex = findEvent(taggedWords, i, events);
            i = newIndex;
        }
            return {
                title: $('header h1').text(),
                img: $('.article-hero__main img').attr('src'),
                text,
                events: filterMistakes(events),
                date: new Date ($('.article-body time').text().split('/')[0])
            }
        });
          
          
    const response = await Promise.all(requests);
    
    return response.filter(article => article.text);
}

function findEvent(taggedWords, i, events) {
    const initialIndex = i;
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

    if(taggedWords[i][1] === 'DT') {
        i++;
    }

    if(NOUNS[taggedWords[i][1]] && taggedWords[i][0].length > 2) {
        i++;
    } else return initialIndex;

    if(['has', 'have', 'had', 'was','were'].includes(taggedWords[i][0])) {
        i++;
    }

    if(VERBS[taggedWords[i][1]] && taggedWords[i][0].length > 2) {
        i++;
    } else return initialIndex;

    if(taggedWords[i][1] === 'IN') {
        i++;
    }

    if(taggedWords[i][1] === 'DT') {
        i++;
    }

    if(NOUNS[taggedWords[i][1]] && taggedWords[i][0].length > 2) {
        i++;
    } else return initialIndex;

    let extractEvent = '';
    for(let index = initialIndex; index < i; index++) {
        extractEvent = extractEvent.concat(taggedWords[index][0]) + ' ';
    }
    extractEvent = extractEvent.trim();
    if(!events.includes(extractEvent)) {
        events.push(extractEvent)
    }

    return i;

}

function filterMistakes(events) {
    return events.filter(event => {
        const words = event.split(' ');
        return !event.match('.*[—”’_“-].*') && !words.some(word => constsModule.bannedWords.includes(word));
    });
}

const scrapeNbcLinks = async () => {


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

const scrapeTimeLinks = async () => {
    

    const url = 'https://time.com/section/politics';
    const requests = [];
    for(let page = 1; page < 30; page++) {
        requests.push(fetch(
            `${url}/?page=${page}`,
            {
                method: 'get',
                headers: { 
                'Content-Type': 'text/plain; charset=windows-1252',
                },
            })
        )
    }

    const pageData = await Promise.all(requests);
    const links = [];

    for(let page of pageData) {
        const html = await page.text();
        const $ = cheerio.load(html);

        $('.heading-3 > a')
        .each((i, item) => {
            links.push('https://time.com' + $(item).attr('href'));
        });
    }

    return links;
}

const scrapeTimeNews = async (urls) => {
    const requests = urls
    .map(async url => {
          
        const res = await fetch(url, {
            method: 'get',
            headers: { 
                        'Content-Type': 'text/plain; charset=windows-1252',
            },
        });
                
        const html = await res.text();
        const $ = cheerio.load(html);

        const text = $('.padded > p').text();
        const events = [];

        const words = new pos.Lexer().lex(text);
        const tagger = new pos.Tagger();
        const taggedWords = tagger.tag(words);

        for (let i = 0; i < taggedWords.length - 2; i++) {
            const newIndex = findEvent(taggedWords, i, events);
            i = newIndex;
        }

            return {
                title: $('.article-info .headline').text(),
                img: $('.image-and-burst img').attr('src'),
                text,
                date: new Date($('.published-date').text().split('|')[0].trim()),
                events: filterMistakes(events)
            }
        });
          
          
    const response = await Promise.all(requests);
    
    return response.filter(article => article.text);
}

const scrapeLinks = async () => {
    links = await Promise.all([scrapeTimeLinks(), scrapeNbcLinks()]);
    return links;
}

const scrapeNews = async (links) => {
    news = await Promise.all([scrapeTimeNews(links[0]), scrapeNbcNews(links[1])]);
    return news[1].concat(news[0]).splice(0, 200);
}

module.exports = {
    scrapeLinks: scrapeLinks,
    scrapeNews: scrapeNews
};