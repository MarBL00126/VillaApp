CREATE TABLE product_categories (
    id      SERIAL PRIMARY KEY,
    name    VARCHAR(100) NOT NULL,
    slug    VARCHAR(100) NOT NULL UNIQUE,
    active  BOOLEAN NOT NULL DEFAULT TRUE
);
INSERT INTO product_categories (name, slug) VALUES
  ('Indumentaria', 'indumentaria'),
  ('Accesorios', 'accesorios'),
  ('Varios', 'varios');
