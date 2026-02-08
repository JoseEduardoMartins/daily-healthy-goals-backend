import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { User } from '../users/entities/user.entity';
import { PermissionsHelper } from '../../common/helpers/permissions.helper';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async findAll(user?: User): Promise<Product[]> {
    const queryBuilder = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.pain_state', 'pain_state')
      .leftJoinAndSelect('product.user_type', 'user_type')
      .leftJoinAndSelect('product.plan', 'plan');

    // Se não tem usuário, retorna apenas recursos públicos (sem restrições)
    if (!user) {
      queryBuilder.where('product.user_type_id IS NULL AND product.plan_id IS NULL');
    } else {
      // Admin vê tudo
      if (user.user_type?.name === 'admin') {
        // Sem filtros
      } else if (user.user_type?.name === 'visitante') {
        // Visitante: apenas recursos de visitante
        queryBuilder.where(
          '(product.user_type_id = :userTypeId AND product.plan_id IS NULL)',
          { userTypeId: user.user_type_id },
        );
      } else if (user.user_type?.name === 'pagante') {
        // Pagante: recursos de visitante + recursos do seu plano
        queryBuilder.where(
          '(product.user_type_id = :userTypeId AND product.plan_id IS NULL) OR (product.plan_id = :planId)',
          { userTypeId: user.user_type_id, planId: user.plan_id },
        );
      } else {
        // Sem tipo definido: apenas recursos públicos
        queryBuilder.where('product.user_type_id IS NULL AND product.plan_id IS NULL');
      }
    }

    return await queryBuilder.orderBy('product.name', 'ASC').getMany();
  }

  async findOne(id: string, user?: User): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: [
        'category',
        'pain_state',
        'product_ingredients',
        'product_ingredients.ingredient',
        'user_type',
        'plan',
      ],
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    // Verifica permissão de acesso
    if (user && !PermissionsHelper.canAccess(user, product.user_type_id, product.plan_id)) {
      throw new NotFoundException('Produto não encontrado');
    }

    return product;
  }

  async findByPainStateId(painStateId: string, user?: User): Promise<Product[]> {
    const queryBuilder = this.productsRepository
      .createQueryBuilder('product')
      .where('product.pain_state_id = :painStateId', { painStateId });

    // Aplica filtros de permissão
    if (!user) {
      queryBuilder.andWhere('product.user_type_id IS NULL AND product.plan_id IS NULL');
    } else if (user.user_type?.name === 'admin') {
      // Admin vê tudo
    } else if (user.user_type?.name === 'visitante') {
      queryBuilder.andWhere(
        '(product.user_type_id = :userTypeId AND product.plan_id IS NULL)',
        { userTypeId: user.user_type_id },
      );
    } else if (user.user_type?.name === 'pagante') {
      queryBuilder.andWhere(
        '(product.user_type_id = :userTypeId AND product.plan_id IS NULL) OR (product.plan_id = :planId)',
        { userTypeId: user.user_type_id, planId: user.plan_id },
      );
    } else {
      queryBuilder.andWhere('product.user_type_id IS NULL AND product.plan_id IS NULL');
    }

    return await queryBuilder.orderBy('product.name', 'ASC').getMany();
  }
}
