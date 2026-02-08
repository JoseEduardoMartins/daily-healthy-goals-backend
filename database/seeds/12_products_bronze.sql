-- Seed: Products for Bronze Plan
-- 8 produtos exclusivos do plano Bronze
-- Distribuídos entre os 3 estados de dor

-- ============================================
-- PRODUTOS BRONZE - COM DOR (3 produtos)
-- ============================================

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Bebidas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1),
  'Chá de Cúrcuma e Gengibre (Bronze)',
  'Bebida anti-inflamatória premium para alívio de dores',
  'Manhã',
  'Potente anti-inflamatório natural, alivia dores articulares e musculares',
  'Ferver 1 colher de cúrcuma em pó e 2 fatias de gengibre em 300ml de água por 15 minutos. Adicionar pimenta preta e mel.',
  (SELECT id FROM plans WHERE level = 'bronze' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Chá de Cúrcuma e Gengibre (Bronze)' AND plan_id = (SELECT id FROM plans WHERE level = 'bronze' LIMIT 1));

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Comidas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1),
  'Salmão Grelhado com Vegetais (Bronze)',
  'Refeição rica em ômega-3 para redução de inflamações',
  'Cena',
  'Alto teor de ômega-3, proteína de alta qualidade, anti-inflamatório natural',
  'Grelhar filé de salmão temperado com ervas. Servir com brócolis e batata-doce assados.',
  (SELECT id FROM plans WHERE level = 'bronze' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Salmão Grelhado com Vegetais (Bronze)' AND plan_id = (SELECT id FROM plans WHERE level = 'bronze' LIMIT 1));

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Bebidas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1),
  'Smoothie Anti-inflamatório Premium (Bronze)',
  'Bebida rica em antioxidantes e propriedades anti-inflamatórias',
  'Desayuno',
  'Reduz inflamações, fornece energia e melhora recuperação',
  'Bater no liquidificador: 1 xícara de mirtilos, 1 banana, 1 colher de chia, 200ml de leite de amêndoas e 1 colher de mel.',
  (SELECT id FROM plans WHERE level = 'bronze' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Smoothie Anti-inflamatório Premium (Bronze)' AND plan_id = (SELECT id FROM plans WHERE level = 'bronze' LIMIT 1));

-- ============================================
-- PRODUTOS BRONZE - INCHADA (2 produtos)
-- ============================================

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Bebidas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Inchada' LIMIT 1),
  'Água Detox com Pepino e Hortelã (Bronze)',
  'Bebida detoxificante premium para redução de inchaço',
  'Manhã',
  'Elimina toxinas, reduz retenção de líquidos, melhora digestão',
  'Cortar pepino e hortelã em fatias. Deixar em infusão em 1 litro de água por 2 horas na geladeira.',
  (SELECT id FROM plans WHERE level = 'bronze' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Água Detox com Pepino e Hortelã (Bronze)' AND plan_id = (SELECT id FROM plans WHERE level = 'bronze' LIMIT 1));

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Comidas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Inchada' LIMIT 1),
  'Sopa Detox de Legumes (Bronze)',
  'Sopa nutritiva com propriedades diuréticas',
  'Almuerzo',
  'Ajuda na eliminação de líquidos, rica em fibras e nutrientes',
  'Cozinhar abobrinha, pepino, aipo e cebola em caldo de legumes. Bater e temperar com ervas.',
  (SELECT id FROM plans WHERE level = 'bronze' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Sopa Detox de Legumes (Bronze)' AND plan_id = (SELECT id FROM plans WHERE level = 'bronze' LIMIT 1));

-- ============================================
-- PRODUTOS BRONZE - NORMAL (3 produtos)
-- ============================================

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Proteínas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1),
  'Bowl de Quinoa com Frango e Abacate (Bronze)',
  'Refeição completa e nutritiva para manutenção da saúde',
  'Almuerzo',
  'Rica em proteínas, carboidratos complexos, gorduras saudáveis e fibras',
  'Cozinhar quinoa. Grelhar peito de frango cortado em tiras. Montar bowl com quinoa, frango, abacate, tomate e folhas verdes.',
  (SELECT id FROM plans WHERE level = 'bronze' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Bowl de Quinoa com Frango e Abacate (Bronze)' AND plan_id = (SELECT id FROM plans WHERE level = 'bronze' LIMIT 1));

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Proteínas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1),
  'Omelete de Claras com Vegetais (Bronze)',
  'Refeição rica em proteínas e baixa em calorias',
  'Desayuno',
  'Alto teor proteico, rica em vitaminas e minerais',
  'Bater 4 claras com temperos. Refogar vegetais (pimentão, cebola, espinafre). Fazer omelete e servir.',
  (SELECT id FROM plans WHERE level = 'bronze' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Omelete de Claras com Vegetais (Bronze)' AND plan_id = (SELECT id FROM plans WHERE level = 'bronze' LIMIT 1));

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Frutas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1),
  'Smoothie Proteico (Bronze)',
  'Bebida rica em proteínas e nutrientes',
  'Tarde',
  'Fornece proteínas, vitaminas e energia sustentada',
  'Bater: 1 banana, 1 xícara de morangos, 1 colher de proteína em pó, 200ml de leite de amêndoas e 1 colher de mel.',
  (SELECT id FROM plans WHERE level = 'bronze' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Smoothie Proteico (Bronze)' AND plan_id = (SELECT id FROM plans WHERE level = 'bronze' LIMIT 1));
