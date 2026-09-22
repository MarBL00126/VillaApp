CREATE TABLE canteen_menu_categories (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0
);
CREATE TABLE canteen_menu_items (
    id          SERIAL PRIMARY KEY,
    category_id INT REFERENCES canteen_menu_categories(id),
    name        VARCHAR(200) NOT NULL,
    description VARCHAR(400),
    price       NUMERIC(10,2) NOT NULL,
    image_url   VARCHAR(500),
    available   BOOLEAN NOT NULL DEFAULT TRUE
);
INSERT INTO canteen_menu_categories (name, sort_order) VALUES
  ('Comidas', 1), ('Bebidas', 2), ('Snacks', 3), ('Combos', 4);
INSERT INTO canteen_menu_items (category_id, name, description, price) VALUES
  (1, 'Hamburguesa clásica', 'Pan, carne, lechuga, tomate', 4500.00),
  (1, 'Perrito caliente', 'Salchicha, pan y mostaza', 3200.00),
  (1, 'Empanada (x3)', 'Surtidas, al horno', 2800.00),
  (2, 'Agua mineral', '500ml', 1200.00),
  (2, 'Gaseosa', 'Lata 354ml', 1500.00),
  (2, 'Cerveza', 'Lata 473ml', 2500.00),
  (2, 'Café', 'Vaso grande', 1800.00),
  (3, 'Papas fritas', 'Porción mediana', 2200.00),
  (3, 'Maní', 'Paquete', 800.00),
  (4, 'Combo Partido', 'Hamburguesa + gaseosa + papas', 7500.00),
  (4, 'Combo Socio', 'Perrito + bebida + snack (15% OFF socios)', 5500.00);
