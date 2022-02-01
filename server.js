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

function Trending (id, title, realeaseDate, posterPath, overview) {
    this.id = id;
    this.title = title;
    this.realease_date = realeaseDate;
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
    const results = [];
    axios.get(`https://api.themoviedb.org/3/trending/all/week?api_key=${APIKEY}&language=en-US`)
    .then(response =>{
        response.data.results.forEach(movie => {
            console.log(movie);
            const trendingMovie = new Trending(movie.id, movie.title, movie.realease_date, movie.poster_path, movie.overview)
            results.push(trendingMovie)
        })
        return res.status(200).json(results)
    }
    )
    .catch(err => errorHandler(error, req, res))
}


const searchHandler = (req, res) => {
    const query = req.query.search
    const movies = []
    axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}&language=en-US&query=${query}&page=2`)
    .then(response => {response.data.results.forEach(result => movies.push(result))
    return res.status(200).json(movies)
    })
    .catch(error => errorHandler(error, req, res))   
}

const reviewsHandler = (req, res) => {
    axios.get(`https://api.themoviedb.org/3/review/{review_id}?api_key=${APIKEY}`)
    .then(response => console.log(response.data))
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


app.get("/reviews", reviewsHandler)

app.listen(3000, () => {
    console.log(
        "Listening on port 3000"
    );
})