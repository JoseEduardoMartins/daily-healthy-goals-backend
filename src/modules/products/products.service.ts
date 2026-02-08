import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async findByPainStateId(painStateId: string): Promise<Product[]> {
    return await this.productsRepository.find({
      where: { pain_state_id: painStateId },
      order: { name: 'ASC' },
    });
  }

  async findAll(): Promise<Product[]> {
    return await this.productsRepository.find({
      relations: ['category', 'pain_state'],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Product> {
    return await this.productsRepository.findOne({
      where: { id },
      relations: ['category', 'pain_state', 'product_ingredients', 'product_ingredients.ingredient'],
    });
  }
}
