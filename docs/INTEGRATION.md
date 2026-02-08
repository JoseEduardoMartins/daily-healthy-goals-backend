# Documentação de Integração - Frontend

Esta documentação descreve como integrar o frontend com a API do Daily Healthy Goals Backend.

## 📋 Índice

- [Informações Gerais](#informações-gerais)
- [Autenticação](#autenticação)
- [Endpoints](#endpoints)
- [Modelos de Dados](#modelos-de-dados)
- [Tratamento de Erros](#tratamento-de-erros)
- [Exemplos de Integração](#exemplos-de-integração)
- [Fluxo Completo](#fluxo-completo)
- [Estrutura de Dados](#estrutura-de-dados)

## 🔗 Informações Gerais

### URL Base

```
Desenvolvimento: http://localhost:3000
Produção: [URL_DO_SERVIDOR]
```

### Headers Padrão

Todas as requisições devem incluir:

```http
Content-Type: application/json
Accept: application/json
```

Para endpoints que requerem autenticação:

```http
Authorization: Bearer <jwt-token>
```

O token é obtido após login/registro e deve ser enviado em todas as requisições autenticadas.

## 🔐 Autenticação

O sistema utiliza **JWT (JSON Web Tokens)** para autenticação. O token contém informações sobre o usuário, incluindo seu **role** (tipo de usuário), que determina quais recursos ele pode acessar.

### Fluxo de Autenticação

1. Usuário se registra via `POST /auth/register` ou faz login via `POST /auth/login`
2. Backend retorna um `access_token` JWT e dados do usuário
3. Frontend armazena o token e dados do usuário
4. Frontend envia o token no header `Authorization: Bearer <token>` em todas as requisições autenticadas

### Resposta de Login/Registro

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "João Silva",
    "email": "joao@example.com",
    "weight": 75.5,
    "height": 1.75,
    "role": "pagante",
    "plan_id": "bronze-plan-uuid",
    "user_type_id": "pagante-type-uuid"
  }
}
```

### Armazenamento no Frontend

```javascript
// Após registro/login bem-sucedido
const { access_token, user } = response;

localStorage.setItem('access_token', access_token);
localStorage.setItem('user', JSON.stringify(user));
```

### Enviando Token nas Requisições

```javascript
// Headers para requisições autenticadas
const token = localStorage.getItem('access_token');

fetch('http://localhost:3000/products', {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
});
```

### Acesso Anônimo (Sem Token)

Alguns endpoints podem ser acessados **sem token** (visitante anônimo):
- `GET /products` - Retorna apenas produtos públicos
- `GET /exercises` - Retorna apenas exercícios públicos
- `GET /pain-states` - Lista estados de dor
- `GET /categories` - Lista categorias

⚠️ **Importante**: Para acesso completo, sempre envie o token quando disponível.

### Sistema de Controle de Acesso

O backend filtra automaticamente produtos e exercícios baseado no **role** do usuário:

- **Admin**: Acesso a tudo
- **Visitante (com token)**: Produtos públicos + produtos de visitante
- **Visitante (sem token)**: Apenas produtos públicos
- **Pagante**: Produtos públicos + produtos de visitante + produtos do seu plano

📖 **Documentação Completa**: Veja [ACCESS_CONTROL.md](./ACCESS_CONTROL.md) para detalhes completos sobre o sistema de controle de acesso.

## 📡 Endpoints

### 1. Registro de Usuário

**Endpoint:** `POST /auth/register`

**Descrição:** Cria um novo usuário no sistema. Peso e altura são obrigatórios.

**Headers:**
```http
Content-Type: application/json
```

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123",
  "weight": 75.5,
  "height": 1.75
}
```

**Validações:**
- `name`: obrigatório, string
- `email`: obrigatório, email válido, único no sistema
- `password`: obrigatório, string
- `weight`: obrigatório, número > 0
- `height`: obrigatório, número > 0

**Resposta de Sucesso (201 Created):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "João Silva",
    "email": "joao@example.com",
    "weight": 75.5,
    "height": 1.75,
    "role": "visitante",
    "plan_id": null,
    "user_type_id": null
  }
}
```

**Resposta de Erro (409 Conflict):**
```json
{
  "statusCode": 409,
  "message": "Email já está em uso",
  "error": "Conflict"
}
```

---

### 2. Login de Usuário

**Endpoint:** `POST /auth/login`

**Descrição:** Autentica um usuário existente no sistema usando email e senha.

**Headers:**
```http
Content-Type: application/json
```

**Body:**
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Resposta de Sucesso (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "João Silva",
    "email": "joao@example.com",
    "weight": 75.5,
    "height": 1.75,
    "role": "visitante",
    "plan_id": null,
    "user_type_id": null
  }
}
```

**Resposta de Erro (401 Unauthorized):**
```json
{
  "statusCode": 401,
  "message": "Credenciais inválidas",
  "error": "Unauthorized"
}
```

---

### 3. Listar Estados de Dor (Pain States)

**Endpoint:** `GET /pain-states`

**Descrição:** Retorna todos os estados de dor/humor disponíveis para seleção na "Tela de Dor".

**Headers:**
```http
Content-Type: application/json
```

**Resposta de Sucesso (200 OK):**
```json
[
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "Com Dor"
  },
  {
    "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "name": "Inchada"
  },
  {
    "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
    "name": "Normal"
  }
]
```

**Uso no Frontend:**
- Exibir os estados de dor em botões ou cards na tela de seleção
- Ao selecionar um estado, usar o `id` (UUID) para criar o check-in

---

### 4. Listar Categorias

**Endpoint:** `GET /categories`

**Descrição:** Retorna todas as categorias de produtos disponíveis. As categorias podem ser do tipo `diet` (alimentação) ou `exercise` (exercícios).

**Headers:**
```http
Content-Type: application/json
```

**Resposta de Sucesso (200 OK):**
```json
[
  {
    "id": "d4e5f6a7-b8c9-0123-def0-123456789012",
    "name": "Proteínas",
    "image_url": "https://example.com/images/proteinas.jpg",
    "type": "diet"
  },
  {
    "id": "e5f6a7b8-c9d0-1234-ef01-234567890123",
    "name": "Bebidas",
    "image_url": "https://example.com/images/bebidas.jpg",
    "type": "diet"
  },
  {
    "id": "f6a7b8c9-d0e1-2345-f012-345678901234",
    "name": "Cardio",
    "image_url": null,
    "type": "exercise"
  },
  {
    "id": "a7b8c9d0-e1f2-3456-0123-456789012345",
    "name": "Força",
    "image_url": null,
    "type": "exercise"
  }
]
```

**Notas:**
- `type`: pode ser `"diet"` ou `"exercise"`
- `image_url`: pode ser `null`
- Ordenadas por `name`

**Uso no Frontend:**
- Filtrar categorias por tipo se necessário
- Exibir categorias agrupadas por tipo
- Usar `image_url` para exibir imagens quando disponível

---

### 5. Criar Daily Check-in

**Endpoint:** `POST /daily-checkin`

**Descrição:** Cria um registro diário e automaticamente gera o plano do dia com produtos (comidas/bebidas) e exercícios baseados no estado de dor selecionado.

**Headers:**
```http
Content-Type: application/json
Authorization: Bearer <jwt-token>
```

**Body:**
```json
{
  "pain_state_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

**Validações:**
- `pain_state_id`: obrigatório, UUID válido, deve existir na tabela de pain_states

**Resposta de Sucesso (201 Created):**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "pain_state_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "checkin_date": "2024-01-15",
  "pain_state": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "Com Dor"
  },
  "user_daily_plans": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440002",
      "checkin_id": "660e8400-e29b-41d4-a716-446655440001",
      "product_id": "880e8400-e29b-41d4-a716-446655440003",
      "is_completed": false,
      "product": {
        "id": "880e8400-e29b-41d4-a716-446655440003",
        "category_id": "d4e5f6a7-b8c9-0123-def0-123456789012",
        "pain_state_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "name": "Smoothie de Banana e Aveia",
        "description": "Rico em fibras e potássio",
        "image_url": "https://example.com/images/smoothie.jpg",
        "moment_of_day": "Desayuno",
        "benefits": "Ajuda na digestão e fornece energia",
        "recipe_prep": "Bater no liquidificador: 1 banana, 2 colheres de aveia, 200ml de leite"
      }
    },
    {
      "id": "770e8400-e29b-41d4-a716-446655440004",
      "checkin_id": "660e8400-e29b-41d4-a716-446655440001",
      "product_id": null,
      "is_completed": false,
      "exercise_prescription": {
        "id": "990e8400-e29b-41d4-a716-446655440005",
        "plan_id": "770e8400-e29b-41d4-a716-446655440004",
        "exercise_id": "aa0e8400-e29b-41d4-a716-446655440006",
        "sets": 3,
        "reps": "12 a 15",
        "rest_time": 60,
        "observations": "Fazer com cuidado, respeitando os limites",
        "exercise": {
          "id": "aa0e8400-e29b-41d4-a716-446655440006",
          "category_id": "f6a7b8c9-d0e1-2345-f012-345678901234",
          "pain_state_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
          "name": "Alongamento Suave",
          "description": "Exercícios de alongamento para aliviar dores",
          "image_url": "https://example.com/images/alongamento.jpg",
          "video_url": "https://example.com/videos/alongamento.mp4",
          "difficulty": "easy"
        }
      }
    }
  ]
}
```

**Regra de Negócio R1:**
- Se já existir um check-in para o dia atual, a API retorna o check-in existente (não cria duplicado)
- O frontend deve tratar isso como sucesso e exibir o plano já existente

**Resposta de Erro (404 Not Found):**
```json
{
  "statusCode": 404,
  "message": "Estado de dor não encontrado",
  "error": "Not Found"
}
```

**Resposta de Erro (401 Unauthorized):**
```json
{
  "statusCode": 401,
  "message": "Autenticação necessária",
  "error": "Unauthorized"
}
```

---

### 6. Listar Plano do Dia (Daily Goals)

**Endpoint:** `GET /daily-goals`

**Descrição:** Retorna todo o plano do dia atual do usuário, incluindo produtos (comidas/bebidas) e exercícios com suas prescrições.

**Headers:**
```http
Content-Type: application/json
Authorization: Bearer <jwt-token>
```

**Resposta de Sucesso (200 OK):**
```json
[
  {
    "id": "770e8400-e29b-41d4-a716-446655440002",
    "checkin_id": "660e8400-e29b-41d4-a716-446655440001",
    "product_id": "880e8400-e29b-41d4-a716-446655440003",
    "is_completed": false,
    "product": {
      "id": "880e8400-e29b-41d4-a716-446655440003",
      "category_id": "d4e5f6a7-b8c9-0123-def0-123456789012",
      "pain_state_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "name": "Smoothie de Banana e Aveia",
      "description": "Rico em fibras e potássio",
      "image_url": "https://example.com/images/smoothie.jpg",
      "moment_of_day": "Desayuno",
      "benefits": "Ajuda na digestão e fornece energia",
      "recipe_prep": "Bater no liquidificador: 1 banana, 2 colheres de aveia, 200ml de leite",
      "category": {
        "id": "d4e5f6a7-b8c9-0123-def0-123456789012",
        "name": "Bebidas",
        "image_url": "https://example.com/images/bebidas.jpg",
        "type": "diet"
      },
      "pain_state": {
        "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "name": "Com Dor"
      }
    },
    "exercise_prescription": null
  },
  {
    "id": "770e8400-e29b-41d4-a716-446655440004",
    "checkin_id": "660e8400-e29b-41d4-a716-446655440001",
    "product_id": null,
    "is_completed": false,
    "product": null,
    "exercise_prescription": {
      "id": "990e8400-e29b-41d4-a716-446655440005",
      "plan_id": "770e8400-e29b-41d4-a716-446655440004",
      "exercise_id": "aa0e8400-e29b-41d4-a716-446655440006",
      "sets": 3,
      "reps": "12 a 15",
      "rest_time": 60,
      "observations": "Fazer com cuidado, respeitando os limites",
      "exercise": {
        "id": "aa0e8400-e29b-41d4-a716-446655440006",
        "category_id": "f6a7b8c9-d0e1-2345-f012-345678901234",
        "pain_state_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "name": "Alongamento Suave",
        "description": "Exercícios de alongamento para aliviar dores",
        "image_url": "https://example.com/images/alongamento.jpg",
        "video_url": "https://example.com/videos/alongamento.mp4",
        "difficulty": "easy",
        "category": {
          "id": "f6a7b8c9-d0e1-2345-f012-345678901234",
          "name": "Cardio",
          "image_url": null,
          "type": "exercise"
        },
        "pain_state": {
          "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
          "name": "Com Dor"
        }
      }
    }
  }
]
```

**Resposta quando não há plano (200 OK):**
```json
[]
```

**Estrutura da Resposta:**
- Se `product_id` não é `null`: é um produto (comida/bebida)
- Se `product_id` é `null` e `exercise_prescription` não é `null`: é um exercício
- Cada item tem `is_completed` para marcar como concluído

**Uso no Frontend:**
- Separar produtos de exercícios
- Agrupar produtos por `moment_of_day` se necessário
- Exibir informações do produto: `name`, `description`, `image_url`, `benefits`, `recipe_prep`
- Exibir informações do exercício: `name`, `description`, `image_url`, `video_url`, `difficulty`
- Exibir prescrição do exercício: `sets`, `reps`, `rest_time`, `observations`

---

### 7. Atualizar Status do Item do Plano

**Endpoint:** `PATCH /daily-goals/:id`

**Descrição:** Marca um item do plano (produto ou exercício) como concluído ou pendente.

**Headers:**
```http
Content-Type: application/json
Authorization: Bearer <jwt-token>
```

**Parâmetros de URL:**
- `id`: UUID do item do plano (user_daily_plan.id)

**Body:**
```json
{
  "is_completed": true
}
```

**Validações:**
- `is_completed`: obrigatório, boolean

**Resposta de Sucesso (200 OK):**
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "checkin_id": "660e8400-e29b-41d4-a716-446655440001",
  "product_id": "880e8400-e29b-41d4-a716-446655440003",
  "is_completed": true
}
```

**Resposta de Erro (404 Not Found):**
```json
{
  "statusCode": 404,
  "message": "Plano não encontrado",
  "error": "Not Found"
}
```

---

### 8. Resetar Check-in do Dia

**Endpoint:** `DELETE /daily-checkin/today`

**Descrição:** Remove o check-in do dia atual e todo o plano associado (produtos e exercícios) - delete em cascata (Regra R2).

**Headers:**
```http
Content-Type: application/json
Authorization: Bearer <jwt-token>
```

**Resposta de Sucesso (204 No Content):**
Sem corpo na resposta.

**Resposta de Erro (404 Not Found):**
```json
{
  "statusCode": 404,
  "message": "Check-in de hoje não encontrado",
  "error": "Not Found"
}
```

---

## 📊 Modelos de Dados

### User (Usuário)

```typescript
interface User {
  id: string;              // UUID
  name: string;            // Nome completo
  email: string;           // Email único
  weight: number;          // Peso em kg
  height: number;          // Altura em metros
  created_at: string;      // ISO 8601 datetime string
}
```

### PainState (Estado de Dor/Humor)

```typescript
interface PainState {
  id: string;             // UUID
  name: string;            // Nome do estado (ex: "Com Dor", "Inchada", "Normal")
}
```

### Category (Categoria)

```typescript
interface Category {
  id: string;             // UUID
  name: string;            // Nome da categoria
  image_url: string | null; // URL da imagem (opcional)
  type: 'diet' | 'exercise'; // Tipo: 'diet' para alimentos, 'exercise' para exercícios
}
```

### Product (Produto - Comida/Bebida)

```typescript
interface Product {
  id: string;                    // UUID
  category_id: string;            // UUID da categoria (type: 'diet')
  pain_state_id: string;         // UUID do estado de dor
  name: string;                   // Nome do produto
  description: string | null;     // Descrição do produto
  image_url: string | null;       // URL da imagem
  moment_of_day: string | null;   // Momento do dia (ex: "Desayuno", "Mañana")
  benefits: string | null;        // Benefícios do produto
  recipe_prep: string | null;     // Receita/preparação
  category?: Category;             // Categoria (quando incluído)
  pain_state?: PainState;          // Estado de dor (quando incluído)
}
```

### Exercise (Exercício)

```typescript
interface Exercise {
  id: string;                    // UUID
  category_id: string;            // UUID da categoria (type: 'exercise')
  pain_state_id: string;         // UUID do estado de dor
  name: string;                   // Nome do exercício
  description: string | null;     // Descrição do exercício
  image_url: string | null;       // URL da imagem
  video_url: string | null;       // URL do vídeo demonstrativo
  difficulty: 'easy' | 'medium' | 'hard' | null; // Dificuldade
  category?: Category;             // Categoria (quando incluído)
  pain_state?: PainState;          // Estado de dor (quando incluído)
}
```

### ExercisePrescription (Prescrição do Exercício)

```typescript
interface ExercisePrescription {
  id: string;                    // UUID
  plan_id: string;               // UUID do plano (unique, OneToOne com UserDailyPlan)
  exercise_id: string | null;    // UUID do exercício (nullable)
  sets: number;                   // Número de séries (ex: 3)
  reps: string;                   // Número de repetições (ex: "12 a 15")
  rest_time: number | null;       // Tempo de descanso em segundos (ex: 60)
  observations: string | null;   // Observações adicionais
  plan?: UserDailyPlan;           // Plano (quando incluído)
  exercise?: Exercise;             // Exercício (quando incluído)
}
```

### DailyCheckin (Check-in Diário)

```typescript
interface DailyCheckin {
  id: string;              // UUID
  user_id: string;         // UUID do usuário
  pain_state_id: string;   // UUID do estado de dor
  checkin_date: string;    // Data no formato YYYY-MM-DD
  pain_state?: PainState;   // Estado de dor (quando incluído)
  user_daily_plans?: UserDailyPlan[]; // Plano do dia (quando incluído)
}
```

### UserDailyPlan (Item do Plano Diário)

```typescript
interface UserDailyPlan {
  id: string;              // UUID
  checkin_id: string;      // UUID do check-in
  product_id: string | null; // UUID do produto (null se for exercício)
  is_completed: boolean;   // Status de conclusão
  product?: Product | null; // Dados do produto (quando incluído, null se for exercício)
  exercise_prescription?: ExercisePrescription | null; // Prescrição do exercício (quando incluído, null se for produto)
}
```

**Lógica de Identificação:**
- Se `product_id` não é `null` → é um produto (comida/bebida)
- Se `product_id` é `null` e `exercise_prescription` não é `null` → é um exercício

### Ingredient (Ingrediente)

```typescript
interface Ingredient {
  id: string;              // UUID
  name: string;            // Nome do ingrediente
  unit: 'g' | 'kg' | 'ml' | 'L' | 'un' | null; // Unidade de medida
}
```

### ProductIngredient (Relação Produto-Ingrediente)

```typescript
interface ProductIngredient {
  id: string;              // UUID
  product_id: string;     // UUID do produto
  ingredient_id: string;   // UUID do ingrediente
  units: number;           // Quantidade de unidades
  quantity_per_unit: number; // Quantidade por unidade
  product?: Product;        // Produto (quando incluído)
  ingredient?: Ingredient;  // Ingrediente (quando incluído)
}
```

---

## ⚠️ Tratamento de Erros

### Códigos de Status HTTP

| Código | Significado | Quando Ocorre |
|--------|-------------|---------------|
| 200 | OK | Requisição bem-sucedida |
| 201 | Created | Recurso criado com sucesso |
| 204 | No Content | Sucesso sem conteúdo (DELETE) |
| 400 | Bad Request | Dados inválidos ou faltando |
| 401 | Unauthorized | Credenciais inválidas |
| 404 | Not Found | Recurso não encontrado |
| 409 | Conflict | Conflito (ex: email duplicado) |
| 500 | Internal Server Error | Erro no servidor |

### Estrutura de Erro Padrão

```typescript
interface ApiError {
  statusCode: number;
  message: string | string[];  // String única ou array de mensagens
  error: string;               // Tipo do erro
}
```

---

## 💻 Exemplos de Integração

### React/TypeScript

#### Configuração da API

```typescript
// src/services/api.ts
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

class ApiService {
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    const token = localStorage.getItem('access_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async register(userData: RegisterData): Promise<User> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao registrar');
    }

    const { access_token, user } = await response.json();
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('user', JSON.stringify(user));
    return { access_token, user };
  }

  async login(loginData: LoginData): Promise<User> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao fazer login');
    }

    const { access_token, user } = await response.json();
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('user', JSON.stringify(user));
    return { access_token, user };
  }

  async getPainStates(): Promise<PainState[]> {
    const response = await fetch(`${API_URL}/pain-states`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar estados de dor');
    }

    return response.json();
  }

  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${API_URL}/categories`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar categorias');
    }

    return response.json();
  }

  async createCheckin(painStateId: string): Promise<DailyCheckin> {
    const response = await fetch(`${API_URL}/daily-checkin`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ pain_state_id: painStateId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao criar check-in');
    }

    return response.json();
  }

  async getDailyGoals(): Promise<UserDailyPlan[]> {
    const response = await fetch(`${API_URL}/daily-goals`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar plano do dia');
    }

    return response.json();
  }

  async updateGoal(goalId: string, isCompleted: boolean): Promise<UserDailyPlan> {
    const response = await fetch(`${API_URL}/daily-goals/${goalId}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({ is_completed: isCompleted }),
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar item do plano');
    }

    return response.json();
  }

  async resetToday(): Promise<void> {
    const response = await fetch(`${API_URL}/daily-checkin/today`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao resetar');
    }
  }
}

