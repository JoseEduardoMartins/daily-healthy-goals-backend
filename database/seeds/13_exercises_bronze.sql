-- Seed: Exercises for Bronze Plan
-- 7 exercícios exclusivos do plano Bronze
-- Distribuídos entre os 3 estados de dor

-- ============================================
-- EXERCÍCIOS BRONZE - COM DOR (3 exercícios)
-- ============================================

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Flexibilidade' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1),
  'Sequência de Alongamento Avançado (Bronze)',
  'Rotina completa de alongamento para alívio de dores',
  'easy',
  (SELECT id FROM plans WHERE level = 'bronze' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Sequência de Alongamento Avançado (Bronze)' AND plan_id = (SELECT id FROM plans WHERE level = 'bronze' LIMIT 1));

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Relaxamento' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1),
  'Yoga Terapêutica Básica (Bronze)',
  'Posturas de yoga suaves para relaxamento e alívio de dores',
  'easy',
  (SELECT id FROM plans WHERE level = 'bronze' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Yoga Terapêutica Básica (Bronze)' AND plan_id = (SELECT id FROM plans WHERE level = 'bronze' LIMIT 1));

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Força' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1),
  'Treino Funcional Leve (Bronze)',
  'Exercícios funcionais adaptados para pessoas com dores',
  'easy',
  (SELECT id FROM plans WHERE level = 'bronze' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Treino Funcional Leve (Bronze)' AND plan_id = (SELECT id FROM plans WHERE level = 'bronze' LIMIT 1));

-- ============================================
-- EXERCÍCIOS BRONZE - INCHADA (2 exercícios)
-- ============================================

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Cardio' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Inchada' LIMIT 1),
  'Caminhada Terapêutica Guiada (Bronze)',
  'Programa de caminhada estruturado para redução de inchaço',
  'easy',
  (SELECT id FROM plans WHERE level = 'bronze' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Caminhada Terapêutica Guiada (Bronze)' AND plan_id = (SELECT id FROM plans WHERE level = 'bronze' LIMIT 1));

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Flexibilidade' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Inchada' LIMIT 1),
  'Exercícios de Mobilidade (Bronze)',
  'Rotina de mobilidade para melhorar circulação',
  'easy',
  (SELECT id FROM plans WHERE level = 'bronze' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Exercícios de Mobilidade (Bronze)' AND plan_id = (SELECT id FROM plans WHERE level = 'bronze' LIMIT 1));

-- ============================================
-- EXERCÍCIOS BRONZE - NORMAL (2 exercícios)
-- ============================================

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Força' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1),
  'Treino de Força Básico (Bronze)',
  'Rotina de força para iniciantes e manutenção',
  'medium',
  (SELECT id FROM plans WHERE level = 'bronze' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Treino de Força Básico (Bronze)' AND plan_id = (SELECT id FROM plans WHERE level = 'bronze' LIMIT 1));

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Cardio' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1),
  'Treino Cardio Básico (Bronze)',
  'Rotina de cardio para condicionamento básico',
  'medium',
  (SELECT id FROM plans WHERE level = 'bronze' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Treino Cardio Básico (Bronze)' AND plan_id = (SELECT id FROM plans WHERE level = 'bronze' LIMIT 1));
