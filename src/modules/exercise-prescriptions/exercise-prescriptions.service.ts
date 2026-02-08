import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExercisePrescription } from './entities/exercise-prescription.entity';

@Injectable()
export class ExercisePrescriptionsService {
  constructor(
    @InjectRepository(ExercisePrescription)
    private exercisePrescriptionsRepository: Repository<ExercisePrescription>,
  ) {}

  async create(prescriptionData: Partial<ExercisePrescription>): Promise<ExercisePrescription> {
    const prescription = this.exercisePrescriptionsRepository.create(prescriptionData);
    return await this.exercisePrescriptionsRepository.save(prescription);
  }

  async findByPlanId(planId: string): Promise<ExercisePrescription | null> {
    return await this.exercisePrescriptionsRepository.findOne({
      where: { plan_id: planId },
      relations: ['exercise', 'plan'],
    });
  }
}
