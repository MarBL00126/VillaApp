CREATE TABLE standings (
    id              SERIAL PRIMARY KEY,
    team_name       VARCHAR(100) NOT NULL,     -- nombre del equipo (puede ser rival)
    team_id         INT REFERENCES teams(id),  -- null si es equipo externo
    season          SMALLINT NOT NULL,         -- ej: 2026
    zone            VARCHAR(50),               -- "Zona Norte", etc.
    played          SMALLINT NOT NULL DEFAULT 0,
    wins            SMALLINT NOT NULL DEFAULT 0,
    losses          SMALLINT NOT NULL DEFAULT 0,
    points_for      INT NOT NULL DEFAULT 0,
    points_against  INT NOT NULL DEFAULT 0,
    streak          VARCHAR(20),               -- "W3", "L1"
    position        SMALLINT,
    UNIQUE(team_name, season)
);

CREATE INDEX idx_standings_season ON standings(season);