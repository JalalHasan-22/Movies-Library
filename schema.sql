DROP TABLE IF EXISTS fav;

CREATE TABLE IF NOT EXISTS fav (
    id SERIAL PRIMARY KEY,
    title VARCHAR(250),
    releasedate VARCHAR(250),
    posterpath VARCHAR(250),
    overview VARCHAR(1000),
    comment VARCHAR(250)
)