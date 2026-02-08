-- Seed: Exercises for Ouro Plan
-- 15 exercícios exclusivos do plano Ouro

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Flexibilidade' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1),
  'Programa Premium de Recuperação Completa (Ouro)',
  'Sistema completo de recuperação com yoga, pilates e técnicas avançadas',
  'hard',
  (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Programa Premium de Recuperação Completa (Ouro)' AND plan_id = (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1));

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Força' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1),
  'Treino Funcional Avançado Personalizado (Ouro)',
  'Treino funcional avançado adaptado para recuperação e fortalecimento',
  'hard',
  (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Treino Funcional Avançado Personalizado (Ouro)' AND plan_id = (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1));

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Relaxamento' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1),
  'Programa de Meditação Avançada (Ouro)',
  'Sistema completo de meditação e mindfulness para recuperação',
  'medium',
  (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Programa de Meditação Avançada (Ouro)' AND plan_id = (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1));

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Flexibilidade' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1),
  'Yoga Terapêutica Master (Ouro)',
  'Sessão avançada de yoga terapêutica com técnicas exclusivas',
  'hard',
  (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Yoga Terapêutica Master (Ouro)' AND plan_id = (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1));

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Força' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1),
  'Pilates Avançado Personalizado (Ouro)',
  'Sessão avançada de pilates com equipamentos e técnicas exclusivas',
  'hard',
  (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Pilates Avançado Personalizado (Ouro)' AND plan_id = (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1));

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Cardio' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Inchada' LIMIT 1),
  'Programa Cardio Premium Completo (Ouro)',
  'Sistema completo de cardio para circulação e redução de inchaço',
  'hard',
  (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Programa Cardio Premium Completo (Ouro)' AND plan_id = (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1));

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Flexibilidade' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Inchada' LIMIT 1),
  'Yoga para Circulação Avançada (Ouro)',
  'Sessão avançada de yoga focada em circulação e redução de inchaço',
  'hard',
  (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Yoga para Circulação Avançada (Ouro)' AND plan_id = (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1));

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Cardio' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Inchada' LIMIT 1),
  'Treino HIIT para Circulação (Ouro)',
  'Treino intervalado avançado para melhor circulação',
  'hard',
  (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Treino HIIT para Circulação (Ouro)' AND plan_id = (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1));

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Flexibilidade' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Inchada' LIMIT 1),
  'Programa de Mobilidade Master (Ouro)',
  'Sistema completo de mobilidade articular avançada',
  'hard',
  (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Programa de Mobilidade Master (Ouro)' AND plan_id = (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1));

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Relaxamento' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Inchada' LIMIT 1),
  'Técnicas Avançadas de Respiração (Ouro)',
  'Sistema completo de técnicas respiratórias avançadas',
  'medium',
  (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Técnicas Avançadas de Respiração (Ouro)' AND plan_id = (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1));

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Força' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1),
  'Programa de Força Avançado Premium (Ouro)',
  'Rotina completa de força avançada para performance máxima',
  'hard',
  (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Programa de Força Avançado Premium (Ouro)' AND plan_id = (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1));

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Cardio' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1),
  'Treino HIIT Avançado (Ouro)',
  'Treino intervalado de alta intensidade avançado',
  'hard',
  (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Treino HIIT Avançado (Ouro)' AND plan_id = (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1));

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Força' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1),
  'Treino Funcional Master (Ouro)',
  'Sistema completo de exercícios funcionais avançados',
  'hard',
  (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Treino Funcional Master (Ouro)' AND plan_id = (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1));

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Cardio' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1),
  'Programa de Corrida Avançado (Ouro)',
  'Sistema completo de corrida para performance máxima',
  'hard',
  (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Programa de Corrida Avançado (Ouro)' AND plan_id = (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1));

INSERT INTO exercise (id, category_id, pain_state_id, name, description, difficulty, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Flexibilidade' AND type = 'exercise' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1),
  'Yoga Dinâmica Avançada (Ouro)',
  'Sessão avançada de yoga dinâmica para flexibilidade e força máxima',
  'hard',
  (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM exercise WHERE name = 'Yoga Dinâmica Avançada (Ouro)' AND plan_id = (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1));

