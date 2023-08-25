'use strict';
const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const weatherData = require('./data/weather.json');

const PORT = process.env.PORT;
const app = express();
app.use(cors());

class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}

app.get('/weather', (request, response) => {
  const { lat, lon, searchQuery } = request.query;

  if (!lat || !lon || !searchQuery) {
    response.status(400).send('Bad Request');
    return;
  }

  const foundCity = weatherData.find(
    (item) =>
      (item.lat === lat.toString() && item.lon === lon.toString()) ||
      item.city_name.toLowerCase() === searchQuery.toLowerCase()
  );

  if (!foundCity) {
    response.status(404).send('City not found');
    return;
  }

  const forecasts = foundCity.data.map((dataPoint) => {
    const forecastDate = dataPoint.valid_date;
    const forecastDescription = dataPoint.weather.description;

    return new Forecast(forecastDate, forecastDescription);
  });

  response.status(200).json(forecasts);
});

app.listen(PORT, () => {
  console.log('App is listening!!');
});
