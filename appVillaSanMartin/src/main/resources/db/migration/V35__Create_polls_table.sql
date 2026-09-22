CREATE TABLE polls (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(300) NOT NULL,
    type        VARCHAR(30) NOT NULL DEFAULT 'POLL',
    -- POLL | MVP_VOTE
    match_id    INT REFERENCES matches(id),   -- opcional: vincular a un partido
    active      BOOLEAN NOT NULL DEFAULT TRUE,
    closes_at   TIMESTAMP,
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE poll_options (
    id        SERIAL PRIMARY KEY,
    poll_id   INT NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
    text      VARCHAR(200) NOT NULL,
    player_id INT REFERENCES players(id),  -- para votación MVP
    sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE poll_votes (
    id         SERIAL PRIMARY KEY,
    user_id    INT NOT NULL REFERENCES users(id),
    poll_id    INT NOT NULL REFERENCES polls(id),
    option_id  INT NOT NULL REFERENCES poll_options(id),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, poll_id)
);

INSERT INTO polls (title, type, active) VALUES
  ('Jugador del partido', 'MVP_VOTE', TRUE),
  ('Que contenido queres ver mas?', 'POLL', TRUE);

INSERT INTO poll_options (poll_id, text, sort_order) VALUES
  ((SELECT id FROM polls WHERE title = 'Jugador del partido'), 'Base titular', 1),
  ((SELECT id FROM polls WHERE title = 'Jugador del partido'), 'Escolta goleador', 2),
  ((SELECT id FROM polls WHERE title = 'Jugador del partido'), 'Pivot dominante', 3),
  ((SELECT id FROM polls WHERE title = 'Que contenido queres ver mas?'), 'Entrenamientos', 1),
  ((SELECT id FROM polls WHERE title = 'Que contenido queres ver mas?'), 'Entrevistas', 2),
  ((SELECT id FROM polls WHERE title = 'Que contenido queres ver mas?'), 'Historias del club', 3);
