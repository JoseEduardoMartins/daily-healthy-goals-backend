-- Seed: Products for Prata Plan
SET NAMES utf8mb4;
-- 15 produtos exclusivos do plano Prata

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Bebidas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1),
  'Smoothie Premium Anti-inflamatório (Prata)',
  'Bebida super nutritiva com ingredientes premium',
  'Desayuno',
  'Rico em antioxidantes, anti-inflamatórios naturais, probióticos e enzimas digestivas',
  'Bater: 1 xícara de mirtilos, 1/2 xícara de framboesas, 1 colher de açafrão, 1 colher de sementes de chia, 200ml de leite de coco, 1 colher de proteína em pó e 1 colher de mel.',
  (SELECT id FROM plans WHERE level = 'prata' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Smoothie Premium Anti-inflamatório (Prata)' AND plan_id = (SELECT id FROM plans WHERE level = 'prata' LIMIT 1));

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Comidas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1),
  'Risotto de Cogumelos e Espinafre (Prata)',
  'Refeição gourmet rica em nutrientes anti-inflamatórios',
  'Cena',
  'Rico em selênio, vitamina D, antioxidantes e propriedades anti-inflamatórias',
  'Refogar arroz arbóreo com cebola. Adicionar caldo de legumes quente aos poucos. Finalizar com cogumelos salteados, espinafre e queijo parmesão.',
  (SELECT id FROM plans WHERE level = 'prata' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Risotto de Cogumelos e Espinafre (Prata)' AND plan_id = (SELECT id FROM plans WHERE level = 'prata' LIMIT 1));

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Bebidas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1),
  'Chá de Açafrão Premium (Prata)',
  'Chá especializado em redução de inflamações',
  'Tarde',
  'Potente anti-inflamatório, rico em curcumina',
  'Infusão de 2 colheres de açafrão em pó, gengibre e canela em 300ml de água quente por 15 minutos.',
  (SELECT id FROM plans WHERE level = 'prata' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Chá de Açafrão Premium (Prata)' AND plan_id = (SELECT id FROM plans WHERE level = 'prata' LIMIT 1));

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Proteínas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1),
  'Salmão com Quinoa e Legumes (Prata)',
  'Refeição completa rica em ômega-3',
  'Cena',
  'Alto teor de ômega-3, proteína completa, anti-inflamatório',
  'Grelhar salmão. Cozinhar quinoa. Assar legumes. Servir com molho de ervas.',
  (SELECT id FROM plans WHERE level = 'prata' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Salmão com Quinoa e Legumes (Prata)' AND plan_id = (SELECT id FROM plans WHERE level = 'prata' LIMIT 1));

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Comidas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1),
  'Sopa de Lentilha Premium (Prata)',
  'Sopa nutritiva e anti-inflamatória',
  'Almuerzo',
  'Rica em proteínas, fibras e propriedades anti-inflamatórias',
  'Cozinhar lentilhas com legumes e especiarias. Bater parcialmente e servir.',
  (SELECT id FROM plans WHERE level = 'prata' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Sopa de Lentilha Premium (Prata)' AND plan_id = (SELECT id FROM plans WHERE level = 'prata' LIMIT 1));

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Bebidas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Inchada' LIMIT 1),
  'Chá Detox Premium de Dente-de-Leão (Prata)',
  'Chá especializado em desintoxicação e redução de inchaço',
  'Tarde',
  'Potente diurético natural, elimina toxinas, melhora função renal e hepática',
  'Infusão de 2 colheres de dente-de-leão seco em 300ml de água quente por 15 minutos. Adicionar limão e mel.',
  (SELECT id FROM plans WHERE level = 'prata' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Chá Detox Premium de Dente-de-Leão (Prata)' AND plan_id = (SELECT id FROM plans WHERE level = 'prata' LIMIT 1));

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Bebidas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Inchada' LIMIT 1),
  'Água Detox Completa (Prata)',
  'Bebida detoxificante completa',
  'Manhã',
  'Elimina toxinas, reduz inchaço, melhora digestão',
  'Água com limão, pepino, gengibre, hortelã e chlorella. Infusão por 4 horas.',
  (SELECT id FROM plans WHERE level = 'prata' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Água Detox Completa (Prata)' AND plan_id = (SELECT id FROM plans WHERE level = 'prata' LIMIT 1));

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Comidas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Inchada' LIMIT 1),
  'Salada Detox Premium (Prata)',
  'Salada rica em ingredientes diuréticos',
  'Almuerzo',
  'Ajuda na eliminação de líquidos, rica em fibras',
  'Misturar rúcula, espinafre, pepino, aipo, abacate e sementes. Temperar com azeite e limão.',
  (SELECT id FROM plans WHERE level = 'prata' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Salada Detox Premium (Prata)' AND plan_id = (SELECT id FROM plans WHERE level = 'prata' LIMIT 1));

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Comidas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Inchada' LIMIT 1),
  'Sopa de Abóbora e Gengibre (Prata)',
  'Sopa detoxificante e nutritiva',
  'Cena',
  'Reduz inchaço, rica em nutrientes',
  'Cozinhar abóbora com gengibre. Bater e temperar com especiarias.',
  (SELECT id FROM plans WHERE level = 'prata' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Sopa de Abóbora e Gengibre (Prata)' AND plan_id = (SELECT id FROM plans WHERE level = 'prata' LIMIT 1));

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Frutas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Inchada' LIMIT 1),
  'Smoothie Detox Premium (Prata)',
  'Bebida detoxificante completa',
  'Manhã',
  'Elimina toxinas, rica em antioxidantes',
  'Bater: abacaxi, pepino, hortelã, gengibre e água de coco.',
  (SELECT id FROM plans WHERE level = 'prata' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Smoothie Detox Premium (Prata)' AND plan_id = (SELECT id FROM plans WHERE level = 'prata' LIMIT 1));

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Proteínas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1),
  'Salmão com Quinoa e Legumes Assados (Prata)',
  'Refeição premium rica em nutrientes essenciais',
  'Cena',
  'Alto teor de ômega-3, proteína completa, carboidratos complexos e fibras',
  'Grelhar salmão temperado. Cozinhar quinoa. Assar mix de legumes (abobrinha, berinjela, pimentão). Servir tudo junto com molho de ervas.',
  (SELECT id FROM plans WHERE level = 'prata' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Salmão com Quinoa e Legumes Assados (Prata)' AND plan_id = (SELECT id FROM plans WHERE level = 'prata' LIMIT 1));

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Proteínas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1),
  'Frango Grelhado com Batata Doce (Prata)',
  'Refeição balanceada e nutritiva',
  'Cena',
  'Rica em proteínas, carboidratos complexos e fibras',
  'Grelhar peito de frango. Assar batata-doce. Servir com legumes grelhados.',
  (SELECT id FROM plans WHERE level = 'prata' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Frango Grelhado com Batata Doce (Prata)' AND plan_id = (SELECT id FROM plans WHERE level = 'prata' LIMIT 1));

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Comidas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1),
  'Bowl Nutritivo Completo (Prata)',
  'Refeição completa e balanceada',
  'Almuerzo',
  'Rica em todos os macronutrientes essenciais',
  'Montar bowl com quinoa, frango, abacate, legumes, sementes e molho especial.',
  (SELECT id FROM plans WHERE level = 'prata' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Bowl Nutritivo Completo (Prata)' AND plan_id = (SELECT id FROM plans WHERE level = 'prata' LIMIT 1));

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Bebidas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1),
  'Smoothie Energético Premium (Prata)',
  'Bebida rica em nutrientes e energia',
  'Desayuno',
  'Fornece energia sustentada, rica em vitaminas',
  'Bater: banana, aveia, proteína, leite de amêndoas, mel e sementes.',
  (SELECT id FROM plans WHERE level = 'prata' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Smoothie Energético Premium (Prata)' AND plan_id = (SELECT id FROM plans WHERE level = 'prata' LIMIT 1));

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep, plan_id)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Frutas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1),
  'Salada de Frutas Premium (Prata)',
  'Seleção premium de frutas',
  'Tarde',
  'Rica em vitaminas, minerais e antioxidantes',
  'Cortar e servir: frutas exóticas, berries, melão e granola.',
  (SELECT id FROM plans WHERE level = 'prata' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Salada de Frutas Premium (Prata)' AND plan_id = (SELECT id FROM plans WHERE level = 'prata' LIMIT 1));

