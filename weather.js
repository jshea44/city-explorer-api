'use strict';
require('dotenv').config();
const axios = require('axios');
const cache = require('./cache.js');

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

class Forecast {
  constructor(description, date) {
    this.description = description;
    this.date = date;
  }
}

function formatWeatherData(weatherData) {
  const formattedWeatherData = weatherData.map((item) => {
    let lowTemp = item.low_temp;
    let highTemp = item.high_temp;
    let dateTime = item.datetime;
    let cloudState = item.weather.description;

    let description = `Low of ${lowTemp}, high of ${highTemp} with ${cloudState}`;
    return new Forecast(description, dateTime);
  });
  return formattedWeatherData;
}

// get the weather data from the weather API
async function getWeatherData(lat, lon) {
  let weatherKey = 'lat=' + lat + 'lon=' + lon;
  if (cache[weatherKey]) {
    console.log(' weather cached');
    return cache[weatherKey].data;
  } else {
    console.log('caching weather');
    cache[weatherKey] = {};
    let response = await axios.get(
      `http://api.weatherbit.io/v2.0/forecast/daily?key=${WEATHER_API_KEY}&lon=${lon}&lat=${lat}`
    );
    cache[weatherKey].data = response.data.data;
    return cache[weatherKey].data;
  }
}

const handleWeatherRequest = async (req, res) => {
  const { lat, lon, searchQuery } = req.query;
  if (!lat || !lon || !searchQuery) {
    res.status(400).send('Bad Request');
    return;
  } else {
    let recievedWeatherData = await getWeatherData(lat, lon);
    let formattedWeatherData = formatWeatherData(recievedWeatherData);
    res.status(200).send(formattedWeatherData);
  }
};

module.exports = handleWeatherRequest;
