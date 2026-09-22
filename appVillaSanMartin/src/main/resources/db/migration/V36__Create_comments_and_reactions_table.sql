CREATE TABLE comments (
    id          SERIAL PRIMARY KEY,
    user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_type VARCHAR(30) NOT NULL,   -- NEWS | VIDEO | MATCH
    target_id   INT NOT NULL,
    content     TEXT NOT NULL,
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE reactions (
    id          SERIAL PRIMARY KEY,
    user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_type VARCHAR(30) NOT NULL,   -- NEWS | VIDEO | MATCH | COMMENT
    target_id   INT NOT NULL,
    type        VARCHAR(20) NOT NULL,   -- LIKE | FIRE | CLAP
    created_at  TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, target_type, target_id, type)
);

CREATE INDEX idx_comments_target ON comments(target_type, target_id);
CREATE INDEX idx_reactions_target ON reactions(target_type, target_id);