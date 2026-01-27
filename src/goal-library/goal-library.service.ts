import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GoalLibrary } from './entities/goal-library.entity';

@Injectable()
export class GoalLibraryService {
  constructor(
    @InjectRepository(GoalLibrary)
    private goalLibraryRepository: Repository<GoalLibrary>,
  ) {}

  async findByCategoryId(categoryId: number): Promise<GoalLibrary[]> {
    return await this.goalLibraryRepository.find({
      where: { category_id: categoryId },
      order: { id: 'ASC' },
    });
  }
}
