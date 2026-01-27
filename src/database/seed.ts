import { DataSource } from 'typeorm';
import { Category } from '../categories/entities/category.entity';
import { PainState } from '../pain-states/entities/pain-state.entity';
import { Product } from '../products/entities/product.entity';
import { Exercise } from '../exercises/entities/exercise.entity';

export async function seedDatabase(dataSource: DataSource) {
  const painStateRepository = dataSource.getRepository(PainState);
  const categoryRepository = dataSource.getRepository(Category);
  const productRepository = dataSource.getRepository(Product);
  const exerciseRepository = dataSource.getRepository(Exercise);

  // Verificar se já existem pain states
  const existingPainStates = await painStateRepository.count();
  if (existingPainStates > 0) {
    console.log('Banco de dados já possui dados. Pulando seed.');
    return;
  }

  // ========== CRIAR PAIN STATES ==========
  console.log('Criando Pain States...');
  const painStateComDor = painStateRepository.create({ name: 'Com Dor' });
  const painStateInchada = painStateRepository.create({ name: 'Inchada' });
  const painStateNormal = painStateRepository.create({ name: 'Normal' });

  const savedComDor = await painStateRepository.save(painStateComDor);
  const savedInchada = await painStateRepository.save(painStateInchada);
  const savedNormal = await painStateRepository.save(painStateNormal);

  console.log('✓ Pain States criados');

  // ========== CRIAR CATEGORIAS (DIET) ==========
  console.log('Criando Categorias de Alimentação...');
  const categoriaBebidas = await categoryRepository.save(
    categoryRepository.create({
      name: 'Bebidas',
      type: 'diet',
      image_url: null,
    }),
  );
  const categoriaComidas = await categoryRepository.save(
    categoryRepository.create({
      name: 'Comidas',
      type: 'diet',
      image_url: null,
    }),
  );
  const categoriaProteínas = await categoryRepository.save(
    categoryRepository.create({
      name: 'Proteínas',
      type: 'diet',
      image_url: null,
    }),
  );
  const categoriaFrutas = await categoryRepository.save(
    categoryRepository.create({
      name: 'Frutas',
      type: 'diet',
      image_url: null,
    }),
  );
  const categoriaVegetais = await categoryRepository.save(
    categoryRepository.create({
      name: 'Vegetais',
      type: 'diet',
      image_url: null,
    }),
  );

  console.log('✓ Categorias de Alimentação criadas');

  // ========== CRIAR CATEGORIAS (EXERCISE) ==========
  console.log('Criando Categorias de Exercícios...');
  const categoriaCardio = await categoryRepository.save(
    categoryRepository.create({
      name: 'Cardio',
      type: 'exercise',
      image_url: null,
    }),
  );
  const categoriaForça = await categoryRepository.save(
    categoryRepository.create({
      name: 'Força',
      type: 'exercise',
      image_url: null,
    }),
  );
  const categoriaFlexibilidade = await categoryRepository.save(
    categoryRepository.create({
      name: 'Flexibilidade',
      type: 'exercise',
      image_url: null,
    }),
  );
  const categoriaRelaxamento = await categoryRepository.save(
    categoryRepository.create({
      name: 'Relaxamento',
      type: 'exercise',
      image_url: null,
    }),
  );

  console.log('✓ Categorias de Exercícios criadas');

  // ========== PRODUTOS PARA "COM DOR" ==========
  console.log('Criando Produtos para "Com Dor"...');
  const produtosComDor = [
    {
      name: 'Chá de Camomila',
      description: 'Chá calmante e anti-inflamatório natural',
      moment_of_day: 'Manhã',
      benefits: 'Reduz inflamações, alivia dores musculares e promove relaxamento',
      recipe_prep:
        'Infusão de 1 colher de sopa de camomila seca em 200ml de água quente por 5 minutos. Coar e beber morno.',
      category_id: categoriaBebidas.id,
    },
    {
      name: 'Chá de Gengibre',
      description: 'Bebida anti-inflamatória e analgésica natural',
      moment_of_day: 'Tarde',
      benefits: 'Alivia dores articulares, reduz inflamações e melhora circulação',
      recipe_prep:
        'Ferver 3 fatias de gengibre fresco em 300ml de água por 10 minutos. Adicionar mel a gosto.',
      category_id: categoriaBebidas.id,
    },
    {
      name: 'Smoothie Anti-inflamatório',
      description: 'Bebida rica em antioxidantes e propriedades anti-inflamatórias',
      moment_of_day: 'Desayuno',
      benefits: 'Reduz inflamações, fornece energia e melhora recuperação',
      recipe_prep:
        'Bater no liquidificador: 1 xícara de mirtilos, 1 banana, 1 colher de chia, 200ml de leite de amêndoas e 1 colher de mel.',
      category_id: categoriaBebidas.id,
    },
    {
      name: 'Sopa de Abóbora',
      description: 'Sopa cremosa e nutritiva, fácil de digerir',
      moment_of_day: 'Almuerzo',
      benefits: 'Rica em vitamina A, anti-inflamatória e hidratante',
      recipe_prep:
        'Cozinhar 500g de abóbora cortada em cubos com 1 litro de caldo de legumes até amolecer. Bater no liquidificador e temperar com sal, pimenta e azeite.',
      category_id: categoriaComidas.id,
    },
    {
      name: 'Salada de Folhas Verdes',
      description: 'Salada rica em nutrientes e propriedades anti-inflamatórias',
      moment_of_day: 'Almuerzo',
      benefits: 'Rica em magnésio, ajuda a reduzir dores e inflamações',
      recipe_prep:
        'Misturar alface, espinafre, rúcula e agrião. Adicionar tomate cereja, pepino e temperar com azeite, limão e sal.',
      category_id: categoriaVegetais.id,
    },
    {
      name: 'Aveia com Frutas',
      description: 'Refeição nutritiva e fácil de digerir',
      moment_of_day: 'Desayuno',
      benefits: 'Fornece energia sustentada, rica em fibras e ajuda na recuperação',
      recipe_prep:
        'Cozinhar 3 colheres de aveia em 200ml de água ou leite. Adicionar banana fatiada, morangos e mel.',
      category_id: categoriaComidas.id,
    },
  ];

  for (const produto of produtosComDor) {
    await productRepository.save(
      productRepository.create({
        ...produto,
        pain_state_id: savedComDor.id,
      }),
    );
  }
  console.log(`✓ ${produtosComDor.length} produtos criados para "Com Dor"`);

  // ========== PRODUTOS PARA "INCHADA" ==========
  console.log('Criando Produtos para "Inchada"...');
  const produtosInchada = [
    {
      name: 'Chá Diurético de Cavalinha',
      description: 'Chá natural com propriedades diuréticas',
      moment_of_day: 'Manhã',
      benefits: 'Ajuda a eliminar líquidos retidos, reduz inchaço e melhora circulação',
      recipe_prep:
        'Infusão de 1 colher de sopa de cavalinha seca em 250ml de água quente por 10 minutos. Coar e beber.',
      category_id: categoriaBebidas.id,
    },
    {
      name: 'Água com Limão',
      description: 'Bebida simples e eficaz para reduzir retenção de líquidos',
      moment_of_day: 'Manhã',
      benefits: 'Diurético natural, melhora digestão e hidratação',
      recipe_prep: 'Espremer meio limão em 300ml de água morna. Beber em jejum.',
      category_id: categoriaBebidas.id,
    },
    {
      name: 'Smoothie de Melancia',
      description: 'Bebida refrescante e diurética',
      moment_of_day: 'Tarde',
      benefits: 'Alta concentração de água, ajuda a eliminar líquidos e reduz inchaço',
      recipe_prep:
        'Bater no liquidificador: 2 xícaras de melancia sem sementes, 1 colher de hortelã e gelo.',
      category_id: categoriaBebidas.id,
    },
    {
      name: 'Chá Verde',
      description: 'Bebida antioxidante com propriedades diuréticas',
      moment_of_day: 'Tarde',
      benefits: 'Acelera metabolismo, ajuda na eliminação de líquidos e reduz inchaço',
      recipe_prep:
        'Infusão de 1 colher de chá verde em 200ml de água quente (80°C) por 3 minutos. Não deixar ferver.',
      category_id: categoriaBebidas.id,
    },
    {
      name: 'Salada de Pepino e Tomate',
      description: 'Salada leve e refrescante',
      moment_of_day: 'Almuerzo',
      benefits: 'Rica em água, ajuda a eliminar líquidos retidos e reduz inchaço',
      recipe_prep:
        'Cortar pepino e tomate em cubos. Adicionar cebola roxa, azeite, vinagre e sal. Deixar descansar 10 minutos.',
      category_id: categoriaVegetais.id,
    },
    {
      name: 'Abacaxi com Hortelã',
      description: 'Sobremesa leve e diurética',
      moment_of_day: 'Tarde',
      benefits: 'Rico em bromelina, ajuda na digestão e eliminação de líquidos',
      recipe_prep: 'Cortar abacaxi em cubos e adicionar folhas de hortelã picadas. Servir gelado.',
      category_id: categoriaFrutas.id,
    },
    {
      name: 'Peixe Grelhado com Legumes',
      description: 'Refeição leve e nutritiva',
      moment_of_day: 'Cena',
      benefits: 'Rico em ômega-3, proteína magra e ajuda a reduzir inflamações',
      recipe_prep:
        'Grelhar filé de peixe (salmão ou tilápia) com azeite e ervas. Servir com legumes cozidos no vapor (brócolis, cenoura, abobrinha).',
      category_id: categoriaProteínas.id,
    },
  ];

  for (const produto of produtosInchada) {
    await productRepository.save(
      productRepository.create({
        ...produto,
        pain_state_id: savedInchada.id,
      }),
    );
  }
  console.log(`✓ ${produtosInchada.length} produtos criados para "Inchada"`);

  // ========== PRODUTOS PARA "NORMAL" ==========
  console.log('Criando Produtos para "Normal"...');
  const produtosNormal = [
    {
      name: 'Smoothie Energético',
      description: 'Bebida nutritiva e energética para começar o dia',
      moment_of_day: 'Desayuno',
      benefits: 'Fornece energia, vitaminas e minerais essenciais',
      recipe_prep:
        'Bater no liquidificador: 1 banana, 1 xícara de morangos, 1 colher de proteína em pó, 200ml de leite e 1 colher de mel.',
      category_id: categoriaBebidas.id,
    },
    {
      name: 'Água de Coco',
      description: 'Bebida natural rica em eletrólitos',
      moment_of_day: 'Tarde',
      benefits: 'Hidratação natural, rica em potássio e ajuda na recuperação',
      recipe_prep: 'Servir água de coco natural gelada. Pode adicionar limão espremido.',
      category_id: categoriaBebidas.id,
    },
    {
      name: 'Chá de Ervas Variadas',
      description: 'Chá relaxante para o final do dia',
      moment_of_day: 'Noite',
      benefits: 'Promove relaxamento, melhora digestão e qualidade do sono',
      recipe_prep:
        'Infusão de ervas (camomila, erva-cidreira, hortelã) em 200ml de água quente por 5 minutos.',
      category_id: categoriaBebidas.id,
    },
    {
      name: 'Bowl de Açaí',
      description: 'Refeição nutritiva e energética',
      moment_of_day: 'Desayuno',
      benefits: 'Rico em antioxidantes, fornece energia e melhora disposição',
      recipe_prep:
        'Bater 200g de polpa de açaí congelada com 1 banana. Servir com granola, morangos, banana e mel.',
      category_id: categoriaComidas.id,
    },
    {
      name: 'Salada Completa com Proteína',
      description: 'Refeição balanceada e nutritiva',
      moment_of_day: 'Almuerzo',
      benefits: 'Rica em proteínas, fibras, vitaminas e minerais',
      recipe_prep:
        'Misturar folhas verdes, tomate, pepino, cenoura ralada, grão-de-bico, frango grelhado e temperar com azeite e limão.',
      category_id: categoriaComidas.id,
    },
    {
      name: 'Peito de Frango com Quinoa',
      description: 'Refeição rica em proteínas e carboidratos complexos',
      moment_of_day: 'Cena',
      benefits: 'Alto valor proteico, rica em aminoácidos essenciais e fibras',
      recipe_prep:
        'Grelhar peito de frango temperado. Cozinhar quinoa e servir com legumes grelhados (berinjela, abobrinha, pimentão).',
      category_id: categoriaProteínas.id,
    },
    {
      name: 'Frutas Variadas',
      description: 'Seleção de frutas frescas',
      moment_of_day: 'Tarde',
      benefits: 'Rica em vitaminas, minerais, fibras e antioxidantes',
      recipe_prep:
        'Cortar e servir: maçã, pera, uvas, morangos e kiwi. Pode adicionar iogurte natural.',
      category_id: categoriaFrutas.id,
    },
  ];

  for (const produto of produtosNormal) {
    await productRepository.save(
      productRepository.create({
        ...produto,
        pain_state_id: savedNormal.id,
      }),
    );
  }
  console.log(`✓ ${produtosNormal.length} produtos criados para "Normal"`);

  // ========== EXERCÍCIOS PARA "COM DOR" ==========
  console.log('Criando Exercícios para "Com Dor"...');
  const exerciciosComDor = [
    {
      name: 'Alongamento Suave de Pescoço',
      description: 'Exercício de alongamento para aliviar tensão no pescoço e ombros',
      difficulty: 'easy',
      category_id: categoriaFlexibilidade.id,
    },
    {
      name: 'Respiração Diafragmática',
      description: 'Técnica de respiração profunda para relaxamento e alívio de dores',
      difficulty: 'easy',
      category_id: categoriaRelaxamento.id,
    },
    {
      name: 'Alongamento de Costas',
      description: 'Movimentos suaves para aliviar dores nas costas',
      difficulty: 'easy',
      category_id: categoriaFlexibilidade.id,
    },
    {
      name: 'Yoga Restaurativa',
      description: 'Posturas de yoga suaves para relaxamento e alívio de dores',
      difficulty: 'easy',
      category_id: categoriaRelaxamento.id,
    },
    {
      name: 'Caminhada Leve',
      description: 'Caminhada em ritmo suave para melhorar circulação sem sobrecarregar',
      difficulty: 'easy',
      category_id: categoriaCardio.id,
    },
  ];

  for (const exercicio of exerciciosComDor) {
    await exerciseRepository.save(
      exerciseRepository.create({
        ...exercicio,
        pain_state_id: savedComDor.id,
      }),
    );
  }
  console.log(`✓ ${exerciciosComDor.length} exercícios criados para "Com Dor"`);

  // ========== EXERCÍCIOS PARA "INCHADA" ==========
  console.log('Criando Exercícios para "Inchada"...');
  const exerciciosInchada = [
    {
      name: 'Caminhada Moderada',
      description: 'Caminhada em ritmo moderado para melhorar circulação e reduzir inchaço',
      difficulty: 'easy',
      category_id: categoriaCardio.id,
    },
    {
      name: 'Elevação de Pernas',
      description: 'Exercício para melhorar circulação e reduzir inchaço nas pernas',
      difficulty: 'easy',
      category_id: categoriaFlexibilidade.id,
    },
    {
      name: 'Alongamento de Pernas',
      description: 'Alongamentos específicos para pernas e tornozelos',
      difficulty: 'easy',
      category_id: categoriaFlexibilidade.id,
    },
    {
      name: 'Exercícios Aquáticos Leves',
      description: 'Movimentos na água para reduzir impacto e melhorar circulação',
      difficulty: 'easy',
      category_id: categoriaCardio.id,
    },
    {
      name: 'Pilates Suave',
      description: 'Exercícios de pilates focados em circulação e flexibilidade',
      difficulty: 'medium',
      category_id: categoriaFlexibilidade.id,
    },
  ];

  for (const exercicio of exerciciosInchada) {
    await exerciseRepository.save(
      exerciseRepository.create({
        ...exercicio,
        pain_state_id: savedInchada.id,
      }),
    );
  }
  console.log(`✓ ${exerciciosInchada.length} exercícios criados para "Inchada"`);

  // ========== EXERCÍCIOS PARA "NORMAL" ==========
  console.log('Criando Exercícios para "Normal"...');
  const exerciciosNormal = [
    {
      name: 'Corrida Leve',
      description: 'Corrida em ritmo moderado para melhorar condicionamento cardiovascular',
      difficulty: 'medium',
      category_id: categoriaCardio.id,
    },
    {
      name: 'Treino de Força Completo',
      description: 'Exercícios com pesos para fortalecimento muscular geral',
      difficulty: 'medium',
      category_id: categoriaForça.id,
    },
    {
      name: 'HIIT (Treino Intervalado)',
      description: 'Treino de alta intensidade com intervalos para queima de gordura',
      difficulty: 'hard',
      category_id: categoriaCardio.id,
    },
    {
      name: 'Yoga Dinâmica',
      description: 'Sequência de yoga mais dinâmica para flexibilidade e força',
      difficulty: 'medium',
      category_id: categoriaFlexibilidade.id,
    },
    {
      name: 'Musculação Completa',
      description: 'Treino de musculação para desenvolvimento muscular',
      difficulty: 'hard',
      category_id: categoriaForça.id,
    },
    {
      name: 'Ciclismo',
      description: 'Pedalada para condicionamento cardiovascular',
      difficulty: 'medium',
      category_id: categoriaCardio.id,
    },
    {
      name: 'Natação',
      description: 'Natação completa para condicionamento físico geral',
      difficulty: 'medium',
      category_id: categoriaCardio.id,
    },
  ];

  for (const exercicio of exerciciosNormal) {
    await exerciseRepository.save(
      exerciseRepository.create({
        ...exercicio,
        pain_state_id: savedNormal.id,
      }),
    );
  }
  console.log(`✓ ${exerciciosNormal.length} exercícios criados para "Normal"`);

  // ========== RESUMO ==========
  console.log('\n========== SEED CONCLUÍDO COM SUCESSO! ==========');
  console.log(`Pain States: 3`);
  console.log(`Categorias Diet: 5`);
  console.log(`Categorias Exercise: 4`);
  console.log(`Produtos "Com Dor": ${produtosComDor.length}`);
  console.log(`Produtos "Inchada": ${produtosInchada.length}`);
  console.log(`Produtos "Normal": ${produtosNormal.length}`);
  console.log(`Exercícios "Com Dor": ${exerciciosComDor.length}`);
  console.log(`Exercícios "Inchada": ${exerciciosInchada.length}`);
  console.log(`Exercícios "Normal": ${exerciciosNormal.length}`);
  console.log('================================================\n');
}
