CREATE TABLE galleries (
    id              SERIAL PRIMARY KEY,
    title           VARCHAR(200) NOT NULL,
    cover_image_url VARCHAR(500),
    event_date      DATE,
    created_at      TIMESTAMP DEFAULT NOW()
);
CREATE TABLE photos (
    id          SERIAL PRIMARY KEY,
    gallery_id  INT NOT NULL REFERENCES galleries(id) ON DELETE CASCADE,
    image_url   VARCHAR(500) NOT NULL,
    caption     VARCHAR(300),
    sort_order  INT NOT NULL DEFAULT 0
);
CREATE TABLE videos (
    id           SERIAL PRIMARY KEY,
    title        VARCHAR(200) NOT NULL,
    description  TEXT,
    url          VARCHAR(500) NOT NULL,
    thumbnail    VARCHAR(500),
    type         VARCHAR(30) NOT NULL DEFAULT 'HIGHLIGHT',
    published_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_videos_type ON videos(type);
INSERT INTO galleries (title, event_date) VALUES
  ('Pretemporada 2026', '2026-09-01');
INSERT INTO videos (title, description, url, type) VALUES
  ('Highlight — Primer amistoso', 'Los mejores momentos del partido de pretemporada', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'HIGHLIGHT');
