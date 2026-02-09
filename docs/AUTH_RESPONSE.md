# Documentação: Resposta de Autenticação (Login/Register)

## 📋 Visão Geral

Os endpoints de autenticação (`POST /auth/login` e `POST /auth/register`) retornam informações completas sobre o usuário, incluindo **status da assinatura** e **informações do plano**.

---

## 🔐 Endpoint de Login

**URL**: `POST /auth/login`  
**Autenticação**: Não necessária  
**Content-Type**: `application/json`

### Request

```json
{
  "email": "ouro@dailyhealthygoals.com",
  "password": "ouro123"
}
```

### Response de Sucesso (200 OK)

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "445c6e55-05e4-11f1-907e-0242ac160002",
    "name": "Usuário Ouro",
    "email": "ouro@dailyhealthygoals.com",
    "weight": 74,
    "height": 1.74,
    "role": "pagante",
    "plan_id": "44186098-05e4-11f1-907e-0242ac160002",
    "user_type_id": "43d71bc4-05e4-11f1-907e-0242ac160002",
    "subscription": {
      "hasActiveSubscription": true,
      "status": "active",
      "expires_at": "2026-03-09T17:25:47.000Z",
      "plan": {
        "id": "44186098-05e4-11f1-907e-0242ac160002",
        "name": "Ouro",
        "level": "ouro"
      },
      "current_period_end": "2026-03-09T17:25:47.000Z",
      "cancel_at_period_end": false
    }
  }
}
```

### Response para Usuário Visitante (200 OK)

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "Usuário Visitante",
    "email": "visitante@dailyhealthygoals.com",
    "weight": 70,
    "height": 1.70,
    "role": "visitante",
    "plan_id": null,
    "user_type_id": "uuid-do-tipo-visitante",
    "subscription": {
      "hasActiveSubscription": false,
      "status": null,
      "expires_at": null,
      "plan": null,
      "current_period_end": null,
      "cancel_at_period_end": false
    }
  }
}
```

### Response para Usuário Pagante sem Assinatura Ativa (200 OK)

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "Usuário Pagante",
    "email": "pagante@example.com",
    "weight": 75,
    "height": 1.75,
    "role": "pagante",
    "plan_id": null,
    "user_type_id": "uuid-do-tipo-pagante",
    "subscription": {
      "hasActiveSubscription": false,
      "status": "expired",
      "expires_at": "2026-01-01T00:00:00.000Z",
      "plan": null,
      "current_period_end": null,
      "cancel_at_period_end": false
    }
  }
}
```

---

## 📝 Campos da Resposta

### Campos do Usuário

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | `string` | UUID do usuário |
| `name` | `string` | Nome completo do usuário |
| `email` | `string` | Email do usuário |
| `weight` | `number` | Peso em kg |
| `height` | `number` | Altura em metros |
| `role` | `string` | Tipo de usuário: `"admin"`, `"visitante"` ou `"pagante"` |
| `plan_id` | `string \| null` | ID do plano atual do usuário (null se não tiver plano) |
| `user_type_id` | `string \| null` | ID do tipo de usuário |
| `subscription` | `object \| null` | Informações da assinatura (ver abaixo) |

### Campos da Subscription

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `hasActiveSubscription` | `boolean` | Indica se o usuário possui uma assinatura ativa |
| `status` | `string \| null` | Status da assinatura: `"active"`, `"canceled"`, `"expired"`, `"past_due"`, `"trialing"` ou `null` |
| `expires_at` | `string \| null` | Data de expiração da assinatura (ISO 8601) ou `null` |
| `plan` | `object \| null` | Informações do plano (ver abaixo) ou `null` |
| `current_period_end` | `string \| null` | Data de término do período atual (ISO 8601) ou `null` |
| `cancel_at_period_end` | `boolean` | Indica se a assinatura será cancelada ao final do período atual |

### Campos do Plano (dentro de subscription.plan)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | `string` | UUID do plano |
| `name` | `string` | Nome do plano (ex: "Bronze", "Prata", "Ouro") |
| `level` | `string` | Nível do plano (ex: "bronze", "prata", "ouro") |

---

## 📊 Status da Assinatura

### Valores Possíveis para `subscription.status`

- **`"active"`**: Assinatura ativa e pagamentos em dia
- **`"trialing"`**: Período de teste (primeiros 30 dias)
- **`"past_due"`**: Pagamento atrasado (usuário ainda tem acesso, mas precisa pagar)
- **`"canceled"`**: Assinatura cancelada (usuário perdeu acesso)
- **`"expired"`**: Assinatura expirada (usuário perdeu acesso)
- **`null`**: Usuário não possui assinatura (visitante ou pagante sem assinatura)

---

## 💻 Exemplos de Uso no Frontend

### React/TypeScript

```typescript
interface SubscriptionPlan {
  id: string;
  name: string;
  level: string;
}

interface Subscription {
  hasActiveSubscription: boolean;
  status: string | null;
  expires_at: string | null;
  plan: SubscriptionPlan | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  weight: number;
  height: number;
  role: string;
  plan_id: string | null;
  user_type_id: string | null;
  subscription: Subscription | null;
}

interface AuthResponse {
  access_token: string;
  user: User;
}

async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Erro ao fazer login');
  }

  return await response.json();
}

