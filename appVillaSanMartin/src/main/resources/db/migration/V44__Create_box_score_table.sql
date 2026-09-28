CREATE TABLE box_score (
    id              SERIAL PRIMARY KEY,
    match_id        INT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    player_id       INT NOT NULL REFERENCES players(id),
    team_is_local   BOOLEAN NOT NULL,
    -- Tiempo
    minutes         NUMERIC(5,2) NOT NULL DEFAULT 0,
    -- Tiro de campo
    fg_made         SMALLINT NOT NULL DEFAULT 0,
    fg_att          SMALLINT NOT NULL DEFAULT 0,
    -- Triples
    three_made      SMALLINT NOT NULL DEFAULT 0,
    three_att       SMALLINT NOT NULL DEFAULT 0,
    -- Libres
    ft_made         SMALLINT NOT NULL DEFAULT 0,
    ft_att          SMALLINT NOT NULL DEFAULT 0,
    -- Stats
    points          SMALLINT NOT NULL DEFAULT 0,
    rebounds        SMALLINT NOT NULL DEFAULT 0,
    off_rebounds    SMALLINT NOT NULL DEFAULT 0,
    def_rebounds    SMALLINT NOT NULL DEFAULT 0,
    assists         SMALLINT NOT NULL DEFAULT 0,
    steals          SMALLINT NOT NULL DEFAULT 0,
    blocks          SMALLINT NOT NULL DEFAULT 0,
    turnovers       SMALLINT NOT NULL DEFAULT 0,
    fouls           SMALLINT NOT NULL DEFAULT 0,
    plus_minus      SMALLINT NOT NULL DEFAULT 0,
    UNIQUE(match_id, player_id)
);

CREATE INDEX idx_box_score_match  ON box_score(match_id);
CREATE INDEX idx_box_score_player ON box_score(player_id);