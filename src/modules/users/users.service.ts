import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, SubscriptionStatus } from './entities/user.entity';
import { RegisterDto } from '../../common/dtos/auth/register.dto';
import { UserTypesService } from '../user-types/user-types.service';
import { PlansService } from '../plans/plans.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private userTypesService: UserTypesService,
    private plansService: PlansService,
  ) {}

  async create(registerDto: RegisterDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: registerDto.email, is_deleted: false },
    });

    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    // Buscar o tipo de usuário pelo nome
    // Nota: O DTO já valida que user_type só pode ser 'visitante' ou 'pagante' (admin não permitido)
    const userType = await this.userTypesService.findByName(registerDto.user_type);
    if (!userType) {
      throw new NotFoundException(`Tipo de usuário "${registerDto.user_type}" não encontrado`);
    }

    let planId: string | null = null;
    let subscriptionStatus: SubscriptionStatus | null = null;
    let subscriptionExpiresAt: Date | null = null;
    let finalUserTypeId: string = userType.id;

    // Se for visitante, garantir que não tem plano
    if (registerDto.user_type === 'visitante') {
      if (registerDto.plan_id) {
        throw new BadRequestException('Usuários visitantes não podem ter plano associado');
      }
      planId = null;
      subscriptionStatus = null;
      subscriptionExpiresAt = null;
    }

    // Se for pagante, validar que tem plano e que o plano existe e está ativo
    // IMPORTANTE: Não atribuir o plano ainda - será atribuído apenas após confirmação do pagamento
    if (registerDto.user_type === 'pagante') {
      if (!registerDto.plan_id) {
        throw new BadRequestException('Usuários pagantes devem selecionar um plano');
      }

      const plan = await this.plansService.findOne(registerDto.plan_id);
      if (!plan) {
        throw new NotFoundException('Plano não encontrado');
      }

      if (!plan.is_active) {
        throw new BadRequestException('O plano selecionado não está ativo');
      }

      // NÃO atribuir o plano ainda - será atribuído apenas após confirmação do pagamento via webhook
      // Criar como visitante temporariamente até o pagamento ser confirmado
      const visitorType = await this.userTypesService.findByName('visitante');
      if (!visitorType) {
        throw new NotFoundException('Tipo de usuário "visitante" não encontrado');
      }
      finalUserTypeId = visitorType.id;
      planId = null;
      subscriptionStatus = null;
      subscriptionExpiresAt = null;

      // Armazenar o plan_id desejado no campo plan_id temporariamente (será usado no checkout)
      // Mas não vamos atribuir ainda - vamos criar uma tabela ou usar metadata
      // Por enquanto, vamos criar como visitante e o plano será atribuído no webhook
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = this.usersRepository.create({
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPassword,
      weight: registerDto.weight,
      height: registerDto.height,
      birth_date: registerDto.birth_date ? new Date(registerDto.birth_date) : null,
      user_type_id: finalUserTypeId,
      plan_id: planId,
      subscription_status: subscriptionStatus,
      subscription_expires_at: subscriptionExpiresAt,
    });

    const savedUser = await this.usersRepository.save(user);

    // Retornar o usuário com relacionamentos carregados
    return await this.findOne(savedUser.id);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find({
      where: { is_deleted: false },
      relations: ['user_type', 'plan'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id, is_deleted: false },
      relations: ['user_type', 'plan'],
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { email, is_deleted: false },
      relations: ['user_type', 'plan'],
    });
  }

  async updateStripeCustomerId(userId: string, stripeCustomerId: string): Promise<void> {
    await this.usersRepository.update(userId, {
      stripe_customer_id: stripeCustomerId,
    });
  }

  async updateSubscription(
    userId: string,
    planId: string,
    subscriptionStatus: SubscriptionStatus,
    subscriptionExpiresAt: Date,
  ): Promise<void> {
    this.logger.log(
      `🔄 updateSubscription chamado: userId=${userId}, planId=${planId}, status=${subscriptionStatus}, expiresAt=${subscriptionExpiresAt.toISOString()}`,
    );

    // Buscar tipo pagante para atualizar o user_type_id
    const payingUserType = await this.userTypesService.findByName('pagante');
    if (!payingUserType) {
      throw new NotFoundException('Tipo de usuário "pagante" não encontrado');
    }

    this.logger.log(
      `📝 Atualizando usuário ${userId}: user_type_id=${payingUserType.id}, plan_id=${planId}, subscription_status=${subscriptionStatus}`,
    );

    await this.usersRepository.update(userId, {
      user_type_id: payingUserType.id,
      plan_id: planId,
      subscription_status: subscriptionStatus,
      subscription_expires_at: subscriptionExpiresAt,
    });

    this.logger.log(`✅ Usuário ${userId} atualizado com sucesso no banco de dados`);
  }

  async updateSubscriptionStatus(
    userId: string,
    subscriptionStatus: SubscriptionStatus,
  ): Promise<void> {
    await this.usersRepository.update(userId, {
      subscription_status: subscriptionStatus,
    });
  }

  async cancelSubscription(userId: string): Promise<void> {
    // Buscar tipo visitante
    const visitanteType = await this.userTypesService.findByName('visitante');
    if (!visitanteType) {
      throw new NotFoundException('Tipo de usuário visitante não encontrado');
    }

    // Downgrade para visitante
    await this.usersRepository.update(userId, {
      user_type_id: visitanteType.id,
      plan_id: null,
      subscription_status: SubscriptionStatus.CANCELED,
      subscription_expires_at: null,
    });
  }
}
