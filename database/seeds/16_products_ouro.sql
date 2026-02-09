-- Seed: Products for Ouro Plan
SET NAMES utf8mb4;
-- 15 produtos exclusivos do plano Ouro

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Bebidas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1),
  'Elixir Premium Anti-inflamatório (Ouro)',
  'Bebida exclusiva com superalimentos e adaptógenos',
  'Manhã',
  'Combinação exclusiva de adaptógenos, superalimentos, probióticos e enzimas para máxima recuperação',
  'Misturar: 1 colher de açafrão, 1 colher de ashwagandha, 1 colher de maca, 1 colher de colágeno, 200ml de leite de coco, 1 colher de mel de manuka e 1 colher de óleo de coco. Bater e servir.',
  (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Elixir Premium Anti-inflamatório (Ouro)' AND plan_id = (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1));

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Comidas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1),
  'Menu Gourmet Anti-inflamatório Completo (Ouro)',
  'Refeição completa e sofisticada para recuperação máxima',
  'Cena',
  'Combinação perfeita de nutrientes anti-inflamatórios, proteínas de alta qualidade, gorduras saudáveis e carboidratos complexos',
  'Salmão grelhado com ervas, quinoa com cogumelos, salada de folhas verdes com abacate, molho de tahine e limão, acompanhado de batata-doce assada.',
  (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Menu Gourmet Anti-inflamatório Completo (Ouro)' AND plan_id = (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1));

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Bebidas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1),
  'Chá de Adaptógenos Premium (Ouro)',
  'Chá exclusivo com adaptógenos para recuperação',
  'Tarde',
  'Combinação de adaptógenos para redução de inflamações e estresse',
  'Infusão de ashwagandha, rhodiola, ginseng e açafrão em água quente por 20 minutos.',
  (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Chá de Adaptógenos Premium (Ouro)' AND plan_id = (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1));

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Proteínas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1),
  'Salmão Selvagem com Superalimentos (Ouro)',
  'Refeição premium com ingredientes exclusivos',
  'Cena',
  'Rico em ômega-3, proteínas de alta qualidade e superalimentos',
  'Grelhar salmão selvagem. Servir com quinoa, espinafre, abacate, sementes de chia e molho especial.',
  (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Salmão Selvagem com Superalimentos (Ouro)' AND plan_id = (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1));

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Comidas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1),
  'Risotto de Cogumelos Medicinais (Ouro)',
  'Risotto gourmet com cogumelos medicinais',
  'Cena',
  'Rico em propriedades medicinais, selênio e antioxidantes',
  'Preparar risotto com cogumelos shiitake, reishi e maitake. Finalizar com queijo parmesão e trufas.',
  (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Risotto de Cogumelos Medicinais (Ouro)' AND plan_id = (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1));

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Bebidas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Inchada' LIMIT 1),
  'Programa Detox Premium Completo (Ouro)',
  'Sistema completo de desintoxicação e redução de inchaço',
  'Manhã',
  'Combinação exclusiva de ingredientes detox, probióticos, enzimas digestivas e minerais essenciais',
  'Água com limão, pepino, gengibre, hortelã, dente-de-leão, chlorella e spirulina. Deixar em infusão por 4 horas. Beber ao longo do dia.',
  (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Programa Detox Premium Completo (Ouro)' AND plan_id = (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1));

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Bebidas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Inchada' LIMIT 1),
  'Chá Detox Master (Ouro)',
  'Chá detoxificante premium com ingredientes exclusivos',
  'Tarde',
  'Potente desintoxicante, melhora função hepática e renal',
  'Infusão de dente-de-leão, cardo mariano, boldo e gengibre por 20 minutos.',
  (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Chá Detox Master (Ouro)' AND plan_id = (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1));

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Comidas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Inchada' LIMIT 1),
  'Menu Detox Gourmet (Ouro)',
  'Refeição completa detoxificante',
  'Almuerzo',
  'Combinação perfeita de ingredientes detox e nutrientes',
  'Salada gourmet com ingredientes orgânicos, sopa detox, smoothie verde e suplementos.',
  (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Menu Detox Gourmet (Ouro)' AND plan_id = (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1));

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Comidas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Inchada' LIMIT 1),
  'Sopa Detox Premium (Ouro)',
  'Sopa detoxificante com superalimentos',
  'Cena',
  'Elimina toxinas, rica em nutrientes e fibras',
  'Cozinhar legumes orgânicos com especiarias detox. Adicionar chlorella e spirulina.',
  (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Sopa Detox Premium (Ouro)' AND plan_id = (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1));

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Frutas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Inchada' LIMIT 1),
  'Smoothie Detox Master (Ouro)',
  'Bebida detoxificante completa e premium',
  'Manhã',
  'Elimina toxinas, rica em antioxidantes e enzimas',
  'Bater: abacaxi, pepino, hortelã, gengibre, chlorella, spirulina e água de coco.',
  (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Smoothie Detox Master (Ouro)' AND plan_id = (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1));

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Proteínas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1),
  'Menu Executivo Premium Completo (Ouro)',
  'Refeição gourmet completa para performance e saúde máxima',
  'Cena',
  'Nutrição completa e balanceada com ingredientes premium, proteínas de alta qualidade, superalimentos e adaptógenos',
  'Salmão selvagem grelhado, quinoa com legumes orgânicos, salada gourmet com abacate, nozes e sementes, molho especial de ervas, acompanhado de batata-doce roxa assada e brócolis orgânico.',
  (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Menu Executivo Premium Completo (Ouro)' AND plan_id = (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1));

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Proteínas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1),
  'Frango Orgânico com Superalimentos (Ouro)',
  'Refeição premium com ingredientes orgânicos',
  'Cena',
  'Rica em proteínas de alta qualidade e superalimentos',
  'Grelhar frango orgânico. Servir com quinoa, legumes orgânicos, abacate e sementes.',
  (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Frango Orgânico com Superalimentos (Ouro)' AND plan_id = (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1));

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Comidas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1),
  'Bowl Gourmet Premium (Ouro)',
  'Refeição completa e sofisticada',
  'Almuerzo',
  'Combinação perfeita de todos os nutrientes essenciais',
  'Montar bowl com ingredientes premium: quinoa, salmão, abacate, legumes orgânicos, sementes e molho especial.',
  (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Bowl Gourmet Premium (Ouro)' AND plan_id = (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1));

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Bebidas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1),
  'Smoothie Energético Master (Ouro)',
  'Bebida premium rica em nutrientes e energia',
  'Desayuno',
  'Fornece energia máxima, rica em superalimentos',
  'Bater: banana, aveia, proteína premium, leite de coco, mel de manuka, maca e sementes.',
  (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Smoothie Energético Master (Ouro)' AND plan_id = (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1));

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Frutas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1),
  'Salada de Frutas Exóticas Premium (Ouro)',
  'Seleção exclusiva de frutas exóticas',
  'Tarde',
  'Rica em vitaminas, minerais e antioxidantes premium',
  'Cortar e servir: frutas exóticas, berries orgânicas, granola premium e mel de manuka.',
  (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Salada de Frutas Exóticas Premium (Ouro)' AND plan_id = (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1));

