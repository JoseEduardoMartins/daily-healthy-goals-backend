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

Para endpoints que requerem autenticação (temporariamente):

```http
user-id: <uuid-do-usuario>
```

## 🔐 Autenticação

⚠️ **Nota Temporária:** Atualmente, a autenticação está usando um header `user-id`. Para produção, será implementado JWT.

### Fluxo de Autenticação

1. Usuário se registra via `POST /auth/register` ou faz login via `POST /auth/login`
2. Backend retorna os dados do usuário (sem senha)
3. Frontend armazena o `id` do usuário
4. Frontend envia o `user-id` no header de todas as requisições autenticadas

### Armazenamento no Frontend

```javascript
// Após registro/login bem-sucedido
localStorage.setItem('userId', user.id);
// ou
sessionStorage.setItem('userId', user.id);
```

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
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "João Silva",
  "email": "joao@example.com",
  "weight": 75.5,
  "height": 1.75,
  "created_at": "2024-01-15T10:30:00.000Z"
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

**Resposta de Erro de Validação (400 Bad Request):**
```json
{
  "statusCode": 400,
  "message": [
    "Nome é obrigatório",
    "Email inválido",
    "Peso deve ser maior que zero"
  ],
  "error": "Bad Request"
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

**Validações:**
- `email`: obrigatório, email válido
- `password`: obrigatório, string

**Resposta de Sucesso (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "João Silva",
  "email": "joao@example.com",
  "weight": 75.5,
  "height": 1.75,
  "created_at": "2024-01-15T10:30:00.000Z"
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

**Resposta de Erro de Validação (400 Bad Request):**
```json
{
  "statusCode": 400,
  "message": [
    "Email é obrigatório",
    "Email inválido",
    "Senha é obrigatória"
  ],
  "error": "Bad Request"
}
```

---

### 3. Listar Categorias

**Endpoint:** `GET /categories`

**Descrição:** Retorna todas as categorias disponíveis para seleção na "Tela de Dor".

**Headers:**
```http
Content-Type: application/json
```

**Resposta de Sucesso (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Com Dor"
  },
  {
    "id": 2,
    "name": "Inchada"
  },
  {
    "id": 3,
    "name": "Normal"
  }
]
```

**Uso no Frontend:**
- Exibir as categorias em botões ou cards na tela de seleção
- Ao selecionar uma categoria, usar o `id` para criar o check-in

---

### 4. Criar Daily Check-in

**Endpoint:** `POST /daily-checkin`

**Descrição:** Cria um registro diário e automaticamente gera as metas baseadas na categoria selecionada.

**Headers:**
```http
Content-Type: application/json
user-id: 550e8400-e29b-41d4-a716-446655440000
```

**Body:**
```json
{
  "category_id": 1
}
```

**Validações:**
- `category_id`: obrigatório, número inteiro, deve existir na tabela de categorias

**Resposta de Sucesso (201 Created):**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "category_id": 1,
  "checkin_date": "2024-01-15",
  "category": {
    "id": 1,
    "name": "Com Dor"
  },
  "user_daily_goals": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440002",
      "checkin_id": "660e8400-e29b-41d4-a716-446655440001",
      "goal_library_id": 1,
      "is_completed": false,
      "goal_library": {
        "id": 1,
        "category_id": 1,
        "description": "Fazer alongamento suave por 10 minutos"
      }
    },
    {
      "id": "770e8400-e29b-41d4-a716-446655440003",
      "checkin_id": "660e8400-e29b-41d4-a716-446655440001",
      "goal_library_id": 2,
      "is_completed": false,
      "goal_library": {
        "id": 2,
        "category_id": 1,
        "description": "Aplicar compressa quente na área dolorida"
      }
    }
  ]
}
```

**Regra de Negócio R1:**
- Se já existir um check-in para o dia atual, a API retorna o check-in existente (não cria duplicado)
- O frontend deve tratar isso como sucesso e exibir as metas já existentes

**Resposta de Erro (404 Not Found):**
```json
{
  "statusCode": 404,
  "message": "Categoria não encontrada",
  "error": "Not Found"
}
```

**Resposta de Erro (400 Bad Request):**
```json
{
  "statusCode": 400,
  "message": "User ID é necessário. Implemente autenticação JWT.",
  "error": "Bad Request"
}
```

---

### 5. Listar Metas do Dia

**Endpoint:** `GET /daily-goals`

**Descrição:** Retorna todas as metas do dia atual do usuário.

**Headers:**
```http
Content-Type: application/json
user-id: 550e8400-e29b-41d4-a716-446655440000
```

**Resposta de Sucesso (200 OK):**
```json
[
  {
    "id": "770e8400-e29b-41d4-a716-446655440002",
    "checkin_id": "660e8400-e29b-41d4-a716-446655440001",
    "goal_library_id": 1,
    "is_completed": false,
    "goal_library": {
      "id": 1,
      "category_id": 1,
      "description": "Fazer alongamento suave por 10 minutos"
    }
  },
  {
    "id": "770e8400-e29b-41d4-a716-446655440003",
    "checkin_id": "660e8400-e29b-41d4-a716-446655440001",
    "goal_library_id": 2,
    "is_completed": false,
    "goal_library": {
      "id": 2,
      "category_id": 1,
      "description": "Aplicar compressa quente na área dolorida"
    }
  }
]
```

**Resposta quando não há metas (200 OK):**
```json
[]
```

**Uso no Frontend:**
- Exibir lista de metas com checkboxes
- Mostrar status de conclusão (`is_completed`)
- Exibir descrição da meta (`goal_library.description`)

---

### 6. Atualizar Status da Meta

**Endpoint:** `PATCH /daily-goals/:id`

**Descrição:** Marca uma meta como concluída ou pendente.

**Headers:**
```http
Content-Type: application/json
user-id: 550e8400-e29b-41d4-a716-446655440000
```

**Parâmetros de URL:**
- `id`: UUID da meta (user_daily_goals.id)

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
  "goal_library_id": 1,
  "is_completed": true
}
```

