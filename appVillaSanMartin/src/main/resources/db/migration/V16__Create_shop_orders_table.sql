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
