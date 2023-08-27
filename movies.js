'use strict';
require('dotenv').config();
const axios = require('axios');
const cache = require('./cache.js');
const MOVIE_API_KEY = process.env.MOVIE_API_KEY;

class Movie {
  constructor(
    image,
    title,
    overview,
    averageVotes,
    totalVotes,
    popularity,
    releasedOn
  ) {
    this.image_url = image;
    this.title = title;
    this.overview = overview;
    this.average_votes = averageVotes;
    this.total_votes = totalVotes;
    this.popularity = popularity;
    this.released_on = releasedOn;
  }
}

function formatMovieData(movieData) {
  const formattedMovieData = movieData.map((item) => {
    let imageURLStart = 'https://image.tmdb.org/t/p/w500/';
    let image = `${imageURLStart}${item.poster_path}`;
    let title = item.title;
    let overview = item.overview;
    let averageVotes = item.vote_average;
    let totalVotes = item.vote_count;
    let popularity = item.popularity;
    let releasedOn = item.release_date;

    return new Movie(
      image,
      title,
      overview,
      averageVotes,
      totalVotes,
      popularity,
      releasedOn
    );
  });
  return formattedMovieData;
}

// get the data from MovieDB API
async function getMovieData(city) {
  if (cache[city]) {
    console.log(' movies cached');
    return cache[city].data.results;
  } else {
    console.log('caching movies');
    cache[city] = {};
    let response = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=${MOVIE_API_KEY}&query=${city}`
    );
    cache[city].data = response.data;
    // let movieData = cache[city].data.results;
    return cache[city].data.results;
  }
}

const handleMovieRequest = async (req, res) => {
  const { searchQuery } = req.query;
  if (!searchQuery) {
    res.status(400).send('Bad Request');
    return;
  } else {
    let recievedMovieData = await getMovieData(searchQuery);
    let formattedMovieData = formatMovieData(recievedMovieData);
    res.status(200).send(formattedMovieData);
  }
};

module.exports = handleMovieRequest;
