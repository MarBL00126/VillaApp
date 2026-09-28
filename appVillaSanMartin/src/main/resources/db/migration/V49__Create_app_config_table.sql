CREATE TABLE app_config (
    id      SERIAL PRIMARY KEY,
    key     VARCHAR(100) NOT NULL UNIQUE,
    value   TEXT NOT NULL,
    type    VARCHAR(20) NOT NULL DEFAULT 'STRING',  -- STRING | BOOLEAN | NUMBER | JSON
    description VARCHAR(300)
);

INSERT INTO app_config (key, value, type, description) VALUES
  ('match_live_polling_seconds', '15',   'NUMBER',  'Frecuencia de polling en Game Center'),
  ('cantina_orders_enabled',     'true', 'BOOLEAN', 'Habilitar pedidos de cantina'),
  ('press_requests_open',        'true', 'BOOLEAN', 'Aceptar nuevas solicitudes de prensa'),
  ('max_tickets_per_user',       '10',    'NUMBER',  'Máximo de tickets por usuario por partido');