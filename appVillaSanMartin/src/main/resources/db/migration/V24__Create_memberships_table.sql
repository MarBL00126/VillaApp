CREATE TABLE memberships (
    id                  SERIAL PRIMARY KEY,
    user_id             INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    membership_type_id  INT NOT NULL REFERENCES membership_types(id),
    status              VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    -- ACTIVE | SUSPENDED | CANCELLED
    member_number       VARCHAR(20) NOT NULL UNIQUE,
    joined_at           TIMESTAMP DEFAULT NOW(),
    expires_at          TIMESTAMP,
    UNIQUE(user_id)
);

CREATE INDEX idx_memberships_status ON memberships(status);
CREATE INDEX idx_memberships_number ON memberships(member_number);