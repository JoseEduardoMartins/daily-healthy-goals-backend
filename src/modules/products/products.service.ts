import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { PermissionsHelper } from '../../common/helpers/permissions.helper';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async findAll(user: CurrentUserPayload): Promise<Product[]> {
    const queryBuilder = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.pain_state', 'pain_state');

    // Aplica filtros baseado no role do usuário
    const conditions = PermissionsHelper.getQueryConditions(user);
    if (conditions) {
      queryBuilder.where(conditions.condition, conditions.params);
    }

    const products = await queryBuilder.orderBy('product.name', 'ASC').getMany();

    // Filtra novamente para garantir (caso algum produto tenha restrições específicas)
    return PermissionsHelper.filterByAccess(products, user);
  }

  async findOne(id: string, user: CurrentUserPayload): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: [
        'category',
        'pain_state',
        'product_ingredients',
        'product_ingredients.ingredient',
      ],
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    // Verifica permissão de acesso
    if (
      !PermissionsHelper.canAccess(
        user,
        product.user_type_id || null,
        product.plan_id || null,
      )
    ) {
      throw new NotFoundException('Produto não encontrado');
    }

    return product;
  }

  async findByPainStateId(painStateId: string, user: CurrentUserPayload): Promise<Product[]> {
    const queryBuilder = this.productsRepository
      .createQueryBuilder('product')
      .where('product.pain_state_id = :painStateId', { painStateId })
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.pain_state', 'pain_state');

    // Aplica filtros de permissão
    const conditions = PermissionsHelper.getQueryConditions(user);
    if (conditions) {
      queryBuilder.andWhere(conditions.condition, conditions.params);
    }

    const products = await queryBuilder.orderBy('product.name', 'ASC').getMany();

    // Filtra novamente para garantir
    return PermissionsHelper.filterByAccess(products, user);
  }
}