**Resposta de Erro (404 Not Found):**
```json
{
  "statusCode": 404,
  "message": "Meta não encontrada",
  "error": "Not Found"
}
```

**Uso no Frontend:**
- Ao clicar no checkbox da meta, fazer PATCH com o novo status
- Atualizar a UI imediatamente (otimistic update)
- Tratar erros caso a atualização falhe

---

### 7. Resetar Check-in do Dia

**Endpoint:** `DELETE /daily-checkin/today`

**Descrição:** Remove o check-in do dia atual e todas as metas associadas (delete em cascata - Regra R2).

**Headers:**
```http
Content-Type: application/json
user-id: 550e8400-e29b-41d4-a716-446655440000
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

**Uso no Frontend:**
- Exibir botão "Resetar" na tela de metas
- Após reset bem-sucedido, redirecionar para a tela de seleção de categoria
- Limpar estado local das metas

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
  created_at: string;      // ISO 8601 date string
}
```

### Category (Categoria)

```typescript
interface Category {
  id: number;             // ID numérico
  name: string;            // Nome da categoria
}
```

### DailyCheckin (Check-in Diário)

```typescript
interface DailyCheckin {
  id: string;              // UUID
  user_id: string;         // UUID do usuário
  category_id: number;     // ID da categoria
  checkin_date: string;    // Data no formato YYYY-MM-DD
  category?: Category;      // Categoria (quando incluído)
  user_daily_goals?: UserDailyGoal[]; // Metas (quando incluído)
}
```

### GoalLibrary (Biblioteca de Metas)

```typescript
interface GoalLibrary {
  id: number;             // ID numérico
  category_id: number;    // ID da categoria
  description: string;    // Descrição da meta
}
```

### UserDailyGoal (Meta do Usuário)

