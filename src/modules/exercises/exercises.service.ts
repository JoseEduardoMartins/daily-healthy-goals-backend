import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from './entities/exercise.entity';
import { User } from '../users/entities/user.entity';
import { PermissionsHelper } from '../../common/helpers/permissions.helper';

@Injectable()
export class ExercisesService {
  constructor(
    @InjectRepository(Exercise)
    private exercisesRepository: Repository<Exercise>,
  ) {}

  async findAll(user?: User): Promise<Exercise[]> {
    const queryBuilder = this.exercisesRepository
      .createQueryBuilder('exercise')
      .leftJoinAndSelect('exercise.category', 'category')
      .leftJoinAndSelect('exercise.pain_state', 'pain_state')
      .leftJoinAndSelect('exercise.user_type', 'user_type')
      .leftJoinAndSelect('exercise.plan', 'plan');

    // Se não tem usuário, retorna apenas recursos públicos (sem restrições)
    if (!user) {
      queryBuilder.where('exercise.user_type_id IS NULL AND exercise.plan_id IS NULL');
    } else {
      // Admin vê tudo
      if (user.user_type?.name === 'admin') {
        // Sem filtros
      } else if (user.user_type?.name === 'visitante') {
        // Visitante: apenas recursos de visitante
        queryBuilder.where(
          '(exercise.user_type_id = :userTypeId AND exercise.plan_id IS NULL)',
          { userTypeId: user.user_type_id },
        );
      } else if (user.user_type?.name === 'pagante') {
        // Pagante: recursos de visitante + recursos do seu plano
        queryBuilder.where(
          '(exercise.user_type_id = :userTypeId AND exercise.plan_id IS NULL) OR (exercise.plan_id = :planId)',
          { userTypeId: user.user_type_id, planId: user.plan_id },
        );
      } else {
        // Sem tipo definido: apenas recursos públicos
        queryBuilder.where('exercise.user_type_id IS NULL AND exercise.plan_id IS NULL');
      }
    }

    return await queryBuilder.orderBy('exercise.name', 'ASC').getMany();
  }

  async findOne(id: string, user?: User): Promise<Exercise> {
    const exercise = await this.exercisesRepository.findOne({
      where: { id },
      relations: ['category', 'pain_state', 'user_type', 'plan'],
    });

    if (!exercise) {
      throw new NotFoundException('Exercício não encontrado');
    }

    // Verifica permissão de acesso
    if (user && !PermissionsHelper.canAccess(user, exercise.user_type_id, exercise.plan_id)) {
      throw new NotFoundException('Exercício não encontrado');
    }

    return exercise;
  }

  async findByPainStateId(painStateId: string, user?: User): Promise<Exercise[]> {
    const queryBuilder = this.exercisesRepository
      .createQueryBuilder('exercise')
      .where('exercise.pain_state_id = :painStateId', { painStateId });

    // Aplica filtros de permissão
    if (!user) {
      queryBuilder.andWhere('exercise.user_type_id IS NULL AND exercise.plan_id IS NULL');
    } else if (user.user_type?.name === 'admin') {
      // Admin vê tudo
    } else if (user.user_type?.name === 'visitante') {
      queryBuilder.andWhere(
        '(exercise.user_type_id = :userTypeId AND exercise.plan_id IS NULL)',
        { userTypeId: user.user_type_id },
      );
    } else if (user.user_type?.name === 'pagante') {
      queryBuilder.andWhere(
        '(exercise.user_type_id = :userTypeId AND exercise.plan_id IS NULL) OR (exercise.plan_id = :planId)',
        { userTypeId: user.user_type_id, planId: user.plan_id },
      );
    } else {
      queryBuilder.andWhere('exercise.user_type_id IS NULL AND exercise.plan_id IS NULL');
    }

    return await queryBuilder.orderBy('exercise.name', 'ASC').getMany();
  }
}
