CREATE TABLE live_match_state (
    id              SERIAL PRIMARY KEY,
    match_id        INT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    status          VARCHAR(20) NOT NULL DEFAULT 'PRE',
    -- PRE | LIVE | HALFTIME | FINAL
    quarter         SMALLINT NOT NULL DEFAULT 1,
    clock           VARCHAR(10) NOT NULL DEFAULT '10:00',     -- "07:34" o "OT"
    home_score      INT NOT NULL DEFAULT 0,
    away_score      INT NOT NULL DEFAULT 0,
    last_updated    TIMESTAMP DEFAULT NOW(),
    UNIQUE(match_id)
);

CREATE INDEX idx_live_state_match ON live_match_state(match_id);