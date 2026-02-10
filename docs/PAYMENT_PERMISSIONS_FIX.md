# Correção de Permissões Após Pagamento - Documentação

## 📋 Problema Identificado

Após o pagamento ser concluído com sucesso, o usuário ainda não consegue acessar os produtos/exercícios do plano contratado. O sistema continua tratando o usuário como "visitante" mesmo após a confirmação do pagamento.

### Sintomas

- Usuário faz pagamento do plano Ouro
- Pagamento é confirmado no Stripe
- Usuário é redirecionado para `/profile?payment_success=true`
- Ao acessar a biblioteca, vê apenas 8 produtos (públicos) ao invés de 46 (todos do plano Ouro)
- O sistema não reconhece que o usuário é "pagante" com plano ativo

### Causa Raiz

O problema ocorre porque:

1. **JWT Token desatualizado**: O token JWT foi gerado antes do pagamento e contém dados antigos (`role: 'visitante'`, `plan_id: null`)
2. **JwtStrategy usa dados do token**: O `JwtStrategy.validate()` prioriza os dados do token JWT ao invés dos dados atualizados do banco de dados
3. **Frontend não atualiza token**: Após o pagamento, o frontend não faz refresh do token ou novo login

---

## 🔧 Melhorias Necessárias

### Backend

#### 1. Corrigir JwtStrategy para usar dados do banco como fonte de verdade

**Arquivo:** `src/modules/auth/strategies/jwt.strategy.ts`

**Problema atual:**
```typescript
async validate(payload: JwtPayload) {
  const user = await this.usersService.findOne(payload.sub);
  
  // ❌ PROBLEMA: Usa dados do token (antigos)
  let effectiveRole = payload.role;  // Token pode ter 'visitante'
  let effectivePlanId = payload.plan_id;  // Token pode ter null
  
  // ✅ CORREÇÃO: Usar dados do banco (atualizados)
  let effectiveRole = user.user_type?.name || 'visitante';
  let effectivePlanId = user.plan_id;
  
  // ... resto do código
}
```

**Solução:**
O `JwtStrategy` deve sempre usar os dados do banco de dados como fonte de verdade, não os dados do token. O token JWT deve ser usado apenas para identificar o usuário (ID), mas todas as informações de permissão devem vir do banco atualizado.

**Código corrigido:**
```typescript
async validate(payload: JwtPayload) {
  const user = await this.usersService.findOne(payload.sub);
  if (!user) {
    throw new UnauthorizedException();
  }
  
  // Verificar se assinatura expirou
  const now = new Date();
  const isSubscriptionExpired =
    user.subscription_expires_at && user.subscription_expires_at < now;

  // ✅ CORREÇÃO: Usar dados do banco como fonte de verdade
  let effectiveRole = user.user_type?.name || 'visitante';
  let effectivePlanId = user.plan_id;
  let effectiveSubscriptionStatus = user.subscription_status;
  let effectiveSubscriptionExpiresAt = user.subscription_expires_at;

  // Se assinatura expirou e usuário é pagante, downgrade para visitante
  if (
    effectiveRole === 'pagante' &&
    (isSubscriptionExpired ||
      effectiveSubscriptionStatus === 'expired' ||
      effectiveSubscriptionStatus === 'canceled')
  ) {
    // Assinatura expirada ou cancelada - tratar como visitante
    effectiveRole = 'visitante';
    effectivePlanId = null;
    effectiveSubscriptionStatus = null;
    effectiveSubscriptionExpiresAt = null;
  }

  return {
    id: user.id,
    email: user.email,
    role: effectiveRole,  // ✅ Do banco, não do token
    plan_id: effectivePlanId,  // ✅ Do banco, não do token
    plan_level: user.plan?.level || null,  // ✅ Do banco
    user_type_id: user.user_type_id,  // ✅ Do banco
    subscription_status: effectiveSubscriptionStatus,  // ✅ Do banco
    subscription_expires_at: effectiveSubscriptionExpiresAt,  // ✅ Do banco
  };
}
```

**Benefícios:**
- Mesmo com token antigo, as permissões refletem o estado atual do usuário no banco
- Não é necessário fazer novo login após pagamento
- Sistema sempre usa dados atualizados para verificação de permissões

---

#### 2. (Opcional) Criar endpoint para refresh de token

**Arquivo:** `src/modules/auth/auth.controller.ts`

