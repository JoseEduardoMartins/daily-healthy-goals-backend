-- Seed: Products
-- Produtos (comidas e bebidas) para cada estado de dor

-- Nota: Este arquivo requer que pain_states e categories já tenham sido populados
-- Os IDs são gerados dinamicamente, então precisamos usar subqueries

-- Produtos para "Com Dor"
INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Bebidas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1),
  'Chá de Camomila',
  'Chá calmante e anti-inflamatório natural',
  'Manhã',
  'Reduz inflamações, alivia dores musculares e promove relaxamento',
  'Infusão de 1 colher de sopa de camomila seca em 200ml de água quente por 5 minutos. Coar e beber morno.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Chá de Camomila' AND pain_state_id = (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1));

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Bebidas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1),
  'Chá de Gengibre',
  'Bebida anti-inflamatória e analgésica natural',
  'Tarde',
  'Alivia dores articulares, reduz inflamações e melhora circulação',
  'Ferver 3 fatias de gengibre fresco em 300ml de água por 10 minutos. Adicionar mel a gosto.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Chá de Gengibre' AND pain_state_id = (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1));

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Bebidas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1),
  'Smoothie Anti-inflamatório',
  'Bebida rica em antioxidantes e propriedades anti-inflamatórias',
  'Desayuno',
  'Reduz inflamações, fornece energia e melhora recuperação',
  'Bater no liquidificador: 1 xícara de mirtilos, 1 banana, 1 colher de chia, 200ml de leite de amêndoas e 1 colher de mel.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Smoothie Anti-inflamatório' AND pain_state_id = (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1));

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Comidas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1),
  'Sopa de Abóbora',
  'Sopa cremosa e nutritiva, fácil de digerir',
  'Almuerzo',
  'Rica em vitamina A, anti-inflamatória e hidratante',
  'Cozinhar 500g de abóbora cortada em cubos com 1 litro de caldo de legumes até amolecer. Bater no liquidificador e temperar com sal, pimenta e azeite.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Sopa de Abóbora' AND pain_state_id = (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1));

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Vegetais' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1),
  'Salada de Folhas Verdes',
  'Salada rica em nutrientes e propriedades anti-inflamatórias',
  'Almuerzo',
  'Rica em magnésio, ajuda a reduzir dores e inflamações',
  'Misturar alface, espinafre, rúcula e agrião. Adicionar tomate cereja, pepino e temperar com azeite, limão e sal.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Salada de Folhas Verdes' AND pain_state_id = (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1));

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Comidas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1),
  'Aveia com Frutas',
  'Refeição nutritiva e fácil de digerir',
  'Desayuno',
  'Fornece energia sustentada, rica em fibras e ajuda na recuperação',
  'Cozinhar 3 colheres de aveia em 200ml de água ou leite. Adicionar banana fatiada, morangos e mel.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Aveia com Frutas' AND pain_state_id = (SELECT id FROM pain_states WHERE name = 'Com Dor' LIMIT 1));

-- Produtos para "Inchada"
INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Bebidas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Inchada' LIMIT 1),
  'Chá Diurético de Cavalinha',
  'Chá natural com propriedades diuréticas',
  'Manhã',
  'Ajuda a eliminar líquidos retidos, reduz inchaço e melhora circulação',
  'Infusão de 1 colher de sopa de cavalinha seca em 250ml de água quente por 10 minutos. Coar e beber.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Chá Diurético de Cavalinha' AND pain_state_id = (SELECT id FROM pain_states WHERE name = 'Inchada' LIMIT 1));

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Bebidas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Inchada' LIMIT 1),
  'Água com Limão',
  'Bebida simples e eficaz para reduzir retenção de líquidos',
  'Manhã',
  'Diurético natural, melhora digestão e hidratação',
  'Espremer meio limão em 300ml de água morna. Beber em jejum.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Água com Limão' AND pain_state_id = (SELECT id FROM pain_states WHERE name = 'Inchada' LIMIT 1));

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Bebidas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Inchada' LIMIT 1),
  'Smoothie de Melancia',
  'Bebida refrescante e diurética',
  'Tarde',
  'Alta concentração de água, ajuda a eliminar líquidos e reduz inchaço',
  'Bater no liquidificador: 2 xícaras de melancia sem sementes, 1 colher de hortelã e gelo.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Smoothie de Melancia' AND pain_state_id = (SELECT id FROM pain_states WHERE name = 'Inchada' LIMIT 1));

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Bebidas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Inchada' LIMIT 1),
  'Chá Verde',
  'Bebida antioxidante com propriedades diuréticas',
  'Tarde',
  'Acelera metabolismo, ajuda na eliminação de líquidos e reduz inchaço',
  'Infusão de 1 colher de chá verde em 200ml de água quente (80°C) por 3 minutos. Não deixar ferver.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Chá Verde' AND pain_state_id = (SELECT id FROM pain_states WHERE name = 'Inchada' LIMIT 1));

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Vegetais' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Inchada' LIMIT 1),
  'Salada de Pepino e Tomate',
  'Salada leve e refrescante',
  'Almuerzo',
  'Rica em água, ajuda a eliminar líquidos retidos e reduz inchaço',
  'Cortar pepino e tomate em cubos. Adicionar cebola roxa, azeite, vinagre e sal. Deixar descansar 10 minutos.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Salada de Pepino e Tomate' AND pain_state_id = (SELECT id FROM pain_states WHERE name = 'Inchada' LIMIT 1));

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Frutas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Inchada' LIMIT 1),
  'Abacaxi com Hortelã',
  'Sobremesa leve e diurética',
  'Tarde',
  'Rico em bromelina, ajuda na digestão e eliminação de líquidos',
  'Cortar abacaxi em cubos e adicionar folhas de hortelã picadas. Servir gelado.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Abacaxi com Hortelã' AND pain_state_id = (SELECT id FROM pain_states WHERE name = 'Inchada' LIMIT 1));

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Proteínas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Inchada' LIMIT 1),
  'Peixe Grelhado com Legumes',
  'Refeição leve e nutritiva',
  'Cena',
  'Rico em ômega-3, proteína magra e ajuda a reduzir inflamações',
  'Grelhar filé de peixe (salmão ou tilápia) com azeite e ervas. Servir com legumes cozidos no vapor (brócolis, cenoura, abobrinha).'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Peixe Grelhado com Legumes' AND pain_state_id = (SELECT id FROM pain_states WHERE name = 'Inchada' LIMIT 1));

