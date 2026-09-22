CREATE TABLE staff (
    id        SERIAL PRIMARY KEY,
    team_id   INT REFERENCES teams(id),
    name      VARCHAR(100) NOT NULL,
    role      VARCHAR(100) NOT NULL,   -- "Director Técnico", "Asistente", etc.
    photo_url VARCHAR(500),
    bio       TEXT,
    active    BOOLEAN NOT NULL DEFAULT TRUE
);

-- Agregar biography a players
ALTER TABLE players ADD COLUMN IF NOT EXISTS biography TEXT;
ALTER TABLE players ADD COLUMN IF NOT EXISTS favorite_count INT NOT NULL DEFAULT 0;
