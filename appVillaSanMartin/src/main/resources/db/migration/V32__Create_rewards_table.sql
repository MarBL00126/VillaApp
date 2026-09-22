CREATE TABLE rewards (
    id           SERIAL PRIMARY KEY,
    name         VARCHAR(200) NOT NULL,
    description  TEXT,
    points_cost  INT NOT NULL,
    type         VARCHAR(50) NOT NULL,
    -- SHOP_DISCOUNT | CANTINA_DISCOUNT | EXCLUSIVE | MERCHANDISE
    stock        INT,             -- NULL = ilimitado
    active       BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE reward_redemptions (
    id          SERIAL PRIMARY KEY,
    user_id     INT NOT NULL REFERENCES users(id),
    reward_id   INT NOT NULL REFERENCES rewards(id),
    code        VARCHAR(50) NOT NULL UNIQUE,  -- código de descuento generado
    redeemed_at TIMESTAMP DEFAULT NOW(),
    used_at     TIMESTAMP,
    expires_at  TIMESTAMP
);

INSERT INTO rewards (name, description, points_cost, type, stock, active) VALUES
  ('10% OFF en tienda', 'Codigo de descuento para merchandising oficial.', 100, 'SHOP_DISCOUNT', NULL, TRUE),
  ('Combo cantina', 'Canje por beneficio en cantina durante dia de partido.', 150, 'CANTINA_DISCOUNT', NULL, TRUE),
  ('Contenido exclusivo', 'Acceso a material especial para fans.', 80, 'EXCLUSIVE', NULL, TRUE);
