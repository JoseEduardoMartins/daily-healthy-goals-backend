# Fluxo de Pagamento - Documentação Frontend

Esta documentação explica como implementar o fluxo de pagamento com Stripe no frontend.

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Endpoints Disponíveis](#endpoints-disponíveis)
3. [Fluxo Completo](#fluxo-completo)
4. [Exemplos de Implementação](#exemplos-de-implementação)
5. [Tratamento de Erros](#tratamento-de-erros)
6. [Estados da Assinatura](#estados-da-assinatura)

---

## Visão Geral

O sistema de pagamento funciona da seguinte forma:

1. **Usuário seleciona um plano** → Frontend lista planos disponíveis
2. **Frontend cria sessão de checkout** → Backend retorna URL do Stripe
3. **Usuário é redirecionado para Stripe** → Completa o pagamento
4. **Stripe redireciona de volta para o backend** → `GET /subscriptions/success?session_id=...`
5. **Backend valida o pagamento** → Redireciona o usuário para `/profile` no frontend com parâmetros de status
6. **Frontend atualiza a UI em `/profile`** → Lê parâmetros de query e busca dados atualizados (`/subscriptions/status` ou login)
7. **Webhooks do Stripe** continuam existindo como mecanismo adicional de segurança/sincronização

---

## Endpoints Disponíveis

### 1. Listar Planos Disponíveis

**GET** `/plans`

Lista todos os planos ativos disponíveis para assinatura.

**Headers:**
```
Authorization: Bearer <token>
```

**Resposta (200 OK):**
```json
[
  {
    "id": "15ac0191-0531-11f1-a076-0242ac160002",
    "name": "Bronze",
    "description": "Plano básico com acesso limitado",
    "price": 29.90,
    "level": "bronze",
    "level_value": 1,
    "is_active": true,
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": "15ac0192-0531-11f1-a076-0242ac160003",
    "name": "Prata",
    "description": "Plano intermediário com mais recursos",
    "price": 59.90,
    "level": "prata",
    "level_value": 2,
    "is_active": true,
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": "15ac0193-0531-11f1-a076-0242ac160004",
    "name": "Ouro",
    "description": "Plano completo com todos os recursos",
    "price": 99.90,
    "level": "ouro",
    "level_value": 3,
    "is_active": true,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

**Exemplo de uso:**
```typescript
const response = await fetch('http://localhost:3000/plans', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const plans = await response.json();
```

---

### 2. Criar Sessão de Checkout

**POST** `/subscriptions/create-checkout`

Cria uma sessão de checkout no Stripe para o plano selecionado.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "plan_id": "15ac0191-0531-11f1-a076-0242ac160002"
}
```

**Resposta (200 OK):**
```json
{
  "checkoutUrl": "https://checkout.stripe.com/c/pay/cs_test_...",
  "sessionId": "cs_test_..."
}
```

**Erros possíveis:**

- **400 Bad Request**: Plano inválido ou não ativo
- **409 Conflict**: Usuário já possui assinatura ativa
- **401 Unauthorized**: Token inválido ou expirado

**Exemplo de uso:**
```typescript
const response = await fetch('http://localhost:3000/subscriptions/create-checkout', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    plan_id: selectedPlanId
  })
});

if (response.ok) {
  const { checkoutUrl } = await response.json();
  // Redirecionar usuário para checkoutUrl
  window.location.href = checkoutUrl;
} else {
  const error = await response.json();
  console.error('Erro ao criar checkout:', error);
}
```

---

### 3. Verificar Status da Assinatura

**GET** `/subscriptions/status`

Retorna o status atual da assinatura do usuário autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Resposta (200 OK):**
```json
{
  "hasActiveSubscription": true,
  "subscription": {
    "id": "sub-uuid",
    "plan": {
      "id": "15ac0191-0531-11f1-a076-0242ac160002",
      "name": "Bronze",
      "level": "bronze"
    },
    "status": "active",
    "current_period_start": "2024-01-01T00:00:00.000Z",
    "current_period_end": "2024-02-01T00:00:00.000Z",
    "cancel_at_period_end": false
  },
  "user": {
    "subscription_status": "active",
    "subscription_expires_at": "2024-02-01T00:00:00.000Z",
    "plan_id": "15ac0191-0531-11f1-a076-0242ac160002"
  }
}
```

**Resposta quando não há assinatura (200 OK):**
```json
{
  "hasActiveSubscription": false,
  "subscription": null,
  "user": {
    "subscription_status": null,
    "subscription_expires_at": null,
    "plan_id": null
  }
}
```

**Exemplo de uso:**
```typescript
const response = await fetch('http://localhost:3000/subscriptions/status', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const status = await response.json();

if (status.hasActiveSubscription) {
  console.log('Usuário tem assinatura ativa:', status.subscription.plan.name);
} else {
  console.log('Usuário não tem assinatura ativa');
}
```

---

### 4. Cancelar Assinatura

**POST** `/subscriptions/cancel`

Cancela a assinatura atual do usuário. A assinatura será cancelada ao final do período atual.

**Headers:**
```
Authorization: Bearer <token>
```

**Resposta (200 OK):**
```json
{
  "message": "Solicitação de cancelamento enviada. A assinatura será cancelada ao final do período atual."
}
```

**Erros possíveis:**

- **404 Not Found**: Assinatura ativa não encontrada
- **401 Unauthorized**: Token inválido ou expirado

**Exemplo de uso:**
```typescript
const response = await fetch('http://localhost:3000/subscriptions/cancel', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

if (response.ok) {
  const result = await response.json();
  alert(result.message);
} else {
  const error = await response.json();
  console.error('Erro ao cancelar:', error);
}
```

---

## Fluxo Completo

### 1. Página de Seleção de Plano

```typescript
// Componente React/Next.js exemplo
import { useEffect, useState } from 'react';

function PlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    async function fetchPlans() {
      try {
        const response = await fetch('http://localhost:3000/plans', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setPlans(data);
      } catch (error) {
        console.error('Erro ao buscar planos:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPlans();
  }, [token]);

  const handleSelectPlan = async (planId: string) => {
    try {
      const response = await fetch('http://localhost:3000/subscriptions/create-checkout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ plan_id: planId })
      });

      if (response.ok) {
        const { checkoutUrl } = await response.json();
        // Redirecionar para Stripe
        window.location.href = checkoutUrl;
      } else {
        const error = await response.json();
        if (response.status === 409) {
          alert('Você já possui uma assinatura ativa. Considere fazer upgrade.');
        } else {
          alert(`Erro: ${error.message}`);
        }
      }
    } catch (error) {
      console.error('Erro ao criar checkout:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
    }
  };

  if (loading) return <div>Carregando planos...</div>;

  return (
    <div>
      <h1>Escolha seu Plano</h1>
      {plans.map(plan => (
        <div key={plan.id}>
          <h2>{plan.name}</h2>
          <p>{plan.description}</p>
          <p>R$ {plan.price.toFixed(2)}/mês</p>
          <button onClick={() => handleSelectPlan(plan.id)}>
            Assinar {plan.name}
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

### 2. Comportamento após Checkout (Redirecionamento para `/profile`)

Após o usuário completar o pagamento no Stripe, o fluxo é:

- **Stripe** → `GET http://localhost:3000/subscriptions/success?session_id={CHECKOUT_SESSION_ID}`
- **Backend**:
  - Valida o pagamento
  - Tenta processar a assinatura (via webhook ou manualmente)
  - Redireciona o usuário para:
    - Sucesso: `/profile?payment_success=true&session_id=...`
    - Processando: `/profile?payment_processing=true&session_id=...`
    - Erro: `/profile?payment_error=...&session_id=...`

**Importante:**

- Não é mais necessário ter uma página dedicada em `/subscription/success`.
- Toda a lógica pós-pagamento deve acontecer na própria página de perfil (`/profile`), lendo os parâmetros de query.
- Para exemplos detalhados de como tratar esses parâmetros e fazer polling, consulte:
  - `docs/PAYMENT_REDIRECT_FRONTEND.md`

---

### 3. Redirecionamento ao Cancelar Checkout

Se o usuário cancelar o checkout no Stripe, ele será automaticamente redirecionado de volta para:
```
http://localhost:5173/profile
```

**Nota:** Não é necessário criar uma página de cancelamento separada. O usuário será redirecionado automaticamente para a página de perfil, onde pode verificar seu status de assinatura e tentar novamente se desejar.

Se você quiser exibir uma mensagem ao usuário quando ele retornar da página de checkout, pode verificar se há um parâmetro na URL ou usar um estado global para indicar que o checkout foi cancelado.

---

### 4. Verificar Status da Assinatura (Dashboard)

```typescript
// Componente para exibir status da assinatura
import { useEffect, useState } from 'react';

function SubscriptionStatus() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    async function fetchStatus() {
      try {
        const response = await fetch('http://localhost:3000/subscriptions/status', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setStatus(data);
      } catch (error) {
        console.error('Erro ao buscar status:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStatus();
  }, [token]);

  if (loading) return <div>Carregando...</div>;

  if (!status?.hasActiveSubscription) {
    return (
      <div>
        <p>Você não possui uma assinatura ativa.</p>
        <a href="/plans">Ver Planos</a>
      </div>
    );
  }

  const { subscription } = status;
  const endDate = new Date(subscription.current_period_end);
  const isCanceling = subscription.cancel_at_period_end;

  return (
    <div>
      <h2>Sua Assinatura</h2>
      <p><strong>Plano:</strong> {subscription.plan.name}</p>
      <p><strong>Status:</strong> {subscription.status}</p>
      <p><strong>Próxima renovação:</strong> {endDate.toLocaleDateString('pt-BR')}</p>
      {isCanceling && (
        <p style={{ color: 'orange' }}>
          ⚠️ Sua assinatura será cancelada em {endDate.toLocaleDateString('pt-BR')}
        </p>
      )}
      {!isCanceling && (
        <button onClick={handleCancel}>Cancelar Assinatura</button>
      )}
    </div>
  );

  async function handleCancel() {
    if (!confirm('Tem certeza que deseja cancelar sua assinatura?')) {
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/subscriptions/cancel', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Assinatura cancelada. Você terá acesso até o final do período atual.');
        // Recarregar status
        window.location.reload();
      } else {
        const error = await response.json();
        alert(`Erro: ${error.message}`);
      }
    } catch (error) {
      console.error('Erro ao cancelar:', error);
      alert('Erro ao cancelar assinatura. Tente novamente.');
    }
  }
}
```

---

## Tratamento de Erros

### Erros Comuns e Como Tratá-los

#### 1. **409 Conflict - Usuário já possui assinatura ativa**

```typescript
if (response.status === 409) {
  // Opção 1: Mostrar mensagem e redirecionar para status
  alert('Você já possui uma assinatura ativa.');
  navigate('/subscription/status');
  
  // Opção 2: Oferecer upgrade
  const currentPlan = await getCurrentSubscription();
  if (currentPlan) {
    showUpgradeOptions(currentPlan);
  }
}
```

#### 2. **400 Bad Request - Plano inválido**

```typescript
if (response.status === 400) {
  const error = await response.json();
  alert(`Erro: ${error.message}`);
  // Recarregar lista de planos
  fetchPlans();
}
```

#### 3. **401 Unauthorized - Token inválido**

```typescript
if (response.status === 401) {
  // Token expirado, fazer logout e redirecionar para login
  localStorage.removeItem('token');
  navigate('/login');
}
```

#### 4. **404 Not Found - Assinatura não encontrada (ao cancelar)**

```typescript
if (response.status === 404) {
  alert('Assinatura não encontrada. Você pode não ter uma assinatura ativa.');
}
```

---

## Estados da Assinatura

### Status Possíveis

- **`active`**: Assinatura ativa e pagamentos em dia
- **`trialing`**: Período de teste (primeiros 30 dias)
- **`past_due`**: Pagamento atrasado (usuário ainda tem acesso, mas precisa pagar)
- **`canceled`**: Assinatura cancelada (usuário perdeu acesso)
- **`expired`**: Assinatura expirada (usuário perdeu acesso)

### Comportamento do Frontend

```typescript
function getSubscriptionStatusMessage(status: string) {
  switch (status) {
    case 'active':
      return { message: 'Assinatura Ativa', color: 'green' };
    case 'trialing':
      return { message: 'Período de Teste', color: 'blue' };
    case 'past_due':
      return { 
        message: 'Pagamento Atrasado - Renove sua assinatura', 
        color: 'orange' 
      };
    case 'canceled':
    case 'expired':
      return { 
        message: 'Assinatura Expirada - Renove para continuar', 
        color: 'red' 
      };
    default:
      return { message: 'Status Desconhecido', color: 'gray' };
  }
}
```

---

## Variáveis de Ambiente

Certifique-se de configurar a URL de redirecionamento no backend:

```env
FRONTEND_URL=http://localhost:5173
```

No ambiente de produção:
```env
STRIPE_FRONTEND_URL=https://seu-dominio.com
```

---

## Notas Importantes

1. **Webhooks são processados assincronamente**: Após o checkout, pode levar alguns segundos para o webhook atualizar o status. Implemente polling ou aguarde alguns segundos antes de verificar.

2. **Cancelamento não é imediato**: Quando o usuário cancela, a assinatura continua ativa até o final do período atual (`cancel_at_period_end: true`).

3. **Token JWT contém informações do plano**: O token JWT já inclui `plan_id`, `plan_level`, `subscription_status` e `subscription_expires_at`. Você pode usar essas informações sem fazer uma requisição adicional.

4. **Acesso a recursos**: O backend controla automaticamente o acesso a produtos e exercícios baseado no plano do usuário. Não é necessário filtrar no frontend.

---

## Exemplo Completo com React + TypeScript

```typescript
// hooks/useSubscription.ts
import { useState, useEffect } from 'react';

interface SubscriptionStatus {
  hasActiveSubscription: boolean;
  subscription: {
    id: string;
    plan: {
      id: string;
      name: string;
      level: string;
    };
    status: string;
    current_period_start: string;
    current_period_end: string;
    cancel_at_period_end: boolean;
  } | null;
  user: {
    subscription_status: string | null;
    subscription_expires_at: string | null;
    plan_id: string | null;
  };
}

export function useSubscription(token: string | null) {
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/subscriptions/status', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStatus(data);
        setError(null);
      } else {
        setError('Erro ao buscar status da assinatura');
      }
    } catch (err) {
      setError('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [token]);

  return { status, loading, error, refetch: fetchStatus };
}
```

```typescript
// components/PlansList.tsx
import { useSubscription } from '../hooks/useSubscription';

export function PlansList() {
  const token = localStorage.getItem('token');
  const { status } = useSubscription(token);
  const [plans, setPlans] = useState([]);

  // ... código para buscar planos ...

  const handleSubscribe = async (planId: string) => {
    try {
      const response = await fetch('http://localhost:3000/subscriptions/create-checkout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ plan_id: planId })
      });

      if (response.ok) {
        const { checkoutUrl } = await response.json();
        window.location.href = checkoutUrl;
      } else if (response.status === 409) {
        alert('Você já possui uma assinatura ativa.');
      } else {
        const error = await response.json();
        alert(`Erro: ${error.message}`);
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao processar pagamento.');
    }
  };

  return (
    <div>
      {plans.map(plan => (
        <div key={plan.id}>
          <h3>{plan.name}</h3>
          <p>R$ {plan.price.toFixed(2)}/mês</p>
          {status?.hasActiveSubscription ? (
            <button disabled>Já possui assinatura</button>
          ) : (
            <button onClick={() => handleSubscribe(plan.id)}>
              Assinar
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
```

---

## Suporte

Para mais informações sobre a arquitetura de pagamentos, consulte:
- [Arquitetura de Pagamentos](./PAYMENT_ARCHITECTURE.md)
- [Configuração do Stripe](./STRIPE_SETUP.md)
- [Testando Webhooks](./WEBHOOK_TESTING.md)