**Motivação:**
Embora a correção do `JwtStrategy` resolva o problema principal, é uma boa prática permitir que o frontend solicite um novo token atualizado após eventos importantes como pagamento.

**Implementação:**
```typescript
@Post('refresh')
@UseGuards(JwtAuthGuard)
@ApiOperation({ summary: 'Atualizar token JWT com dados atualizados do usuário' })
@ApiResponse({ status: 200, description: 'Token atualizado com sucesso' })
async refreshToken(@CurrentUser() user: User): Promise<AuthResponse> {
  // Buscar usuário atualizado do banco
  const updatedUser = await this.usersService.findOne(user.id);
  
  // Gerar novo token com dados atualizados
  return this.generateTokenResponse(updatedUser);
}
```

**Uso:**
- Frontend pode chamar este endpoint após `payment_success=true`
- Retorna novo token com dados atualizados
- Frontend atualiza o token armazenado

---

#### 3. Verificar se webhook está atualizando corretamente

**Arquivo:** `src/modules/subscriptions/subscriptions.service.ts`

**Verificações necessárias:**

1. **Confirmar que `handleCheckoutCompleted` está sendo chamado:**
   - Verificar logs quando webhook é recebido
   - Confirmar que `usersService.updateSubscription` é executado

2. **Verificar que `updateSubscription` atualiza todos os campos necessários:**
   ```typescript
   await this.usersRepository.update(userId, {
     user_type_id: payingUserType.id,  // ✅ Deve atualizar
     plan_id: planId,  // ✅ Deve atualizar
     subscription_status: subscriptionStatus,  // ✅ Deve atualizar
     subscription_expires_at: subscriptionExpiresAt,  // ✅ Deve atualizar
   });
   ```

3. **Adicionar logs para debug:**
   ```typescript
   this.logger.log(`Atualizando usuário ${userId} para pagante com plano ${planId}`);
   await this.usersRepository.update(userId, { ... });
   this.logger.log(`Usuário ${userId} atualizado com sucesso`);
   ```

---

### Frontend

#### 1. Atualizar token após pagamento bem-sucedido

**Localização:** Componente que trata o redirecionamento de `/profile?payment_success=true`

**Problema atual:**
- Frontend recebe `payment_success=true` mas não atualiza o token
- Continua usando token antigo com dados de "visitante"

**Solução A: Refresh automático do token (Recomendado)**

```typescript
// No componente Profile ou onde trata payment_success
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const paymentSuccess = urlParams.get('payment_success');
  
  if (paymentSuccess === 'true') {
    // Fazer refresh do token para obter dados atualizados
    refreshUserToken();
    
    // Limpar parâmetro da URL
    window.history.replaceState({}, '', '/profile');
  }
}, []);

const refreshUserToken = async () => {
  try {
    const response = await fetch('http://localhost:3000/auth/refresh', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      // Atualizar token armazenado
      localStorage.setItem('token', data.access_token);
      
      // Atualizar dados do usuário no contexto/state
      updateUser(data.user);
      
      // Recarregar dados da biblioteca
      refetchLibrary();
    }
  } catch (error) {
    console.error('Erro ao atualizar token:', error);
  }
};
```

**Solução B: Novo login silencioso (Alternativa)**

```typescript
// Se não houver endpoint /auth/refresh, fazer novo login
const refreshUserToken = async () => {
  try {
    // Obter email do usuário atual (pode estar no contexto/state)
    const currentUser = getUserFromContext();
    
    // Fazer login silencioso (sem mostrar formulário)
    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: currentUser.email,
        password: '', // ⚠️ Precisa armazenar senha ou usar outro método
      }),
    });
    
    // ... atualizar token
  } catch (error) {
    console.error('Erro ao atualizar token:', error);
  }
};
```

**Nota:** A Solução B requer armazenar senha (não recomendado) ou implementar endpoint `/auth/refresh` no backend.

---

#### 2. Polling quando payment_processing=true

**Localização:** Componente que trata `/profile?payment_processing=true`

**Contexto:**
Quando o webhook ainda não processou o pagamento, o backend redireciona com `payment_processing=true`. O frontend deve fazer polling para verificar quando o pagamento for processado.

