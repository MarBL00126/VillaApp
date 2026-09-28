CREATE TABLE shot_chart (
    id          SERIAL PRIMARY KEY,
    match_id    INT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    player_id   INT NOT NULL REFERENCES players(id),
    quarter     SMALLINT NOT NULL,
    clock       VARCHAR(10),
    x           NUMERIC(5,2) NOT NULL,       -- % ancho cancha (0-100)
    y           NUMERIC(5,2) NOT NULL,       -- % largo cancha (0-100)
    made        BOOLEAN NOT NULL,
    shot_type   VARCHAR(20) NOT NULL,        -- TWO | THREE | FREE_THROW
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_shot_chart_match  ON shot_chart(match_id);
CREATE INDEX idx_shot_chart_player ON shot_chart(player_id);