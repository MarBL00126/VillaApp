CREATE TABLE audit_log (
    id          SERIAL PRIMARY KEY,
    user_id     INT REFERENCES users(id),
    action      VARCHAR(50) NOT NULL,
    -- LOGIN | LOGOUT | PURCHASE | SCAN | APPROVE | REJECT | UPDATE | DELETE
    entity_type VARCHAR(50),                  -- "TICKET", "PRESS_ACCREDITATION", etc.
    entity_id   INT,
    ip_address  VARCHAR(45),
    user_agent  VARCHAR(300),
    details     JSONB,
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_user    ON audit_log(user_id);
CREATE INDEX idx_audit_action  ON audit_log(action);
CREATE INDEX idx_audit_created ON audit_log(created_at DESC);