**Implementação:**
```typescript
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const paymentProcessing = urlParams.get('payment_processing');
  
  if (paymentProcessing === 'true') {
    // Iniciar polling para verificar status da subscription
    startPollingSubscriptionStatus();
  }
}, []);

const startPollingSubscriptionStatus = () => {
  const interval = setInterval(async () => {
    try {
      const response = await fetch('http://localhost:3000/subscriptions/status', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      const data = await response.json();
      
      // Se subscription está ativa, atualizar token e parar polling
      if (data.hasActiveSubscription && data.subscription?.status === 'active') {
        clearInterval(interval);
        refreshUserToken(); // Atualizar token
        window.history.replaceState({}, '', '/profile?payment_success=true');
      }
    } catch (error) {
      console.error('Erro ao verificar status:', error);
    }
  }, 2000); // Polling a cada 2 segundos
  
  // Parar polling após 30 segundos (webhook deve processar antes disso)
  setTimeout(() => {
    clearInterval(interval);
  }, 30000);
};
```

---

#### 3. Recarregar dados da biblioteca após atualização do token

**Localização:** Componente da biblioteca (produtos/exercícios)

**Problema:**
Após atualizar o token, os dados da biblioteca podem estar em cache com os dados antigos (apenas produtos públicos).

**Solução:**
```typescript
// Após atualizar token, recarregar biblioteca
const refreshUserToken = async () => {
  // ... código de atualização do token ...
  
  // Recarregar biblioteca
  await refetchProducts();
  await refetchExercises();
};

// Ou usar um hook que observa mudanças no token
useEffect(() => {
  if (user?.role === 'pagante' && user?.plan_id) {
    // Token foi atualizado e usuário agora é pagante
    refetchProducts();
    refetchExercises();
  }
}, [user?.role, user?.plan_id]);
```

---

#### 4. Mostrar feedback visual durante processamento

**Localização:** Componente Profile

**Melhoria de UX:**
```typescript
const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  
  if (urlParams.get('payment_success') === 'true') {
    setPaymentStatus('success');
    // Mostrar toast/notificação de sucesso
    showNotification('Pagamento confirmado! Você agora tem acesso completo à biblioteca.');
  } else if (urlParams.get('payment_processing') === 'true') {
    setPaymentStatus('processing');
    // Mostrar indicador de processamento
    showNotification('Processando pagamento... Aguarde alguns instantes.');
  } else if (urlParams.get('payment_error')) {
    setPaymentStatus('error');
    // Mostrar erro
    showNotification('Erro ao processar pagamento. Entre em contato com o suporte.');
  }
}, []);

// No JSX
{paymentStatus === 'processing' && (
  <div className="payment-processing">
    <Spinner />
    <p>Processando seu pagamento... Isso pode levar alguns segundos.</p>
  </div>
)}
```

---

## 📝 Checklist de Implementação

### Backend

- [ ] **Corrigir `JwtStrategy.validate()`** para usar dados do banco ao invés do token
  - [ ] Substituir `payload.role` por `user.user_type?.name`
  - [ ] Substituir `payload.plan_id` por `user.plan_id`
  - [ ] Garantir que `plan_level` vem de `user.plan?.level`
  - [ ] Testar que permissões funcionam mesmo com token antigo

- [ ] **(Opcional) Criar endpoint `/auth/refresh`**
  - [ ] Adicionar método `refreshToken` no `AuthController`
  - [ ] Adicionar método `refreshToken` no `AuthService`
  - [ ] Documentar no Swagger
  - [ ] Testar endpoint

- [ ] **Verificar logs do webhook**
  - [ ] Confirmar que `handleCheckoutCompleted` é chamado
  - [ ] Confirmar que `updateSubscription` atualiza todos os campos
  - [ ] Adicionar logs de debug se necessário

### Frontend

- [ ] **Tratar `payment_success=true`**
  - [ ] Detectar parâmetro na URL
  - [ ] Chamar endpoint de refresh (ou novo login)
  - [ ] Atualizar token armazenado
  - [ ] Atualizar dados do usuário no contexto/state
  - [ ] Recarregar biblioteca

- [ ] **Tratar `payment_processing=true`**
  - [ ] Detectar parâmetro na URL
  - [ ] Iniciar polling de `/subscriptions/status`
  - [ ] Parar polling quando subscription estiver ativa
  - [ ] Atualizar token quando pagamento for confirmado

- [ ] **Melhorias de UX**
  - [ ] Mostrar feedback visual durante processamento
  - [ ] Mostrar mensagem de sucesso quando pagamento confirmado
  - [ ] Mostrar mensagem de erro se houver problema
  - [ ] Limpar parâmetros da URL após processar

