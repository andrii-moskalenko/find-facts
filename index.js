// const cors = require('cors')({ origin: true});

// const cheerio = require('cheerio');
// const getUrls = require('get-urls');
// const fetch = require('node-fetch');
// const path = require('path');

// const express = require('express')
// const app = express()
// const port = 3000

// app.use(express.static(__dirname + '/dist/find-facts'));
// app.get('/*', function(req,res) {
//   res.sendFile(path.join(__dirname+
//     '/dist/find-facts/index.html'));});


// const scrapeMetatags = (text) => {


//       const urls = ['https://www.politico.com/politics'];

//       const requests = urls.map(async url => {
          
//           const res = await fetch(url, {
//             method: 'get',
//             headers: { 
//                 'Content-Type': 'text/plain; charset=windows-1252',

//             },
//         });

//           const html = await res.text();
//           const $ = cheerio.load(html);
          
//           const getMetatag = (name) =>  
//               $(`meta[name=${name}]`).attr('content') ||  
//               $(`meta[property="og:${name}"]`).attr('content') ||  
//               $(`meta[property="twitter:${name}"]`).attr('content');

//           return { 
//               url,
//               title: $('title').first().text(),
//               favicon: $('link[rel="shortcut icon"]').attr('href'),
//               description: getMetatag('description'),
//               image: getMetatag('image'),
//               author: getMetatag('author'),
//           }
//       });
  
  
//       return Promise.all(requests);
  
  
// }

// app.get('/', (req, res) => {
//     scrapeMetatags()
//     .then(data => res.send(data))
// })

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`)
// })


const express = require('express');
const path = require('path');
const app = express();
app.use(express.static(__dirname + '/dist/find-facts'));
app.get('/*', function(req,res) {
  res.sendFile(path.join(__dirname+
    '/dist/find-facts/index.html'));});
app.listen(process.env.PORT || 8080);