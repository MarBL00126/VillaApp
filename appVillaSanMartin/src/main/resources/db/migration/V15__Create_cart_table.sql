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
