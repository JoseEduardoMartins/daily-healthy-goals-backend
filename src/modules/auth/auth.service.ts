import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { RegisterDto } from '../../common/dtos/auth/register.dto';
import { LoginDto } from '../../common/dtos/auth/login.dto';
import { User } from '../users/entities/user.entity';
import { JwtPayload } from './strategies/jwt.strategy';
import * as bcrypt from 'bcrypt';

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    weight: number;
    height: number;
    role: string;
    plan_id: string | null;
    user_type_id: string | null;
    subscription?: {
      hasActiveSubscription: boolean;
      status: string | null;
      expires_at: string | null;
      plan?: {
        id: string;
        name: string;
        level: string;
      } | null;
      current_period_end?: string | null;
      cancel_at_period_end?: boolean;
    } | null;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly subscriptionsService: SubscriptionsService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const user = await this.usersService.create(registerDto);
    return this.generateTokenResponse(user);
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return this.generateTokenResponse(user);
  }

  private async generateTokenResponse(user: User): Promise<AuthResponse> {
    const role = user.user_type?.name || 'visitante';
    
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role,
      plan_id: user.plan_id,
      user_type_id: user.user_type_id,
    };

    const access_token = this.jwtService.sign(payload);

    // Buscar informações de subscription
    let subscriptionInfo = null;
    try {
      const subscriptionStatus = await this.subscriptionsService.getSubscriptionStatus(user.id);
      
      // Converter subscription_expires_at para ISO string se for Date
      let expiresAt: string | null = null;
      if (subscriptionStatus.user.subscription_expires_at) {
        expiresAt = subscriptionStatus.user.subscription_expires_at instanceof Date
          ? subscriptionStatus.user.subscription_expires_at.toISOString()
          : new Date(subscriptionStatus.user.subscription_expires_at).toISOString();
      }
      
      // Converter current_period_end para ISO string se for Date
      let currentPeriodEnd: string | null = null;
      if (subscriptionStatus.subscription?.current_period_end) {
        currentPeriodEnd = subscriptionStatus.subscription.current_period_end instanceof Date
          ? subscriptionStatus.subscription.current_period_end.toISOString()
          : new Date(subscriptionStatus.subscription.current_period_end).toISOString();
      }
      
      subscriptionInfo = {
        hasActiveSubscription: subscriptionStatus.hasActiveSubscription,
        status: subscriptionStatus.user.subscription_status,
        expires_at: expiresAt,
        plan: subscriptionStatus.subscription?.plan || null,
        current_period_end: currentPeriodEnd,
        cancel_at_period_end: subscriptionStatus.subscription?.cancel_at_period_end || false,
      };
    } catch (error) {
      // Se houver erro ao buscar subscription, retornar informações básicas do usuário
      let expiresAt: string | null = null;
      if (user.subscription_expires_at) {
        expiresAt = user.subscription_expires_at instanceof Date
          ? user.subscription_expires_at.toISOString()
          : new Date(user.subscription_expires_at).toISOString();
      }
      
      subscriptionInfo = {
        hasActiveSubscription: false,
        status: user.subscription_status,
        expires_at: expiresAt,
        plan: user.plan ? {
          id: user.plan.id,
          name: user.plan.name,
          level: user.plan.level,
        } : null,
        current_period_end: null,
        cancel_at_period_end: false,
      };
    }

    return {
      access_token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        weight: user.weight,
        height: user.height,
        role,
        plan_id: user.plan_id,
        user_type_id: user.user_type_id,
        subscription: subscriptionInfo,
      },
    };
  }
}
