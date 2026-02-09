import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface CurrentUserPayload {
  id?: string | null;
  email?: string;
  role: string;
  plan_id?: string | null;
  plan_level?: string | null; // 'bronze', 'prata', 'ouro'
  user_type_id?: string | null;
  subscription_status?: string | null; // 'active', 'canceled', 'expired', 'past_due', 'trialing'
  subscription_expires_at?: Date | null;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CurrentUserPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user || {
      role: 'visitante',
      plan_id: null,
      subscription_status: null,
      subscription_expires_at: null,
    };
  },
);
