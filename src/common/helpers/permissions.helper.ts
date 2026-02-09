import { CurrentUserPayload } from '../decorators/current-user.decorator';

/**
 * Verifica se um usuário pode acessar um recurso baseado no tipo e plano
 * 
 * Regras:
 * - admin: acesso a tudo
 * - visitante: apenas recursos públicos (user_type_id = null, plan_id = null)
 * - pagante: recursos públicos + recursos de planos inferiores ou iguais ao seu
 *   Hierarquia: bronze (1) < prata (2) < ouro (3)
 */
export class PermissionsHelper {
  /**
   * Mapeia o nível do plano para um número para comparação hierárquica
   */
  private static getPlanLevelValue(planLevel: string | null): number {
    if (!planLevel) return 0;
    const levels: { [key: string]: number } = {
      bronze: 1,
      prata: 2,
      ouro: 3,
    };
    return levels[planLevel.toLowerCase()] || 0;
  }

  /**
   * Verifica se o usuário pode acessar um recurso
   * Agora recebe também o plan_level do recurso para comparação hierárquica
   */
  static canAccess(
    user: CurrentUserPayload,
    resourceUserTypeId: string | null,
    resourcePlanId: string | null,
    resourcePlanLevel?: string | null,
  ): boolean {
    // Admin tem acesso a tudo
    if (user.role === 'admin') {
      return true;
    }

    // Se o recurso não tem restrições (null), todos podem acessar (público)
    if (!resourceUserTypeId && !resourcePlanId) {
      return true;
    }

    // Visitante só pode acessar recursos públicos
    if (user.role === 'visitante') {
      return !resourceUserTypeId && !resourcePlanId;
    }

    // Pagante pode acessar:
    // 1. Recursos públicos (sem restrições)
    // 2. Recursos do seu plano ou de planos inferiores (hierarquia)
    // MAS: precisa ter assinatura ativa
    if (user.role === 'pagante') {
      // Verificar se assinatura está ativa
      if (
        user.subscription_status !== 'active' &&
        user.subscription_status !== 'trialing'
      ) {
        // Assinatura não está ativa - tratar como visitante
        return !resourceUserTypeId && !resourcePlanId;
      }

      // Verificar se assinatura não expirou
      if (
        user.subscription_expires_at &&
        user.subscription_expires_at < new Date()
      ) {
        // Assinatura expirada - tratar como visitante
        return !resourceUserTypeId && !resourcePlanId;
      }

      // Recursos públicos
      if (!resourceUserTypeId && !resourcePlanId) {
        return true;
      }

      // Se tem plan_id, precisa verificar hierarquia
      if (resourcePlanId) {
        // Se o usuário tem o mesmo plan_id, pode acessar
        if (user.plan_id === resourcePlanId) {
          return true;
        }
        // Se temos o plan_level do recurso, podemos comparar hierarquia
        if (resourcePlanLevel && user.plan_level) {
          return this.canAccessPlanLevel(user.plan_level, resourcePlanLevel);
        }
        return false;
      }

      return false;
    }

    return false;
  }

  /**
   * Filtra recursos baseado no role e plan_id do usuário
   * Retorna apenas recursos que o usuário pode acessar
   * Agora considera a hierarquia de planos
   */
  static filterByAccess<T extends { user_type_id?: string | null; plan_id?: string | null; plan_level?: string | null }>(
    resources: T[],
    user: CurrentUserPayload,
  ): T[] {
    return resources.filter((resource) => {
      // Recursos públicos (sem restrições) - todos podem acessar
      if (!resource.user_type_id && !resource.plan_id) {
        return true;
      }

      // Admin tem acesso a tudo
      if (user.role === 'admin') {
        return true;
      }

      // Visitante só pode acessar recursos públicos
      if (user.role === 'visitante') {
        return false; // Já filtramos públicos acima
      }

      // Pagante: recursos públicos + recursos do seu plano ou inferiores
      // MAS: precisa ter assinatura ativa
      if (user.role === 'pagante') {
        // Verificar se assinatura está ativa
        if (
          user.subscription_status !== 'active' &&
          user.subscription_status !== 'trialing'
        ) {
          return false; // Assinatura não ativa - apenas recursos públicos (já filtrados acima)
        }

        // Verificar se assinatura não expirou
        if (
          user.subscription_expires_at &&
          user.subscription_expires_at < new Date()
        ) {
          return false; // Assinatura expirada - apenas recursos públicos
        }

        // Se o recurso tem plan_id e plan_level, verifica hierarquia
        if (resource.plan_id && resource.plan_level && user.plan_level) {
          return this.canAccessPlanLevel(user.plan_level, resource.plan_level);
        }
        // Se não tem plan_level mas tem plan_id, verifica se é o mesmo plano
        if (resource.plan_id && !resource.plan_level) {
          return user.plan_id === resource.plan_id;
        }
        return false;
      }

      return false;
    });
  }

  /**
   * Cria condições SQL para filtrar recursos baseado no role do usuário
   * Para pagantes, considera a hierarquia de planos (bronze < prata < ouro)
   * Retorna condições que devem ser aplicadas com JOIN na tabela plans
   */
  static getQueryConditions(user: CurrentUserPayload) {
    // Admin: sem filtros (acessa tudo)
    if (user.role === 'admin') {
      return null; // Sem filtros
    }

    // Visitante: apenas recursos públicos (sem restrições)
    if (user.role === 'visitante') {
      return {
        condition: '(user_type_id IS NULL AND plan_id IS NULL)',
        params: {},
      };
    }

    // Pagante: recursos públicos + recursos do seu plano ou de planos inferiores
    if (user.role === 'pagante') {
      if (user.plan_id) {
        // Retorna condição que permite recursos públicos OU recursos com plan_id
        // A filtragem hierárquica será feita no código após buscar os dados
        return {
          condition: `(
            (user_type_id IS NULL AND plan_id IS NULL) 
            OR 
            plan_id IS NOT NULL
          )`,
          params: {},
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

  /**
   * Verifica se um nível de plano pode acessar outro nível (hierarquia)
   * bronze=1, prata=2, ouro=3
   * Usuário pode acessar recursos do seu nível ou inferiores
   */
  static canAccessPlanLevel(userPlanLevel: string | null, resourcePlanLevel: string | null): boolean {
    if (!resourcePlanLevel) return true; // Recurso público
    if (!userPlanLevel) return false; // Usuário sem plano não acessa recursos com plano

    const levels: { [key: string]: number } = {
      bronze: 1,
      prata: 2,
      ouro: 3,
    };

    const userLevel = levels[userPlanLevel.toLowerCase()] || 0;
    const resourceLevel = levels[resourcePlanLevel.toLowerCase()] || 0;

    return userLevel >= resourceLevel;
  }
}
