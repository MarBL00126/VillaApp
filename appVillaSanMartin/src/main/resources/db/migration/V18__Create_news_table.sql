CREATE TABLE news_categories (
    id   SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE
);
CREATE TABLE news (
    id           SERIAL PRIMARY KEY,
    category_id  INT REFERENCES news_categories(id),
    title        VARCHAR(300) NOT NULL,
    summary      VARCHAR(500),
    content      TEXT NOT NULL,
    image_url    VARCHAR(500),
    featured     BOOLEAN NOT NULL DEFAULT FALSE,
    author       VARCHAR(100),
    published_at TIMESTAMP DEFAULT NOW(),
    created_at   TIMESTAMP DEFAULT NOW()
);
CREATE TABLE favorite_news (
    id         SERIAL PRIMARY KEY,
    user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    news_id    INT NOT NULL REFERENCES news(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, news_id)
);
CREATE INDEX idx_news_featured    ON news(featured);
CREATE INDEX idx_news_category    ON news(category_id);
CREATE INDEX idx_news_published   ON news(published_at DESC);
INSERT INTO news_categories (name, slug) VALUES
  ('Institucional', 'institucional'),
  ('Deportiva', 'deportiva'),
  ('Socio', 'socio');
INSERT INTO news (category_id, title, summary, content, featured, author) VALUES
  (2, 'Inicio de la temporada 2026', 'El equipo se prepara para la Liga Argentina', 'El Club Villa San Martín se prepara para afrontar la temporada 2026 de la Liga Argentina de Básquet con un plantel renovado y grandes expectativas.', true, 'Prensa VSM'),
  (1, 'Bienvenida a los nuevos socios', 'Este mes ingresaron 50 nuevos socios', 'El club da la bienvenida a los 50 nuevos socios que se incorporaron en septiembre de 2026. ¡Gracias por ser parte de la familia!', false, 'Secretaría');
