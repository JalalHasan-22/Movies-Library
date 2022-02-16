"use strict";

const express = require("express");
const jsonData = require("./Movie Data/data.json");
const app = express();
const axios = require("axios");
const dotenv = require("dotenv");
const { response } = require("express");
const pg = require("pg");
const cors = require("cors");

dotenv.config();
app.use(cors());
app.use(express.json());

const DATABASE_URL = process.env.DATABASE_URL;
// const client = new pg.Client(DATABASE_URL);

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const PORT = process.env.PORT || 3001;

function Movie(title, posterPath, overview) {
  this.title = title;
  this.posterPath = posterPath;
  this.overview = overview;
}

function APIMovie(id, title, releaseDate, posterPath, overview) {
  this.id = id;
  this.title = title;
  this.release_date = releaseDate;
  this.poster_path = posterPath;
  this.overview = overview;
}

const formattedData = new Movie(
  jsonData.title,
  jsonData.poster_path,
  jsonData.overview
);

const homePageHandler = (req, res) => {
  return res.status(200).json(formattedData);
};

const favoriteHandler = (req, res) => {
  res.status(200).send("Welcome to Favorite Page");
};

const APIKEY = process.env.APIKEY;

const trendingHandler = (req, res) => {
  axios
    .get(
      `https://api.themoviedb.org/3/trending/all/week?api_key=${APIKEY}&language=en-US`
    )
    .then((response) => {
      return res.status(200).json(
        response.data.results.map((movie) => {
          return new APIMovie(
            movie.id,
            movie.title,
            movie.release_date,
            movie.poster_path,
            movie.overview
          );
        })
      );
    })
    .catch((error) => errorHandler(error, req, res));
};

const searchHandler = (req, res) => {
  const query = req.query.search;
  axios
    .get(
      `https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}&language=en-US&query=${query}&page=2`
    )
    .then((response) => {
      return res.status(200).json(response.data.results);
    })
    .catch((error) => errorHandler(error, req, res));
};

const popularHandler = (req, res) => {
  axios
    .get(
      `https://api.themoviedb.org/3/movie/popular?api_key=${APIKEY}&language=en-US&page=1`
    )
    .then((result) => {
      return res.status(200).json(
        result.data.results.map((mov) => {
          return new APIMovie(
            mov.title,
            mov.release_date,
            mov.poster_path,
            mov.overview
          );
        })
      );
    })
    .catch((error) => errorHandler(error, req, res));
};

const topRatedHandler = (req, res) => {
  axios
    .get(
      `https://api.themoviedb.org/3/movie/top_rated?api_key=${APIKEY}&language=en-US&page=1`
    )
    .then((response) => {
      return res.status(200).json(
        response.data.results.map((mov) => {
          return new APIMovie(
            mov.id,
            mov.title,
            mov.release_date,
            mov.poster_path,
            mov.overview
          );
        })
      );
    })
    .catch((error) => errorHandler(error, req, res));
};

////////////// TASK 13
const addMovieHandler = (req, res) => {
  const movie = req.body;
  console.log(movie);
  const sql = `INSERT INTO fav(title, releaseDate, posterPath, overview, comment) VALUES($1, $2, $3, $4, $5)`;
  const values = [
    movie.title,
    movie.release_date,
    movie.poster_path,
    movie.overview,
    movie.comment,
  ];
  client
    .query(sql, values)
    .then((data) => {
      return res.status(201).json(data.rows);
    })
    .catch((error) => errorHandler(error, req, res));
};

const getMovieHandler = (req, res) => {
  const sql = `SELECT * FROM fav`;

  client
    .query(sql)
    .then((data) => {
      return res.status(200).json(data.rows);
    })
    .catch((error) => {
      errorHandler(error, req, res);
    });
};

app.post("/addMovie", addMovieHandler);

app.get("/getMovie", getMovieHandler);

/////////////// Task 14
const udpateFavHandler = (req, res) => {
  const id = req.params.id;
  const movie = req.body;
  const values = [
    movie.title,
    movie.release_date,
    movie.poster_path,
    movie.overview,
  ];
  const sql = `UPDATE fav
    SET title=$1, releaseDate=$2, posterPath=$3, overview=$4
    WHERE id=${id} RETURNING *;`;

  client
    .query(sql, values)
    .then((data) => res.status(200).json(data.rows))
    .catch((error) => errorHandler(error, req, res));
};

const deleteMovieHandler = (req, res) => {
  const id = req.params.id;
  const sql = `DELETE FROM fav WHERE id=${id};`;

  client
    .query(sql)
    .then(() => res.status(203).json())
    .catch((error) => errorHandler(error, req, res));
};

const getFavMovieHandler = (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * FROM fav WHERE id=${id}`;

  client
    .query(sql)
    .then((data) => res.status(200).json(data.rows))
    .catch((error) => errorHandler(error, req, res));
};

app.put("/udpateFavMovie/:id", udpateFavHandler);

app.delete("/delete/:id", deleteMovieHandler);

app.get("/getFavMovie/:id", getFavMovieHandler);

const errorHandler = (error, req, res) => {
  const err = {
    status: 500,
    message: error.message,
  };
  res.status(500).send(err);
};

app.get("/", homePageHandler);

app.get("/favorite", favoriteHandler);

app.get("/trending", trendingHandler);

app.get("/search", searchHandler);

app.get("/popular", popularHandler);

app.get("/toprated", topRatedHandler);

client.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
});
