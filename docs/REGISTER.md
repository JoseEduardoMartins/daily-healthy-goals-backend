# Documentação: Registro de Usuário com Tipo e Plano

## 📋 Visão Geral

O endpoint de registro (`POST /auth/register`) foi atualizado para permitir que o usuário escolha seu **tipo de usuário** (`visitante` ou `pagante`) e, se for pagante, selecione um **plano de assinatura**.

**Importante**: Este endpoint já retorna o usuário logado com `access_token` na resposta, não é necessário fazer login após o registro.

---

## 🔐 Endpoint de Registro

**URL**: `POST /auth/register`  
**Autenticação**: Não necessária  
**Content-Type**: `application/json`

---

## 📝 Campos do Request

### Campos Obrigatórios (Sempre)

- **`name`**: `string` - Nome completo do usuário
- **`email`**: `string` - Email válido e único
- **`password`**: `string` - Senha do usuário
- **`weight`**: `number` - Peso em kg (deve ser > 0)
- **`height`**: `number` - Altura em metros (deve ser > 0)
- **`birth_date`**: `string` - Data de nascimento no formato **YYYY-MM-DD**. Obrigatória. Não pode ser data futura.

### Campos Novos (Controle de Acesso)

- **`user_type`**: `string` (obrigatório)
  - Valores permitidos: `"visitante"` ou `"pagante"`
  - ⚠️ **NUNCA** enviar `"admin"` (será bloqueado por validação)

- **`plan_id`**: `string | null` (condicional)
  - **Obrigatório** se `user_type === "pagante"`
  - **Proibido** (não deve ser enviado) se `user_type === "visitante"`

---

## 🎯 Fluxo para Registrar Usuário Visitante

### Request

```json
POST /auth/register
Content-Type: application/json

{
  "name": "Maria Visitante",
  "email": "maria.visitante@example.com",
  "password": "senha123",
  "weight": 70,
  "height": 1.70,
  "birth_date": "1995-06-15",
  "user_type": "visitante"
}
```

**⚠️ Importante**: Não envie `plan_id` para visitantes.

### Response de Sucesso (201 Created)

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "Maria Visitante",
    "email": "maria.visitante@example.com",
    "weight": 70,
    "height": 1.7,
    "birth_date": "1995-06-15",
    "role": "visitante",
    "plan_id": null,
    "user_type_id": "uuid-do-tipo-visitante"
  }
}
```

---

## 💳 Fluxo para Registrar Usuário Pagante

### Passo 1: Obter Planos Disponíveis

Antes de registrar um pagante, o frontend deve buscar os planos disponíveis para permitir que o usuário escolha:

```http
GET /plans
```

**Response** (exemplo):

```json
[
  {
    "id": "15ac0191-0531-11f1-a076-0242ac160002",
    "name": "Bronze",
    "level": "bronze",
    "description": "Plano básico com acesso a recursos essenciais",
    "price": 29.9,
    "is_active": true
  },
  {
    "id": "uuid-prata",
    "name": "Prata",
    "level": "prata",
    "description": "Plano intermediário com mais recursos",
    "price": 59.9,
    "is_active": true
  },
  {
    "id": "uuid-ouro",
    "name": "Ouro",
    "level": "ouro",
    "description": "Plano premium com acesso total",
    "price": 99.9,
    "is_active": true
  }
]
```

Use o `id` do plano escolhido como `plan_id` no registro.

### Passo 2: Request de Registro para Pagante

```json
POST /auth/register
Content-Type: application/json

{
  "name": "João Pagante",
  "email": "joao.pagante@example.com",
  "password": "senha123",
  "weight": 80,
  "height": 1.80,
  "birth_date": "1988-03-10",
  "user_type": "pagante",
  "plan_id": "15ac0191-0531-11f1-a076-0242ac160002"
}
```

### Response de Sucesso (201 Created)

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "João Pagante",
    "email": "joao.pagante@example.com",
    "weight": 80,
    "height": 1.8,
    "birth_date": "1988-03-10",
    "role": "pagante",
    "plan_id": "15ac0191-0531-11f1-a076-0242ac160002",
    "user_type_id": "uuid-do-tipo-pagante"
  }
}
```

---

## ⚠️ Regras de Validação (Importante para o Frontend)

### Validação de `user_type`

- **Obrigatório**: O campo `user_type` é obrigatório
- **Valores permitidos**: Apenas `"visitante"` ou `"pagante"`
- **Bloqueio de admin**: Tentar enviar `"admin"` resultará em **400 Bad Request**
  - Mensagem: `"Tipo de usuário deve ser \"visitante\" ou \"pagante\". Admin não pode ser cadastrado por segurança."`

### Validação de `plan_id`

#### Para Visitantes (`user_type === "visitante"`)

- **Não deve ser enviado**: Visitantes não podem ter plano
- Se enviar `plan_id` → **400 Bad Request**
  - Mensagem: `"Usuários visitantes não podem ter plano associado"`

#### Para Pagantes (`user_type === "pagante"`)

- **Obrigatório**: O campo `plan_id` é obrigatório
- Se não enviar → **400 Bad Request**
  - Mensagem: `"Plano é obrigatório para usuários pagantes"`
- Deve ser um UUID válido
- O plano deve existir no banco de dados
- O plano deve estar ativo (`is_active === true`)
- Se plano não existir ou estiver inativo → **404 Not Found** ou **400 Bad Request**

---

## 🎨 O que o Frontend Precisa Implementar

### 1. Tela de Cadastro

O formulário de registro deve incluir:

- **Campos básicos**:
  - Input para `name`
  - Input para `email`
  - Input para `password` (com tipo password)
  - Input para `weight` (número)
  - Input para `height` (número)
  - Input para **`birth_date`** (tipo `date` ou date picker; formato YYYY-MM-DD; não pode ser futura)

