import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    return await this.categoriesRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findByType(type: 'diet' | 'exercise'): Promise<Category[]> {
    return await this.categoriesRepository.find({
      where: { type },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Category> {
    return await this.categoriesRepository.findOne({ where: { id } });
  }
}
