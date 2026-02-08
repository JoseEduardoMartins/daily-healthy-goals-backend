-- Seed: Exercises
-- Exercícios para cada estado de dor

-- Exercícios para "Com Dor"
INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Flexibilidade' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1),
  'Alongamento Suave de Pescoço',
  'Exercício de alongamento para aliviar tensão no pescoço e ombros',
  'easy'
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Alongamento Suave de Pescoço' AND pain_state_id = (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1));

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Relaxamento' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1),
  'Respiração Diafragmática',
  'Técnica de respiração profunda para relaxamento e alívio de dores',
  'easy'
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Respiração Diafragmática' AND pain_state_id = (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1));

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Flexibilidade' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1),
  'Alongamento de Costas',
  'Movimentos suaves para aliviar dores nas costas',
  'easy'
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Alongamento de Costas' AND pain_state_id = (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1));

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Relaxamento' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1),
  'Yoga Restaurativa',
  'Posturas de yoga suaves para relaxamento e alívio de dores',
  'easy'
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Yoga Restaurativa' AND pain_state_id = (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1));

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Cardio' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1),
  'Caminhada Leve',
  'Caminhada em ritmo suave para melhorar circulação sem sobrecarregar',
  'easy'
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Caminhada Leve' AND pain_state_id = (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1));

-- Exercícios para "Inchada"
INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Cardio' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Inchada' LIMIT 1),
  'Caminhada Moderada',
  'Caminhada em ritmo moderado para melhorar circulação e reduzir inchaço',
  'easy'
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Caminhada Moderada' AND pain_state_id = (SELECT id FROM pain_states WHERE name = 'Inchada' LIMIT 1));

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Flexibilidade' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Inchada' LIMIT 1),
  'Elevação de Pernas',
  'Exercício para melhorar circulação e reduzir inchaço nas pernas',
  'easy'
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Elevação de Pernas' AND pain_state_id = (SELECT id FROM pain_states WHERE name = 'Inchada' LIMIT 1));

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Flexibilidade' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Inchada' LIMIT 1),
  'Alongamento de Pernas',
  'Alongamentos específicos para pernas e tornozelos',
  'easy'
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Alongamento de Pernas' AND pain_state_id = (SELECT id FROM pain_states WHERE name = 'Inchada' LIMIT 1));

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Cardio' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Inchada' LIMIT 1),
  'Exercícios Aquáticos Leves',
  'Movimentos na água para reduzir impacto e melhorar circulação',
  'easy'
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Exercícios Aquáticos Leves' AND pain_state_id = (SELECT id FROM pain_states WHERE name = 'Inchada' LIMIT 1));

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Flexibilidade' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Inchada' LIMIT 1),
  'Pilates Suave',
  'Exercícios de pilates focados em circulação e flexibilidade',
  'medium'
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Pilates Suave' AND pain_state_id = (SELECT id FROM pain_states WHERE name = 'Inchada' LIMIT 1));

-- Exercícios para "Normal"
INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Cardio' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1),
  'Corrida Leve',
  'Corrida em ritmo moderado para melhorar condicionamento cardiovascular',
  'medium'
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Corrida Leve' AND pain_state_id = (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1));

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Força' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1),
  'Treino de Força Completo',
  'Exercícios com pesos para fortalecimento muscular geral',
  'medium'
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Treino de Força Completo' AND pain_state_id = (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1));

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Cardio' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1),
  'HIIT (Treino Intervalado)',
  'Treino de alta intensidade com intervalos para queima de gordura',
  'hard'
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'HIIT (Treino Intervalado)' AND pain_state_id = (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1));

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Flexibilidade' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1),
  'Yoga Dinâmica',
  'Sequência de yoga mais dinâmica para flexibilidade e força',
  'medium'
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Yoga Dinâmica' AND pain_state_id = (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1));

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Força' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1),
  'Musculação Completa',
  'Treino de musculação para desenvolvimento muscular',
  'hard'
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Musculação Completa' AND pain_state_id = (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1));

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Cardio' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1),
  'Ciclismo',
  'Pedalada para condicionamento cardiovascular',
  'medium'
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Ciclismo' AND pain_state_id = (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1));

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Cardio' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1),
  'Natação',
  'Natação completa para condicionamento físico geral',
  'medium'
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Natação' AND pain_state_id = (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1));
