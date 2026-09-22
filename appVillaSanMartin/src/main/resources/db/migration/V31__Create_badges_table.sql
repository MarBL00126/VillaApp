CREATE TABLE badges (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    description     TEXT,
    image_url       VARCHAR(500),
    required_points INT NOT NULL DEFAULT 0,
    active          BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE user_badges (
    id         SERIAL PRIMARY KEY,
    user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id   INT NOT NULL REFERENCES badges(id),
    earned_at  TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

INSERT INTO badges (name, description, required_points) VALUES
  ('Hincha Nuevo',    'Primeros pasos en la app',    0),
  ('Fan Activo',      'Acumulaste 100 puntos',      100),
  ('Super Fan',       'Acumulaste 500 puntos',      500),
  ('Leyenda',         'Acumulaste 2000 puntos',    2000);