---

## 🧪 Testes

### Teste 1: Token antigo com banco atualizado

1. Fazer login como visitante (token gerado)
2. Fazer pagamento do plano Ouro
3. **Sem fazer novo login**, acessar `/products`
4. **Esperado:** Ver todos os produtos do plano Ouro (46 produtos)
5. **Atual:** Ver apenas produtos públicos (8 produtos)

### Teste 2: Refresh de token após pagamento

1. Fazer login como visitante
2. Fazer pagamento do plano Ouro
3. Chamar `/auth/refresh` (ou fazer novo login)
4. Acessar `/products` com novo token
5. **Esperado:** Ver todos os produtos do plano Ouro

### Teste 3: Polling quando webhook está atrasado

1. Fazer pagamento do plano Ouro
2. Simular atraso do webhook (não processar imediatamente)
3. Frontend recebe `payment_processing=true`
4. Frontend inicia polling
5. Webhook processa pagamento
6. Frontend detecta subscription ativa e atualiza token
7. **Esperado:** Usuário vê produtos do plano Ouro

---

## 🔍 Debug

### Como verificar se o problema foi resolvido

1. **Verificar dados no banco:**
   ```sql
   SELECT id, email, user_type_id, plan_id, subscription_status, subscription_expires_at
   FROM users
   WHERE email = 'usuario@example.com';
   ```
   - `user_type_id` deve ser o ID do tipo "pagante"
   - `plan_id` deve ser o ID do plano Ouro
   - `subscription_status` deve ser `'active'`

2. **Verificar token JWT:**
   - Decodificar token em https://jwt.io
   - Verificar que `role` e `plan_id` no token podem estar antigos (isso é OK após correção)

3. **Verificar `CurrentUserPayload` em requisições:**
   - Adicionar log no `JwtStrategy.validate()`:
     ```typescript
     console.log('Token payload:', payload);
     console.log('User from DB:', user);
     console.log('Effective role:', effectiveRole);
     console.log('Effective plan_id:', effectivePlanId);
     ```
   - Verificar que `effectiveRole` e `effectivePlanId` vêm do banco, não do token

4. **Verificar permissões:**
   - Adicionar log no `PermissionsHelper.filterByAccess()`:
     ```typescript
     console.log('User role:', user.role);
     console.log('User plan_id:', user.plan_id);
     console.log('User plan_level:', user.plan_level);
     console.log('Filtered resources:', filtered.length);
     ```
   - Verificar que `user.role` é `'pagante'` e `user.plan_level` é `'ouro'`

---

## 📚 Referências

- [Documentação de Pagamento](./PAYMENT_FLOW_FRONTEND.md) - Fluxo completo de pagamento
- [Documentação de Permissões](./PERMISSIONS.md) - Sistema de permissões e hierarquia de planos
- [JWT Strategy](./JWT_STRATEGY.md) - Como funciona a validação de tokens

---

## ⚠️ Notas Importantes

1. **Prioridade:** A correção do `JwtStrategy` é **crítica** e deve ser feita primeiro. Ela resolve o problema principal sem depender do frontend.

2. **Compatibilidade:** Após corrigir o `JwtStrategy`, tokens antigos continuarão funcionando, mas com permissões atualizadas do banco. Isso é o comportamento desejado.

3. **Performance:** Buscar dados do banco a cada requisição pode ter impacto de performance. Considere cache se necessário, mas garanta que o cache seja invalidado quando dados do usuário mudarem.

4. **Segurança:** O token JWT ainda é necessário para autenticação (identificar o usuário). A correção apenas garante que as permissões vêm do banco atualizado, não do token.

---

## ✅ Resultado Esperado

Após implementar as correções:

1. ✅ Usuário faz pagamento do plano Ouro
2. ✅ Webhook atualiza banco de dados (user_type_id, plan_id, subscription_status)
3. ✅ Próxima requisição do usuário (mesmo com token antigo) usa dados atualizados do banco
4. ✅ `JwtStrategy` retorna `role: 'pagante'`, `plan_id: <ouro>`, `plan_level: 'ouro'`
5. ✅ `PermissionsHelper` permite acesso a todos os produtos do plano Ouro
6. ✅ Usuário vê 46 produtos na biblioteca ao invés de 8
7. ✅ Frontend pode opcionalmente atualizar token para melhor UX
