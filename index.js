'use strict';
const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const handleWeatherRequest = require('./weather.js');
const handleMovieRequest = require('./movies.js');

const PORT = process.env.PORT;
const app = express();
app.use(cors());

app.get('/weather', handleWeatherRequest);
app.get('/movie', handleMovieRequest);

app.listen(PORT, () => {
  console.log('App is listening!!');
});
