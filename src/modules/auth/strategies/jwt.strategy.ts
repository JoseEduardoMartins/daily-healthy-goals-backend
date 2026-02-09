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

    // Se assinatura expirou e usuário é pagante, downgrade para visitante
    let effectiveRole = payload.role;
    let effectivePlanId = payload.plan_id;
    let effectiveSubscriptionStatus = user.subscription_status;
    let effectiveSubscriptionExpiresAt = user.subscription_expires_at;

    if (
      payload.role === 'pagante' &&
      (isSubscriptionExpired ||
        user.subscription_status === 'expired' ||
        user.subscription_status === 'canceled')
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
      role: effectiveRole,
      plan_id: effectivePlanId,
      plan_level: user.plan?.level || null,
      user_type_id: payload.user_type_id || user.user_type_id,
      subscription_status: effectiveSubscriptionStatus,
      subscription_expires_at: effectiveSubscriptionExpiresAt,
    };
  }
}
