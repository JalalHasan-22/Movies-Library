DROP TABLE IF EXISTS fav;

CREATE TABLE IF NOT EXISTS fav (
    id SERIAL PRIMARY KEY,
    title VARCHAR(250),
    releaseDate VARCHAR(250),
    posterPath VARCHAR(250),
    overview VARCHAR(1000),
    comments VARCHAR(250)
)