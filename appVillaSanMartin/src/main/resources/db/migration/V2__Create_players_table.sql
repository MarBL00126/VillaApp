CREATE TABLE IF NOT EXISTS players(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    surname VARCHAR(50) NOT NULL,
    position VARCHAR(50) NOT NULL,
    shirt_number INT,
    height FLOAT,
    nationality VARCHAR(50) NOT NULL,
    birth_date DATE NOT NULL
);
CREATE INDEX idx_players_shirt_number ON players(shirt_number);