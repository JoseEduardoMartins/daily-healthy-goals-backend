-- Seed: Products for Visitante (Públicos)
-- 8 produtos públicos (acessíveis por todos)
-- Distribuídos entre os 3 estados de dor

-- ============================================
-- PRODUTOS PÚBLICOS - COM DOR (3 produtos)
-- ============================================

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Bebidas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1),
  'Chá de Camomila',
  'Chá calmante e anti-inflamatório natural',
  'Manhã',
  'Reduz inflamações, alivia dores musculares e promove relaxamento',
  'Infusão de 1 colher de sopa de camomila seca em 200ml de água quente por 5 minutos. Coar e beber morno.',
  NULL
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Chá de Camomila' AND plan_id IS NULL);

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Bebidas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1),
  'Chá de Gengibre',
  'Bebida anti-inflamatória e analgésica natural',
  'Tarde',
  'Alivia dores articulares, reduz inflamações e melhora circulação',
  'Ferver 3 fatias de gengibre fresco em 300ml de água por 10 minutos. Adicionar mel a gosto.',
  NULL
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Chá de Gengibre' AND plan_id IS NULL);

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Comidas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1),
  'Sopa de Abóbora',
  'Sopa cremosa e nutritiva, fácil de digerir',
  'Almuerzo',
  'Rica em vitamina A, anti-inflamatória e hidratante',
  'Cozinhar 500g de abóbora cortada em cubos com 1 litro de caldo de legumes até amolecer. Bater no liquidificador e temperar.',
  NULL
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Sopa de Abóbora' AND plan_id IS NULL);

-- ============================================
-- PRODUTOS PÚBLICOS - INCHADA (2 produtos)
-- ============================================

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Bebidas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Inchada' LIMIT 1),
  'Chá Diurético de Cavalinha',
  'Chá natural com propriedades diuréticas',
  'Manhã',
  'Ajuda a eliminar líquidos retidos, reduz inchaço e melhora circulação',
  'Infusão de 1 colher de sopa de cavalinha seca em 250ml de água quente por 10 minutos. Coar e beber.',
  NULL
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Chá Diurético de Cavalinha' AND plan_id IS NULL);

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Bebidas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Inchada' LIMIT 1),
  'Água com Limão',
  'Bebida simples e eficaz para reduzir retenção de líquidos',
  'Manhã',
  'Ajuda na eliminação de toxinas e redução de inchaço',
  'Espremer meio limão em 300ml de água morna. Beber em jejum.',
  NULL
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Água com Limão' AND plan_id IS NULL);

-- ============================================
-- PRODUTOS PÚBLICOS - NORMAL (3 produtos)
-- ============================================

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Proteínas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1),
  'Peito de Frango Grelhado',
  'Fonte de proteína magra e nutritiva',
  'Cena',
  'Alto valor proteico, rico em aminoácidos essenciais',
  'Grelhar peito de frango temperado com ervas. Servir com legumes grelhados.',
  NULL
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Peito de Frango Grelhado' AND plan_id IS NULL);

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Frutas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1),
  'Frutas Variadas',
  'Seleção de frutas frescas',
  'Tarde',
  'Rica em vitaminas, minerais, fibras e antioxidantes',
  'Cortar e servir: maçã, pera, uvas, morangos e kiwi. Pode adicionar iogurte natural.',
  NULL
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Frutas Variadas' AND plan_id IS NULL);

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Vegetais' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1),
  'Salada de Folhas Verdes',
  'Salada rica em nutrientes',
  'Almuerzo',
  'Rica em fibras, vitaminas e minerais essenciais',
  'Misturar alface, espinafre, rúcula. Adicionar tomate, pepino e temperar com azeite e limão.',
  NULL
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Salada de Folhas Verdes' AND plan_id IS NULL);