-- Produtos para "Normal"
INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Bebidas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1),
  'Smoothie Energético',
  'Bebida nutritiva e energética para começar o dia',
  'Desayuno',
  'Fornece energia, vitaminas e minerais essenciais',
  'Bater no liquidificador: 1 banana, 1 xícara de morangos, 1 colher de proteína em pó, 200ml de leite e 1 colher de mel.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Smoothie Energético' AND pain_state_id = (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1));

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Bebidas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1),
  'Água de Coco',
  'Bebida natural rica em eletrólitos',
  'Tarde',
  'Hidratação natural, rica em potássio e ajuda na recuperação',
  'Servir água de coco natural gelada. Pode adicionar limão espremido.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Água de Coco' AND pain_state_id = (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1));

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Bebidas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1),
  'Chá de Ervas Variadas',
  'Chá relaxante para o final do dia',
  'Noite',
  'Promove relaxamento, melhora digestão e qualidade do sono',
  'Infusão de ervas (camomila, erva-cidreira, hortelã) em 200ml de água quente por 5 minutos.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Chá de Ervas Variadas' AND pain_state_id = (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1));

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Comidas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1),
  'Bowl de Açaí',
  'Refeição nutritiva e energética',
  'Desayuno',
  'Rico em antioxidantes, fornece energia e melhora disposição',
  'Bater 200g de polpa de açaí congelada com 1 banana. Servir com granola, morangos, banana e mel.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Bowl de Açaí' AND pain_state_id = (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1));

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Comidas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1),
  'Salada Completa com Proteína',
  'Refeição balanceada e nutritiva',
  'Almuerzo',
  'Rica em proteínas, fibras, vitaminas e minerais',
  'Misturar folhas verdes, tomate, pepino, cenoura ralada, grão-de-bico, frango grelhado e temperar com azeite e limão.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Salada Completa com Proteína' AND pain_state_id = (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1));

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Proteínas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1),
  'Peito de Frango com Quinoa',
  'Refeição rica em proteínas e carboidratos complexos',
  'Cena',
  'Alto valor proteico, rica em aminoácidos essenciais e fibras',
  'Grelhar peito de frango temperado. Cozinhar quinoa e servir com legumes grelhados (berinjela, abobrinha, pimentão).'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Peito de Frango com Quinoa' AND pain_state_id = (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1));

INSERT INTO products (id, category_id, pain_state_id, name, description, moment_of_day, benefits, recipe_prep)
SELECT 
  UUID(),
  (SELECT id FROM categories WHERE name = 'Frutas' AND type = 'diet' LIMIT 1),
  (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1),
  'Frutas Variadas',
  'Seleção de frutas frescas',
  'Tarde',
  'Rica em vitaminas, minerais, fibras e antioxidantes',
  'Cortar e servir: maçã, pera, uvas, morangos e kiwi. Pode adicionar iogurte natural.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Frutas Variadas' AND pain_state_id = (SELECT id FROM pain_states WHERE name = 'Normal' LIMIT 1));
