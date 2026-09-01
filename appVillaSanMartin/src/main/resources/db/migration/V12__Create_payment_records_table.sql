CREATE TABLE payment_records(
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES purchase_orders(id),
    mp_preference_id VARCHAR(100),
    mp_payment_id BIGINT,
    mp_status VARCHAR(30),
    amount NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_payment_records_order_id
    ON payment_records(order_id);