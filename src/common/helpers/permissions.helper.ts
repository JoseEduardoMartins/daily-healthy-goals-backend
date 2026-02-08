import { User } from '../../modules/users/entities/user.entity';

/**
 * Verifica se um usuário pode acessar um recurso baseado no tipo e plano
 * 
 * Regras:
 * - admin: acesso a tudo
 * - visitante: apenas recursos de visitante (user_type_id = visitante, plan_id = null)
 * - pagante: recursos de visitante + recursos do seu plano e planos inferiores
 */
export class PermissionsHelper {
  /**
   * Verifica se o usuário pode acessar um recurso
   */
  static canAccess(
    user: User,
    resourceUserTypeId: string | null,
    resourcePlanId: string | null,
  ): boolean {
    // Admin tem acesso a tudo
    if (user.user_type?.name === 'admin') {
      return true;
    }

    // Se o recurso não tem restrições (null), todos podem acessar
    if (!resourceUserTypeId && !resourcePlanId) {
      return true;
    }

    // Visitante só pode acessar recursos de visitante
    if (user.user_type?.name === 'visitante') {
      return resourceUserTypeId === user.user_type_id && !resourcePlanId;
    }

    // Pagante pode acessar:
    // 1. Recursos de visitante (user_type_id = visitante, plan_id = null)
    // 2. Recursos do seu plano ou planos inferiores
    if (user.user_type?.name === 'pagante') {
      // Recursos de visitante
      if (resourceUserTypeId && resourceUserTypeId !== user.user_type_id && !resourcePlanId) {
        return false; // Não é recurso de visitante
      }

      // Se tem plan_id, verifica se o usuário tem plano e se é compatível
      if (resourcePlanId) {
        if (!user.plan_id) {
          return false; // Usuário não tem plano
        }

        // Verifica hierarquia de planos
        return this.canAccessPlan(user.plan?.level || '', resourcePlanId);
      }

      // Se não tem plan_id mas tem user_type_id, verifica se é do mesmo tipo
      if (resourceUserTypeId) {
        return resourceUserTypeId === user.user_type_id;
      }

      return true;
    }

    return false;
  }

  /**
   * Verifica se um plano pode acessar outro plano baseado na hierarquia
   * bronze < silver < gold < platinum
   */
  private static canAccessPlan(
    userPlanLevel: string,
    resourcePlanId: string,
  ): boolean {
    // TODO: Implementar lógica de hierarquia quando necessário
    // Por enquanto, apenas verifica se o usuário tem o mesmo plano
    // Isso será expandido quando houver mais planos
    return true; // Simplificado por enquanto
  }

  /**
   * Cria query builder conditions para filtrar recursos baseado no usuário
   */
  static getAccessConditions(user: User) {
    const conditions: any = {};

    // Admin: sem filtros (acessa tudo)
    if (user.user_type?.name === 'admin') {
      return {}; // Retorna vazio para não filtrar
    }

    // Visitante: apenas recursos de visitante
    if (user.user_type?.name === 'visitante') {
      return {
        user_type_id: user.user_type_id,
        plan_id: null,
      };
    }

    // Pagante: recursos de visitante + recursos do seu plano
    if (user.user_type?.name === 'pagante') {
      // Retorna condições que permitem:
      // 1. Recursos de visitante (user_type_id = visitante, plan_id = null)
      // 2. Recursos do plano do usuário
      // Isso será implementado com OR na query
      return {
        user_type_id: user.user_type_id,
        plan_id: user.plan_id,
      };
    }

    return conditions;
  }
}
