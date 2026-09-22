CREATE TABLE membership_fees (
    id             SERIAL PRIMARY KEY,
    membership_id  INT NOT NULL REFERENCES memberships(id) ON DELETE CASCADE,
    month          SMALLINT NOT NULL,   -- 1-12
    year           SMALLINT NOT NULL,
    amount         NUMERIC(10,2) NOT NULL,
    status         VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    -- PENDING | PAID | OVERDUE | CANCELLED
    due_date       DATE NOT NULL,
    paid_at        TIMESTAMP,
    mp_payment_id  VARCHAR(100),
    mp_preference_id VARCHAR(100),
    UNIQUE(membership_id, month, year)
);

CREATE INDEX idx_fees_status       ON membership_fees(status);
CREATE INDEX idx_fees_membership   ON membership_fees(membership_id);