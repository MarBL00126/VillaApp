CREATE TABLE refresh_tokens (
    id          SERIAL PRIMARY KEY,
    user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token       VARCHAR(255) NOT NULL UNIQUE,
    expires_at  TIMESTAMP NOT NULL,
    revoked     BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_refresh_tokens_user   ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token  ON refresh_tokens(token);