import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { RegisterDto } from '../../common/dtos/auth/register.dto';
import { UserTypesService } from '../user-types/user-types.service';
import { PlansService } from '../plans/plans.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private userTypesService: UserTypesService,
    private plansService: PlansService,
  ) {}

  async create(registerDto: RegisterDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: registerDto.email },
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

    // Se for visitante, garantir que não tem plano
    if (registerDto.user_type === 'visitante') {
      if (registerDto.plan_id) {
        throw new BadRequestException('Usuários visitantes não podem ter plano associado');
      }
      planId = null;
    }

    // Se for pagante, validar que tem plano e que o plano existe e está ativo
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

      planId = registerDto.plan_id;
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = this.usersRepository.create({
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPassword,
      weight: registerDto.weight,
      height: registerDto.height,
      user_type_id: userType.id,
      plan_id: planId,
    });

    const savedUser = await this.usersRepository.save(user);
    
    // Retornar o usuário com relacionamentos carregados
    return await this.findOne(savedUser.id);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find({
      relations: ['user_type', 'plan'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['user_type', 'plan'],
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { email },
      relations: ['user_type', 'plan'],
    });
  }
}
