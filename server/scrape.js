const cheerio = require('cheerio');
const pos = require('pos');
const fetch = require('node-fetch');
const constsModule = require('./consts.js');

const scrapeNews = async (urls) => {
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
                events: filterMistakes(events)
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

    events.push('');
    for(let index = initialIndex; index < i; index++) {
        events[events.length - 1] = (events[events.length - 1].concat(taggedWords[index][0] + ' ') + ' ');
    }
    events[events.length - 1] = events[events.length - 1].trim();

    return i;

}

function filterMistakes(events) {
    return events.filter(event => {
        const words = event.split(' ');
        return !event.match('.*[”’“-].*') && !words.some(word => constsModule.bannedWords.includes(word));
    });
}

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


module.exports = {
    scrapeLinks: scrapeLinks,
    scrapeNews: scrapeNews
};