CREATE TABLE IF NOT EXISTS matches (
    id SERIAL PRIMARY KEY,
    match_date TIMESTAMP NOT NULL,
    is_local BOOLEAN,
    opponent VARCHAR(100) NOT NULL,
    team_points INTEGER,
    opponent_points INTEGER,
    team_id INTEGER NOT NULL,
    CONSTRAINT fk_matches_team
        FOREIGN KEY (team_id)
        REFERENCES teams(id)
);