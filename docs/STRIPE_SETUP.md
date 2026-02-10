# Configuração do Stripe

## 📋 Variáveis de Ambiente

Adicione as seguintes variáveis de ambiente ao seu arquivo `.env`:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...        # Chave secreta do Stripe (Test ou Live)
STRIPE_WEBHOOK_SECRET=whsec_...      # Secret do webhook (obtido no dashboard do Stripe)
STRIPE_CURRENCY=brl                  # Moeda (brl, usd, etc.)
BACKEND_URL=http://localhost:3000    # URL pública do backend (usada no success_url do Stripe)
FRONTEND_URL=http://localhost:5173   # URL do frontend (usada para redirecionar para /profile)
```

## 🔑 Como Obter as Chaves

### 1. Criar Conta no Stripe

1. Acesse [https://stripe.com](https://stripe.com)
2. Crie uma conta ou faça login
3. Acesse o Dashboard

### 2. Obter Chave Secreta (Secret Key)

1. No Dashboard, vá em **Developers** → **API keys**
2. Copie a **Secret key** (começa com `sk_test_` para teste ou `sk_live_` para produção)
3. Adicione ao `.env` como `STRIPE_SECRET_KEY`

### 3. Configurar Webhook

1. No Dashboard, vá em **Developers** → **Webhooks**
2. Clique em **Add endpoint**
3. Configure:
   - **Endpoint URL**: `https://seu-dominio.com/subscriptions/webhook`
   - **Events to send**: Selecione os seguintes eventos:
     - `checkout.session.completed`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
     - `customer.subscription.deleted`
     - `customer.subscription.updated`
4. Após criar, copie o **Signing secret** (começa com `whsec_`)
5. Adicione ao `.env` como `STRIPE_WEBHOOK_SECRET`

### 4. Testar com Cartões de Teste

O Stripe fornece cartões de teste para desenvolvimento:

- **Sucesso**: `4242 4242 4242 4242`
- **Falha**: `4000 0000 0000 0002`
- **Requer autenticação**: `4000 0025 0000 3155`

Use qualquer data futura para expiração e qualquer CVC.

## 🧪 Modo de Teste vs Produção

### Modo de Teste (Development)

- Use chaves que começam com `sk_test_` e `whsec_`
- Use cartões de teste do Stripe
- Não há cobranças reais

### Modo de Produção (Production)

- Use chaves que começam com `sk_live_` e `whsec_`
- Configure webhook com URL de produção
- Cobranças reais serão processadas

## 📝 Exemplo de .env

```env
# Database
DB_HOST=mysql
DB_PORT=3306
DB_USERNAME=app_user
DB_PASSWORD=app_password
DB_DATABASE=daily_healthy_goals

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Stripe (Test Mode)
STRIPE_SECRET_KEY=sk_test_51AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdefghijklmnopqrstuvwxyz
STRIPE_CURRENCY=brl
BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
```

## ⚠️ Segurança

- **NUNCA** commite o arquivo `.env` no Git
- Use variáveis de ambiente diferentes para desenvolvimento e produção
- Mantenha as chaves secretas seguras
- Use HTTPS em produção para webhooks

## 🔍 Verificar Configuração

Após configurar, você pode testar se o Stripe está funcionando:

```bash
# Verificar se a aplicação inicia sem erros
npm run start:dev

# Verificar logs para mensagens de aviso sobre Stripe
# Se STRIPE_SECRET_KEY não estiver configurada, verá um aviso
```

## 📚 Recursos

- [Documentação do Stripe](https://stripe.com/docs)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
