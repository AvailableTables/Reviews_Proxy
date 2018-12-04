const express = require('express');
const morgan = require('morgan');
const path = require('path');
const axios = require('axios');
const app = express();
const parser = require('body-parser');
const port = process.env.PORT || 3000;
const components = {};

const fs = require('fs');
const fetch = require('node-fetch');


const services = {
  'Reviews': 'http://localhost:3020/bundle-client.js',
'ReviewsServer': 'http://localhost:3020/bundle-server.js'
};


// app.use(morgan('dev'));
app.use(parser.json());
app.use(express.static(path.join(__dirname, './public')));

app.all('/*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/favicon.ico', (req, res) => {
  res.send();
});

// app.get('/restaurants/*', (req, res) => {
//   res.sendFile(path.join(__dirname, './public/index.html'));
// });

// Reviews Service
app.get('/API/Reviews/*', (req, res) => {
  axios.get(`http://localhost:3020${req.url}`)
    .then((results) => {
      res.send(results.data);
    })
    .catch((err) => {
      console.log(err);
      res.send();
    });
});
// -------------------------------------------------------------------------//
// download bundles
(() => {
  let serviceNames = ['Reviews'];
  serviceNames.forEach((service) => {
    let url = path.join(__dirname, `/public/bundles/${service}.js`);
    fs.access(url, (err) => {
      if (err) {
        fetch(services[service])
          .then(response => {
            const dest = fs.createWriteStream(url);
            response.body.pipe(dest);
            response.body.on('end', () => {
              setTimeout(() => {
                console.log('file written');
              }, 0);
            });
          });
      } else {
        console.log('file exists');
      }
    });
  });
})();
 // download server bundles
(() => {
  let serviceNames = ['ReviewsServer'];
  serviceNames.forEach((service) => {
    let url = path.join(__dirname, `/public/bundles/${service}.js`);
    fs.access(url, (err) => {
      if (err) {
        fetch(services[service])
          .then(response => {
            const dest = fs.createWriteStream(url);
            response.body.pipe(dest);
            response.body.on('end', () => {
              setTimeout(() => {
                components[service] = require(url).default;
                console.log('file written');
              }, 3000);
            });
          });
      } else {
        components[service] = require(url).default;
        console.log('file exists');
      }
    });
  });
}) ();
app.get('/restaurants/*', (req, res) => {
  // console.log('resultsStart', req.url)
  Promise.all([
    // axios.get(`http://localhost:3020${req.url}`)
    axios.get(`http://localhost:3020${req.url}`)
    .then((received)=>{
      // console.log('hello', received.data,'end')
      return received.data
    } )
    .then((results) => {
      console.log(results.length)
      let htmls = [];
      let props = [];
      let comp = [];
      // results.forEach(({props}) => {
        // console.log('foreach', data[0])
        htmls.push(results[0]);
        props.push(results[1]);
        // let rendercomp = React.createElement(application, reactData);

        //console.log(htmls.length, props.length)
        // res.send(`<div>Hello${props[0]}<div/>`)
        //            <script  src="http://localhost:3020/bundle-client.js"></script>

      // });
       res.end(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <link rel="stylesheet" href="/style.css">
            <title>FEC - TableOpen</title>
          </head>
          <body>
            <div class="body">
              <div id="Header"></div>
              <div class="mainbody">
                <div id="Reservations"></div>
                <div class="data">
                  <div id="Overview"></div>
                  <div id="Reviews">${htmls[0]}</div>
                </div>
              </div>
            </div>
            <script crossorigin src="https://unpkg.com/react@16.6.3/umd/react.development.js"></script>
            <script crossorigin src="https://unpkg.com/react-dom@16.6.3/umd/react-dom.development.js"></script>
            <script  src="http://localhost:3020/bundle-client.js"></script>            <script>
              ReactDOM.hydrate(
                React.createElement(Reviews, ${props[0]}),
                document.getElementById('Reviews')
              );
            </script>
          </body>
        </html>
      `);
    })
  ])
});

// ---------------------------------------------------------------------//
// Overview Service
app.get('/api/*', (req, res) => {
  // axios.get(`http://3.16.45.212${req.url}`)
  //   .then((results) => {
  //     res.send(results.data);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     res.send();
  //   });
});

// Reservations Service
app.get('/reservations/*', (req, res) => {
  // axios.get(`http://18.217.247.139${req.url}`)
  //   .then((results) => {
  //     res.send(results.data);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     res.send();
  //   });
});

// Header
app.get('/header', (req, res) => {
  
  // axios.get(`http://34.207.247.29:8888${req.url}`)
  //   .then((results) => {
  //     res.send(results.data);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     res.send();
  //   });
});

// Header
app.post('/header', (req, res) => {
  // axios.post(`http://34.207.247.29:8888${req.url}`, {id: req.body.id})
  //   .then((results) => {
  //     res.send(results.data);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     res.send();
  //   });
});

app.listen(port, () => {
  console.log(`server running at: http://localhost:${port}`);
});
