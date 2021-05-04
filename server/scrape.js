const cheerio = require('cheerio');
const pos = require('pos');
const fetch = require('node-fetch');

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
                img: $('.article-hero__main img').attr('src'),
                text,
                events: filterMistakes(events)
            }
        });
          
          
    const response = await Promise.all(requests);
    
    return response.filter(article => article.text);
}

function filterMistakes(events) {
    return events.filter(event => {
        return !event.includes('\’') && !(event === '-');
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