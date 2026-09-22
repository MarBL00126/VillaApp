CREATE TABLE points_accounts (
    id           SERIAL PRIMARY KEY,
    user_id      INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_points INT NOT NULL DEFAULT 0,
    level        VARCHAR(30) NOT NULL DEFAULT 'ROOKIE',
    -- ROOKIE | FAN | SUPERFAN | LEGEND
    updated_at   TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id)
);

CREATE TABLE points_transactions (
    id         SERIAL PRIMARY KEY,
    account_id INT NOT NULL REFERENCES points_accounts(id) ON DELETE CASCADE,
    amount     INT NOT NULL,               -- puede ser negativo (canje)
    reason     VARCHAR(50) NOT NULL,
    -- PREDICTION | TRIVIA | MVP_VOTE | PURCHASE | REDEMPTION | BONUS
    reference_id INT,                      -- id del objeto que generó los puntos
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_points_transactions_account ON points_transactions(account_id);