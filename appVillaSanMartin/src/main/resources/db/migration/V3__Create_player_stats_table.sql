CREATE TABLE IF NOT EXISTS players_stats (
    id SERIAL PRIMARY KEY,
    player_id INTEGER NOT NULL UNIQUE,
    made_free_throws FLOAT,
    attempted_free_throws FLOAT,
    made_two_pointers FLOAT,
    attempted_two_pointers FLOAT,
    made_three_pointers FLOAT,
    attempted_three_pointers FLOAT,
    played_games FLOAT,
    total_minutes FLOAT,
    total_points FLOAT,
    total_rebounds FLOAT,
    total_assists FLOAT,
    total_blocks FLOAT,
    total_turnovers FLOAT,
    total_steals FLOAT,
    total_fouls FLOAT,
    total_valoration FLOAT,
    CONSTRAINT fk_players_stats_player
        FOREIGN KEY (player_id)
        REFERENCES players(id)
        ON DELETE CASCADE
);