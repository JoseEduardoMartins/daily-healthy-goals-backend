import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

export interface JwtPayload {
  sub: string; // user id
  email: string;
  role: string; // user_type name (admin, visitante, pagante)
  plan_id?: string | null;
  user_type_id?: string | null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret'),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findOne(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    
    // Verificar se assinatura expirou
    const now = new Date();
    const isSubscriptionExpired =
      user.subscription_expires_at && user.subscription_expires_at < now;

    // ✅ CORREÇÃO: Usar dados do banco como fonte de verdade, não do token
    // O token JWT é usado apenas para identificar o usuário (ID),
    // mas todas as informações de permissão vêm do banco atualizado
    let effectiveRole = user.user_type?.name || 'visitante';
    let effectivePlanId = user.plan_id;
    let effectiveSubscriptionStatus = user.subscription_status;
    let effectiveSubscriptionExpiresAt = user.subscription_expires_at;

    // Se assinatura expirou e usuário é pagante, downgrade para visitante
    if (
      effectiveRole === 'pagante' &&
      (isSubscriptionExpired ||
        effectiveSubscriptionStatus === 'expired' ||
        effectiveSubscriptionStatus === 'canceled')
    ) {
      // Assinatura expirada ou cancelada - tratar como visitante
      effectiveRole = 'visitante';
      effectivePlanId = null;
      effectiveSubscriptionStatus = null;
      effectiveSubscriptionExpiresAt = null;
    }

    return {
      id: user.id,
      email: user.email,
      role: effectiveRole, // ✅ Do banco, não do token
      plan_id: effectivePlanId, // ✅ Do banco, não do token
      plan_level: user.plan?.level || null, // ✅ Do banco
      user_type_id: user.user_type_id, // ✅ Do banco
      subscription_status: effectiveSubscriptionStatus, // ✅ Do banco
      subscription_expires_at: effectiveSubscriptionExpiresAt, // ✅ Do banco
      birth_date: user.birth_date ?? null, // Para metas de alimentação por faixa etária
    };
  }
}
