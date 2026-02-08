import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan } from './entities/plan.entity';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(Plan)
    private plansRepository: Repository<Plan>,
  ) {}

  async findAll(): Promise<Plan[]> {
    return await this.plansRepository.find({
      where: { is_active: true },
      order: { level: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Plan> {
    const plan = await this.plansRepository.findOne({
      where: { id },
    });

    if (!plan) {
      throw new NotFoundException('Plano não encontrado');
    }

    return plan;
  }

  async findByLevel(level: string): Promise<Plan | null> {
    return await this.plansRepository.findOne({
      where: { level, is_active: true },
    });
  }

  async findPlansUpToLevel(level: string): Promise<Plan[]> {
    // Hierarquia de planos: bronze < silver < gold < platinum
    const levelOrder = ['bronze', 'silver', 'gold', 'platinum'];
    const targetIndex = levelOrder.indexOf(level.toLowerCase());

    if (targetIndex === -1) {
      return [];
    }

    const allowedLevels = levelOrder.slice(0, targetIndex + 1);

    return await this.plansRepository.find({
      where: allowedLevels.map((lvl) => ({ level: lvl, is_active: true })),
      order: { level: 'ASC' },
    });
  }
}
