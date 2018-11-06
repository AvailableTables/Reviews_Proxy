const express = require('express');
const morgan = require('morgan');
const path = require('path');
const axios = require('axios');
const app = express();
const parser = require('body-parser');
const port = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(parser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.all('/*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/favicon.ico', (req, res) => {
  res.send();
});

app.get('/restaurants/*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

// Reviews Service
app.get('/API/Reviews/*', (req, res) => {
  axios.get(`http://34.207.247.29${req.url}`)
    .then((results) => {
      res.send(results.data);
    })
    .catch((err) => {
      console.log(err);
      res.send();
    });
});

// Overview Service
app.get('/api/*', (req, res) => {
  axios.get(`http://3.16.45.212${req.url}`)
    .then((results) => {
      res.send(results.data);
    })
    .catch((err) => {
      console.log(err);
      res.send();
    });
});

// Reservations Service
app.get('/reservations/*', (req, res) => {
  axios.get(`http://18.217.247.139${req.url}`)
    .then((results) => {
      res.send(results.data);
    })
    .catch((err) => {
      console.log(err);
      res.send();
    });
});

// Header
app.get('/header', (req, res) => {
  axios.get(`http://34.207.247.29:8888${req.url}`)
    .then((results) => {
      res.send(results.data);
    })
    .catch((err) => {
      console.log(err);
      res.send();
    });
});

// Header
app.post('/header', (req, res) => {
  console.log(req.body);
  axios.post(`http://34.207.247.29:8888${req.url}`, {id: req.body.id})
    .then((results) => {
      res.send(results.data);
    })
    .catch((err) => {
      console.log(err);
      res.send();
    });
});

app.listen(port, () => {
  console.log(`server running at: http://localhost:${port}`);
});
