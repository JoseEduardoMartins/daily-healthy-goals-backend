# Documentação Frontend: Data de Nascimento e Metas de Alimentação por Idade

Esta documentação descreve as alterações de API para **data de nascimento no registro** e **metas de alimentação (produtos) filtradas por faixa etária**, para o frontend permanecer alinhado ao backend.

---

## Índice

1. [Visão geral](#visão-geral)
2. [Registro com data de nascimento](#registro-com-data-de-nascimento)
3. [Resposta de autenticação (login/register)](#resposta-de-autenticação-loginregister)
4. [Metas de alimentação por idade](#metas-de-alimentação-por-idade)
5. [Tipos TypeScript](#tipos-typescript)
6. [Admin: produtos com faixa etária](#admin-produtos-com-faixa-etária)
7. [Resumo e checklist](#resumo-e-checklist)

---

## Visão geral

- **Registro**: O campo **`birth_date`** (data de nascimento) é **obrigatório** no cadastro. Formato: `YYYY-MM-DD`.
- **Auth**: O objeto `user` retornado em login/register passa a incluir **`birth_date`** (string ou `null`).
- **Metas diárias**: As metas de **alimentação** (produtos) são filtradas pela **idade** do usuário, calculada a partir de `birth_date`. Produtos podem ter faixa etária opcional (`min_age` / `max_age`).

---

## Registro com data de nascimento

### Endpoint

`POST /auth/register`

### Campo novo no request

| Campo         | Tipo     | Obrigatório | Descrição |
|---------------|----------|-------------|-----------|
| `birth_date`  | `string` | **Sim**     | Data de nascimento no formato **YYYY-MM-DD**. Não pode ser data futura. |

### Exemplo de request (visitante)

```json
{
  "name": "Maria Silva",
  "email": "maria@example.com",
  "password": "senha123",
  "weight": 70,
  "height": 1.70,
  "birth_date": "1995-06-15",
  "user_type": "visitante"
}
```

### Exemplo de request (pagante)

```json
{
  "name": "João Santos",
  "email": "joao@example.com",
  "password": "senha123",
  "weight": 80,
  "height": 1.80,
  "birth_date": "1988-03-10",
  "user_type": "pagante",
  "plan_id": "uuid-do-plano"
}
```

### Validações (backend)

- `birth_date` é obrigatório.
- Deve ser uma data válida em formato **YYYY-MM-DD**.
- **Não pode ser data futura** (ex.: hoje ou anterior).

### Erros comuns

| Situação              | Status | Exemplo de mensagem |
|-----------------------|--------|----------------------|
| Campo ausente         | 400    | "Data de nascimento é obrigatória" |
| Formato inválido      | 400    | "Data de nascimento deve ser uma data válida (YYYY-MM-DD)" |
| Data futura           | 400    | "Data de nascimento não pode ser futura" |

### O que o frontend deve implementar

1. **Formulário de registro**
   - Incluir campo de data de nascimento (date picker ou input `type="date"`).
   - Garantir formato `YYYY-MM-DD` ao enviar (ex.: `input[type=date].value` já retorna nesse formato).
   - Validar no frontend que a data não é futura (opcional, mas melhora a UX).

2. **Exemplo de input (React)**

```tsx
<label>
  Data de nascimento
  <input
    type="date"
    value={form.birth_date}
    onChange={(e) => setForm({ ...form, birth_date: e.target.value })}
    max={new Date().toISOString().slice(0, 10)}
    required
  />
</label>
```

---

## Resposta de autenticação (login/register)

Tanto `POST /auth/login` quanto `POST /auth/register` retornam o mesmo formato. O objeto **`user`** passa a incluir **`birth_date`**.

### Campo novo no objeto `user`

| Campo        | Tipo              | Descrição |
|-------------|-------------------|-----------|
| `birth_date` | `string \| null`  | Data de nascimento no formato **YYYY-MM-DD**, ou `null` se não informado (ex.: usuários antigos). |

### Exemplo de response (200 OK)

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "Maria Silva",
    "email": "maria@example.com",
    "weight": 70,
    "height": 1.7,
    "birth_date": "1995-06-15",
    "role": "visitante",
    "plan_id": null,
    "user_type_id": "uuid",
    "subscription": { ... }
  }
}
```

### Uso no frontend

- Armazenar `user.birth_date` junto com os demais dados do usuário (estado global, contexto, etc.).
- Exibir ou editar data de nascimento na tela de perfil, se houver.
- **Não é necessário** enviar `birth_date` em outras requisições para as metas: o backend usa o valor salvo no usuário (via JWT/sessão).

---

## Metas de alimentação por idade

### Comportamento

- Ao criar ou buscar o **check-in do dia** (metas diárias), as metas de **alimentação** são **produtos** filtrados por:
  - estado de dor (`pain_state_id`),
  - permissões (plano/tipo de usuário),
  - **idade do usuário**, calculada a partir de **`birth_date`**.

### Regras de faixa etária (produtos)

- Cada produto pode ter, opcionalmente:
  - **`min_age`**: idade mínima (em anos) para o produto aparecer na meta.
  - **`max_age`**: idade máxima (em anos) para o produto aparecer na meta.

Comportamento:

| Produto tem faixa?              | Comportamento |
|---------------------------------|----------------|
| Sem `min_age` e sem `max_age`   | Aparece para **todos** os usuários (respeitando plano e pain_state). |
| Com `min_age` e/ou `max_age`    | Só aparece se a **idade do usuário** estiver dentro da faixa. |

- **Usuário sem `birth_date`** (ex.: conta antiga): idade = `null`. Nesse caso, só entram nas metas os produtos **sem** faixa etária (produtos com `min_age`/`max_age` são excluídos para esse usuário).

### Onde isso impacta o frontend

- **Nenhuma mudança de contrato** nos endpoints de daily goals: o frontend continua chamando os mesmos endpoints (ex.: criar check-in, listar metas do dia).
- A **lista de metas de alimentação** que o backend retorna já vem **filtrada por idade**; o frontend só consome a lista como hoje.
- Se quiser, o frontend pode exibir a idade do usuário (calculada a partir de `birth_date`) na UI, por exemplo no perfil.

### Cálculo de idade (opcional no frontend)

Se precisar exibir a idade em algum lugar:

```typescript
function getAge(birthDate: string | null): number | null {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age >= 0 ? age : null;
}

// Uso
const age = getAge(user.birth_date); // ex.: 29
```

---

## Tipos TypeScript

### Registro (request)

```typescript
interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  weight: number;
  height: number;
  birth_date: string; // YYYY-MM-DD
  user_type: 'visitante' | 'pagante';
  plan_id?: string; // obrigatório se user_type === 'pagante'
}
```

### Usuário (resposta de login/register)

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  weight: number;
  height: number;
  birth_date: string | null; // YYYY-MM-DD ou null
  role: string;
  plan_id: string | null;
  user_type_id: string | null;
  subscription?: Subscription | null;
}
```

### Produto (quando listado em metas ou catálogo)

Produtos podem incluir faixa etária (útil na área admin e para exibição):

```typescript
interface Product {
  id: string;
  name: string;
  description?: string | null;
  category_id: string;
  pain_state_id: string;
  // ... outros campos
  min_age: number | null;  // idade mínima (anos) para aparecer na meta
  max_age: number | null;  // idade máxima (anos) para aparecer na meta
}
```

---

## Admin: produtos com faixa etária

Na área admin, produtos podem ser criados/editados **com faixa etária opcional**.

### Criar produto

`POST /admin/products`

Campos opcionais novos:

| Campo     | Tipo              | Descrição |
|----------|-------------------|-----------|
| `min_age` | `number \| null`  | Idade mínima em anos (0–150). Opcional. |
| `max_age` | `number \| null`  | Idade máxima em anos (0–150). Opcional. |

### Atualizar produto

`PATCH /admin/products/:id`

Mesmos campos opcionais: `min_age`, `max_age`.

### Exemplo de payload (admin)

```json
{
  "name": "Smoothie Antioxidante",
  "category_id": "uuid",
  "pain_state_id": "uuid",
  "description": "...",
  "min_age": 18,
  "max_age": 65
}
```

- Se não enviar `min_age`/`max_age`, o produto fica sem faixa (visível para todas as idades, respeitando plano e pain_state).
- Produtos já existentes sem esses campos continuam sem faixa.

---

## Resumo e checklist

### Registro

- [ ] Incluir campo **data de nascimento** no formulário de registro.
- [ ] Enviar `birth_date` no formato **YYYY-MM-DD** em `POST /auth/register`.
- [ ] Tratar erros 400 (obrigatório, formato, data futura).

### Autenticação

- [ ] Incluir **`birth_date`** no tipo/interface do usuário (resposta de login/register).
- [ ] Persistir `user.birth_date` no estado/contexto de autenticação.

### Metas diárias

- [ ] Nenhuma mudança obrigatória nos endpoints de metas; a filtragem por idade é feita no backend.
- [ ] (Opcional) Exibir idade do usuário no perfil, calculada a partir de `birth_date`.

### Admin (produtos)

- [ ] Incluir campos opcionais **`min_age`** e **`max_age`** nos formulários de criar/editar produto.
- [ ] Validar no frontend: inteiros, 0–150 (opcional).

---

## Documentos relacionados

- [Registro de usuário (REGISTER.md)](./REGISTER.md) – Campos e fluxos de registro.
- [Resposta de autenticação (AUTH_RESPONSE.md)](./AUTH_RESPONSE.md) – Estrutura completa de login/register.
- [Admin (ADMIN_FRONTEND.md)](./ADMIN_FRONTEND.md) – CRUD de usuários, produtos, exercícios e planos.
