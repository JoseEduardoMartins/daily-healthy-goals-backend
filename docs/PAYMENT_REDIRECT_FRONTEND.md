# Fluxo de Redirecionamento após Pagamento - Frontend

## 📋 Visão Geral

Após o usuário completar o pagamento no Stripe Checkout, ele é redirecionado para o backend (`/subscriptions/success`), que valida o pagamento e redireciona para a página de perfil (`/profile`) com parâmetros de query indicando o status do pagamento.

## 🔄 Fluxo Completo

1. **Usuário escolhe plano** → Frontend chama `POST /subscriptions/create-checkout`
2. **Usuário é redirecionado** → Stripe Checkout (`https://checkout.stripe.com/...`)
3. **Usuário completa pagamento** → Stripe redireciona para `http://localhost:3000/subscriptions/success?session_id=...`
4. **Backend valida pagamento** → Consulta Stripe e verifica subscription
5. **Backend redireciona** → `http://localhost:5173/profile?payment_success=true&session_id=...`

## 📍 Redirecionamento para `/profile`

O backend sempre redireciona para `/profile` com os seguintes parâmetros de query:

### ✅ Pagamento Confirmado e Processado
```
/profile?payment_success=true&session_id=cs_test_...
```
- Subscription já foi processada pelo webhook
- Dados do usuário estão atualizados no banco
- Frontend deve buscar dados atualizados do usuário

### ⏳ Pagamento Confirmado mas Processando
```
/profile?payment_processing=true&session_id=cs_test_...
```
- Pagamento foi confirmado no Stripe
- Webhook ainda não processou (pode levar alguns segundos)
- Frontend deve fazer polling ou aguardar alguns segundos e buscar dados atualizados

### ❌ Erro no Pagamento
```
/profile?payment_error=not_completed&session_id=cs_test_...
/profile?payment_error=validation_failed&session_id=cs_test_...
/profile?payment_error=missing_session
```

## 🎯 Implementação no Frontend

### 1. Na página `/profile`, verificar parâmetros de query:

```typescript
// Exemplo React/Vue
import { useSearchParams } from 'react-router-dom'; // ou equivalente no Vue

function ProfilePage() {
  const [searchParams] = useSearchParams();
  const paymentSuccess = searchParams.get('payment_success');
  const paymentProcessing = searchParams.get('payment_processing');
  const paymentError = searchParams.get('payment_error');
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Se houver parâmetros de pagamento, buscar dados atualizados do usuário
    if (paymentSuccess || paymentProcessing || paymentError) {
      fetchUserData(); // Buscar dados atualizados
      
      // Se estiver processando, fazer polling
      if (paymentProcessing) {
        const interval = setInterval(() => {
          fetchUserData();
          // Verificar se subscription foi atualizada
          // Se sim, limpar interval e mostrar sucesso
        }, 2000); // Polling a cada 2 segundos
        
        // Limpar interval após 30 segundos (timeout)
        setTimeout(() => clearInterval(interval), 30000);
      }
    }
  }, [paymentSuccess, paymentProcessing, paymentError]);

  // Mostrar mensagens apropriadas
  if (paymentSuccess) {
    // Mostrar: "Pagamento confirmado! Sua assinatura está ativa."
  }
  if (paymentProcessing) {
    // Mostrar: "Processando pagamento... Aguarde alguns instantes."
  }
  if (paymentError) {
    // Mostrar: "Erro ao processar pagamento. Tente novamente."
  }
}
```

### 2. Buscar dados atualizados do usuário:

```typescript
// Chamar endpoint de login novamente ou endpoint de status da subscription
async function fetchUserData() {
  const response = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  // Atualizar estado do usuário com dados atualizados
  // data.user.subscription agora terá informações atualizadas
}
```

Ou usar o endpoint de status da subscription:

```typescript
async function fetchSubscriptionStatus() {
  const response = await fetch('http://localhost:3000/subscriptions/status', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  const data = await response.json();
  // Verificar se subscription está ativa
  return data;
}
```

