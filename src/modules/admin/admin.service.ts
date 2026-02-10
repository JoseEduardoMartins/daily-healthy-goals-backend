import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, SubscriptionStatus } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Exercise } from '../exercises/entities/exercise.entity';
import { Plan } from '../plans/entities/plan.entity';
import { Subscription as SubscriptionEntity, SubscriptionStatus as SubscriptionEntityStatus } from '../subscriptions/entities/subscription.entity';
import { DailyCheckin } from '../daily-checkins/entities/daily-checkin.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { UserTypesService } from '../user-types/user-types.service';
import { PlansService } from '../plans/plans.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Exercise)
    private exercisesRepository: Repository<Exercise>,
    @InjectRepository(Plan)
    private plansRepository: Repository<Plan>,
    @InjectRepository(SubscriptionEntity)
    private subscriptionsRepository: Repository<SubscriptionEntity>,
    @InjectRepository(DailyCheckin)
    private dailyCheckinsRepository: Repository<DailyCheckin>,
    private userTypesService: UserTypesService,
    private plansService: PlansService,
  ) {}

  // ==================== MÉTRICAS ====================

  async getMetrics() {
    const [
      totalUsers,
      activeSubscriptions,
      totalCheckins,
      usersByType,
      subscriptionsByStatus,
      usersByPlan,
    ] = await Promise.all([
      this.usersRepository.count({
        where: { is_deleted: false },
      }),
      this.subscriptionsRepository.count({
        where: { status: SubscriptionEntityStatus.ACTIVE },
      }),
      this.dailyCheckinsRepository.count(),
      this.usersRepository
        .createQueryBuilder('user')
        .where('user.is_deleted = :isDeleted', { isDeleted: false })
        .leftJoin('user.user_type', 'user_type')
        .select('user_type.name', 'type')
        .addSelect('COUNT(user.id)', 'count')
        .groupBy('user_type.name')
        .getRawMany(),
      this.subscriptionsRepository
        .createQueryBuilder('subscription')
        .select('subscription.status', 'status')
        .addSelect('COUNT(subscription.id)', 'count')
        .groupBy('subscription.status')
        .getRawMany(),
      this.usersRepository
        .createQueryBuilder('user')
        .leftJoin('user.plan', 'plan')
        .select('plan.name', 'plan')
        .addSelect('COUNT(user.id)', 'count')
        .where('user.plan_id IS NOT NULL')
        .andWhere('user.is_deleted = :isDeleted', { isDeleted: false })
        .groupBy('plan.name')
        .getRawMany(),
    ]);

    return {
      users: {
        total: totalUsers,
        by_type: usersByType.map((item) => ({
          type: item.type || 'sem_tipo',
          count: parseInt(item.count),
        })),
      },
      subscriptions: {
        active: activeSubscriptions,
        by_status: subscriptionsByStatus.map((item) => ({
          status: item.status,
          count: parseInt(item.count),
        })),
      },
      users_by_plan: usersByPlan.map((item) => ({
        plan: item.plan,
        count: parseInt(item.count),
      })),
      daily_checkins: {
        total: totalCheckins,
      },
    };
  }

  // ==================== CRUD USUÁRIOS ====================

  async findAllUsers(includeDeleted: boolean = false) {
    const queryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.user_type', 'user_type')
      .leftJoinAndSelect('user.plan', 'plan')
      .orderBy('user.created_at', 'DESC');

    if (!includeDeleted) {
      queryBuilder.where('user.is_deleted = :isDeleted', { isDeleted: false });
    }

    return await queryBuilder.getMany();
  }

  async findUserById(id: string, includeDeleted: boolean = false) {
    const queryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.user_type', 'user_type')
      .leftJoinAndSelect('user.plan', 'plan')
      .leftJoinAndSelect('user.subscriptions', 'subscriptions')
      .leftJoinAndSelect('user.daily_checkins', 'daily_checkins')
      .where('user.id = :id', { id });

    if (!includeDeleted) {
      queryBuilder.andWhere('user.is_deleted = :isDeleted', { isDeleted: false });
    }

    const user = await queryBuilder.getOne();

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email, is_deleted: false },
    });

    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    const userType = await this.userTypesService.findByName(createUserDto.user_type);
    if (!userType) {
      throw new NotFoundException(`Tipo de usuário "${createUserDto.user_type}" não encontrado`);
    }

    let planId: string | null = null;
    let subscriptionStatus: SubscriptionStatus | null = null;
    let subscriptionExpiresAt: Date | null = null;

    if (createUserDto.user_type === 'visitante') {
      if (createUserDto.plan_id) {
        throw new BadRequestException('Usuários visitantes não podem ter plano associado');
      }
    }

    if (createUserDto.user_type === 'pagante' && createUserDto.plan_id) {
      const plan = await this.plansService.findOne(createUserDto.plan_id);
      if (!plan.is_active) {
        throw new BadRequestException('O plano selecionado não está ativo');
      }
      planId = createUserDto.plan_id;
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.usersRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashedPassword,
      weight: createUserDto.weight,
      height: createUserDto.height,
      user_type_id: userType.id,
      plan_id: planId,
      subscription_status: subscriptionStatus,
      subscription_expires_at: subscriptionExpiresAt,
    });

    return await this.usersRepository.save(user);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findUserById(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: updateUserDto.email, is_deleted: false },
      });

      if (existingUser) {
        throw new ConflictException('Email já está em uso');
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    if (updateUserDto.user_type) {
      const userType = await this.userTypesService.findByName(updateUserDto.user_type);
      if (!userType) {
        throw new NotFoundException(`Tipo de usuário "${updateUserDto.user_type}" não encontrado`);
      }
      (updateUserDto as any).user_type_id = userType.id;
      delete (updateUserDto as any).user_type;
    }

    if (updateUserDto.plan_id !== undefined) {
      if (updateUserDto.plan_id) {
        const plan = await this.plansService.findOne(updateUserDto.plan_id);
        if (!plan.is_active) {
          throw new BadRequestException('O plano selecionado não está ativo');
        }
      }
    }

    // Preparar dados para atualização
    const updateData: any = { ...updateUserDto };
    
    // Remover campos que não existem na entidade
    if ('user_type' in updateData) {
      delete updateData.user_type;
    }
    
    // Se user_type foi fornecido, buscar o ID
    if (updateUserDto.user_type) {
      const userType = await this.userTypesService.findByName(updateUserDto.user_type);
      if (!userType) {
        throw new NotFoundException(`Tipo de usuário "${updateUserDto.user_type}" não encontrado`);
      }
      updateData.user_type_id = userType.id;
    }

    await this.usersRepository.update(id, updateData);

    return await this.findUserById(id);
  }

  async deleteUser(id: string) {
    const user = await this.findUserById(id, true); // Permite buscar mesmo se deletado
    
    if (user.is_deleted) {
      throw new BadRequestException('Usuário já está deletado');
    }

    await this.usersRepository.update(id, { is_deleted: true });
    return { message: 'Usuário removido com sucesso' };
  }

  // ==================== CRUD PRODUTOS ====================

  async findAllProducts() {
    return await this.productsRepository.find({
      relations: ['category', 'pain_state', 'user_type', 'plan'],
      order: { name: 'ASC' },
    });
  }

  async findProductById(id: string) {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category', 'pain_state', 'user_type', 'plan', 'product_ingredients'],
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    return product;
  }

  async createProduct(createProductDto: CreateProductDto) {
    const product = this.productsRepository.create(createProductDto);
    return await this.productsRepository.save(product);
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto) {
    await this.findProductById(id);
    await this.productsRepository.update(id, updateProductDto);
    return await this.findProductById(id);
  }

  async deleteProduct(id: string) {
    const product = await this.findProductById(id);
    await this.productsRepository.remove(product);
    return { message: 'Produto removido com sucesso' };
  }

  // ==================== CRUD EXERCÍCIOS ====================

  async findAllExercises() {
    return await this.exercisesRepository.find({
      relations: ['category', 'pain_state', 'user_type', 'plan'],
      order: { name: 'ASC' },
    });
  }

  async findExerciseById(id: string) {
    const exercise = await this.exercisesRepository.findOne({
      where: { id },
      relations: ['category', 'pain_state', 'user_type', 'plan'],
    });

    if (!exercise) {
      throw new NotFoundException('Exercício não encontrado');
    }

    return exercise;
  }

  async createExercise(createExerciseDto: CreateExerciseDto) {
    const exercise = this.exercisesRepository.create(createExerciseDto);
    return await this.exercisesRepository.save(exercise);
  }

  async updateExercise(id: string, updateExerciseDto: UpdateExerciseDto) {
    await this.findExerciseById(id);
    await this.exercisesRepository.update(id, updateExerciseDto);
    return await this.findExerciseById(id);
  }

  async deleteExercise(id: string) {
    const exercise = await this.findExerciseById(id);
    await this.exercisesRepository.remove(exercise);
    return { message: 'Exercício removido com sucesso' };
  }

  // ==================== CRUD PLANOS ====================

  async findAllPlans() {
    // Ordenar por hierarquia: bronze (1) < prata (2) < ouro (3)
    return await this.plansRepository
      .createQueryBuilder('plan')
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

  async findPlanById(id: string) {
    const plan = await this.plansRepository.findOne({
      where: { id },
      relations: ['users'],
    });

    if (!plan) {
      throw new NotFoundException('Plano não encontrado');
    }

    return plan;
  }

  async createPlan(createPlanDto: CreatePlanDto) {
    const existingPlan = await this.plansRepository.findOne({
      where: { name: createPlanDto.name },
    });

    if (existingPlan) {
      throw new ConflictException('Já existe um plano com este nome');
    }

    const plan = this.plansRepository.create({
      ...createPlanDto,
      is_active: createPlanDto.is_active ?? true,
    });

    return await this.plansRepository.save(plan);
  }

  async updatePlan(id: string, updatePlanDto: UpdatePlanDto) {
    await this.findPlanById(id);

    if (updatePlanDto.name) {
      const existingPlan = await this.plansRepository.findOne({
        where: { name: updatePlanDto.name },
      });

      if (existingPlan && existingPlan.id !== id) {
        throw new ConflictException('Já existe um plano com este nome');
      }
    }

    await this.plansRepository.update(id, updatePlanDto);
    return await this.findPlanById(id);
  }

  async deletePlan(id: string) {
    const plan = await this.findPlanById(id);

    // Verificar se há usuários com este plano
    const usersWithPlan = await this.usersRepository.count({
      where: { plan_id: id },
    });

    if (usersWithPlan > 0) {
      throw new BadRequestException(
        `Não é possível remover o plano. Existem ${usersWithPlan} usuário(s) associado(s) a este plano.`,
      );
    }

    await this.plansRepository.remove(plan);
    return { message: 'Plano removido com sucesso' };
  }
}