export const apiService = new ApiService();
```

#### Hook para Estados de Dor

```typescript
// src/hooks/usePainStates.ts
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { PainState } from '../types';

export function usePainStates() {
  const [painStates, setPainStates] = useState<PainState[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPainStates() {
      try {
        setLoading(true);
        const data = await apiService.getPainStates();
        setPainStates(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    }

    fetchPainStates();
  }, []);

  return { painStates, loading, error };
}
```

#### Componente de Seleção de Estado de Dor

```typescript
// src/components/PainStateSelection.tsx
import React, { useState } from 'react';
import { usePainStates } from '../hooks/usePainStates';
import { apiService } from '../services/api';
import { useNavigate } from 'react-router-dom';

export function PainStateSelection() {
  const { painStates, loading, error } = usePainStates();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSelectPainState = async (painStateId: string) => {
    try {
      setSubmitting(true);
      const checkin = await apiService.createCheckin(painStateId);
      // Redirecionar para tela do plano
      navigate('/plan', { state: { checkin } });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao criar check-in');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Carregando estados...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      <h1>Como você está se sentindo hoje?</h1>
      <div className="pain-states-grid">
        {painStates.map((painState) => (
          <button
            key={painState.id}
            onClick={() => handleSelectPainState(painState.id)}
            disabled={submitting}
            className="pain-state-button"
          >
            {painState.name}
          </button>
        ))}
      </div>
    </div>
  );
}
```

#### Componente do Plano Diário

```typescript
// src/components/DailyPlan.tsx
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { UserDailyPlan } from '../types';

export function DailyPlan() {
  const [plans, setPlans] = useState<UserDailyPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    loadPlans();
  }, []);

  async function loadPlans() {
    try {
      setLoading(true);
      const data = await apiService.getDailyGoals();
      setPlans(data);
    } catch (err) {
      alert('Erro ao carregar plano');
    } finally {
      setLoading(false);
    }
  }

  async function togglePlan(plan: UserDailyPlan) {
    const newStatus = !plan.is_completed;
    
    // Otimistic update
    setPlans(prev => prev.map(p => 
      p.id === plan.id ? { ...p, is_completed: newStatus } : p
    ));

    try {
      setUpdating(plan.id);
      await apiService.updateGoal(plan.id, newStatus);
    } catch (err) {
      // Reverter em caso de erro
      setPlans(prev => prev.map(p => 
        p.id === plan.id ? { ...p, is_completed: !newStatus } : p
      ));
      alert('Erro ao atualizar item');
    } finally {
      setUpdating(null);
    }
  }

  async function handleReset() {
    if (!confirm('Tem certeza que deseja resetar o dia?')) return;

    try {
      await apiService.resetToday();
      setPlans([]);
      window.location.href = '/pain-states';
    } catch (err) {
      alert('Erro ao resetar');
    }
  }

  // Separar produtos e exercícios
  const products = plans.filter(p => p.product_id !== null);
  const exercises = plans.filter(p => p.product_id === null && p.exercise_prescription !== null);

  // Agrupar produtos por momento do dia
  const productsByMoment = products.reduce((acc, plan) => {
    const moment = plan.product?.moment_of_day || 'Outros';
    if (!acc[moment]) acc[moment] = [];
    acc[moment].push(plan);
    return acc;
  }, {} as Record<string, UserDailyPlan[]>);

  if (loading) return <div>Carregando plano...</div>;

  return (
    <div className="daily-plan">
      <h1>Seu Plano de Hoje</h1>
      
      {/* Seção de Produtos (Alimentação) */}
      <section className="products-section">
        <h2>🍽️ Alimentação</h2>
        {Object.entries(productsByMoment).map(([moment, momentPlans]) => (
          <div key={moment} className="moment-group">
            <h3>{moment}</h3>
            <div className="plans-list">
              {momentPlans.map((plan) => (
                <div key={plan.id} className={`plan-item ${plan.is_completed ? 'completed' : ''}`}>
                  {plan.product?.image_url && (
                    <img src={plan.product.image_url} alt={plan.product.name} />
                  )}
                  <div className="plan-content">
                    <input
                      type="checkbox"
                      checked={plan.is_completed}
                      onChange={() => togglePlan(plan)}
                      disabled={updating === plan.id}
                    />
                    <div>
                      <h4>{plan.product?.name}</h4>
                      {plan.product?.description && (
                        <p className="description">{plan.product.description}</p>
                      )}
                      {plan.product?.benefits && (
                        <p className="benefits">💡 {plan.product.benefits}</p>
                      )}
                      {plan.product?.recipe_prep && (
                        <details>
                          <summary>📝 Receita/Preparação</summary>
                          <p>{plan.product.recipe_prep}</p>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Seção de Exercícios */}
      <section className="exercises-section">
        <h2>💪 Exercícios</h2>
        <div className="plans-list">
          {exercises.map((plan) => {
            const exercise = plan.exercise_prescription?.exercise;
            const prescription = plan.exercise_prescription;
            
            return (
              <div key={plan.id} className={`plan-item exercise-item ${plan.is_completed ? 'completed' : ''}`}>
                {exercise?.image_url && (
                  <img src={exercise.image_url} alt={exercise.name} />
                )}
                <div className="plan-content">
                  <input
                    type="checkbox"
                    checked={plan.is_completed}
                    onChange={() => togglePlan(plan)}
                    disabled={updating === plan.id}
                  />
                  <div>
                    <h4>{exercise?.name}</h4>
                    {exercise?.description && (
                      <p className="description">{exercise.description}</p>
                    )}
                    {exercise?.difficulty && (
                      <span className={`difficulty-badge difficulty-${exercise.difficulty}`}>
                        {exercise.difficulty === 'easy' ? 'Fácil' : 
                         exercise.difficulty === 'medium' ? 'Médio' : 'Difícil'}
                      </span>
                    )}
                    {prescription && (
                      <div className="prescription">
                        <p><strong>Séries:</strong> {prescription.sets}</p>
                        <p><strong>Repetições:</strong> {prescription.reps}</p>
                        {prescription.rest_time && (
                          <p><strong>Descanso:</strong> {prescription.rest_time}s</p>
                        )}
                        {prescription.observations && (
                          <p className="observations">⚠️ {prescription.observations}</p>
                        )}
                      </div>
                    )}
                    {exercise?.video_url && (
                      <a href={exercise.video_url} target="_blank" rel="noopener noreferrer">
                        ▶️ Ver vídeo demonstrativo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <button onClick={handleReset} className="reset-button">
        Resetar Dia
      </button>
    </div>
  );
}
```

---

## 🔄 Fluxo Completo

### 1. Primeiro Acesso (Novo Usuário)

```
1. Usuário acessa a tela de registro
2. Preenche: nome, email, senha, peso, altura
3. POST /auth/register
4. Backend retorna User (com id)
5. Frontend armazena userId no localStorage
6. Redireciona para tela de estados de dor
```

### 2. Login (Usuário Existente)

```
1. Usuário acessa a tela de login
2. Preenche: email, senha
3. POST /auth/login
4. Backend valida credenciais e retorna User (com id)
5. Frontend armazena userId no localStorage
6. Redireciona para tela de estados de dor ou plano (se já tiver check-in do dia)
```

### 3. Seleção de Estado de Dor

```
1. Frontend carrega estados: GET /pain-states
2. Usuário seleciona um estado de dor
3. POST /daily-checkin com pain_state_id
4. Backend cria check-in e gera plano automaticamente:
   - Busca produtos (comidas/bebidas) para o pain_state
   - Busca exercícios para o pain_state
   - Cria UserDailyPlan para cada produto
   - Cria UserDailyPlan + ExercisePrescription para cada exercício
5. Backend retorna check-in com plano completo
6. Frontend redireciona para tela do plano
```

### 4. Visualização e Gestão do Plano

```
1. Frontend carrega plano: GET /daily-goals
2. Separa produtos de exercícios:
   - Produtos: product_id !== null
   - Exercícios: product_id === null && exercise_prescription !== null
3. Agrupa produtos por moment_of_day
4. Exibe produtos com informações completas
5. Exibe exercícios com prescrições (sets, reps, rest_time)
6. Usuário marca/desmarca itens
7. PATCH /daily-goals/:id para cada mudança
8. Atualiza UI (otimistic update)
```

### 5. Reset do Dia

```
1. Usuário clica em "Resetar"
2. Confirma ação
3. DELETE /daily-checkin/today
4. Backend remove check-in, plano e prescrições (cascata)
5. Frontend limpa estado e redireciona para estados de dor
```

### 6. Acesso Posterior (Usuário Existente)

```
1. Frontend verifica localStorage por userId
2. Se existe, carrega plano: GET /daily-goals
3. Se não há plano, mostra botão para criar check-in
4. Se há plano, exibe tela do plano com produtos e exercícios
```

---

## 📱 Estrutura de Dados

### Identificando Tipo de Item no Plano

```typescript
function getItemType(plan: UserDailyPlan): 'product' | 'exercise' {
  if (plan.product_id !== null) {
    return 'product';
  }
  if (plan.exercise_prescription !== null) {
    return 'exercise';
  }
  // Caso raro: item sem produto nem exercício
  throw new Error('Item do plano inválido');
}

// Uso
plans.forEach(plan => {
  const type = getItemType(plan);
  if (type === 'product') {
    // Renderizar como produto
    console.log(plan.product?.name);
  } else {
    // Renderizar como exercício
    console.log(plan.exercise_prescription?.exercise?.name);
  }
});
```

### Agrupamento de Produtos

```typescript
// Agrupar produtos por momento do dia
const productsByMoment = plans
  .filter(p => p.product_id !== null)
  .reduce((acc, plan) => {
    const moment = plan.product?.moment_of_day || 'Outros';
    if (!acc[moment]) acc[moment] = [];
    acc[moment].push(plan);
    return acc;
  }, {} as Record<string, UserDailyPlan[]>);

// Ordenar momentos (exemplo)
const momentOrder = ['Desayuno', 'Mañana', 'Almuerzo', 'Tarde', 'Cena', 'Outros'];
const sortedMoments = Object.keys(productsByMoment).sort((a, b) => {
  const indexA = momentOrder.indexOf(a);
  const indexB = momentOrder.indexOf(b);
  return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
});
```

### Filtragem de Categorias

```typescript
// Filtrar categorias por tipo
const dietCategories = categories.filter(c => c.type === 'diet');
const exerciseCategories = categories.filter(c => c.type === 'exercise');
```

---

## 🧪 Testando a Integração

### Usando cURL

```bash
# 1. Registrar usuário
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste User",
    "email": "teste@example.com",
    "password": "senha123",
    "weight": 70,
    "height": 1.70
  }'

# 2. Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "password": "senha123"
  }'

# 3. Listar estados de dor
curl http://localhost:3000/pain-states

# 4. Listar categorias
curl http://localhost:3000/categories

# 5. Criar check-in (substitua TOKEN e PAIN_STATE_ID)
curl -X POST http://localhost:3000/daily-checkin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_AQUI" \
  -d '{"pain_state_id": "PAIN_STATE_ID_AQUI"}'

# 6. Listar plano do dia (retorna produtos e exercícios)
curl -H "Authorization: Bearer TOKEN_AQUI" http://localhost:3000/daily-goals

# 7. Atualizar item do plano (substitua TOKEN e PLAN_ID)
curl -X PATCH http://localhost:3000/daily-goals/PLAN_ID_AQUI \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_AQUI" \
  -d '{"is_completed": true}'

# 8. Resetar dia
curl -X DELETE http://localhost:3000/daily-checkin/today \
  -H "Authorization: Bearer TOKEN_AQUI"
```

---

## 🎨 Dicas de UI/UX

### 1. Diferenciação Visual

```css
/* Estilos para produtos */
.product-item {
  border-left: 4px solid #4CAF50; /* Verde para alimentos */
}

/* Estilos para exercícios */
.exercise-item {
  border-left: 4px solid #2196F3; /* Azul para exercícios */
}

.difficulty-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.difficulty-easy { background: #4CAF50; color: white; }
.difficulty-medium { background: #FF9800; color: white; }
.difficulty-hard { background: #F44336; color: white; }
```

### 2. Agrupamento Visual

- Agrupar produtos por `moment_of_day` em seções separadas
- Mostrar exercícios em uma seção dedicada
- Usar ícones diferentes: 🍽️ para produtos, 💪 para exercícios

### 3. Exibição de Informações

**Para Produtos:**
- Nome e imagem (se disponível)
- Descrição e benefícios
- Receita/preparação em collapsible
- Momento do dia como badge

**Para Exercícios:**
- Nome, imagem e vídeo (se disponível)
- Dificuldade como badge colorido
- Prescrição destacada: séries, repetições, descanso
- Observações em destaque

### 4. Progresso Visual

```typescript
// Calcular progresso
const totalItems = plans.length;
const completedItems = plans.filter(p => p.is_completed).length;
const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

// Exibir
<div className="progress-bar">
  <div 
    className="progress-fill" 
    style={{ width: `${progress}%` }}
  />
  <span>{completedItems} de {totalItems} concluídos</span>
</div>
```

---

## 📞 Suporte

Para dúvidas ou problemas na integração:
1. Verifique os logs do backend
2. Confirme que o servidor está rodando
3. Valide os headers e body das requisições
4. Verifique a documentação de erros acima

---

## 📚 Documentação Adicional

- **[ACCESS_CONTROL.md](./ACCESS_CONTROL.md)** - Documentação completa sobre o sistema de controle de acesso, roles e permissões

---

**Última atualização:** Fevereiro 2026
