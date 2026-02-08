import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from './entities/exercise.entity';
import { CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { PermissionsHelper } from '../../common/helpers/permissions.helper';

@Injectable()
export class ExercisesService {
  constructor(
    @InjectRepository(Exercise)
    private exercisesRepository: Repository<Exercise>,
  ) {}

  async findAll(user: CurrentUserPayload): Promise<Exercise[]> {
    const queryBuilder = this.exercisesRepository
      .createQueryBuilder('exercise')
      .leftJoinAndSelect('exercise.category', 'category')
      .leftJoinAndSelect('exercise.pain_state', 'pain_state')
      .leftJoinAndSelect('exercise.plan', 'plan');

    // Aplica filtros baseado no role do usuário
    const conditions = PermissionsHelper.getQueryConditions(user);
    if (conditions) {
      queryBuilder.where(conditions.condition, conditions.params);
    }

    const exercises = await queryBuilder.orderBy('exercise.name', 'ASC').getMany();

    // Adiciona plan_level aos exercícios para filtragem hierárquica
    const exercisesWithPlanLevel = exercises.map(exercise => ({
      ...exercise,
      plan_level: exercise.plan?.level || null,
    }));

    // Filtra baseado na hierarquia de planos
    return PermissionsHelper.filterByAccess(exercisesWithPlanLevel, user);
  }

  async findOne(id: string, user: CurrentUserPayload): Promise<Exercise> {
    const exercise = await this.exercisesRepository.findOne({
      where: { id },
      relations: ['category', 'pain_state'],
    });

    if (!exercise) {
      throw new NotFoundException('Exercício não encontrado');
    }

    // Verifica permissão de acesso
    if (
      !PermissionsHelper.canAccess(
        user,
        exercise.user_type_id || null,
        exercise.plan_id || null,
      )
    ) {
      throw new NotFoundException('Exercício não encontrado');
    }

    return exercise;
  }

  async findByPainStateId(painStateId: string, user: CurrentUserPayload): Promise<Exercise[]> {
    const queryBuilder = this.exercisesRepository
      .createQueryBuilder('exercise')
      .where('exercise.pain_state_id = :painStateId', { painStateId })
      .leftJoinAndSelect('exercise.category', 'category')
      .leftJoinAndSelect('exercise.pain_state', 'pain_state')
      .leftJoinAndSelect('exercise.plan', 'plan');

    // Aplica filtros de permissão
    const conditions = PermissionsHelper.getQueryConditions(user);
    if (conditions) {
      queryBuilder.andWhere(conditions.condition, conditions.params);
    }

    const exercises = await queryBuilder.orderBy('exercise.name', 'ASC').getMany();

    // Adiciona plan_level aos exercícios para filtragem hierárquica
    const exercisesWithPlanLevel = exercises.map(exercise => ({
      ...exercise,
      plan_level: exercise.plan?.level || null,
    }));

    // Filtra baseado na hierarquia de planos
    return PermissionsHelper.filterByAccess(exercisesWithPlanLevel, user);
  }
}
