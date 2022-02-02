"use strict";


const express = require('express');
const jsonData = require("./Movie Data/data.json");
const app = express();
const axios = require("axios");
const dotenv = require("dotenv");
const { response } = require('express');
const pg = require("pg");

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
const client = new pg.Client(DATABASE_URL);
app.use(express.json());



const port = process.env.port;


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

const APIKEY = process.env.APIKEY;


const trendingHandler = (req,res) => {
    const results = [];
    axios.get(`https://api.themoviedb.org/3/trending/all/week?api_key=${APIKEY}&language=en-US`)
    .then(response =>{
        response.data.results.forEach(movie => {
            const trendingMovie = new APIMovie(movie.id, movie.title, movie.release_date, movie.poster_path, movie.overview)
            results.push(trendingMovie)
        })
        return res.status(200).json(results)
    }
    )
    .catch(error => errorHandler(error, req, res))
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

const popularHandler = (req, res) => {
    const movies = [];
    axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${APIKEY}&language=en-US&page=1`)
    .then(result => {
        result.data.results.forEach(mov => {
             const popularMovie = new APIMovie(mov.id, mov.title, mov.release_date, mov.poster_path, mov.overview)
             movies.push(popularMovie)
        })
        return res.status(200).json(movies)
    }
    )
    .catch(error => errorHandler(error, req, res))
}

const topRatedHandler = (req, res) => {
    const movies = [];
    axios.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${APIKEY}&language=en-US&page=1`)
    .then(response => {
        response.data.results.forEach(mov => {
            const topRatedMovie = new APIMovie(mov.id, mov.title, mov.release_date, mov.poster_path, mov.overview);
            movies.push(topRatedMovie)
        })
        return res.status(200).json(movies)
    })
    .catch(error => errorHandler(error, req, res))
}


////////////// TASK 13
const addMovieHandler = (req, res) => {
    const movie = req.body;
    console.log(movie);
    const sql = `INSERT INTO favMOVIES(title, releaseDate, posterPath, overview) VALUES($1, $2, $3, $4)`;
    const values = [movie.title, movie.releaseDate, movie.posterPath, movie.overview];
    client.query(sql, values).then(data => {
        return res.status(201).json(data.rows)
    })
    .catch(error => errorHandler(error, req, res))
}

const getMovieHandler = (req, res) => {
    const sql = `SELECT * FROM favMovies`;
    client.query(sql).then(data => {
        return res.status(200).json(data.rows);
    }).catch(error => {
        errorHandler(error, req,res);
    })
}


app.post("/addMovie", addMovieHandler);

app.get("/getMovie", getMovieHandler)


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


client.connect().then(() => {
    app.listen(port, () => {
        console.log(
            `Listening on port ${port}`
        );
    })
})