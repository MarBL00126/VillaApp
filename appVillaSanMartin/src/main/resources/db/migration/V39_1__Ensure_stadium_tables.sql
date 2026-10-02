CREATE TABLE IF NOT EXISTS stadium_info (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(200) NOT NULL,
    address         VARCHAR(300),
    city            VARCHAR(100),
    capacity        INT,
    map_url         VARCHAR(500),
    parking_url     VARCHAR(500),
    latitude        NUMERIC(10,7),
    longitude       NUMERIC(10,7),
    updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stadium_sectors (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    type        VARCHAR(30) NOT NULL,
    gate        VARCHAR(20),
    capacity    INT,
    color_hex   VARCHAR(7),
    description VARCHAR(300),
    active      BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS stadium_services (
    id          SERIAL PRIMARY KEY,
    sector_id   INT REFERENCES stadium_sectors(id),
    type        VARCHAR(30) NOT NULL,
    name        VARCHAR(200) NOT NULL,
    location    VARCHAR(200),
    active      BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO stadium_info (name, address, city, capacity)
SELECT 'Estadio Villa San Martín', 'Saavedra 135', 'Resistencia', 2500
WHERE NOT EXISTS (SELECT 1 FROM stadium_info);

INSERT INTO stadium_sectors (name, type, gate, capacity, color_hex)
SELECT *
FROM (VALUES
    ('Platea Norte',  'PLATEA',  'Puerta A', 600, '#0d1f4e'),
    ('Platea Sur',   'PLATEA',  'Puerta B', 600, '#0d1f4e'),
    ('Popular Este', 'POPULAR', 'Puerta C', 800, '#1a3a6e'),
    ('Popular Oeste','POPULAR', 'Puerta D', 400, '#1a3a6e'),
    ('VIP',          'VIP',     'Puerta E', 80,  '#f5a623'),
    ('Prensa',       'PRENSA',  'Puerta F', 20,  '#dc2626')
) AS defaults(name, type, gate, capacity, color_hex)
WHERE NOT EXISTS (SELECT 1 FROM stadium_sectors);

INSERT INTO stadium_services (type, name, location)
SELECT *
FROM (VALUES
    ('BANO',        'Baños Platea Norte', 'Pasillo A, nivel 0'),
    ('BANO',        'Baños Popular', 'Acceso Este'),
    ('GASTRONOMIA', 'Cantina Principal', 'Acceso Norte'),
    ('MERCH',       'Tienda Oficial', 'Hall de entrada'),
    ('PARKING',     'Estacionamiento', 'Calle lateral oeste'),
    ('PRIMEROS_AUXILIOS', 'Enfermería', 'Oficina administrativa')
) AS defaults(type, name, location)
WHERE NOT EXISTS (SELECT 1 FROM stadium_services);
