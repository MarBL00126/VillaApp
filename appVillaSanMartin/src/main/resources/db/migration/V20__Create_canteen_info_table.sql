CREATE TABLE canteen_info (
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
INSERT INTO canteen_info (address, phone, schedule, payment_methods, is_open, maps_url) VALUES
  ('Estadio Villa San Martín — Acceso Norte', '2664-000000', 'Días de partido: 2hs antes del inicio hasta el final del juego', 'Efectivo / MercadoPago / Transferencia', FALSE, 'https://maps.google.com');
