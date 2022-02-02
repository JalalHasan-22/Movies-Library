DROP TABLE IF EXISTS favMovies;

CREATE TABLE IF NOT EXISTS favMovies (
    id SERIAL PRIMARY KEY,
    title VARCHAR,
    releaseDate TIMESTAMP,
    posterPath VARCHAR(250),
    overview VARCHAR(1000)
)