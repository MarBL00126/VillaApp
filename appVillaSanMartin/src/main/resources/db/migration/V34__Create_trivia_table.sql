CREATE TABLE trivias (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(200) NOT NULL,
    description TEXT,
    points      INT NOT NULL DEFAULT 10,
    active      BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE trivia_questions (
    id         SERIAL PRIMARY KEY,
    trivia_id  INT NOT NULL REFERENCES trivias(id) ON DELETE CASCADE,
    question   VARCHAR(500) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE trivia_options (
    id          SERIAL PRIMARY KEY,
    question_id INT NOT NULL REFERENCES trivia_questions(id) ON DELETE CASCADE,
    text        VARCHAR(300) NOT NULL,
    is_correct  BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE trivia_attempts (
    id           SERIAL PRIMARY KEY,
    user_id      INT NOT NULL REFERENCES users(id),
    trivia_id    INT NOT NULL REFERENCES trivias(id),
    score        INT NOT NULL DEFAULT 0,
    points_awarded INT,
    completed_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, trivia_id)
);

INSERT INTO trivias (title, description, points, active) VALUES
  ('Trivia Villa San Martin', 'Demostra cuanto sabes del club.', 20, TRUE);

INSERT INTO trivia_questions (trivia_id, question, sort_order) VALUES
  ((SELECT id FROM trivias WHERE title = 'Trivia Villa San Martin'), 'Cual es el deporte principal de la app?', 1),
  ((SELECT id FROM trivias WHERE title = 'Trivia Villa San Martin'), 'Que se muestra en el carnet digital?', 2);

INSERT INTO trivia_options (question_id, text, is_correct) VALUES
  ((SELECT id FROM trivia_questions WHERE question = 'Cual es el deporte principal de la app?'), 'Basquet', TRUE),
  ((SELECT id FROM trivia_questions WHERE question = 'Cual es el deporte principal de la app?'), 'Rugby', FALSE),
  ((SELECT id FROM trivia_questions WHERE question = 'Cual es el deporte principal de la app?'), 'Hockey', FALSE),
  ((SELECT id FROM trivia_questions WHERE question = 'Que se muestra en el carnet digital?'), 'Numero de socio y QR', TRUE),
  ((SELECT id FROM trivia_questions WHERE question = 'Que se muestra en el carnet digital?'), 'Solo noticias', FALSE),
  ((SELECT id FROM trivia_questions WHERE question = 'Que se muestra en el carnet digital?'), 'Fixture completo', FALSE);
