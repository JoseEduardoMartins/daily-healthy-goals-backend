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
    // Ordenar por hierarquia: bronze (1) < prata (2) < ouro (3)
    // Usar CASE WHEN para garantir ordem correta independente da ordem alfabética
    return await this.plansRepository
      .createQueryBuilder('plan')
      .where('plan.is_active = :isActive', { isActive: true })
      .orderBy(
        `CASE 
          WHEN plan.level = 'bronze' THEN 1
          WHEN plan.level = 'prata' THEN 2
          WHEN plan.level = 'ouro' THEN 3
          ELSE 99
        END`,
        'ASC',
      )
      .getMany();
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