```typescript
interface UserDailyGoal {
  id: string;              // UUID
  checkin_id: string;      // UUID do check-in
  goal_library_id: number; // ID da meta na biblioteca
  is_completed: boolean;   // Status de conclusão
  goal_library?: GoalLibrary; // Dados da meta (quando incluído)
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

### Exemplo de Tratamento no Frontend

```typescript
try {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    // error.message pode ser string ou array
    const errorMessage = Array.isArray(error.message) 
      ? error.message.join(', ') 
      : error.message;
    throw new Error(errorMessage);
  }

  const user = await response.json();
  return user;
} catch (error) {
  console.error('Erro ao registrar:', error);
  throw error;
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

    const userId = localStorage.getItem('userId');
    if (userId) {
      headers['user-id'] = userId;
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

    const user = await response.json();
    localStorage.setItem('userId', user.id);
    return user;
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

    const user = await response.json();
    localStorage.setItem('userId', user.id);
    return user;
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

  async createCheckin(categoryId: number): Promise<DailyCheckin> {
    const response = await fetch(`${API_URL}/daily-checkin`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ category_id: categoryId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao criar check-in');
    }

    return response.json();
  }

  async getDailyGoals(): Promise<UserDailyGoal[]> {
    const response = await fetch(`${API_URL}/daily-goals`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar metas');
    }

    return response.json();
  }

  async updateGoal(goalId: string, isCompleted: boolean): Promise<UserDailyGoal> {
    const response = await fetch(`${API_URL}/daily-goals/${goalId}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({ is_completed: isCompleted }),
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar meta');
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

#### Hook para Categorias

```typescript
// src/hooks/useCategories.ts
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Category } from '../types';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        const data = await apiService.getCategories();
        setCategories(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return { categories, loading, error };
}
```

#### Componente de Seleção de Categoria

```typescript
// src/components/CategorySelection.tsx
import React, { useState } from 'react';
import { useCategories } from '../hooks/useCategories';
import { apiService } from '../services/api';
import { useNavigate } from 'react-router-dom';

export function CategorySelection() {
  const { categories, loading, error } = useCategories();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSelectCategory = async (categoryId: number) => {
    try {
      setSubmitting(true);
      const checkin = await apiService.createCheckin(categoryId);
      // Redirecionar para tela de metas
      navigate('/goals', { state: { checkin } });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao criar check-in');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Carregando categorias...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      <h1>Como você está se sentindo hoje?</h1>
      <div className="categories-grid">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleSelectCategory(category.id)}
            disabled={submitting}
            className="category-button"
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
```

#### Componente de Metas

```typescript
// src/components/DailyGoals.tsx
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { UserDailyGoal } from '../types';

export function DailyGoals() {
  const [goals, setGoals] = useState<UserDailyGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    loadGoals();
  }, []);

  async function loadGoals() {
    try {
      setLoading(true);
      const data = await apiService.getDailyGoals();
      setGoals(data);
    } catch (err) {
      alert('Erro ao carregar metas');
    } finally {
      setLoading(false);
    }
  }

  async function toggleGoal(goal: UserDailyGoal) {
    const newStatus = !goal.is_completed;
    
    // Otimistic update
    setGoals(prev => prev.map(g => 
      g.id === goal.id ? { ...g, is_completed: newStatus } : g
    ));

    try {
      setUpdating(goal.id);
      await apiService.updateGoal(goal.id, newStatus);
    } catch (err) {
      // Reverter em caso de erro
      setGoals(prev => prev.map(g => 
        g.id === goal.id ? { ...g, is_completed: !newStatus } : g
      ));
      alert('Erro ao atualizar meta');
    } finally {
      setUpdating(null);
    }
  }

  async function handleReset() {
    if (!confirm('Tem certeza que deseja resetar o dia?')) return;

    try {
      await apiService.resetToday();
      setGoals([]);
      // Redirecionar para tela de categorias
      window.location.href = '/categories';
    } catch (err) {
      alert('Erro ao resetar');
    }
  }

  if (loading) return <div>Carregando metas...</div>;

  return (
    <div>
      <h1>Suas Metas de Hoje</h1>
      <div className="goals-list">
        {goals.map((goal) => (
          <div key={goal.id} className="goal-item">
            <input
              type="checkbox"
              checked={goal.is_completed}
              onChange={() => toggleGoal(goal)}
              disabled={updating === goal.id}
            />
            <span className={goal.is_completed ? 'completed' : ''}>
              {goal.goal_library?.description}
            </span>
          </div>
        ))}
      </div>
      <button onClick={handleReset} className="reset-button">
        Resetar Dia
      </button>
    </div>
  );
}
```

### Vue.js/TypeScript

```typescript
// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar user-id
api.interceptors.request.use((config) => {
  const userId = localStorage.getItem('userId');
  if (userId) {
    config.headers['user-id'] = userId;
  }
  return config;
});

export const apiService = {
  async register(userData: RegisterData): Promise<User> {
    const response = await api.post('/auth/register', userData);
    localStorage.setItem('userId', response.data.id);
    return response.data;
  },

  async login(loginData: LoginData): Promise<User> {
    const response = await api.post('/auth/login', loginData);
    localStorage.setItem('userId', response.data.id);
    return response.data;
  },

  async getCategories(): Promise<Category[]> {
    const response = await api.get('/categories');
    return response.data;
  },

  async createCheckin(categoryId: number): Promise<DailyCheckin> {
    const response = await api.post('/daily-checkin', { category_id: categoryId });
    return response.data;
  },

  async getDailyGoals(): Promise<UserDailyGoal[]> {
    const response = await api.get('/daily-goals');
    return response.data;
  },

  async updateGoal(goalId: string, isCompleted: boolean): Promise<UserDailyGoal> {
    const response = await api.patch(`/daily-goals/${goalId}`, {
      is_completed: isCompleted,
    });
    return response.data;
  },

  async resetToday(): Promise<void> {
    await api.delete('/daily-checkin/today');
  },
};
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
6. Redireciona para tela de categorias
```

### 1.1. Login (Usuário Existente)

```
1. Usuário acessa a tela de login
2. Preenche: email, senha
3. POST /auth/login
4. Backend valida credenciais e retorna User (com id)
5. Frontend armazena userId no localStorage
6. Redireciona para tela de categorias ou metas (se já tiver check-in do dia)
```

### 3. Seleção de Categoria (Tela de Dor)

```
1. Frontend carrega categorias: GET /categories
2. Usuário seleciona uma categoria
3. POST /daily-checkin com category_id
4. Backend cria check-in e gera metas automaticamente
5. Backend retorna check-in com metas
6. Frontend redireciona para tela de metas
```

### 4. Visualização e Gestão de Metas

```
1. Frontend carrega metas: GET /daily-goals
2. Exibe lista de metas com checkboxes
3. Usuário marca/desmarca metas
4. PATCH /daily-goals/:id para cada mudança
5. Atualiza UI (otimistic update)
```

### 5. Reset do Dia

```
1. Usuário clica em "Resetar"
2. Confirma ação
3. DELETE /daily-checkin/today
4. Backend remove check-in e metas (cascata)
5. Frontend limpa estado e redireciona para categorias
```

### 6. Acesso Posterior (Usuário Existente)

```
1. Frontend verifica localStorage por userId
2. Se existe, carrega metas: GET /daily-goals
3. Se não há metas, mostra botão para criar check-in
4. Se há metas, exibe tela de metas
```

---

## 📱 Exemplo de Fluxo de Telas

### Tela 1: Registro/Login
- Formulário de registro
- Campos: nome, email, senha, peso, altura
- Botão "Registrar"

### Tela 2: Seleção de Categoria
- Título: "Como você está se sentindo hoje?"
- Cards/Botões com categorias
- Ao selecionar, cria check-in automaticamente

### Tela 3: Metas do Dia
- Lista de metas com checkboxes
- Progresso visual (ex: "3 de 5 concluídas")
- Botão "Resetar Dia" no topo ou rodapé

---

## 🔍 Dicas de Implementação

### 1. Cache de Categorias
As categorias raramente mudam. Considere cachear:
```typescript
// Cachear por 1 hora
const categoriesCache = {
  data: null,
  timestamp: null,
  ttl: 3600000, // 1 hora
};
```

### 2. Otimistic Updates
Atualize a UI antes da resposta do servidor:
```typescript
// Marcar como concluído imediatamente
setGoalCompleted(goalId, true);

// Enviar requisição
try {
  await apiService.updateGoal(goalId, true);
} catch {
  // Reverter se falhar
  setGoalCompleted(goalId, false);
}
```

### 3. Tratamento de Erros Offline
```typescript
if (!navigator.onLine) {
  // Mostrar mensagem de offline
  // Armazenar ações em queue para sincronizar depois
}
```

### 4. Loading States
Sempre mostre feedback visual:
- Loading spinner durante requisições
- Disable buttons durante submit
- Skeleton screens enquanto carrega

### 5. Validação no Frontend
Valide antes de enviar:
```typescript
if (!email.includes('@')) {
  setError('Email inválido');
  return;
}
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

# 1.1. Login (alternativa ao registro)
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "password": "senha123"
  }'

# 2. Listar categorias
curl http://localhost:3000/categories

# 3. Criar check-in (substitua USER_ID e CATEGORY_ID)
curl -X POST http://localhost:3000/daily-checkin \
  -H "Content-Type: application/json" \
  -H "user-id: USER_ID_AQUI" \
  -d '{"category_id": 1}'

# 4. Listar metas
curl -H "user-id: USER_ID_AQUI" http://localhost:3000/daily-goals

# 5. Atualizar meta (substitua GOAL_ID)
curl -X PATCH http://localhost:3000/daily-goals/GOAL_ID_AQUI \
  -H "Content-Type: application/json" \
  -H "user-id: USER_ID_AQUI" \
  -d '{"is_completed": true}'

# 6. Resetar dia
curl -X DELETE http://localhost:3000/daily-checkin/today \
  -H "user-id: USER_ID_AQUI"
```

### Usando Postman/Insomnia

1. Importe o arquivo `postman_collection.json` fornecido
2. Configure variável de ambiente `base_url` = `http://localhost:3000`
3. Execute "Register User" - o `user_id` será salvo automaticamente
4. Use as outras requisições normalmente

---

## 📞 Suporte

Para dúvidas ou problemas na integração:
1. Verifique os logs do backend
2. Confirme que o servidor está rodando
3. Valide os headers e body das requisições
4. Verifique a documentação de erros acima

---

**Última atualização:** Janeiro 2024
