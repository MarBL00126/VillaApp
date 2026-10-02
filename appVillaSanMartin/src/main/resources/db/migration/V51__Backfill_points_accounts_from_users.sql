
INSERT INTO points_accounts (user_id, total_points, level)
SELECT u.id,
       u.points,
       CASE
           WHEN u.points >= 2000 THEN 'LEGEND'
           WHEN u.points >= 500 THEN 'SUPERFAN'
           WHEN u.points >= 100 THEN 'FAN'
           ELSE 'ROOKIE'
       END
FROM users u
WHERE COALESCE(u.points, 0) > 0
  AND NOT EXISTS (SELECT 1 FROM points_accounts pa WHERE pa.user_id = u.id);
