import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Permite acesso sem autenticação se não houver token
    // Isso permite que visitantes acessem recursos públicos
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      // Sem token = visitante anônimo (só recursos públicos)
      request.user = { role: 'visitante', plan_id: null, user_type_id: null, id: null };
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // Se houver erro ou usuário não encontrado, trata como visitante anônimo
    if (err || !user || info) {
      const request = context.switchToHttp().getRequest();
      request.user = { role: 'visitante', plan_id: null, user_type_id: null, id: null };
      return request.user;
    }
    return user;
  }
}
