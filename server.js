"use strict";


const express = require('express');
const jsonData = require("./Movie Data/data.json");
const app = express();
const axios = require("axios");
const dotenv = require("dotenv");
const { response } = require('express');


dotenv.config();


function Movie (title, posterPath, overview) {
    this.title = title;
    this.posterPath = posterPath;
    this.overview = overview;
}

function APIMovie (id, title, releaseDate, posterPath, overview) {
    this.id = id;
    this.title = title;
    this.release_date = releaseDate;
    this.poster_path = posterPath;
    this.overview = overview
}

const formattedData = new Movie(jsonData.title, jsonData.poster_path, jsonData.overview);


const homePageHandler = (req, res) => {
    return res.status(200).json(formattedData)
}

const favoriteHandler = (req, res) => {
    res.status(200).send("Welcome to Favorite Page")
}

const APIKEY = process.env.APIKEY


const trendingHandler = (req,res) => {
    axios.get(`https://api.themoviedb.org/3/trending/all/week?api_key=${APIKEY}&language=en-US`)
    .then(response =>{
        return res.status(200).json(response.data.results.map(movie => {
            return new APIMovie(movie.id, movie.title, movie.release_date, movie.poster_path, movie.overview)
        }))
    }
    )
    .catch(error => errorHandler(error, req, res))
}


const searchHandler = (req, res) => {
    const query = req.query.search
    axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}&language=en-US&query=${query}&page=2`)
    .then(response => {
        return res.status(200).json(response.data.results)
    })
    .catch(error => errorHandler(error, req, res))   
}

const popularHandler = (req, res) => {
    axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${APIKEY}&language=en-US&page=1`)
    .then(result => {
        return res.status(200).json(result.data.results.map(mov => {
            return new APIMovie(mov.title, mov.release_date, mov.poster_path, mov.overview)
        }))
        })
    .catch(error => errorHandler(error, req, res))
}

const topRatedHandler = (req, res) => {
    axios.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${APIKEY}&language=en-US&page=1`)
    .then(response => {
        return res.status(200).json(response.data.results.map(mov => {
            return new APIMovie(mov.id, mov.title, mov.release_date, mov.poster_path, mov.overview);
           
        }))
    })
    .catch(error => errorHandler(error, req, res))
}

const errorHandler  = (error, req, res) => {
    const err = {
        status: 500,
        message: error.message
    }
    res.status(500).send(err)
}

app.get("/", homePageHandler);

app.get("/favorite", favoriteHandler);

app.get("/trending", trendingHandler)

app.get("/search", searchHandler)

app.get("/popular", popularHandler)

app.get("/toprated", topRatedHandler)

app.listen(3000, () => {
    console.log(
        "Listening on port 3000"
    );
})