CREATE TABLE press_accreditations (
    id              SERIAL PRIMARY KEY,
    user_id         INT REFERENCES users(id),                 -- puede ser sin cuenta
    match_id        INT REFERENCES matches(id),
    -- Datos del periodista
    journalist_name VARCHAR(100) NOT NULL,
    media_name      VARCHAR(200) NOT NULL,
    role            VARCHAR(100) NOT NULL,                    -- "Cronista", "Fotógrafo", etc.
    email           VARCHAR(100) NOT NULL,
    phone           VARCHAR(50),
    coverage_type   VARCHAR(50) NOT NULL,                     -- NOTA | FOTO | VIDEO | STREAMING
    -- Gestión
    status          VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    -- PENDING | APPROVED | REJECTED | REVOKED
    notes           VARCHAR(500),                             -- observaciones del admin
    -- Credencial digital
    qr_code         VARCHAR(200) UNIQUE,                      -- token único para QR
    sector_id       INT REFERENCES stadium_sectors(id),
    gate            VARCHAR(20),
    valid_from      TIMESTAMP,
    valid_until     TIMESTAMP,
    -- Registro
    submitted_at    TIMESTAMP DEFAULT NOW(),
    reviewed_at     TIMESTAMP,
    reviewed_by     INT REFERENCES users(id)
);

CREATE TABLE press_access_logs (
    id                  SERIAL PRIMARY KEY,
    accreditation_id    INT NOT NULL REFERENCES press_accreditations(id),
    scanned_at          TIMESTAMP DEFAULT NOW(),
    direction           VARCHAR(10) NOT NULL DEFAULT 'IN',    -- IN | OUT
    gate                VARCHAR(20),
    device_id           VARCHAR(100)
);

CREATE INDEX idx_press_status   ON press_accreditations(status);
CREATE INDEX idx_press_match    ON press_accreditations(match_id);
CREATE INDEX idx_press_qr       ON press_accreditations(qr_code);