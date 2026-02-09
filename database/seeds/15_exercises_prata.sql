-- Seed: Exercises for Prata Plan
SET NAMES utf8mb4;
-- 15 exercícios exclusivos do plano Prata

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Flexibilidade' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1),
  'Yoga Terapêutica Avançada (Prata)',
  'Sessão completa de yoga terapêutica para alívio profundo de dores',
  'medium',
  (SELECT id FROM plans WHERE level = 'prata' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Yoga Terapêutica Avançada (Prata)' AND plan_id = (SELECT id FROM plans WHERE level = 'prata' LIMIT 1));

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Força' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1),
  'Pilates Terapêutico (Prata)',
  'Sessão de pilates focada em reabilitação e fortalecimento',
  'medium',
  (SELECT id FROM plans WHERE level = 'prata' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Pilates Terapêutico (Prata)' AND plan_id = (SELECT id FROM plans WHERE level = 'prata' LIMIT 1));

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Relaxamento' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1),
  'Meditação Guiada para Dor (Prata)',
  'Técnicas de meditação específicas para alívio de dores',
  'easy',
  (SELECT id FROM plans WHERE level = 'prata' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Meditação Guiada para Dor (Prata)' AND plan_id = (SELECT id FROM plans WHERE level = 'prata' LIMIT 1));

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Flexibilidade' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1),
  'Alongamento Profundo (Prata)',
  'Sequência avançada de alongamentos terapêuticos',
  'medium',
  (SELECT id FROM plans WHERE level = 'prata' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Alongamento Profundo (Prata)' AND plan_id = (SELECT id FROM plans WHERE level = 'prata' LIMIT 1));

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Força' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1),
  'Treino Funcional Adaptado (Prata)',
  'Exercícios funcionais adaptados para recuperação',
  'medium',
  (SELECT id FROM plans WHERE level = 'prata' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Treino Funcional Adaptado (Prata)' AND plan_id = (SELECT id FROM plans WHERE level = 'prata' LIMIT 1));

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Cardio' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Inchada' LIMIT 1),
  'Treino Cardio Intervalado (Prata)',
  'Programa de cardio intervalado para melhor circulação e redução de inchaço',
  'medium',
  (SELECT id FROM plans WHERE level = 'prata' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Treino Cardio Intervalado (Prata)' AND plan_id = (SELECT id FROM plans WHERE level = 'prata' LIMIT 1));

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Flexibilidade' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Inchada' LIMIT 1),
  'Yoga para Circulação (Prata)',
  'Posturas de yoga focadas em melhorar circulação',
  'medium',
  (SELECT id FROM plans WHERE level = 'prata' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Yoga para Circulação (Prata)' AND plan_id = (SELECT id FROM plans WHERE level = 'prata' LIMIT 1));

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Cardio' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Inchada' LIMIT 1),
  'Caminhada com Elevação (Prata)',
  'Caminhada com variações de elevação para melhor circulação',
  'medium',
  (SELECT id FROM plans WHERE level = 'prata' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Caminhada com Elevação (Prata)' AND plan_id = (SELECT id FROM plans WHERE level = 'prata' LIMIT 1));

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Flexibilidade' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Inchada' LIMIT 1),
  'Exercícios de Mobilidade Avançada (Prata)',
  'Rotina avançada de mobilidade articular',
  'medium',
  (SELECT id FROM plans WHERE level = 'prata' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Exercícios de Mobilidade Avançada (Prata)' AND plan_id = (SELECT id FROM plans WHERE level = 'prata' LIMIT 1));

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Relaxamento' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Inchada' LIMIT 1),
  'Técnicas de Respiração Avançada (Prata)',
  'Exercícios respiratórios para redução de inchaço',
  'easy',
  (SELECT id FROM plans WHERE level = 'prata' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Técnicas de Respiração Avançada (Prata)' AND plan_id = (SELECT id FROM plans WHERE level = 'prata' LIMIT 1));

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Força' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1),
  'Treino de Força Intermediário (Prata)',
  'Rotina de força intermediária para desenvolvimento muscular',
  'medium',
  (SELECT id FROM plans WHERE level = 'prata' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Treino de Força Intermediário (Prata)' AND plan_id = (SELECT id FROM plans WHERE level = 'prata' LIMIT 1));

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Cardio' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1),
  'Treino HIIT Básico (Prata)',
  'Treino intervalado de alta intensidade básico',
  'hard',
  (SELECT id FROM plans WHERE level = 'prata' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Treino HIIT Básico (Prata)' AND plan_id = (SELECT id FROM plans WHERE level = 'prata' LIMIT 1));

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Força' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1),
  'Treino Funcional Completo (Prata)',
  'Rotina completa de exercícios funcionais',
  'medium',
  (SELECT id FROM plans WHERE level = 'prata' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Treino Funcional Completo (Prata)' AND plan_id = (SELECT id FROM plans WHERE level = 'prata' LIMIT 1));

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Cardio' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1),
  'Corrida Moderada (Prata)',
  'Programa de corrida para condicionamento',
  'medium',
  (SELECT id FROM plans WHERE level = 'prata' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Corrida Moderada (Prata)' AND plan_id = (SELECT id FROM plans WHERE level = 'prata' LIMIT 1));

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Flexibilidade' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1),
  'Yoga Dinâmica (Prata)',
  'Sessão de yoga dinâmica para flexibilidade e força',
  'medium',
  (SELECT id FROM plans WHERE level = 'prata' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Yoga Dinâmica (Prata)' AND plan_id = (SELECT id FROM plans WHERE level = 'prata' LIMIT 1));

