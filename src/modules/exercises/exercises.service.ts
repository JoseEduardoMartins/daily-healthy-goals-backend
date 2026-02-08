import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from './entities/exercise.entity';

@Injectable()
export class ExercisesService {
  constructor(
    @InjectRepository(Exercise)
    private exercisesRepository: Repository<Exercise>,
  ) {}

  async findByPainStateId(painStateId: string): Promise<Exercise[]> {
    return await this.exercisesRepository.find({
      where: { pain_state_id: painStateId },
      order: { name: 'ASC' },
    });
  }

  async findAll(): Promise<Exercise[]> {
    return await this.exercisesRepository.find({
      relations: ['category', 'pain_state'],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Exercise> {
    return await this.exercisesRepository.findOne({
      where: { id },
      relations: ['category', 'pain_state'],
    });
  }
}
