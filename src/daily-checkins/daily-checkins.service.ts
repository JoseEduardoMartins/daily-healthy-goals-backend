import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DailyCheckin } from './entities/daily-checkin.entity';
import { CreateDailyCheckinDto } from './dto/create-daily-checkin.dto';
import { CategoriesService } from '../categories/categories.service';
import { GoalLibraryService } from '../goal-library/goal-library.service';
import { UserDailyGoalsService } from '../user-daily-goals/user-daily-goals.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class DailyCheckinsService {
  constructor(
    @InjectRepository(DailyCheckin)
    private dailyCheckinsRepository: Repository<DailyCheckin>,
    private categoriesService: CategoriesService,
    private goalLibraryService: GoalLibraryService,
    @Inject(forwardRef(() => UserDailyGoalsService))
    private userDailyGoalsService: UserDailyGoalsService,
  ) {}

  async create(
    user: User,
    createDailyCheckinDto: CreateDailyCheckinDto,
  ): Promise<DailyCheckin> {
    // Verificar se já existe um check-in para o usuário hoje
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0]; // Formato YYYY-MM-DD

    const existingCheckin = await this.dailyCheckinsRepository
      .createQueryBuilder('checkin')
      .where('checkin.user_id = :userId', { userId: user.id })
      .andWhere('DATE(checkin.checkin_date) = :date', { date: todayStr })
      .getOne();

    // R1: Se já existe, retornar o existente
    if (existingCheckin) {
      return existingCheckin;
    }

    // Verificar se a categoria existe
    const category = await this.categoriesService.findOne(
      createDailyCheckinDto.category_id,
    );
    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    // Criar o check-in
    const checkin = this.dailyCheckinsRepository.create({
      user_id: user.id,
      category_id: createDailyCheckinDto.category_id,
      checkin_date: today,
    });

    const savedCheckin = await this.dailyCheckinsRepository.save(checkin);

    // Buscar todas as metas da categoria na biblioteca
    const goals = await this.goalLibraryService.findByCategoryId(
      createDailyCheckinDto.category_id,
    );

    // Criar instâncias das metas para o usuário
    await this.userDailyGoalsService.createGoalsFromLibrary(
      savedCheckin.id,
      goals,
    );

    // Retornar o check-in com as metas
    return await this.findOne(savedCheckin.id);
  }

  async findOne(id: string): Promise<DailyCheckin> {
    const checkin = await this.dailyCheckinsRepository.findOne({
      where: { id },
      relations: ['category', 'user_daily_goals', 'user_daily_goals.goal_library'],
    });

    if (!checkin) {
      throw new NotFoundException('Check-in não encontrado');
    }

    return checkin;
  }

  async findTodayByUser(userId: string): Promise<DailyCheckin | null> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0]; // Formato YYYY-MM-DD

    return await this.dailyCheckinsRepository
      .createQueryBuilder('checkin')
      .leftJoinAndSelect('checkin.category', 'category')
      .leftJoinAndSelect('checkin.user_daily_goals', 'user_daily_goals')
      .leftJoinAndSelect('user_daily_goals.goal_library', 'goal_library')
      .where('checkin.user_id = :userId', { userId })
      .andWhere('DATE(checkin.checkin_date) = :date', { date: todayStr })
      .getOne();
  }

  async deleteTodayByUser(userId: string): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0]; // Formato YYYY-MM-DD

    const checkin = await this.dailyCheckinsRepository
      .createQueryBuilder('checkin')
      .where('checkin.user_id = :userId', { userId })
      .andWhere('DATE(checkin.checkin_date) = :date', { date: todayStr })
      .getOne();

    if (!checkin) {
      throw new NotFoundException('Check-in de hoje não encontrado');
    }

    // R2: Delete em cascata - as metas serão removidas automaticamente
    await this.dailyCheckinsRepository.remove(checkin);
  }
}
