import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DailyCheckin } from './entities/daily-checkin.entity';
import { CreateDailyCheckinDto } from '../../common/dtos/daily-checkins/create-daily-checkin.dto';
import { PainStatesService } from '../pain-states/pain-states.service';
import { ProductsService } from '../products/products.service';
import { ExercisesService } from '../exercises/exercises.service';
import { UserDailyPlanService } from '../user-daily-plan/user-daily-plan.service';
import { CurrentUserPayload } from '../../common/decorators/current-user.decorator';

@Injectable()
export class DailyCheckinsService {
  constructor(
    @InjectRepository(DailyCheckin)
    private dailyCheckinsRepository: Repository<DailyCheckin>,
    private painStatesService: PainStatesService,
    private productsService: ProductsService,
    private exercisesService: ExercisesService,
    @Inject(forwardRef(() => UserDailyPlanService))
    private userDailyPlanService: UserDailyPlanService,
  ) {}

  /**
   * Cria check-in temporário para visitantes anônimos (sem salvar no banco)
   */
  async createGuestCheckin(
    user: CurrentUserPayload,
    createDailyCheckinDto: CreateDailyCheckinDto,
  ): Promise<any> {
    // Validar pain state
    const painState = await this.painStatesService.findOne(
      createDailyCheckinDto.pain_state_id,
    );
    if (!painState) {
      throw new NotFoundException('Estado de dor não encontrado');
    }

    // Buscar produtos e exercícios filtrados para visitante
    const products = await this.productsService.findByPainStateId(
      createDailyCheckinDto.pain_state_id,
      user,
    );

    const exercises = await this.exercisesService.findByPainStateId(
      createDailyCheckinDto.pain_state_id,
      user,
    );

    // Criar estrutura de resposta similar ao check-in real
    const today = new Date().toISOString().slice(0, 10);
    const timestamp = Date.now();
    const guestCheckinId = `guest-${timestamp}`;

    // Formatar produtos como user_daily_plans
    const productPlans = products.map((product, index) => ({
      id: `guest-plan-${timestamp}-${index}`,
      checkin_id: guestCheckinId,
      product_id: product.id,
      is_completed: false,
      product: {
        ...product,
        category: product.category,
        pain_state: product.pain_state,
      },
      exercise_prescription: null,
    }));

    // Formatar exercícios como user_daily_plans
    const exercisePlans = exercises.map((exercise, index) => {
      const planId = `guest-plan-${timestamp}-${products.length + index}`;
      return {
        id: planId,
        checkin_id: guestCheckinId,
        product_id: null,
        is_completed: false,
        product: null,
        exercise_prescription: {
          id: `guest-prescription-${timestamp}-${index}`,
          plan_id: planId,
          exercise_id: exercise.id,
          sets: 3,
          reps: '12 a 15',
          rest_time: 60,
          observations: null,
          exercise: {
            ...exercise,
            category: exercise.category,
            pain_state: exercise.pain_state,
          },
        },
      };
    });

    return {
      id: guestCheckinId,
      user_id: null,
      pain_state_id: createDailyCheckinDto.pain_state_id,
      checkin_date: today,
      pain_state: painState,
      user_daily_plans: [...productPlans, ...exercisePlans],
      is_guest: true, // Flag para identificar check-in temporário
    };
  }

  async create(
    user: CurrentUserPayload,
    createDailyCheckinDto: CreateDailyCheckinDto,
  ): Promise<DailyCheckin> {
    // Visitantes anônimos não podem criar check-ins no banco
    if (!user.id) {
      throw new UnauthorizedException('Autenticação necessária para criar check-in');
    }

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

    // Verificar se o pain state existe
    const painState = await this.painStatesService.findOne(
      createDailyCheckinDto.pain_state_id,
    );
    if (!painState) {
      throw new NotFoundException('Estado de dor não encontrado');
    }

    // Criar o check-in
    const checkin = this.dailyCheckinsRepository.create({
      user_id: user.id,
      pain_state_id: createDailyCheckinDto.pain_state_id,
      checkin_date: today,
    });

    const savedCheckin = await this.dailyCheckinsRepository.save(checkin);

    // Buscar todos os produtos para o pain state (filtrados por permissão do usuário)
    const products = await this.productsService.findByPainStateId(
      createDailyCheckinDto.pain_state_id,
      user,
    );

    // Buscar todos os exercícios para o pain state (filtrados por permissão do usuário)
    const exercises = await this.exercisesService.findByPainStateId(
      createDailyCheckinDto.pain_state_id,
      user,
    );

    // Criar instâncias dos produtos para o usuário
    await this.userDailyPlanService.createPlansFromProducts(
      savedCheckin.id,
      products,
    );

    // Criar instâncias dos exercícios para o usuário
    await this.userDailyPlanService.createPlansFromExercises(
      savedCheckin.id,
      exercises,
    );

    // Retornar o check-in com as metas
    return await this.findOne(savedCheckin.id);
  }

  async findOne(id: string): Promise<DailyCheckin> {
    const checkin = await this.dailyCheckinsRepository.findOne({
      where: { id },
      relations: [
        'pain_state',
        'user_daily_plans',
        'user_daily_plans.product',
        'user_daily_plans.exercise_prescription',
        'user_daily_plans.exercise_prescription.exercise',
      ],
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
      .leftJoinAndSelect('checkin.pain_state', 'pain_state')
      .leftJoinAndSelect('checkin.user_daily_plans', 'user_daily_plans')
      .leftJoinAndSelect('user_daily_plans.product', 'product')
      .leftJoinAndSelect('user_daily_plans.exercise_prescription', 'exercise_prescription')
      .leftJoinAndSelect('exercise_prescription.exercise', 'exercise')
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
