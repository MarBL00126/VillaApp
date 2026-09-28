CREATE TABLE play_by_play (
    id              SERIAL PRIMARY KEY,
    match_id        INT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    quarter         SMALLINT NOT NULL,
    clock           VARCHAR(10) NOT NULL,
    event_type      VARCHAR(30) NOT NULL,
    -- BASKET_2 | BASKET_3 | FREE_THROW | FOUL | TIMEOUT | SUBSTITUTION
    -- REBOUND | STEAL | BLOCK | TURNOVER | QUARTER_END | GAME_END
    player_id       INT REFERENCES players(id),
    team_is_local   BOOLEAN,                                  -- de cuál equipo fue el evento
    home_score      INT NOT NULL DEFAULT 0,
    away_score      INT NOT NULL DEFAULT 0,
    description     VARCHAR(300) NOT NULL,                    -- ej: "García anota de 3 puntos"
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_pbp_match   ON play_by_play(match_id);
CREATE INDEX idx_pbp_quarter ON play_by_play(match_id, quarter);