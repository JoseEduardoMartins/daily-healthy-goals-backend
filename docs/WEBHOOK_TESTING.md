# Como Testar Webhooks do Stripe Localmente

## 📋 Pré-requisitos

1. Stripe CLI instalado
2. Aplicação rodando em `http://localhost:3000`
3. Webhook secret configurado no `.env`

## 🚀 Passo a Passo

### 1. Configurar o Webhook Secret

Quando você rodar `stripe listen`, ele fornecerá um webhook secret. Adicione ao `.env`:

```env
STRIPE_WEBHOOK_SECRET=whsec_c7f841d389e700d0babf9bb475f6f6b04fa409ab64232ee65f2a6fdfae35b432
```

### 2. Reiniciar a Aplicação (se necessário)

Se você mudou o `.env`, reinicie:
```bash
cd /home/eduardo/Desktop/projects/personal/daily-healthy-goals/daily-healthy-goals-backend
docker compose restart app
```

### 3. Rodar o Stripe Listen (Terminal 1)

**IMPORTANTE**: Este comando deve ficar rodando continuamente. Não suspenda (^Z) ou feche este terminal.

```bash
stripe listen --forward-to localhost:3000/subscriptions/webhook
```

Você verá:
```
> Ready! You are using Stripe API Version [2026-01-28.clover]. 
> Your webhook signing secret is whsec_xxxxx (^C to quit)
```

**⚠️ Deixe este terminal aberto e rodando!**

### 4. Disparar Eventos (Terminal 2)

Em **outro terminal**, dispare os eventos:

```bash
# Testar checkout completado
stripe trigger checkout.session.completed

# Testar pagamento bem-sucedido
stripe trigger invoice.payment_succeeded

# Testar pagamento falhado
stripe trigger invoice.payment_failed

# Testar assinatura cancelada
stripe trigger customer.subscription.deleted

# Testar assinatura atualizada
stripe trigger customer.subscription.updated
```

### 5. Verificar os Logs (Terminal 3)

Em **outro terminal**, monitore os logs:

```bash
cd /home/eduardo/Desktop/projects/personal/daily-healthy-goals/daily-healthy-goals-backend
docker compose logs app -f
```

Ou para ver apenas webhooks:
```bash
docker compose logs app -f | grep -E "(webhook|Webhook|checkout|invoice|✅|📝|💳|⚠️|🔔)"
```

## 📊 Logs Esperados

Quando um webhook é recebido e processado, você verá:

```
🔔 Webhook recebido do Stripe
✅ Evento recebido: checkout.session.completed
📝 Processando checkout.session.completed
✅ checkout.session.completed processado com sucesso
✅ Webhook processado com sucesso
```

## ⚠️ Problemas Comuns

### Problema: "no configuration file provided: not found"

**Solução**: Certifique-se de estar no diretório correto:
```bash
cd /home/eduardo/Desktop/projects/personal/daily-healthy-goals/daily-healthy-goals-backend
```

### Problema: Webhooks não estão chegando

**Causas possíveis**:
1. `stripe listen` não está rodando ou foi suspenso
2. Webhook secret não está configurado no `.env`
3. Aplicação não está rodando

**Solução**:
1. Verifique se `stripe listen` está rodando (não suspenso)
2. Verifique se `STRIPE_WEBHOOK_SECRET` está no `.env`
3. Verifique se a aplicação está rodando: `docker compose ps`

### Problema: "Webhook signature verification failed"

**Causa**: Webhook secret incorreto ou não configurado

**Solução**: 
1. Pare o `stripe listen` (Ctrl+C)
2. Rode novamente: `stripe listen --forward-to localhost:3000/subscriptions/webhook`
3. Copie o novo `whsec_xxxxx`
4. Atualize o `.env` com o novo secret
5. Reinicie a aplicação: `docker compose restart app`

## 🎯 Eventos Suportados

O sistema processa os seguintes eventos:

1. ✅ `checkout.session.completed` - Checkout completado
2. ✅ `invoice.payment_succeeded` - Pagamento bem-sucedido
3. ✅ `invoice_payment.paid` - Pagamento pago (versão nova da API)
4. ✅ `invoice.payment_failed` - Pagamento falhado
5. ✅ `customer.subscription.deleted` - Assinatura cancelada
6. ✅ `customer.subscription.updated` - Assinatura atualizada

## 📝 Comandos Úteis

```bash
# Ver logs em tempo real
docker compose logs app -f

# Ver apenas webhooks
docker compose logs app -f | grep -i webhook

# Ver últimas 50 linhas
docker compose logs app --tail 50

# Ver logs dos últimos 5 minutos
docker compose logs app --since 5m

# Verificar se containers estão rodando
docker compose ps

# Reiniciar aplicação
docker compose restart app
```

## 🔍 Verificar no Banco de Dados

Após processar webhooks, você pode verificar se os dados foram salvos:

```bash
# Ver assinaturas
docker compose exec mysql mysql -u app_user -papp_password daily_healthy_goals -e "SELECT id, user_id, plan_id, status, current_period_end FROM subscriptions ORDER BY created_at DESC LIMIT 5;"

# Ver histórico de pagamentos
docker compose exec mysql mysql -u app_user -papp_password daily_healthy_goals -e "SELECT id, subscription_id, amount, status, paid_at FROM payment_history ORDER BY created_at DESC LIMIT 5;"
```
