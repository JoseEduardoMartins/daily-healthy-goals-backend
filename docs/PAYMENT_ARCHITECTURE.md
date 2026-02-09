# Arquitetura de Pagamento e Controle de Acesso - Análise e Proposta

## 📋 Índice

- [Análise: Pagamento no Registro vs Separado](#análise-pagamento-no-registro-vs-separado)
- [Controle de Acesso Mensal](#controle-de-acesso-mensal)
- [Proposta de Arquitetura](#proposta-de-arquitetura)
- [Fluxo de Pagamento Recomendado](#fluxo-de-pagamento-recomendado)
- [Estrutura de Banco de Dados](#estrutura-de-banco-de-dados)
- [Implementação com Stripe](#implementação-com-stripe)

---

## 🔍 Análise: Pagamento no Registro vs Separado

### ❌ **NÃO Recomendado: Pagamento no Registro**

**Problemas:**
1. **Fricção no Onboarding**: Usuário precisa pagar antes de conhecer o produto
2. **Sem Trial Period**: Não permite período de teste gratuito
3. **Abandono de Carrinho**: Taxa de conversão menor (usuário pode desistir)
4. **Rigidez**: Dificulta mudanças de plano ou upgrades
5. **UX Ruim**: Bloqueia o registro se houver problema no pagamento
6. **Complexidade**: Mistura registro com pagamento (responsabilidades diferentes)

### ✅ **Recomendado: Pagamento Separado (Freemium Model)**

**Vantagens:**
1. **Registro Livre**: Usuário pode se registrar como visitante sem pagamento
2. **Trial Period**: Permite período de teste antes de pagar
3. **Melhor Conversão**: Usuário conhece o produto antes de pagar
4. **Flexibilidade**: Permite upgrade/downgrade de planos facilmente
5. **Separação de Responsabilidades**: Registro e pagamento são fluxos distintos
6. **Melhor UX**: Usuário não fica bloqueado se houver problema no pagamento

### 🎯 **Modelo Recomendado: Freemium com Upgrade**

```
1. Registro → Usuário se registra como "visitante" (sem pagamento)
2. Exploração → Usuário usa recursos gratuitos
3. Upgrade → Usuário escolhe plano e faz pagamento
4. Ativação → Sistema ativa plano após confirmação do Stripe
```

---

## 📅 Controle de Acesso Mensal

### Desafios

1. **Assinaturas Mensais**: Planos são pagos mensalmente
2. **Expiração**: Acesso deve expirar se pagamento não for renovado
3. **Renovação Automática**: Stripe renova automaticamente, mas precisamos sincronizar
4. **Downgrade**: Se pagamento falhar, usuário volta para visitante
5. **Grace Period**: Período de graça após expiração (opcional)

### Solução Proposta

#### 1. **Tabela de Assinaturas (Subscriptions)**

Criar uma tabela `subscriptions` para rastrear:
- Status da assinatura (ativa, cancelada, expirada)
- Data de início
- Data de expiração/renovação
- ID da assinatura no Stripe
- Histórico de pagamentos

#### 2. **Campos no User**

Adicionar campos para controle:
- `subscription_status`: `active` | `canceled` | `expired` | `past_due`
- `subscription_expires_at`: Data de expiração
- `stripe_customer_id`: ID do cliente no Stripe
- `stripe_subscription_id`: ID da assinatura no Stripe

#### 3. **Verificação de Acesso**

A verificação de acesso deve considerar:
- `user_type` (visitante, pagante, admin)
- `subscription_status` (se pagante)
- `subscription_expires_at` (se pagante)
- `plan_id` (plano atual)

**Lógica:**
```typescript
if (user.role === 'admin') → Acesso total
if (user.role === 'visitante') → Acesso limitado (recursos públicos)
if (user.role === 'pagante') {
  if (subscription_status === 'active' && subscription_expires_at > now) {
    → Acesso ao plano
  } else {
    → Downgrade para visitante
  }
}
```

#### 4. **Webhooks do Stripe**

Implementar webhooks para sincronizar:
- `invoice.payment_succeeded` → Renovação bem-sucedida
- `invoice.payment_failed` → Falha no pagamento
- `customer.subscription.deleted` → Assinatura cancelada
- `customer.subscription.updated` → Plano alterado

---

## 🏗️ Proposta de Arquitetura

### Fluxo Completo

```
┌─────────────────┐
│  1. Registro    │
│  (Visitante)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  2. Exploração  │
│  (Recursos      │
│   Gratuitos)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  3. Escolha     │
│     Plano       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  4. Checkout    │
│     Stripe      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  5. Webhook     │
│  (Confirmação)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  6. Ativação   │
│     Plano      │
└────────────────┘
```

### Endpoints Propostos

#### 1. **Registro (Mantém como está)**
```
POST /auth/register
- Permite registro como visitante (sem pagamento)
- Permite registro como pagante (mas sem ativar plano ainda)
```

#### 2. **Novos Endpoints de Pagamento**

```
GET /subscriptions/plans
- Lista planos disponíveis com preços

POST /subscriptions/create-checkout
- Cria sessão de checkout no Stripe
- Retorna URL para redirecionar usuário

POST /subscriptions/webhook
- Recebe eventos do Stripe (webhook)
- Atualiza status da assinatura

GET /subscriptions/status
- Retorna status atual da assinatura do usuário

POST /subscriptions/cancel
- Cancela assinatura atual

POST /subscriptions/upgrade
- Altera plano (upgrade/downgrade)
```

---

## 🗄️ Estrutura de Banco de Dados

### Nova Tabela: `subscriptions`

```sql
CREATE TABLE subscriptions (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  plan_id VARCHAR(36) NOT NULL,
  stripe_subscription_id VARCHAR(255) UNIQUE,
  stripe_customer_id VARCHAR(255),
  status ENUM('active', 'canceled', 'expired', 'past_due', 'trialing') NOT NULL,
  current_period_start DATETIME NOT NULL,
  current_period_end DATETIME NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (plan_id) REFERENCES plans(id),
  
  INDEX idx_user_id (user_id),
  INDEX idx_stripe_subscription_id (stripe_subscription_id),
  INDEX idx_status (status),
  INDEX idx_current_period_end (current_period_end)
);
```

### Atualização na Tabela: `users`

```sql
ALTER TABLE users ADD COLUMN subscription_status ENUM('active', 'canceled', 'expired', 'past_due', 'trialing') NULL;
ALTER TABLE users ADD COLUMN subscription_expires_at DATETIME NULL;
ALTER TABLE users ADD COLUMN stripe_customer_id VARCHAR(255) NULL;
ALTER TABLE users ADD INDEX idx_subscription_status (subscription_status);
ALTER TABLE users ADD INDEX idx_subscription_expires_at (subscription_expires_at);
```

### Tabela: `payment_history` (Opcional, para auditoria)

```sql
CREATE TABLE payment_history (
  id VARCHAR(36) PRIMARY KEY,
  subscription_id VARCHAR(36) NOT NULL,
  stripe_invoice_id VARCHAR(255),
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'BRL',
  status ENUM('paid', 'failed', 'pending') NOT NULL,
  paid_at DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE,
  INDEX idx_subscription_id (subscription_id),
  INDEX idx_status (status)
);
```

---

## 💳 Implementação com Stripe

### 1. **Configuração Inicial**

```typescript
// config/stripe.config.ts
export default () => ({
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    currency: 'brl', // ou 'usd'
  },
});
```

### 2. **Criar Checkout Session**

```typescript
// POST /subscriptions/create-checkout
async createCheckoutSession(userId: string, planId: string) {
  const user = await this.usersService.findOne(userId);
  const plan = await this.plansService.findOne(planId);
  
  // Criar ou buscar customer no Stripe
  let customerId = user.stripe_customer_id;
  if (!customerId) {
    const customer = await this.stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: { userId: user.id },
    });
    customerId = customer.id;
    await this.usersService.updateStripeCustomerId(user.id, customerId);
  }
  
  // Criar sessão de checkout
  const session = await this.stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'brl',
        product_data: {
          name: plan.name,
          description: plan.description,
        },
        recurring: {
          interval: 'month', // Mensal
        },
        unit_amount: Math.round(plan.price * 100), // Stripe usa centavos
      },
      quantity: 1,
    }],
    mode: 'subscription',
    success_url: `${process.env.FRONTEND_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/subscription/cancel`,
    metadata: {
      userId: user.id,
      planId: plan.id,
    },
  });
  
  return { checkoutUrl: session.url };
}
```

### 3. **Webhook Handler**

```typescript
// POST /subscriptions/webhook
async handleWebhook(signature: string, payload: Buffer) {
  const event = this.stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET,
  );
  
  switch (event.type) {
    case 'checkout.session.completed':
      await this.handleCheckoutCompleted(event.data.object);
      break;
      
    case 'invoice.payment_succeeded':
      await this.handlePaymentSucceeded(event.data.object);
      break;
      
    case 'invoice.payment_failed':
      await this.handlePaymentFailed(event.data.object);
      break;
      
    case 'customer.subscription.deleted':
      await this.handleSubscriptionDeleted(event.data.object);
      break;
      
    case 'customer.subscription.updated':
      await this.handleSubscriptionUpdated(event.data.object);
      break;
  }
}
```

### 4. **Atualizar Status da Assinatura**

```typescript
async handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string;
  const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
  
  // Buscar assinatura no banco
  const dbSubscription = await this.subscriptionsService.findByStripeId(subscriptionId);
  
  if (dbSubscription) {
    // Atualizar período
    await this.subscriptionsService.update({
      id: dbSubscription.id,
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000),
      current_period_end: new Date(subscription.current_period_end * 1000),
    });
    
    // Atualizar usuário
    await this.usersService.updateSubscriptionStatus(
      dbSubscription.user_id,
      subscription.status,
      new Date(subscription.current_period_end * 1000),
    );
  }
}
```

### 5. **Verificação de Acesso Atualizada**

```typescript
// permissions.helper.ts
static canAccess(
  user: CurrentUserPayload,
  resourceUserTypeId: string | null,
  resourcePlanId: string | null,
  resourcePlanLevel?: string | null,
  subscriptionStatus?: string | null,
  subscriptionExpiresAt?: Date | null,
): boolean {
  if (user.role === 'admin') {
    return true;
  }
  
  if (user.role === 'visitante') {
    return !resourceUserTypeId && !resourcePlanId;
  }
  
  if (user.role === 'pagante') {
    // Verificar se assinatura está ativa
    if (subscriptionStatus !== 'active' && subscriptionStatus !== 'trialing') {
      return false; // Assinatura expirada/cancelada
    }
    
    if (subscriptionExpiresAt && subscriptionExpiresAt < new Date()) {
      return false; // Assinatura expirada
    }
    
    // Verificar acesso ao plano (lógica hierárquica existente)
    if (!resourceUserTypeId && !resourcePlanId) {
      return true; // Recurso público
    }
    
    if (resourcePlanId && resourcePlanLevel && user.plan_level) {
      return this.canAccessPlanLevel(user.plan_level, resourcePlanLevel);
    }
    
    return false;
  }
  
  return false;
}
```

---

## 🔄 Fluxo de Pagamento Recomendado

### 1. **Usuário Escolhe Plano**

```
Frontend: GET /subscriptions/plans
→ Exibe planos disponíveis
→ Usuário clica em "Assinar"
```

### 2. **Criar Checkout**

```
Frontend: POST /subscriptions/create-checkout
Body: { plan_id: "uuid" }
→ Backend cria sessão Stripe
→ Retorna checkoutUrl
```

### 3. **Redirecionar para Stripe**

```
Frontend: Redireciona para checkoutUrl
→ Usuário preenche dados de pagamento no Stripe
→ Stripe processa pagamento
```

### 4. **Webhook Confirma Pagamento**

```
Stripe: Envia webhook para /subscriptions/webhook
→ Backend atualiza subscription_status
→ Backend atualiza user.plan_id
→ Backend atualiza user.subscription_expires_at
```

### 5. **Usuário Retorna ao App**

```
Frontend: Redireciona para /subscription/success
→ Frontend busca status: GET /subscriptions/status
→ Exibe confirmação
→ Atualiza UI com novo plano
```

---

## 📊 Resumo das Recomendações

### ✅ **Fazer**

1. **Separar registro de pagamento**: Registro livre, pagamento opcional
2. **Criar tabela subscriptions**: Rastrear assinaturas e status
3. **Implementar webhooks**: Sincronizar com Stripe automaticamente
4. **Verificar expiração**: Validar acesso baseado em `subscription_expires_at`
5. **Grace period opcional**: Período de graça após expiração

### ❌ **Não Fazer**

1. **Não bloquear registro**: Permitir registro sem pagamento
2. **Não confiar apenas no Stripe**: Validar também no backend
3. **Não ignorar webhooks**: Sempre processar eventos do Stripe
4. **Não expor chaves secretas**: Usar variáveis de ambiente

---

## 🎯 Próximos Passos

1. **Criar migration** para tabela `subscriptions`
2. **Instalar Stripe SDK**: `npm install stripe @stripe/stripe-js`
3. **Criar módulo Subscriptions**: Service, Controller, Entity
4. **Implementar webhooks**: Handler seguro com verificação de assinatura
5. **Atualizar verificação de acesso**: Incluir status de assinatura
6. **Testar com Stripe Test Mode**: Usar cartões de teste

---

## 📚 Referências

- [Stripe Subscriptions](https://stripe.com/docs/billing/subscriptions/overview)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Stripe Testing](https://stripe.com/docs/testing)
