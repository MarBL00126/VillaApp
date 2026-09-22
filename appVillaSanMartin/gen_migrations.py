import os

base_pkg = "mariano.projects.appVillaSanMartin"
base_dir = "src/main/java/mariano/projects/appVillaSanMartin"
mig_dir = "src/main/resources/db/migration"

def create_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")

# MIGRATIONS
create_file(f"{mig_dir}/V13__Create_product_categories_table.sql", """
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
""")

create_file(f"{mig_dir}/V14__Create_products_table.sql", """
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
""")

create_file(f"{mig_dir}/V15__Create_cart_table.sql", """
CREATE TABLE carts (
    id         SERIAL PRIMARY KEY,
    user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id)
);
CREATE TABLE cart_items (
    id          SERIAL PRIMARY KEY,
    cart_id     INT NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id  INT NOT NULL REFERENCES products(id),
    variant_id  INT REFERENCES product_variants(id),
    quantity    INT NOT NULL DEFAULT 1,
    unit_price  NUMERIC(10,2) NOT NULL
);
""")

create_file(f"{mig_dir}/V16__Create_shop_orders_table.sql", """
CREATE TABLE coupons (
    id            SERIAL PRIMARY KEY,
    code          VARCHAR(50) NOT NULL UNIQUE,
    discount_pct  NUMERIC(5,2) NOT NULL,
    min_amount    NUMERIC(10,2) DEFAULT 0,
    expires_at    TIMESTAMP,
    active        BOOLEAN NOT NULL DEFAULT TRUE,
    max_uses      INT,
    used_count    INT NOT NULL DEFAULT 0
);
CREATE TABLE shop_orders (
    id            SERIAL PRIMARY KEY,
    user_id       INT NOT NULL REFERENCES users(id),
    coupon_id     INT REFERENCES coupons(id),
    subtotal      NUMERIC(10,2) NOT NULL,
    discount      NUMERIC(10,2) NOT NULL DEFAULT 0,
    total_amount  NUMERIC(10,2) NOT NULL,
    status        VARCHAR(30) NOT NULL DEFAULT 'PENDING_PAYMENT',
    mp_payment_id VARCHAR(100),
    mp_preference_id VARCHAR(100),
    created_at    TIMESTAMP DEFAULT NOW(),
    paid_at       TIMESTAMP
);
CREATE TABLE shop_order_items (
    id          SERIAL PRIMARY KEY,
    order_id    INT NOT NULL REFERENCES shop_orders(id) ON DELETE CASCADE,
    product_id  INT NOT NULL REFERENCES products(id),
    variant_id  INT REFERENCES product_variants(id),
    quantity    INT NOT NULL,
    unit_price  NUMERIC(10,2) NOT NULL
);
INSERT INTO coupons (code, discount_pct, min_amount, active) VALUES
  ('VILLA10', 10.00, 5000.00, true),
  ('SOCIO15', 15.00, 0.00, true);
""")

create_file(f"{mig_dir}/V17__Create_favorite_products_table.sql", """
CREATE TABLE favorite_products (
    id         SERIAL PRIMARY KEY,
    user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);
""")

create_file(f"{mig_dir}/V18__Create_news_table.sql", """
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
""")

create_file(f"{mig_dir}/V19__Create_multimedia_table.sql", """
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
""")

create_file(f"{mig_dir}/V20__Create_cantina_info_table.sql", """
CREATE TABLE cantina_info (
    id               SERIAL PRIMARY KEY,
    address          VARCHAR(300),
    phone            VARCHAR(50),
    email            VARCHAR(100),
    schedule         VARCHAR(500),
    payment_methods  VARCHAR(300),
    maps_url         VARCHAR(500),
    is_open          BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at       TIMESTAMP DEFAULT NOW()
);
INSERT INTO cantina_info (address, phone, schedule, payment_methods, is_open, maps_url) VALUES
  ('Estadio Villa San Martín — Acceso Norte', '2664-000000', 'Días de partido: 2hs antes del inicio hasta el final del juego', 'Efectivo / MercadoPago / Transferencia', FALSE, 'https://maps.google.com');
""")

create_file(f"{mig_dir}/V21__Create_cantina_menu_table.sql", """
CREATE TABLE cantina_menu_categories (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0
);
CREATE TABLE cantina_menu_items (
    id          SERIAL PRIMARY KEY,
    category_id INT REFERENCES cantina_menu_categories(id),
    name        VARCHAR(200) NOT NULL,
    description VARCHAR(400),
    price       NUMERIC(10,2) NOT NULL,
    image_url   VARCHAR(500),
    available   BOOLEAN NOT NULL DEFAULT TRUE
);
INSERT INTO cantina_menu_categories (name, sort_order) VALUES
  ('Comidas', 1), ('Bebidas', 2), ('Snacks', 3), ('Combos', 4);
INSERT INTO cantina_menu_items (category_id, name, description, price) VALUES
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
""")

create_file(f"{mig_dir}/V22__Create_cantina_orders_table.sql", """
CREATE TABLE cantina_orders (
    id             SERIAL PRIMARY KEY,
    user_id        INT REFERENCES users(id),
    order_number   VARCHAR(20) NOT NULL UNIQUE,
    status         VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    total_amount   NUMERIC(10,2) NOT NULL,
    payment_method VARCHAR(50),
    notes          TEXT,
    created_at     TIMESTAMP DEFAULT NOW(),
    ready_at       TIMESTAMP
);
CREATE TABLE cantina_order_items (
    id           SERIAL PRIMARY KEY,
    order_id     INT NOT NULL REFERENCES cantina_orders(id) ON DELETE CASCADE,
    menu_item_id INT NOT NULL REFERENCES cantina_menu_items(id),
    quantity     INT NOT NULL,
    unit_price   NUMERIC(10,2) NOT NULL
);
CREATE INDEX idx_cantina_orders_number ON cantina_orders(order_number);
CREATE INDEX idx_cantina_orders_status ON cantina_orders(status);
""")

print("Migrations generated.")