- **Seletor de tipo de usuário**:
  - Radio buttons ou Select para escolher entre `"visitante"` ou `"pagante"`
  - **Não incluir opção "admin"** (por segurança)

- **Seletor de plano** (condicional):
  - **Se `user_type === "pagante"`**:
    - Carregar planos disponíveis com `GET /plans`
    - Exibir dropdown/lista de planos para o usuário escolher
    - Enviar o `plan_id` do plano selecionado no payload
  - **Se `user_type === "visitante"`**:
    - Não mostrar seleção de plano
    - Não enviar `plan_id` no payload

### 2. Tratamento de Erros

O frontend deve tratar os seguintes erros:

- **400 Bad Request**:
  - Se mensagem contém `"Tipo de usuário deve ser"` → Mostrar erro de tipo inválido
  - Se mensagem contém `"Plano é obrigatório"` → Mostrar: "Por favor, selecione um plano para continuar"
  - Se mensagem contém `"não podem ter plano associado"` → Mostrar: "Visitantes não podem ter plano selecionado"
  - Se mensagem contém `"UUID válido"` → Mostrar: "Plano inválido"

- **404 Not Found**:
  - Se relacionado a plano → Mostrar: "Plano não encontrado"

- **409 Conflict**:
  - Se email já existe → Mostrar: "Este email já está em uso"

### 3. Pós-Registro

Após registro bem-sucedido:

1. **Salvar o token**: Armazenar o `access_token` retornado (usar para autenticação em requisições futuras)
2. **Armazenar dados do usuário**: Salvar informações do `user` retornado no estado da aplicação
3. **Redirecionar**: Redirecionar para a tela principal ou dashboard
4. **Ajustar UI**: Usar `user.role` e `user.plan_id` para:
   - Mostrar/ocultar features baseadas no plano
   - Ajustar menus e navegação
   - Exibir informações do plano atual

---

## 📊 Exemplo de Implementação (Pseudo-código)

```typescript
// Exemplo de componente React/TypeScript

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  weight: number;
  height: number;
  birth_date: string; // YYYY-MM-DD
  user_type: 'visitante' | 'pagante';
  plan_id?: string;
}

async function handleRegister(formData: RegisterForm) {
  // Preparar payload
  const payload: any = {
    name: formData.name,
    email: formData.email,
    password: formData.password,
    weight: formData.weight,
    height: formData.height,
    birth_date: formData.birth_date,
    user_type: formData.user_type,
  };

  // Se for pagante, adicionar plan_id
  if (formData.user_type === 'pagante') {
    if (!formData.plan_id) {
      throw new Error('Plano é obrigatório para usuários pagantes');
    }
    payload.plan_id = formData.plan_id;
  }
  // Se for visitante, não enviar plan_id

  // Fazer requisição
  const response = await fetch('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    // Tratar erros conforme descrito acima
    throw new Error(error.message);
  }

  const data = await response.json();
  
  // Salvar token e dados do usuário
  localStorage.setItem('access_token', data.access_token);
  localStorage.setItem('user', JSON.stringify(data.user));
  
  return data;
}

// Carregar planos antes de mostrar formulário (se user_type === 'pagante')
async function loadPlans() {
  const response = await fetch('/plans');
  const plans = await response.json();
  return plans.filter(plan => plan.is_active);
}
```

---

## 🔑 Referência Rápida

| Tipo de Usuário | `user_type` | `plan_id` | `role` no Token |
|-----------------|-------------|----------|-----------------|
| **Visitante**   | `"visitante"` | `null` (não enviar) | `"visitante"` |
| **Pagante**     | `"pagante"` | UUID obrigatório | `"pagante"` |
| **Admin**       | ❌ Bloqueado | - | - |

---

## 📚 Endpoints Relacionados

- **`GET /plans`**: Lista planos disponíveis (use antes de registrar pagante)
- **`POST /auth/login`**: Login de usuário existente
- **`GET /user-types`**: Lista tipos de usuário disponíveis (opcional, para referência)

## 📄 Documentação complementar

- **[FRONTEND_BIRTH_DATE_AND_GOALS.md](./FRONTEND_BIRTH_DATE_AND_GOALS.md)** – Data de nascimento no registro e metas de alimentação por idade (tipos, exemplos e checklist para o frontend).

---

## ⚡ Notas Importantes

1. **Segurança**: O tipo "admin" não pode ser cadastrado via endpoint público por questões de segurança
2. **Token JWT**: O `access_token` retornado já contém as informações de `role` e `plan_id` no payload
3. **Validação**: Todas as validações são feitas no backend, mas o frontend deve validar também para melhor UX
4. **Planos Ativos**: Apenas planos com `is_active: true` devem ser exibidos para seleção

---

## 🐛 Troubleshooting

### Erro: "Plano é obrigatório para usuários pagantes"
- **Causa**: `user_type === "pagante"` mas `plan_id` não foi enviado
- **Solução**: Garantir que o usuário selecionou um plano antes de enviar

### Erro: "Usuários visitantes não podem ter plano associado"
- **Causa**: `user_type === "visitante"` mas `plan_id` foi enviado
- **Solução**: Não enviar `plan_id` quando `user_type === "visitante"`

### Erro: "Tipo de usuário deve ser..."
- **Causa**: Tentou enviar `"admin"` ou valor inválido
- **Solução**: Usar apenas `"visitante"` ou `"pagante"`

### Erro: "Plano não encontrado" ou "Plano não está ativo"
- **Causa**: `plan_id` inválido ou plano inativo
- **Solução**: Buscar planos ativos com `GET /plans` e usar apenas IDs válidos
