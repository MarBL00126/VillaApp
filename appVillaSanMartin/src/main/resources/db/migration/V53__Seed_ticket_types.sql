-- Seed default ticket types for upcoming home matches that have none yet
INSERT INTO ticket_types (match_id, name, price, total_quantity, available_quantity)
SELECT m.id, t.name, t.price, t.qty, t.qty
FROM matches m
CROSS JOIN (VALUES
    ('Popular', 5000.00, 400),
    ('Platea', 8000.00, 200),
    ('Platea VIP', 12000.00, 50)
) AS t(name, price, qty)
WHERE m.is_local = TRUE
  AND m.match_date > NOW()
  AND NOT EXISTS (SELECT 1 FROM ticket_types tt WHERE tt.match_id = m.id);