### 3. Limpar parâmetros de query após processar:

```typescript
// Após processar os parâmetros, limpar da URL
if (paymentSuccess || paymentProcessing || paymentError) {
  // Processar...
  
  // Limpar parâmetros da URL (sem recarregar página)
  window.history.replaceState({}, '', '/profile');
}
```

## 📝 Exemplo Completo (React)

```typescript
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

function ProfilePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [user, setUser] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);

  useEffect(() => {
    const paymentSuccess = searchParams.get('payment_success');
    const paymentProcessing = searchParams.get('payment_processing');
    const paymentError = searchParams.get('payment_error');
    const sessionId = searchParams.get('session_id');

    if (paymentSuccess) {
      setPaymentStatus('success');
      fetchUserData(); // Buscar dados atualizados
      // Limpar parâmetros após 3 segundos
      setTimeout(() => {
        setSearchParams({});
      }, 3000);
    } else if (paymentProcessing) {
      setPaymentStatus('processing');
      // Fazer polling para verificar se subscription foi atualizada
      const interval = setInterval(async () => {
        const updated = await fetchUserData();
        if (updated?.user?.subscription?.hasActiveSubscription) {
          setPaymentStatus('success');
          clearInterval(interval);
          setSearchParams({});
        }
      }, 2000);
      
      // Timeout após 30 segundos
      setTimeout(() => {
        clearInterval(interval);
        setPaymentStatus('timeout');
      }, 30000);
    } else if (paymentError) {
      setPaymentStatus('error');
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  async function fetchUserData() {
    // Implementar busca de dados do usuário
    // Retornar dados atualizados
  }

  return (
    <div>
      {paymentStatus === 'success' && (
        <div className="alert alert-success">
          Pagamento confirmado! Sua assinatura está ativa.
        </div>
      )}
      {paymentStatus === 'processing' && (
        <div className="alert alert-info">
          Processando pagamento... Aguarde alguns instantes.
        </div>
      )}
      {paymentStatus === 'error' && (
        <div className="alert alert-danger">
          Erro ao processar pagamento. Tente novamente.
        </div>
      )}
      
      {/* Conteúdo da página de perfil */}
    </div>
  );
}
```

## 🔍 Endpoints Úteis

### `GET /subscriptions/status`
Retorna status atual da subscription do usuário autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Resposta:**
```json
{
  "hasActiveSubscription": true,
  "user": {
    "subscription_status": "active",
    "subscription_expires_at": "2024-02-10T00:00:00.000Z"
  },
  "subscription": {
    "id": "...",
    "status": "active",
    "plan": {
      "id": "...",
      "name": "Plano Ouro",
      "level": "ouro"
    },
    "current_period_end": "2024-03-10T00:00:00.000Z"
  }
}
```

### `POST /auth/login`
Retorna dados atualizados do usuário incluindo informações de subscription.

**Body:**
```json
{
  "email": "usuario@example.com",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "access_token": "...",
  "user": {
    "id": "...",
    "name": "...",
    "email": "...",
    "subscription": {
      "hasActiveSubscription": true,
      "status": "active",
      "plan": { ... }
    }
  }
}
```

## ⚠️ Observações Importantes

1. **Webhook pode demorar**: O webhook do Stripe pode levar alguns segundos para processar. Por isso, o frontend deve fazer polling se receber `payment_processing=true`.

2. **Timeout de polling**: Recomenda-se fazer polling por no máximo 30 segundos. Se após esse tempo a subscription não estiver ativa, mostrar mensagem para o usuário entrar em contato.

3. **Limpar URL**: Sempre limpar os parâmetros de query da URL após processar para evitar que o usuário veja mensagens duplicadas ao recarregar a página.

4. **Atualizar dados do usuário**: Sempre buscar dados atualizados do usuário após receber parâmetros de pagamento, pois a subscription pode ter sido atualizada.
