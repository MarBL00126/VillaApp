-- Seed staff data for Villa San Martín
-- team_id = 1 is assumed from V4/V8 seed (the club's main team)
-- If team_id 1 doesn't exist, use NULL (team_id is nullable)

INSERT INTO staff (team_id, name, role, bio, active) VALUES
  (1, 'Eduardo "Chiche" Japez',  'Entrenador',
   'Entrenador con mas de 30 años de experiencia.',
   true),

  (1, 'Hugo Camisasca', 'Asistente Técnico',
   'Asistente tecnico, campeon de la ABR.',
   true),
  (1, 'Gonzalo Flores', 'Asistente Técnico',
   'Asistente tecnico.',
   true),
  (1, 'Manuel Rios', 'Asistente Técnico',
   'Asistente tecnico.',
   true),

  (1, 'Imanol Escobar Leiras',     'Preparador Físico',
   'Preparador fisico. Desde 2023 con el plantel principal.',
   true),
  (1, 'Octavio Boschetti',     'Preparador Físico',
   'Preparador fisico. Experiencia en formativas.',
   true),

  (1, 'Sergio Ruberto',  'Jefe de Equipo',
   'Jefe de equipo. Supo ser DT de muchas selecciones chaqueñas formativas y de Mayores',
   true),

  (1, 'Pablo Castillo',       'Kinesiólogo',
   'Kinesiologo deportivo con vasta experiencia en deporte de alto rendimiento.',
   true),
  (1, 'Nicolas Crespin',       'Kinesiólogo',
   'Kinesiologo deportivo.',
   true),

  (1, 'Romina Bogado',     'Psicóloga Deportiva',
   'Psicologa deportiva con vasta experiencia en deporte de alto rendimiento y de formativas.',
   true),
  (1, 'Sofia Frangioli',     'Nutricionista',
   'Nutricionista deportiva.',
   true),

  (1, 'Enzo Nuñez',      'Utilero',
   'Utilero. Mas de 10 años de experiencia con el equipo.',
   true);
