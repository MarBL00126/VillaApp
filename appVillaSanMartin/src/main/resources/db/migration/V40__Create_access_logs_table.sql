ALTER TABLE ticket_types ADD COLUMN IF NOT EXISTS sector_id INT REFERENCES stadium_sectors(id);
CREATE TABLE access_logs(
    id SERIAL PRIMARY KEY,
    ticket_id INT REFERENCES purchase_orders(id), -- nullable si es prensa
    user_id INT REFERENCES users(id),
    match_id INT REFERENCES matches(id),
    scanned_at TIMESTAMP DEFAULT NOW(),
    gate VARCHAR(20),
    status VARCHAR(20) NOT NULL DEFAULT 'OK',
    -- OK | DUPLICATE | INVALID | EXPIRED | WRONG_MATCH
    device_id VARCHAR(100), -- identificador del escáner
    notes VARCHAR(300)
);
CREATE INDEX idx_access_logs_match ON access_logs(match_id);
CREATE INDEX idx_access_logs_ticket ON access_logs(ticket_id);
CREATE INDEX idx_access_logs_scanned ON access_logs(scanned_at DESC);