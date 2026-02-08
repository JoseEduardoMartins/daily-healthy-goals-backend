import { CurrentUserPayload } from '../decorators/current-user.decorator';

/**
 * Verifica se um usuário pode acessar um recurso baseado no tipo e plano
 * 
 * Regras:
 * - admin: acesso a tudo
 * - visitante: apenas recursos de visitante (user_type_id = visitante, plan_id = null) + recursos públicos
 * - pagante: recursos de visitante + recursos do seu plano + recursos públicos
 */
export class PermissionsHelper {
  /**
   * Verifica se o usuário pode acessar um recurso
   */
  static canAccess(
    user: CurrentUserPayload,
    resourceUserTypeId: string | null,
    resourcePlanId: string | null,
  ): boolean {
    // Admin tem acesso a tudo
    if (user.role === 'admin') {
      return true;
    }

    // Se o recurso não tem restrições (null), todos podem acessar (público)
    if (!resourceUserTypeId && !resourcePlanId) {
      return true;
    }

    // Visitante só pode acessar recursos públicos ou de visitante
    if (user.role === 'visitante') {
      // Recursos públicos (sem restrições)
      if (!resourceUserTypeId && !resourcePlanId) {
        return true;
      }
      // Recursos de visitante (user_type_id = visitante, plan_id = null)
      // Visitante autenticado pode ver recursos de visitante
      if (user.user_type_id && resourceUserTypeId === user.user_type_id && !resourcePlanId) {
        return true;
      }
      // Visitante anônimo (sem user_type_id) só vê recursos públicos
      return false;
    }

    // Pagante pode acessar:
    // 1. Recursos públicos (sem restrições)
    // 2. Recursos de visitante (user_type_id = visitante, plan_id = null)
    // 3. Recursos do seu plano
    if (user.role === 'pagante') {
      // Recursos públicos
      if (!resourceUserTypeId && !resourcePlanId) {
        return true;
      }

      // Se tem plan_id, verifica se o usuário tem o mesmo plano
      if (resourcePlanId) {
        return user.plan_id === resourcePlanId;
      }

      // Recursos de visitante (sem plan_id) são acessíveis por pagante
      return true;
    }

    return false;
  }

  /**
   * Filtra recursos baseado no role e plan_id do usuário
   * Retorna apenas recursos que o usuário pode acessar
   */
  static filterByAccess<T extends { user_type_id?: string | null; plan_id?: string | null }>(
    resources: T[],
    user: CurrentUserPayload,
  ): T[] {
    return resources.filter((resource) =>
      this.canAccess(user, resource.user_type_id || null, resource.plan_id || null),
    );
  }

  /**
   * Cria condições SQL para filtrar recursos baseado no role do usuário
   */
  static getQueryConditions(user: CurrentUserPayload) {
    // Admin: sem filtros (acessa tudo)
    if (user.role === 'admin') {
      return null; // Sem filtros
    }

    // Visitante: apenas recursos públicos (sem restrições) ou de visitante
    if (user.role === 'visitante') {
      // Visitante anônimo (sem token): apenas recursos públicos
      // Visitante autenticado também vê apenas recursos públicos por enquanto
      // (produtos específicos de visitante serão implementados quando necessário)
      return {
        condition: '(user_type_id IS NULL AND plan_id IS NULL)',
        params: {},
      };
    }

    // Pagante: recursos públicos + recursos de visitante + recursos do seu plano
    if (user.role === 'pagante') {
      if (user.plan_id) {
        return {
          condition:
            '(user_type_id IS NULL AND plan_id IS NULL) OR (plan_id = :planId)',
          params: { planId: user.plan_id },
        };
      }
      // Se não tem plano, apenas recursos públicos
      return {
        condition: '(user_type_id IS NULL AND plan_id IS NULL)',
        params: {},
      };
    }

    // Sem role: apenas recursos públicos
    return {
      condition: '(user_type_id IS NULL AND plan_id IS NULL)',
      params: {},
    };
  }
}
