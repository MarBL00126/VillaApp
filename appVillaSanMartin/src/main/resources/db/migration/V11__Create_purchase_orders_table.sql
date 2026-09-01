CREATE TABLE purchase_orders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    ticket_type_id INT NOT NULL REFERENCES ticket_types(id),
    reservation_id INT REFERENCES reservations(id),
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(10,2) NOT NULL,
    total_amount NUMERIC(10,2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING_PAYMENT',
    entry_code VARCHAR(100) UNIQUE,
    qr_data TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    paid_at TIMESTAMP,
    used_at TIMESTAMP
);