'use-strict';
const express = require('express');
const weatherData = require('./data/weather.json');

const app = express();

const PORT = process.env.PORT;

// app.get('/banana', (request, response) => {
//   console.log(request.query); // query parameters
//   if (!request.query.search) {
//     response.status(400).send('Bad Request');
//   } else {
//     response.status(200).send('Thanks for searching');
//   }
// });

app.get('./weather', (request, response) => {
  console.log('get info');
  const lon = request.query.lon;
  const lat = request.query.lat;
  const searchQuery = request.query;
  if (!lon || !lat || !searchQuery){
    response.status(400).send('Not Found');
  } else {
    response.status(200).send(
      weatherData[]
    );
  }
  
});

app.listen(PORT, () => {
  console.log('App is listening!!');
});
