CREATE TABLE match_predictions (
    id                   SERIAL PRIMARY KEY,
    user_id              INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    match_id             INT NOT NULL REFERENCES matches(id),
    predicted_home_score INT NOT NULL,
    predicted_away_score INT NOT NULL,
    points_awarded       INT,
    created_at           TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, match_id)
);