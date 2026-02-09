-- Seed: Exercises for Visitante (Públicos)
-- 7 exercícios públicos (acessíveis por todos)
-- Distribuídos entre os 3 estados de dor
-- IMPORTANTE: Execute este arquivo com charset UTF-8: mysql --default-character-set=utf8mb4

SET NAMES utf8mb4;

-- ============================================
-- EXERCÍCIOS PÚBLICOS - COM DOR (3 exercícios)
-- ============================================

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Flexibilidade' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1),
  'Alongamento Suave de Pescoço',
  'Exercício de alongamento para aliviar tensão no pescoço e ombros',
  'easy',
  NULL
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Alongamento Suave de Pescoço' AND plan_id IS NULL);

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Relaxamento' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1),
  'Respiração Diafragmática',
  'Técnica de respiração profunda para relaxamento e alívio de dores',
  'easy',
  NULL
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Respiração Diafragmática' AND plan_id IS NULL);

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Flexibilidade' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1),
  'Alongamento de Costas',
  'Movimentos suaves para aliviar dores nas costas',
  'easy',
  NULL
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Alongamento de Costas' AND plan_id IS NULL);

-- ============================================
-- EXERCÍCIOS PÚBLICOS - INCHADA (2 exercícios)
-- ============================================

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Cardio' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Inchada' LIMIT 1),
  'Caminhada Leve',
  'Caminhada suave para melhorar circulação e reduzir inchaço',
  'easy',
  NULL
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Caminhada Leve' AND plan_id IS NULL);

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Flexibilidade' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Inchada' LIMIT 1),
  'Alongamento de Pernas',
  'Exercícios de alongamento para melhorar circulação nas pernas',
  'easy',
  NULL
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Alongamento de Pernas' AND plan_id IS NULL);

-- ============================================
-- EXERCÍCIOS PÚBLICOS - NORMAL (2 exercícios)
-- ============================================

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Cardio' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1),
  'Caminhada Moderada',
  'Caminhada para condicionamento cardiovascular básico',
  'medium',
  NULL
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Caminhada Moderada' AND plan_id IS NULL);

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Força' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1),
  'Exercícios Básicos de Força',
  'Rotina básica de força para iniciantes',
  'medium',
  NULL
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Exercícios Básicos de Força' AND plan_id IS NULL);