// Exemplo de uso
const authData = await login('ouro@dailyhealthygoals.com', 'ouro123');

// Salvar token
localStorage.setItem('token', authData.access_token);

// Verificar status da assinatura
if (authData.user.subscription?.hasActiveSubscription) {
  console.log('Usuário tem assinatura ativa:', authData.user.subscription.plan?.name);
  console.log('Status:', authData.user.subscription.status);
  console.log('Expira em:', authData.user.subscription.expires_at);
  
  if (authData.user.subscription.cancel_at_period_end) {
    console.log('⚠️ Assinatura será cancelada ao final do período');
  }
} else {
  console.log('Usuário não tem assinatura ativa');
  if (authData.user.role === 'pagante') {
    console.log('Usuário é pagante mas não tem assinatura. Redirecionar para planos?');
  }
}
```

### Verificar se Assinatura Está Expirada

```typescript
function isSubscriptionExpired(subscription: Subscription | null): boolean {
  if (!subscription || !subscription.expires_at) {
    return false;
  }
  
  const expiresAt = new Date(subscription.expires_at);
  const now = new Date();
  
  return now > expiresAt;
}

// Uso
if (isSubscriptionExpired(authData.user.subscription)) {
  alert('Sua assinatura expirou. Renove para continuar usando.');
  // Redirecionar para página de planos
}
```

### Verificar se Assinatura Está Próxima de Expirar

```typescript
function isSubscriptionExpiringSoon(
  subscription: Subscription | null,
  daysBefore: number = 7
): boolean {
  if (!subscription || !subscription.expires_at) {
    return false;
  }
  
  const expiresAt = new Date(subscription.expires_at);
  const now = new Date();
  const daysUntilExpiry = Math.ceil(
    (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  return daysUntilExpiry <= daysBefore && daysUntilExpiry > 0;
}

// Uso
if (isSubscriptionExpiringSoon(authData.user.subscription, 7)) {
  alert('Sua assinatura expira em breve. Renove para continuar usando.');
}
```

### Exibir Status da Assinatura na UI

```typescript
function getSubscriptionStatusMessage(subscription: Subscription | null): {
  message: string;
  color: string;
  icon: string;
} {
  if (!subscription || !subscription.hasActiveSubscription) {
    return {
      message: 'Sem assinatura ativa',
      color: 'gray',
      icon: '❌',
    };
  }

  switch (subscription.status) {
    case 'active':
      return {
        message: 'Assinatura Ativa',
        color: 'green',
        icon: '✅',
      };
    case 'trialing':
      return {
        message: 'Período de Teste',
        color: 'blue',
        icon: '🆓',
      };
    case 'past_due':
      return {
        message: 'Pagamento Atrasado',
        color: 'orange',
        icon: '⚠️',
      };
    case 'canceled':
    case 'expired':
      return {
        message: 'Assinatura Expirada',
        color: 'red',
        icon: '❌',
      };
    default:
      return {
        message: 'Status Desconhecido',
        color: 'gray',
        icon: '❓',
      };
  }
}

// Componente React
function SubscriptionStatus({ subscription }: { subscription: Subscription | null }) {
  const status = getSubscriptionStatusMessage(subscription);
  
  return (
    <div style={{ color: status.color }}>
      <span>{status.icon}</span>
      <span>{status.message}</span>
      {subscription?.expires_at && (
        <span>
          {' '}
          (Expira em: {new Date(subscription.expires_at).toLocaleDateString('pt-BR')})
        </span>
      )}
    </div>
  );
}
```

---

## 🔄 Endpoint de Registro

O endpoint `POST /auth/register` retorna o mesmo formato de resposta que o login, incluindo as informações de subscription.

**Nota**: Usuários que se registram como "pagante" são criados inicialmente como "visitante" até o pagamento ser confirmado. Portanto, `hasActiveSubscription` será `false` e `subscription.plan` será `null` até que o pagamento seja processado via webhook do Stripe.

---

## ⚠️ Observações Importantes

1. **Token JWT**: O `access_token` deve ser armazenado e enviado em todas as requisições autenticadas no header `Authorization: Bearer <token>`.

2. **Atualização de Status**: O status da assinatura é atualizado automaticamente via webhooks do Stripe. Para obter informações atualizadas, o frontend pode:
   - Fazer uma nova requisição de login
   - Chamar o endpoint `GET /subscriptions/status` (requer autenticação)

3. **Validação de Acesso**: O backend controla automaticamente o acesso a recursos baseado no `role` e `subscription.status`. Não é necessário filtrar no frontend.

4. **Expiração de Assinatura**: Se `subscription.status === "expired"` ou se `expires_at` for uma data passada, o usuário perde acesso aos recursos pagos, mesmo que `role === "pagante"`.

5. **Cancelamento Programado**: Se `cancel_at_period_end === true`, a assinatura continuará ativa até `current_period_end`, quando será cancelada automaticamente.

---

## 📚 Endpoints Relacionados

- **`GET /subscriptions/status`**: Obter status detalhado da assinatura (requer autenticação)
- **`POST /subscriptions/create-checkout`**: Criar sessão de checkout para assinar um plano
- **`POST /subscriptions/cancel`**: Cancelar assinatura atual

Para mais informações, consulte a documentação de [Fluxo de Pagamento](./PAYMENT_FLOW_FRONTEND.md).
