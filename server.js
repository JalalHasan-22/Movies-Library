"use strict";

const express = require('express');
const jsonData = require("./Movie Data/data.json")
const app = express();


function Movie (title, posterPath, overview) {
    this.title = title;
    this.posterPath = posterPath;
    this.overview = overview;
}

const formattedData = new Movie(jsonData.title, jsonData.poster_path, jsonData.overview);


const homePageHandler = (req, res) => {
    return res.status(200).json(formattedData)
}

const favoriteHandler = (req, res) => {
    res.status(200).send("Welcome to Favorite Page")
}

app.get("/", homePageHandler);

app.get("/favorite", favoriteHandler);


app.listen(3000, () => {
    console.log(
        "Listening on port 3000"
    );
})