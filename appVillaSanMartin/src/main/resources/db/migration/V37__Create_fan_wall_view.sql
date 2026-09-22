CREATE VIEW fan_wall AS
SELECT
    c.id,
    c.target_type,
    c.target_id,
    c.content,
    c.created_at,
    u.name || ' ' || u.surname AS author_name,
    (SELECT COUNT(*) FROM reactions r
     WHERE r.target_type = 'COMMENT' AND r.target_id = c.id AND r.type = 'LIKE') AS likes
FROM comments c
JOIN users u ON u.id = c.user_id
ORDER BY c.created_at DESC;