import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';
import { Category } from '../src/categories/entities/category.entity';
import { GoalLibrary } from '../src/goal-library/entities/goal-library.entity';

config({ path: join(__dirname, '..', '.env') });

async function seed() {
  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USERNAME || 'app_user',
    password: process.env.DB_PASSWORD || 'app_password',
    database: process.env.DB_DATABASE || 'daily_healthy_goals',
    entities: [Category, GoalLibrary],
    synchronize: false,
  });

  try {
    await dataSource.initialize();
    console.log('Conectado ao banco de dados');

    const categoryRepository = dataSource.getRepository(Category);
    const goalLibraryRepository = dataSource.getRepository(GoalLibrary);

    // Verificar se já existem categorias
    const existingCategories = await categoryRepository.count();
    if (existingCategories > 0) {
      console.log('Banco de dados já possui dados. Pulando seed.');
      await dataSource.destroy();
      return;
    }

    // Criar categorias
    const category1 = categoryRepository.create({ name: 'Com Dor' });
    const category2 = categoryRepository.create({ name: 'Inchada' });
    const category3 = categoryRepository.create({ name: 'Normal' });

    const savedCategory1 = await categoryRepository.save(category1);
    const savedCategory2 = await categoryRepository.save(category2);
    const savedCategory3 = await categoryRepository.save(category3);

    console.log('Categorias criadas:', [savedCategory1, savedCategory2, savedCategory3]);

    // Criar metas para "Com Dor"
    const goalsCategory1 = [
      { description: 'Fazer alongamento suave por 10 minutos' },
      { description: 'Aplicar compressa quente na área dolorida' },
      { description: 'Beber 2 litros de água durante o dia' },
      { description: 'Evitar movimentos repetitivos que causam dor' },
      { description: 'Fazer pausas de 5 minutos a cada hora de trabalho' },
    ];

    for (const goal of goalsCategory1) {
      await goalLibraryRepository.save(
        goalLibraryRepository.create({
          category_id: savedCategory1.id,
          description: goal.description,
        }),
      );
    }

    // Criar metas para "Inchada"
    const goalsCategory2 = [
      { description: 'Reduzir consumo de sal durante o dia' },
      { description: 'Elevar as pernas por 20 minutos' },
      { description: 'Beber chá diurético (camomila ou cavalinha)' },
      { description: 'Fazer caminhada leve de 15 minutos' },
      { description: 'Massagear a área inchada com movimentos suaves' },
    ];

    for (const goal of goalsCategory2) {
      await goalLibraryRepository.save(
        goalLibraryRepository.create({
          category_id: savedCategory2.id,
          description: goal.description,
        }),
      );
    }

    // Criar metas para "Normal"
    const goalsCategory3 = [
      { description: 'Manter rotina de exercícios regulares' },
      { description: 'Beber 2 litros de água durante o dia' },
      { description: 'Dormir pelo menos 7 horas' },
      { description: 'Fazer alongamento matinal' },
      { description: 'Manter alimentação equilibrada' },
    ];

    for (const goal of goalsCategory3) {
      await goalLibraryRepository.save(
        goalLibraryRepository.create({
          category_id: savedCategory3.id,
          description: goal.description,
        }),
      );
    }

    console.log('Metas criadas para todas as categorias');
    console.log('Seed concluído com sucesso!');
  } catch (error) {
    console.error('Erro ao executar seed:', error);
  } finally {
    await dataSource.destroy();
  }
}

seed();
