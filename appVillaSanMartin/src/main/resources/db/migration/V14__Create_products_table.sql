CREATE TABLE products (
    id          SERIAL PRIMARY KEY,
    category_id INT REFERENCES product_categories(id),
    name        VARCHAR(200) NOT NULL,
    description TEXT,
    price       NUMERIC(10,2) NOT NULL,
    image_url   VARCHAR(500),
    active      BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT NOW()
);
CREATE TABLE product_variants (
    id         SERIAL PRIMARY KEY,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    label      VARCHAR(50) NOT NULL,
    stock      INT NOT NULL DEFAULT 0
);
INSERT INTO products (category_id, name, description, price, image_url) VALUES
  (1, 'Camiseta Titular', 'Camiseta oficial temporada 2026', 15000.00, null),
  (1, 'Buzo Club', 'Buzo oficial azul y dorado', 22000.00, null),
  (2, 'Gorra VSM', 'Gorra bordada con logo del club', 8500.00, null);
INSERT INTO product_variants (product_id, label, stock) VALUES
  (1, 'Talle S', 10), (1, 'Talle M', 15), (1, 'Talle L', 8), (1, 'Talle XL', 5),
  (2, 'Talle S', 5), (2, 'Talle M', 10), (2, 'Talle L', 7),
  (3, 'Única', 20);
