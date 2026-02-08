import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
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
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
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

    const { password, ...userWithoutPassword } = user;

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
      },
    };
  }
}
