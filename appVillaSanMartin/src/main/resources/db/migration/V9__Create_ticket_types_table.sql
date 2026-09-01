CREATE TABLE ticket_types(
    id SERIAL PRIMARY KEY,
    match_id INT NOT NULL REFERENCES matches(id),
    name VARCHAR(50) NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    total_quantity INT NOT NULL,
    available_quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);