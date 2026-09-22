CREATE TABLE user_preferences (
    id                    SERIAL PRIMARY KEY,
    user_id               INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    favorite_player_id    INT REFERENCES players(id),
    news_category_ids     INT[],              -- array de IDs de categorías
    notify_news           BOOLEAN DEFAULT TRUE,
    notify_videos         BOOLEAN DEFAULT TRUE,
    notify_fees           BOOLEAN DEFAULT TRUE,
    notify_benefits       BOOLEAN DEFAULT TRUE,
    notify_match_results  BOOLEAN DEFAULT TRUE,
    updated_at            TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id)
);