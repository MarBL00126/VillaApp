-- Team
INSERT INTO teams (name, city, short_name, logo_url, stadium, category, primary_team, active, created_at, updated_at)
VALUES ('Club Villa San Martín', 'San Martín', 'VSM', '/images/vsm-logo.png', 'Estadio Villa San Martín', 'Liga Argentina', TRUE, TRUE, NOW(), NOW());

-- Players
INSERT INTO players (name, surname, position, shirt_number, height, nationality, birth_date, team_id) VALUES
  ('Facundo',      'Gago',          'Base',      6,  1.76, 'Argentina', '1996-05-15', (SELECT id FROM teams WHERE short_name = 'VSM')),
  ('Favio',        'Vieta',         'Escolta',   10, 1.88, 'Argentina', '1996-01-12', (SELECT id FROM teams WHERE short_name = 'VSM')),
  ('Maximiliano',  'Martin',        'Alero',     5,  1.90, 'Argentina', '1990-02-27', (SELECT id FROM teams WHERE short_name = 'VSM')),
  ('Lautaro',      'Florito',       'Alero',     11, 1.89, 'Argentina', '2000-11-01', (SELECT id FROM teams WHERE short_name = 'VSM')),
  ('Estefano',     'Simondi',       'Ala-Pivot', 8,  2.01, 'Argentina', '1996-11-22', (SELECT id FROM teams WHERE short_name = 'VSM')),
  ('Elian',        'Centeno',       'Pivot',     18, 2.02, 'Venezuela', '2000-07-18', (SELECT id FROM teams WHERE short_name = 'VSM')),
  ('Emir',         'Perez Barrios', 'Base',      7,  1.87, 'Argentina', '2005-03-04', (SELECT id FROM teams WHERE short_name = 'VSM')),
  ('Agustin',      'Camisasca',     'Escolta',   9,  1.89, 'Argentina', '2004-02-11', (SELECT id FROM teams WHERE short_name = 'VSM')),
  ('Gael',         'Carrasco',      'Escolta',   13, 1.89, 'Argentina', '2009-09-22', (SELECT id FROM teams WHERE short_name = 'VSM')),
  ('Valentino',    'Barua',         'Ala-Pivot', 15, 1.98, 'Argentina', '2004-05-13', (SELECT id FROM teams WHERE short_name = 'VSM')),
  ('Romulo',       'Gusmao',        'Pivot',     16, 2.08, 'Brasil',    '1995-10-01', (SELECT id FROM teams WHERE short_name = 'VSM')),
  ('Santiago',     'Rath',          'Base',      4,  1.83, 'Argentina', '2005-05-24', (SELECT id FROM teams WHERE short_name = 'VSM'));

-- Past matches (with results)
INSERT INTO matches (match_date, is_local, opponent, team_points, opponent_points, team_id) VALUES
  ('2025-10-31 22:00:00', TRUE,  'Independiente BBC',  74, 59, (SELECT id FROM teams WHERE short_name = 'VSM')),
  ('2025-11-07 22:00:00', TRUE, 'Rivadavia',    63, 57, (SELECT id FROM teams WHERE short_name = 'VSM')),
  ('2025-11-11 21:30:00', TRUE,  'Fusion Riojana',      81, 72, (SELECT id FROM teams WHERE short_name = 'VSM')),
  ('2025-11-15 21:30:00', FALSE, 'Estudiantes (Tucuman)',        57, 64, (SELECT id FROM teams WHERE short_name = 'VSM')),
  ('2025-11-17 21:30:00', FALSE,  'Salta Basket',        80, 87, (SELECT id FROM teams WHERE short_name = 'VSM')),
  ('2025-11-19 21:30:00', FALSE, 'Jujuy Basquet',          85, 77, (SELECT id FROM teams WHERE short_name = 'VSM')),
  ('2025-11-26 21:30:00', TRUE,  'Sportivo Suardi',         63, 72, (SELECT id FROM teams WHERE short_name = 'VSM'));

-- Upcoming matches (fixture)
INSERT INTO matches (match_date, is_local, opponent, team_points, opponent_points, team_id) VALUES
  ('2026-11-28 22:00:00', TRUE,  'Hindu (Cordoba)',        0, 0, (SELECT id FROM teams WHERE short_name = 'VSM')),
  ('2026-12-02 22:00:00', TRUE, 'Amancay',         0, 0, (SELECT id FROM teams WHERE short_name = 'VSM')),
  ('2026-12-05 22:00:00', FALSE,  'Rivadavia',   0, 0, (SELECT id FROM teams WHERE short_name = 'VSM')),
  ('2026-12-07 21:00:00', FALSE, 'Huracan Las Heras',    0, 0, (SELECT id FROM teams WHERE short_name = 'VSM'));

-- Player stats (15 games played so far)
INSERT INTO players_stats (player_id, played_games, total_minutes, total_points, made_free_throws,attempted_free_throws, made_two_pointers,attempted_two_pointers, made_three_pointers,attempted_three_pointers, total_rebounds, total_assists, total_blocks, total_turnovers, total_steals, total_fouls, total_valoration) VALUES
  ((SELECT id FROM players WHERE name = 'Facundo'      AND surname = 'Gago'), 7, 229.22, 81, 16,23,16,38,11,34, 23,  28, 0,  16, 6, 12, 69),
  ((SELECT id FROM players WHERE name = 'Favio'       AND surname = 'Vieta'), 7, 200.35, 65,  17,23,15,38,6,28, 40,  16,  0,  15, 10, 12, 71),
  ((SELECT id FROM players WHERE name = 'Maximiliano'    AND surname = 'Martin'),    7, 187.4, 65,  13,16,8,18,12,38, 31,  7,  1,  17, 6, 13, 59),
  ((SELECT id FROM players WHERE name = 'Lautaro'     AND surname = 'Florito'),     7, 193.73, 79,  17,20,22,38,6,30, 32,  13,  0,  6, 5, 12, 86),
  ((SELECT id FROM players WHERE name = 'Estefano'       AND surname = 'Simondi'),  6, 180.88, 72,  18,24,15,27,8,24, 24, 14,  2, 7, 5, 9, 83),
  ((SELECT id FROM players WHERE name = 'Elian'       AND surname = 'Centeno'),     6, 133.23, 82, 12,27,33,48,1,3, 62, 2,  5, 7, 6, 13, 123),
  ((SELECT id FROM players WHERE name = 'Emir'     AND surname = 'Perez Barrios'),  7, 91.41, 11, 1,2,2,9,2,10, 8,  6,  1,  4, 3, 19, -7),
  ((SELECT id FROM players WHERE name = 'Agustin' AND surname = 'Camisasca'),       7, 38.73, 13, 0,0,2,4,3,10, 12,  1,  0,  0, 0, 4, 14),
  ((SELECT id FROM players WHERE name = 'Gael'     AND surname = 'Carrasco'),   0, 0.0, 0, 0,0,0,0,0,0, 0,  0,  0,  0, 0, 0, 0),
  ((SELECT id FROM players WHERE name = 'Valentino'    AND surname = 'Barua'),   1, 8.5, 0, 0,0,0,0,0,0, 0, 0,  0, 0, 0, 1, -1),
  ((SELECT id FROM players WHERE name = 'Romulo'   AND surname = 'Gusmao'),         7, 98.17, 34, 3,6,16,30,0,1, 24,  2,   3, 4, 3,  14, 38),
  ((SELECT id FROM players WHERE name = 'Santiago'     AND surname = 'Rath'),       3, 8.93, 0, 0,0,0,0,0,0, 2,  0,  0, 0, 0, 1, 0);
