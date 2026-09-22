CREATE TABLE membership_types (
    id           SERIAL PRIMARY KEY,
    name         VARCHAR(100) NOT NULL,   -- Activo, Cadete, Vitalicio
    monthly_fee  NUMERIC(10,2),
    annual_fee   NUMERIC(10,2),
    description  TEXT,
    active       BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO membership_types (name, monthly_fee, annual_fee) VALUES
  ('Cadete',   500.00,  5000.00),
  ('Activo',  1500.00, 15000.00),
  ('Vitalicio',   0.00,     0.00);