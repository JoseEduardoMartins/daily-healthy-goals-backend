# Fluxo Completo de Pagamento - Documentação Frontend

Esta documentação explica **todo o fluxo de pagamento** com Stripe, desde a seleção do plano até a confirmação e atualização da assinatura no frontend.

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Fluxo Completo Passo a Passo](#fluxo-completo-passo-a-passo)
3. [Endpoints Disponíveis](#endpoints-disponíveis)
4. [Implementação no Frontend](#implementação-no-frontend)
5. [Tratamento de Erros](#tratamento-de-erros)
6. [Estados da Assinatura](#estados-da-assinatura)
7. [Configuração e Variáveis de Ambiente](#configuração-e-variáveis-de-ambiente)

---

## Visão Geral

O sistema de pagamento funciona da seguinte forma:

1. **Usuário seleciona um plano** → Frontend lista planos disponíveis via `GET /plans`
2. **Frontend cria sessão de checkout** → Backend retorna URL do Stripe via `POST /subscriptions/create-checkout`
3. **Usuário é redirecionado para Stripe** → Completa o pagamento no checkout do Stripe
4. **Stripe redireciona para o backend** → `GET /subscriptions/success?session_id=...`
5. **Backend valida e processa o pagamento** → Tenta processar a subscription (com retry automático se necessário)
6. **Backend redireciona para o frontend** → `/profile?payment_success=true&session_id=...` ou `/profile?payment_processing=true&session_id=...`
7. **Frontend atualiza a UI em `/profile`** → Lê parâmetros de query e busca dados atualizados via `GET /subscriptions/status`
8. **Webhooks do Stripe** continuam como mecanismo adicional de segurança/sincronização

---

## Fluxo Completo Passo a Passo

### 1. Listar Planos Disponíveis

**Frontend:** Chama `GET /plans` para obter lista de planos ativos.

```typescript
const response = await fetch('http://localhost:3000/plans', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const plans = await response.json();
```

**Resposta:**
```json
[
  {
    "id": "15ac0191-0531-11f1-a076-0242ac160002",
    "name": "Bronze",
    "description": "Plano básico com acesso limitado",
    "price": 29.90,
    "level": "bronze",
    "level_value": 1,
    "is_active": true
  },
  {
    "id": "15ac0192-0531-11f1-a076-0242ac160003",
    "name": "Prata",
    "description": "Plano intermediário com mais recursos",
    "price": 59.90,
    "level": "prata",
    "level_value": 2,
    "is_active": true
  },
  {
    "id": "15ac0193-0531-11f1-a076-0242ac160004",
    "name": "Ouro",
    "description": "Plano completo com todos os recursos",
    "price": 99.90,
    "level": "ouro",
    "level_value": 3,
    "is_active": true
  }
]
```

### 2. Criar Sessão de Checkout

**Frontend:** Quando o usuário seleciona um plano, chama `POST /subscriptions/create-checkout`.

```typescript
const response = await fetch('http://localhost:3000/subscriptions/create-checkout', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ plan_id: selectedPlanId })
});

if (response.ok) {
  const { checkoutUrl } = await response.json();
  window.location.href = checkoutUrl; // Redirecionar para Stripe
} else {
  const error = await response.json();
  // Tratar erro (ver seção Tratamento de Erros)
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

### 3. Usuário Completa Pagamento no Stripe

O usuário é redirecionado para o Stripe Checkout, preenche os dados do cartão e confirma o pagamento.

**Cartões de teste (modo desenvolvimento):**
- **Sucesso**: `4242 4242 4242 4242`
- **Falha**: `4000 0000 0000 0002`
- Use qualquer data futura e qualquer CVC

### 4. Stripe Redireciona para o Backend

Após o pagamento, o Stripe redireciona automaticamente para:
```
http://localhost:3000/subscriptions/success?session_id=cs_test_...
```

**⚠️ Importante:** O frontend **não precisa** criar uma página `/subscription/success`. O backend processa tudo e redireciona para `/profile`.

### 5. Backend Processa o Pagamento

O backend (`GET /subscriptions/success`) faz o seguinte:

1. **Valida a sessão** → Consulta o Stripe para verificar se o pagamento foi confirmado
2. **Verifica se a subscription já existe** → Se o webhook já processou, usa a subscription existente
3. **Tenta processar manualmente** → Se não existir, tenta criar a subscription:
   - Valida se os campos `current_period_start` e `current_period_end` estão disponíveis
   - Se não estiverem, aguarda 2 segundos e tenta novamente (até 3 tentativas)
   - Cria a subscription no banco de dados
   - Atualiza os dados do usuário (plan_id, subscription_status, etc.)
4. **Redireciona para o frontend** → Com parâmetros de status na URL

### 6. Backend Redireciona para o Frontend

O backend sempre redireciona para `/profile` com os seguintes parâmetros:

#### ✅ Pagamento Confirmado e Processado
```
/profile?payment_success=true&session_id=cs_test_...
```
- Subscription foi criada/atualizada com sucesso
- Dados do usuário estão atualizados no banco
- Frontend deve buscar dados atualizados e mostrar mensagem de sucesso

#### ⏳ Pagamento Confirmado mas Processando
```
/profile?payment_processing=true&session_id=cs_test_...
```
- Pagamento foi confirmado no Stripe
- Subscription ainda não foi processada (campos não disponíveis ou webhook em andamento)
- Frontend deve fazer polling para verificar quando a subscription estiver ativa

#### ❌ Erro no Pagamento
```
/profile?payment_error=not_completed&session_id=cs_test_...
/profile?payment_error=validation_failed&session_id=cs_test_...
/profile?payment_error=missing_session
```
- Pagamento não foi concluído ou houve erro na validação
- Frontend deve mostrar mensagem de erro e permitir tentar novamente

### 7. Frontend Atualiza a UI

Na página `/profile`, o frontend deve:

1. **Ler os parâmetros de query** da URL
2. **Buscar dados atualizados** via `GET /subscriptions/status`
3. **Mostrar mensagens apropriadas** (sucesso, processando, erro)
4. **Fazer polling se necessário** (quando `payment_processing=true`)
5. **Limpar os parâmetros da URL** após processar

---

## Endpoints Disponíveis

### 1. Listar Planos

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
    "id": "uuid",
    "name": "Bronze",
    "description": "...",
    "price": 29.90,
    "level": "bronze",
    "level_value": 1,
    "is_active": true
  }
]
```

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
  "plan_id": "uuid-do-plano"
}
```

**Resposta (200 OK):**
```json
{
  "checkoutUrl": "https://checkout.stripe.com/c/pay/cs_test_...",
  "sessionId": "cs_test_..."
}
```

**Erros:**
- **400**: Plano inválido ou não ativo
- **409**: Usuário já possui assinatura ativa
- **401**: Token inválido ou expirado

### 3. Verificar Status da Assinatura

**GET** `/subscriptions/status`

Retorna o status atual da assinatura do usuário autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Resposta (200 OK) - Com assinatura:**
```json
{
  "hasActiveSubscription": true,
  "subscription": {
    "id": "uuid",
    "plan": {
      "id": "uuid",
      "name": "Plano Ouro",
      "level": "ouro"
    },
    "status": "active",
    "current_period_start": "2024-02-10T00:00:00.000Z",
    "current_period_end": "2024-03-10T00:00:00.000Z",
    "cancel_at_period_end": false
  },
  "user": {
    "subscription_status": "active",
    "subscription_expires_at": "2024-03-10T00:00:00.000Z",
    "plan_id": "uuid-do-plano"
  }
}
```

**Resposta (200 OK) - Sem assinatura:**
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

**Erros:**
- **404**: Assinatura ativa não encontrada
- **401**: Token inválido ou expirado

---

## Implementação no Frontend

### Exemplo Completo: Página de Seleção de Planos

```typescript
import { useEffect, useState } from 'react';

function PlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    async function fetchPlans() {
      try {
        const response = await fetch('http://localhost:3000/plans', {
          headers: { 'Authorization': `Bearer ${token}` }
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
        window.location.href = checkoutUrl; // Redirecionar para Stripe
      } else if (response.status === 409) {
        alert('Você já possui uma assinatura ativa. Considere fazer upgrade.');
      } else {
        const error = await response.json();
        alert(`Erro: ${error.message}`);
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

### Exemplo Completo: Página de Perfil com Tratamento de Pagamento

```typescript
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

function ProfilePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  // Ler parâmetros de query da URL
  const paymentSuccess = searchParams.get('payment_success');
  const paymentProcessing = searchParams.get('payment_processing');
  const paymentError = searchParams.get('payment_error');
  const sessionId = searchParams.get('session_id');

  // Buscar status da subscription
  const fetchSubscriptionStatus = async () => {
    try {
      const response = await fetch('http://localhost:3000/subscriptions/status', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setSubscriptionStatus(data);
      return data;
    } catch (error) {
      console.error('Erro ao buscar status:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Buscar status inicial
    fetchSubscriptionStatus();

    // Se houver parâmetros de pagamento, processar
    if (paymentSuccess) {
      setPaymentStatus('success');
      // Buscar dados atualizados
      fetchSubscriptionStatus();
      // Limpar parâmetros após 5 segundos
      setTimeout(() => {
        setSearchParams({});
        setPaymentStatus(null);
      }, 5000);
    } else if (paymentProcessing) {
      setPaymentStatus('processing');
      // Fazer polling para verificar se subscription foi atualizada
      const interval = setInterval(async () => {
        const updated = await fetchSubscriptionStatus();
        if (updated?.hasActiveSubscription) {
          setPaymentStatus('success');
          clearInterval(interval);
          setTimeout(() => {
            setSearchParams({});
            setPaymentStatus(null);
          }, 5000);
        }
      }, 2000); // Polling a cada 2 segundos

      // Timeout após 30 segundos
      setTimeout(() => {
        clearInterval(interval);
        if (paymentStatus === 'processing') {
          setPaymentStatus('timeout');
          setSearchParams({});
        }
      }, 30000);
    } else if (paymentError) {
      setPaymentStatus('error');
      setTimeout(() => {
        setSearchParams({});
        setPaymentStatus(null);
      }, 5000);
    }
  }, [paymentSuccess, paymentProcessing, paymentError, token, setSearchParams]);

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      {/* Mensagens de status do pagamento */}
      {paymentStatus === 'success' && (
        <div className="alert alert-success">
          ✅ Pagamento confirmado! Sua assinatura está ativa.
        </div>
      )}
      {paymentStatus === 'processing' && (
        <div className="alert alert-info">
          ⏳ Processando pagamento... Aguarde alguns instantes.
        </div>
      )}
      {paymentStatus === 'timeout' && (
        <div className="alert alert-warning">
          ⚠️ O processamento está demorando mais que o esperado. Por favor, aguarde alguns minutos ou entre em contato com o suporte.
        </div>
      )}
      {paymentStatus === 'error' && (
        <div className="alert alert-danger">
          ❌ Erro ao processar pagamento. Tente novamente ou entre em contato com o suporte.
        </div>
      )}

      {/* Exibir status da subscription */}
      {subscriptionStatus?.hasActiveSubscription ? (
        <div>
          <h2>Sua Assinatura</h2>
          <p><strong>Plano:</strong> {subscriptionStatus.subscription.plan.name}</p>
          <p><strong>Status:</strong> {subscriptionStatus.subscription.status}</p>
          <p>
            <strong>Próxima renovação:</strong>{' '}
            {new Date(subscriptionStatus.subscription.current_period_end).toLocaleDateString('pt-BR')}
          </p>
          {subscriptionStatus.subscription.cancel_at_period_end && (
            <p style={{ color: 'orange' }}>
              ⚠️ Sua assinatura será cancelada em{' '}
              {new Date(subscriptionStatus.subscription.current_period_end).toLocaleDateString('pt-BR')}
            </p>
          )}
        </div>
      ) : (
        <div>
          <p>Você não possui uma assinatura ativa.</p>
          <a href="/plans">Ver Planos</a>
        </div>
      )}

      {/* Conteúdo adicional da página de perfil */}
    </div>
  );
}
```

---

## Tratamento de Erros

### Erros ao Criar Checkout

```typescript
const response = await fetch('http://localhost:3000/subscriptions/create-checkout', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ plan_id: selectedPlanId })
});

if (!response.ok) {
  const error = await response.json();
  
  switch (response.status) {
    case 400:
      // Plano inválido ou não ativo
      alert(`Erro: ${error.message}`);
      break;
    case 409:
      // Usuário já possui assinatura ativa
      alert('Você já possui uma assinatura ativa. Considere fazer upgrade.');
      // Opcional: Redirecionar para página de status
      navigate('/profile');
      break;
    case 401:
      // Token inválido ou expirado
      localStorage.removeItem('token');
      navigate('/login');
      break;
    default:
      alert('Erro ao processar pagamento. Tente novamente.');
  }
}
```

### Erros na Página de Perfil

```typescript
// Se payment_error estiver presente na URL
if (paymentError) {
  let errorMessage = 'Erro ao processar pagamento.';
  
  switch (paymentError) {
    case 'not_completed':
      errorMessage = 'O pagamento não foi concluído. Tente novamente.';
      break;
    case 'validation_failed':
      errorMessage = 'Erro ao validar o pagamento. Entre em contato com o suporte.';
      break;
    case 'missing_session':
      errorMessage = 'Sessão de pagamento inválida. Tente novamente.';
      break;
  }
  
  // Mostrar mensagem de erro
  alert(errorMessage);
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

### Função Helper para Status

```typescript
function getSubscriptionStatusMessage(status: string) {
  switch (status) {
    case 'active':
      return { message: 'Assinatura Ativa', color: 'green', icon: '✅' };
    case 'trialing':
      return { message: 'Período de Teste', color: 'blue', icon: '🆓' };
    case 'past_due':
      return { 
        message: 'Pagamento Atrasado - Renove sua assinatura', 
        color: 'orange',
        icon: '⚠️'
      };
    case 'canceled':
    case 'expired':
      return { 
        message: 'Assinatura Expirada - Renove para continuar', 
        color: 'red',
        icon: '❌'
      };
    default:
      return { message: 'Status Desconhecido', color: 'gray', icon: '❓' };
  }
}

// Uso
const statusInfo = getSubscriptionStatusMessage(subscriptionStatus.subscription.status);
<div style={{ color: statusInfo.color }}>
  {statusInfo.icon} {statusInfo.message}
</div>
```

---

## Configuração e Variáveis de Ambiente

### Variáveis Necessárias no Backend

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_CURRENCY=brl

# URLs
BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
```

### Configuração do Webhook (Desenvolvimento)

Para desenvolvimento local, configure o Stripe CLI:

```bash
# Instalar Stripe CLI
# https://stripe.com/docs/stripe-cli

# Iniciar o encaminhamento de webhooks
stripe listen --forward-to localhost:3000/subscriptions/webhook
```

Isso retornará um webhook secret que deve ser configurado no `.env`:

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Nota:** Mesmo sem o webhook configurado, o sistema tentará processar a subscription manualmente no endpoint `/subscriptions/success` com retry automático, mas o webhook é recomendado para garantir processamento em todos os casos.

---

## ⚠️ Observações Importantes

### 1. Processamento Automático com Retry

O backend agora implementa **retry automático** quando processa a subscription manualmente:

- Se os campos `current_period_start` e `current_period_end` não estiverem disponíveis imediatamente
- O backend aguarda 2 segundos e tenta novamente (até 3 tentativas)
- Isso garante que na maioria dos casos, o usuário será redirecionado com `payment_success=true` imediatamente

### 2. Webhook como Backup

O webhook do Stripe continua funcionando como mecanismo adicional de segurança:

- Processa eventos mesmo se o usuário não acessar o endpoint `/success`
- Garante sincronização em caso de falhas no processamento manual
- Recomendado para produção

### 3. Polling no Frontend

Quando receber `payment_processing=true`:

- Faça polling a cada 2 segundos
- Verifique se `hasActiveSubscription === true`
- Timeout após 30 segundos
- Se após 30 segundos ainda não estiver ativa, mostrar mensagem para o usuário entrar em contato

### 4. Limpar URL

Sempre limpe os parâmetros de query da URL após processar:

```typescript
// Limpar parâmetros sem recarregar página
window.history.replaceState({}, '', '/profile');
// ou com React Router
setSearchParams({});
```

Isso evita que o usuário veja mensagens duplicadas ao recarregar a página.

### 5. Atualizar Dados do Usuário

Sempre busque dados atualizados após receber parâmetros de pagamento:

- Use `GET /subscriptions/status` para verificar se a subscription está ativa
- Ou faça login novamente para obter token atualizado com informações de subscription
- Atualize o estado local do usuário com os novos dados

### 6. Cancelamento de Checkout

Se o usuário cancelar o checkout no Stripe, ele será automaticamente redirecionado para:
```
/profile
```

Não é necessário criar uma página de cancelamento separada. O usuário pode verificar seu status e tentar novamente se desejar.

---

## 📚 Recursos Adicionais

- [Documentação do Stripe](https://stripe.com/docs)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Cartões de Teste do Stripe](https://stripe.com/docs/testing#cards)

---

## 🆘 Suporte

Se encontrar problemas:

1. Verifique os logs do backend para entender o que está acontecendo
2. Confirme que as variáveis de ambiente estão configuradas corretamente
3. Verifique se o webhook está configurado (em desenvolvimento, use Stripe CLI)
4. Teste com cartões de teste do Stripe
5. Verifique se o token JWT está válido e não expirou
