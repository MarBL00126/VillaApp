CREATE TABLE canteen_orders (
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
CREATE TABLE canteen_order_items (
    id           SERIAL PRIMARY KEY,
    order_id     INT NOT NULL REFERENCES canteen_orders(id) ON DELETE CASCADE,
    menu_item_id INT NOT NULL REFERENCES canteen_menu_items(id),
    quantity     INT NOT NULL,
    unit_price   NUMERIC(10,2) NOT NULL
);
CREATE INDEX idx_canteen_orders_number ON canteen_orders(order_number);
CREATE INDEX idx_canteen_orders_status ON canteen_orders(status);
