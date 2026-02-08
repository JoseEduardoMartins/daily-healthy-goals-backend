import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDailyPlan } from './entities/user-daily-plan.entity';
import { UpdateDailyPlanDto } from '../../common/dtos/user-daily-plan/update-daily-plan.dto';
import { Product } from '../products/entities/product.entity';
import { Exercise } from '../exercises/entities/exercise.entity';
import { DailyCheckinsService } from '../daily-checkins/daily-checkins.service';
import { ExercisePrescriptionsService } from '../exercise-prescriptions/exercise-prescriptions.service';

@Injectable()
export class UserDailyPlanService {
  constructor(
    @InjectRepository(UserDailyPlan)
    private userDailyPlanRepository: Repository<UserDailyPlan>,
    @Inject(forwardRef(() => DailyCheckinsService))
    private dailyCheckinsService: DailyCheckinsService,
    private exercisePrescriptionsService: ExercisePrescriptionsService,
  ) {}

  async createPlansFromProducts(
    checkinId: string,
    products: Product[],
  ): Promise<UserDailyPlan[]> {
    const userPlans = products.map((product) =>
      this.userDailyPlanRepository.create({
        checkin_id: checkinId,
        product_id: product.id,
        is_completed: false,
      }),
    );

    return await this.userDailyPlanRepository.save(userPlans);
  }

  async createPlansFromExercises(
    checkinId: string,
    exercises: Exercise[],
  ): Promise<UserDailyPlan[]> {
    const userPlans = await Promise.all(
      exercises.map(async (exercise) => {
        const plan = this.userDailyPlanRepository.create({
          checkin_id: checkinId,
          product_id: null,
          is_completed: false,
        });
        const savedPlan = await this.userDailyPlanRepository.save(plan);

        // Criar prescrição do exercício
        await this.exercisePrescriptionsService.create({
          plan_id: savedPlan.id,
          exercise_id: exercise.id,
          sets: 3, // Valor padrão, pode ser configurável
          reps: '12 a 15', // Valor padrão
          rest_time: 60, // 60 segundos padrão
          observations: null,
        });

        return savedPlan;
      }),
    );

    return userPlans;
  }

  async findTodayByUser(userId: string): Promise<UserDailyPlan[]> {
    const checkin = await this.dailyCheckinsService.findTodayByUser(userId);

    if (!checkin) {
      return [];
    }

    return await this.userDailyPlanRepository.find({
      where: { checkin_id: checkin.id },
      relations: [
        'product',
        'product.category',
        'product.pain_state',
        'exercise_prescription',
        'exercise_prescription.exercise',
        'exercise_prescription.exercise.category',
        'exercise_prescription.exercise.pain_state',
      ],
      order: { id: 'ASC' },
    });
  }

  async update(
    id: string,
    updateDailyPlanDto: UpdateDailyPlanDto,
  ): Promise<UserDailyPlan> {
    const plan = await this.userDailyPlanRepository.findOne({
      where: { id },
    });

    if (!plan) {
      throw new NotFoundException('Plano não encontrado');
    }

    plan.is_completed = updateDailyPlanDto.is_completed;
    return await this.userDailyPlanRepository.save(plan);
  }
}
