# Funcionalidades de Administrador - Documentação Frontend

Esta documentação explica como implementar as funcionalidades de administrador no frontend, incluindo métricas, CRUD de usuários, produtos, exercícios e planos.

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Autenticação e Autorização](#autenticação-e-autorização)
3. [Endpoints Disponíveis](#endpoints-disponíveis)
4. [Implementação no Frontend](#implementação-no-frontend)
5. [Estrutura de Dados](#estrutura-de-dados)
6. [Tratamento de Erros](#tratamento-de-erros)
7. [Exemplos Completos](#exemplos-completos)

---

## Visão Geral

O módulo de administrador permite que usuários com role `admin` gerenciem:

- **Métricas**: Visualizar estatísticas gerais da aplicação
- **Usuários**: CRUD completo de usuários (incluindo criação de admins)
- **Produtos**: CRUD completo de produtos da biblioteca
- **Exercícios**: CRUD completo de exercícios da biblioteca
- **Planos**: CRUD completo de planos de assinatura

**Importante**: Todos os endpoints requerem autenticação JWT e role `admin`.

---

## Autenticação e Autorização

### Verificar se o Usuário é Admin

O token JWT contém informações sobre o role do usuário. Após o login, verifique o campo `role`:

```typescript
// Exemplo de resposta do login
{
  "access_token": "...",
  "user": {
    "id": "...",
    "name": "...",
    "email": "...",
    "role": "admin", // ← Verificar este campo
    "user_type_id": "...",
    "plan_id": null,
    // ...
  }
}
```

### Implementação de Verificação

```typescript
// hooks/useAuth.ts ou utils/auth.ts
export function isAdmin(user: any): boolean {
  return user?.role === 'admin';
}

// Componente React
function AdminDashboard() {
  const user = useAuth(); // Seu hook de autenticação
  
  if (!isAdmin(user)) {
    return <Navigate to="/unauthorized" />;
  }
  
  return (
    <div>
      {/* Conteúdo do admin */}
    </div>
  );
}
```

### Proteção de Rotas

```typescript
// routes/AdminRoutes.tsx
import { Navigate } from 'react-router-dom';

function AdminRoute({ children }: { children: React.ReactNode }) {
  const user = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (!isAdmin(user)) {
    return <Navigate to="/unauthorized" />;
  }
  
  return <>{children}</>;
}

// Uso
<Route path="/admin/*" element={<AdminRoute><AdminLayout /></AdminRoute>} />
```

---

## Endpoints Disponíveis

### Base URL
```
http://localhost:3000/admin
```

### Headers Obrigatórios
```
Authorization: Bearer <token_jwt>
Content-Type: application/json
```

---

## 1. Métricas

### `GET /admin/metrics`

Retorna métricas gerais da aplicação.

**Resposta (200 OK):**
```json
{
  "users": {
    "total": 150,
    "by_type": [
      { "type": "admin", "count": 2 },
      { "type": "visitante", "count": 80 },
      { "type": "pagante", "count": 68 }
    ]
  },
  "subscriptions": {
    "active": 45,
    "by_status": [
      { "status": "active", "count": 45 },
      { "status": "canceled", "count": 10 },
      { "status": "expired", "count": 5 }
    ]
  },
  "users_by_plan": [
    { "plan": "Bronze", "count": 15 },
    { "plan": "Prata", "count": 20 },
    { "plan": "Ouro", "count": 10 }
  ],
  "daily_checkins": {
    "total": 1250
  }
}
```

**Exemplo de uso:**
```typescript
const response = await fetch('http://localhost:3000/admin/metrics', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const metrics = await response.json();
```

---

## 2. CRUD de Usuários

### Listar Usuários

**GET** `/admin/users`

**Resposta (200 OK):**
```json
[
  {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@example.com",
    "weight": 75.5,
    "height": 1.75,
    "created_at": "2024-01-01T00:00:00.000Z",
    "user_type": {
      "id": "uuid",
      "name": "admin",
      "description": "Administrador do sistema"
    },
    "plan": {
      "id": "uuid",
      "name": "Ouro",
      "level": "ouro",
      "price": 99.90
    },
    "subscription_status": "active",
    "subscription_expires_at": "2024-02-01T00:00:00.000Z"
  }
]
```

### Buscar Usuário por ID

**GET** `/admin/users/:id`

**Resposta (200 OK):**
```json
{
  "id": "uuid",
  "name": "João Silva",
  "email": "joao@example.com",
  "weight": 75.5,
  "height": 1.75,
  "created_at": "2024-01-01T00:00:00.000Z",
  "user_type": { ... },
  "plan": { ... },
  "subscriptions": [ ... ],
  "daily_checkins": [ ... ]
}
```

### Criar Usuário

**POST** `/admin/users`

**Body:**
```json
{
  "name": "Maria Santos",
  "email": "maria@example.com",
  "password": "senha123",
  "weight": 65.0,
  "height": 1.65,
  "birth_date": "1990-05-20",
  "user_type": "admin",
  "plan_id": null
}
```

**Campos:**
- `name` (obrigatório): Nome do usuário
- `email` (obrigatório): Email único
- `password` (obrigatório): Senha (será hasheada)
- `weight` (obrigatório): Peso em kg
- `height` (obrigatório): Altura em metros
- `birth_date` (opcional): Data de nascimento (YYYY-MM-DD); usado nas metas de alimentação por idade
- `user_type` (obrigatório): `"admin"`, `"visitante"` ou `"pagante"`
- `plan_id` (opcional): UUID do plano (apenas para pagantes)

**Resposta (201 Created):**
```json
{
  "id": "uuid",
  "name": "Maria Santos",
  "email": "maria@example.com",
  "weight": 65.0,
  "height": 1.65,
  "created_at": "2024-01-01T00:00:00.000Z",
  "user_type_id": "uuid",
  "plan_id": null
}
```

### Atualizar Usuário

**PUT** `/admin/users/:id`

**Body:**
```json
{
  "name": "Maria Santos Silva",
  "email": "maria.silva@example.com",
  "password": "novaSenha123",
  "weight": 66.0,
  "height": 1.65,
  "user_type": "pagante",
  "plan_id": "uuid-do-plano"
}
```

**Nota**: Todos os campos são opcionais. Apenas os campos enviados serão atualizados.

**Resposta (200 OK):**
```json
{
  "id": "uuid",
  "name": "Maria Santos Silva",
  "email": "maria.silva@example.com",
  // ... campos atualizados
}
```

### Remover Usuário

**DELETE** `/admin/users/:id`

**Resposta (200 OK):**
```json
{
  "message": "Usuário removido com sucesso"
}
```

---

## 3. CRUD de Produtos

### Listar Produtos

**GET** `/admin/products`

**Resposta (200 OK):**
```json
[
  {
    "id": "uuid",
    "name": "Smoothie de Banana e Aveia",
    "description": "Rico em fibras e potássio",
    "image_url": "https://example.com/image.jpg",
    "moment_of_day": "Desayuno",
    "benefits": "Ajuda na digestão",
    "recipe_prep": "Bater no liquidificador...",
    "category": {
      "id": "uuid",
      "name": "Proteínas",
      "type": "diet"
    },
    "pain_state": {
      "id": "uuid",
      "name": "Normal"
    },
    "user_type": null,
    "plan": {
      "id": "uuid",
      "name": "Ouro",
      "level": "ouro"
    }
  }
]
```

### Buscar Produto por ID

**GET** `/admin/products/:id`

Retorna produto com todos os relacionamentos, incluindo ingredientes.

### Criar Produto

**POST** `/admin/products`

**Body:**
```json
{
  "category_id": "uuid",
  "pain_state_id": "uuid",
  "name": "Smoothie de Frutas",
  "description": "Smoothie rico em vitaminas",
  "image_url": "https://example.com/image.jpg",
  "moment_of_day": "Desayuno",
  "benefits": "Fonte de vitamina C",
  "recipe_prep": "Bater todas as frutas no liquidificador",
  "user_type_id": null,
  "plan_id": "uuid-do-plano",
  "min_age": 18,
  "max_age": 65
}
```

**Campos obrigatórios:**
- `category_id`: UUID da categoria
- `pain_state_id`: UUID do estado de dor
- `name`: Nome do produto

**Campos opcionais:**
- `description`, `image_url`, `moment_of_day`, `benefits`, `recipe_prep`
- `user_type_id`: UUID do tipo de usuário (null = público)
- `plan_id`: UUID do plano (null = público)
- **`min_age`**: número (0–150) – idade mínima para o produto aparecer nas metas de alimentação; se omitido, produto vale para todas as idades
- **`max_age`**: número (0–150) – idade máxima para o produto aparecer nas metas; se omitido, produto vale para todas as idades

### Atualizar Produto

**PUT** `/admin/products/:id`

**Body:** (todos os campos opcionais)
```json
{
  "name": "Smoothie de Frutas Tropicais",
  "description": "Nova descrição",
  "plan_id": null,
  "min_age": null,
  "max_age": null
}
```

### Remover Produto

**DELETE** `/admin/products/:id`

**Resposta (200 OK):**
```json
{
  "message": "Produto removido com sucesso"
}
```

---

## 4. CRUD de Exercícios

### Listar Exercícios

**GET** `/admin/exercises`

**Resposta (200 OK):**
```json
[
  {
    "id": "uuid",
    "name": "Alongamento Suave",
    "description": "Exercícios de alongamento",
    "image_url": "https://example.com/image.jpg",
    "video_url": "https://example.com/video.mp4",
    "difficulty": "easy",
    "category": {
      "id": "uuid",
      "name": "Cardio",
      "type": "exercise"
    },
    "pain_state": {
      "id": "uuid",
      "name": "Normal"
    },
    "user_type": null,
    "plan": {
      "id": "uuid",
      "name": "Prata",
      "level": "prata"
    }
  }
]
```

### Buscar Exercício por ID

**GET** `/admin/exercises/:id`

### Criar Exercício

**POST** `/admin/exercises`

**Body:**
```json
{
  "category_id": "uuid",
  "pain_state_id": "uuid",
  "name": "Yoga Matinal",
  "description": "Sequência de yoga para iniciar o dia",
  "image_url": "https://example.com/image.jpg",
  "video_url": "https://example.com/video.mp4",
  "difficulty": "medium",
  "user_type_id": null,
  "plan_id": "uuid-do-plano"
}
```

**Campos obrigatórios:**
- `category_id`: UUID da categoria
- `pain_state_id`: UUID do estado de dor
- `name`: Nome do exercício

**Campos opcionais:**
- `description`, `image_url`, `video_url`
- `difficulty`: `"easy"`, `"medium"` ou `"hard"`
- `user_type_id`: UUID do tipo de usuário (null = público)
- `plan_id`: UUID do plano (null = público)

### Atualizar Exercício

**PUT** `/admin/exercises/:id`

**Body:** (todos os campos opcionais)
```json
{
  "name": "Yoga Matinal Avançado",
  "difficulty": "hard"
}
```

### Remover Exercício

**DELETE** `/admin/exercises/:id`

**Resposta (200 OK):**
```json
{
  "message": "Exercício removido com sucesso"
}
```

---

## 5. CRUD de Planos

### Listar Planos

**GET** `/admin/plans`

**Resposta (200 OK):**
```json
[
  {
    "id": "uuid",
    "name": "Bronze",
    "level": "bronze",
    "description": "Plano básico",
    "price": 29.90,
    "is_active": true
  },
  {
    "id": "uuid",
    "name": "Prata",
    "level": "prata",
    "description": "Plano intermediário",
    "price": 59.90,
    "is_active": true
  },
  {
    "id": "uuid",
    "name": "Ouro",
    "level": "ouro",
    "description": "Plano completo",
    "price": 99.90,
    "is_active": false
  }
]
```

**Nota**: Retorna todos os planos, incluindo inativos (diferente de `/plans` que retorna apenas ativos).

### Buscar Plano por ID

**GET** `/admin/plans/:id`

Retorna plano com lista de usuários associados.

### Criar Plano

**POST** `/admin/plans`

**Body:**
```json
{
  "name": "Platina",
  "level": "platina",
  "description": "Plano premium com todos os recursos",
  "price": 149.90,
  "is_active": true
}
```

**Campos obrigatórios:**
- `name`: Nome único do plano
- `level`: Nível hierárquico (bronze, prata, ouro, etc.)

**Campos opcionais:**
- `description`: Descrição do plano
- `price`: Preço mensal
- `is_active`: Se o plano está ativo (padrão: `true`)

**Resposta (201 Created):**
```json
{
  "id": "uuid",
  "name": "Platina",
  "level": "platina",
  "description": "Plano premium com todos os recursos",
  "price": 149.90,
  "is_active": true
}
```

### Atualizar Plano

**PUT** `/admin/plans/:id`

**Body:** (todos os campos opcionais)
```json
{
  "name": "Platina Premium",
  "price": 159.90,
  "is_active": false
}
```

### Remover Plano

**DELETE** `/admin/plans/:id`

**Erro (400 Bad Request):**
```json
{
  "statusCode": 400,
  "message": "Não é possível remover o plano. Existem 5 usuário(s) associado(s) a este plano."
}
```

**Nota**: Não é possível remover planos que têm usuários associados.

**Resposta (200 OK):**
```json
{
  "message": "Plano removido com sucesso"
}
```

---

## Implementação no Frontend

### Exemplo: Hook para Admin

```typescript
// hooks/useAdmin.ts
import { useState, useEffect } from 'react';

export function useAdmin(token: string | null) {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/admin/metrics', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Acesso negado. Apenas administradores podem acessar.');
        }
        throw new Error('Erro ao buscar métricas');
      }

      const data = await response.json();
      setMetrics(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [token]);

  return { metrics, loading, error, refetch: fetchMetrics };
}
```

### Exemplo: Componente de Métricas

```typescript
// components/AdminMetrics.tsx
import { useAdmin } from '../hooks/useAdmin';

function AdminMetrics() {
  const token = localStorage.getItem('token');
  const { metrics, loading, error } = useAdmin(token);

  if (loading) return <div>Carregando métricas...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!metrics) return null;

  return (
    <div className="admin-metrics">
      <h2>Métricas Gerais</h2>
      
      <div className="metric-card">
        <h3>Usuários</h3>
        <p className="metric-value">{metrics.users.total}</p>
        <div className="metric-breakdown">
          {metrics.users.by_type.map(item => (
            <div key={item.type}>
              <span>{item.type}:</span>
              <strong>{item.count}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="metric-card">
        <h3>Assinaturas Ativas</h3>
        <p className="metric-value">{metrics.subscriptions.active}</p>
        <div className="metric-breakdown">
          {metrics.subscriptions.by_status.map(item => (
            <div key={item.status}>
              <span>{item.status}:</span>
              <strong>{item.count}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="metric-card">
        <h3>Usuários por Plano</h3>
        {metrics.users_by_plan.map(item => (
          <div key={item.plan}>
            <span>{item.plan}:</span>
            <strong>{item.count}</strong>
          </div>
        ))}
      </div>

      <div className="metric-card">
        <h3>Check-ins Diários</h3>
        <p className="metric-value">{metrics.daily_checkins.total}</p>
      </div>
    </div>
  );
}
```

### Exemplo: CRUD de Usuários

```typescript
// components/AdminUsers.tsx
import { useState, useEffect } from 'react';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (userData: any) => {
    try {
      const response = await fetch('http://localhost:3000/admin/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao criar usuário');
      }

      await fetchUsers();
      setShowForm(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleUpdate = async (id: string, userData: any) => {
    try {
      const response = await fetch(`http://localhost:3000/admin/users/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao atualizar usuário');
      }

      await fetchUsers();
      setEditingUser(null);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover este usuário?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/admin/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao remover usuário');
      }

      await fetchUsers();
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      <div className="header">
        <h2>Gerenciar Usuários</h2>
        <button onClick={() => setShowForm(true)}>Novo Usuário</button>
      </div>

      {showForm && (
        <UserForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingUser && (
        <UserForm
          user={editingUser}
          onSubmit={(data) => handleUpdate(editingUser.id, data)}
          onCancel={() => setEditingUser(null)}
        />
      )}

      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Tipo</th>
            <th>Plano</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.user_type?.name || 'N/A'}</td>
              <td>{user.plan?.name || 'N/A'}</td>
              <td>
                <button onClick={() => setEditingUser(user)}>Editar</button>
                <button onClick={() => handleDelete(user.id)}>Remover</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### Exemplo: Formulário de Usuário

```typescript
// components/UserForm.tsx
import { useState, useEffect } from 'react';

function UserForm({ user, onSubmit, onCancel }: any) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    weight: 0,
    height: 0,
    user_type: 'visitante',
    plan_id: null,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '', // Não preencher senha
        weight: user.weight || 0,
        height: user.height || 0,
        user_type: user.user_type?.name || 'visitante',
        plan_id: user.plan_id || null,
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Remover senha vazia se for edição
    const data = { ...formData };
    if (user && !data.password) {
      delete data.password;
    }
    
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <div>
        <label>Nome</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div>
        <label>Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      <div>
        <label>Senha {user && '(deixe vazio para não alterar)'}</label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required={!user}
        />
      </div>

      <div>
        <label>Peso (kg)</label>
        <input
          type="number"
          step="0.1"
          value={formData.weight}
          onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
          required
        />
      </div>

      <div>
        <label>Altura (m)</label>
        <input
          type="number"
          step="0.01"
          value={formData.height}
          onChange={(e) => setFormData({ ...formData, height: parseFloat(e.target.value) })}
          required
        />
      </div>

      <div>
        <label>Tipo de Usuário</label>
        <select
          value={formData.user_type}
          onChange={(e) => setFormData({ ...formData, user_type: e.target.value })}
          required
        >
          <option value="visitante">Visitante</option>
          <option value="pagante">Pagante</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div>
        <label>Plano (opcional)</label>
        <PlanSelect
          value={formData.plan_id}
          onChange={(planId) => setFormData({ ...formData, plan_id: planId })}
        />
      </div>

      <div className="form-actions">
        <button type="submit">{user ? 'Atualizar' : 'Criar'}</button>
        <button type="button" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
}
```

### Exemplo: CRUD de Produtos

```typescript
// components/AdminProducts.tsx
import { useState, useEffect } from 'react';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3000/admin/products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (productData: any) => {
    try {
      const response = await fetch('http://localhost:3000/admin/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao criar produto');
      }

      await fetchProducts();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleUpdate = async (id: string, productData: any) => {
    try {
      const response = await fetch(`http://localhost:3000/admin/products/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao atualizar produto');
      }

      await fetchProducts();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover este produto?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/admin/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao remover produto');
      }

      await fetchProducts();
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      <h2>Gerenciar Produtos</h2>
      
      <ProductForm onSubmit={handleCreate} />

      <div className="products-grid">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={(data) => handleUpdate(product.id, data)}
            onDelete={() => handleDelete(product.id)}
          />
        ))}
      </div>
    </div>
  );
}
```

---

## Estrutura de Dados

### Usuário Completo
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  weight: number;
  height: number;
  birth_date: string | null; // YYYY-MM-DD
  created_at: string;
  user_type_id: string | null;
  plan_id: string | null;
  subscription_status: 'active' | 'canceled' | 'expired' | 'past_due' | 'trialing' | null;
  subscription_expires_at: string | null;
  stripe_customer_id: string | null;
  user_type: {
    id: string;
    name: 'admin' | 'visitante' | 'pagante';
    description: string;
  } | null;
  plan: {
    id: string;
    name: string;
    level: string;
    description: string;
    price: number;
    is_active: boolean;
  } | null;
  subscriptions?: Subscription[];
  daily_checkins?: DailyCheckin[];
}
```

### Produto Completo
```typescript
interface Product {
  id: string;
  category_id: string;
  pain_state_id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  moment_of_day: string | null;
  benefits: string | null;
  recipe_prep: string | null;
  user_type_id: string | null;
  plan_id: string | null;
  min_age: number | null;  // idade mínima para aparecer nas metas de alimentação
  max_age: number | null;  // idade máxima para aparecer nas metas de alimentação
  category: {
    id: string;
    name: string;
    type: 'diet' | 'exercise';
  };
  pain_state: {
    id: string;
    name: string;
  };
  user_type: {
    id: string;
    name: string;
  } | null;
  plan: {
    id: string;
    name: string;
    level: string;
  } | null;
}
```

### Exercício Completo
```typescript
interface Exercise {
  id: string;
  category_id: string;
  pain_state_id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  video_url: string | null;
  difficulty: 'easy' | 'medium' | 'hard' | null;
  user_type_id: string | null;
  plan_id: string | null;
  category: {
    id: string;
    name: string;
    type: 'diet' | 'exercise';
  };
  pain_state: {
    id: string;
    name: string;
  };
  user_type: {
    id: string;
    name: string;
  } | null;
  plan: {
    id: string;
    name: string;
    level: string;
  } | null;
}
```

### Plano Completo
```typescript
interface Plan {
  id: string;
  name: string;
  level: string;
  description: string | null;
  price: number | null;
  is_active: boolean;
  users?: User[];
}
```

---

## Tratamento de Erros

### Erros Comuns

#### 401 Unauthorized
```typescript
if (response.status === 401) {
  // Token inválido ou expirado
  localStorage.removeItem('token');
  navigate('/login');
}
```

#### 403 Forbidden
```typescript
if (response.status === 403) {
  // Usuário não é admin
  alert('Acesso negado. Apenas administradores podem acessar esta funcionalidade.');
  navigate('/');
}
```

#### 404 Not Found
```typescript
if (response.status === 404) {
  const error = await response.json();
  alert(`Recurso não encontrado: ${error.message}`);
}
```

#### 409 Conflict
```typescript
if (response.status === 409) {
  const error = await response.json();
  alert(`Conflito: ${error.message}`);
  // Exemplo: Email já em uso, nome de plano duplicado
}
```

#### 400 Bad Request
```typescript
if (response.status === 400) {
  const error = await response.json();
  alert(`Erro de validação: ${error.message}`);
  // Exemplo: Não é possível remover plano com usuários associados
}
```

### Função Helper para Requisições

```typescript
// utils/adminApi.ts
export async function adminRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Token não encontrado');
  }

  const response = await fetch(`http://localhost:3000/admin/${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Sessão expirada');
    }

    if (response.status === 403) {
      throw new Error('Acesso negado. Apenas administradores podem acessar.');
    }

    const error = await response.json();
    throw new Error(error.message || 'Erro na requisição');
  }

  return await response.json();
}

// Uso
const metrics = await adminRequest('metrics');
const users = await adminRequest('users');
const user = await adminRequest('users/123');
await adminRequest('users', {
  method: 'POST',
  body: JSON.stringify(userData)
});
```

---

## Exemplos Completos

### Dashboard Admin Completo

```typescript
// pages/AdminDashboard.tsx
import { useState } from 'react';
import { useAdmin } from '../hooks/useAdmin';
import AdminMetrics from '../components/AdminMetrics';
import AdminUsers from '../components/AdminUsers';
import AdminProducts from '../components/AdminProducts';
import AdminExercises from '../components/AdminExercises';
import AdminPlans from '../components/AdminPlans';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('metrics');
  const token = localStorage.getItem('token');
  const { metrics } = useAdmin(token);

  return (
    <div className="admin-dashboard">
      <nav className="admin-nav">
        <button
          className={activeTab === 'metrics' ? 'active' : ''}
          onClick={() => setActiveTab('metrics')}
        >
          Métricas
        </button>
        <button
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          Usuários
        </button>
        <button
          className={activeTab === 'products' ? 'active' : ''}
          onClick={() => setActiveTab('products')}
        >
          Produtos
        </button>
        <button
          className={activeTab === 'exercises' ? 'active' : ''}
          onClick={() => setActiveTab('exercises')}
        >
          Exercícios
        </button>
        <button
          className={activeTab === 'plans' ? 'active' : ''}
          onClick={() => setActiveTab('plans')}
        >
          Planos
        </button>
      </nav>

      <div className="admin-content">
        {activeTab === 'metrics' && <AdminMetrics />}
        {activeTab === 'users' && <AdminUsers />}
        {activeTab === 'products' && <AdminProducts />}
        {activeTab === 'exercises' && <AdminExercises />}
        {activeTab === 'plans' && <AdminPlans />}
      </div>
    </div>
  );
}
```

### Formulário de Produto Completo

```typescript
// components/ProductForm.tsx
import { useState, useEffect } from 'react';
import { adminRequest } from '../utils/adminApi';

function ProductForm({ product, onSubmit, onCancel }: any) {
  const [categories, setCategories] = useState([]);
  const [painStates, setPainStates] = useState([]);
  const [plans, setPlans] = useState([]);
  const [formData, setFormData] = useState({
    category_id: '',
    pain_state_id: '',
    name: '',
    description: '',
    image_url: '',
    moment_of_day: '',
    benefits: '',
    recipe_prep: '',
    user_type_id: null,
    plan_id: null,
  });

  useEffect(() => {
    // Buscar categorias e pain states
    Promise.all([
      fetch('http://localhost:3000/categories?type=diet').then(r => r.json()),
      fetch('http://localhost:3000/pain-states').then(r => r.json()),
      adminRequest('plans').then(data => setPlans(data)),
    ]).then(([cats, states]) => {
      setCategories(cats);
      setPainStates(states);
    });

    if (product) {
      setFormData({
        category_id: product.category_id,
        pain_state_id: product.pain_state_id,
        name: product.name,
        description: product.description || '',
        image_url: product.image_url || '',
        moment_of_day: product.moment_of_day || '',
        benefits: product.benefits || '',
        recipe_prep: product.recipe_prep || '',
        user_type_id: product.user_type_id,
        plan_id: product.plan_id,
      });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Limpar campos vazios
    const data = Object.fromEntries(
      Object.entries(formData).filter(([_, v]) => v !== '' && v !== null)
    );
    
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <div>
        <label>Categoria *</label>
        <select
          value={formData.category_id}
          onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
          required
        >
          <option value="">Selecione...</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Estado de Dor *</label>
        <select
          value={formData.pain_state_id}
          onChange={(e) => setFormData({ ...formData, pain_state_id: e.target.value })}
          required
        >
          <option value="">Selecione...</option>
          {painStates.map(state => (
            <option key={state.id} value={state.id}>{state.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Nome *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div>
        <label>Descrição</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>

      <div>
        <label>URL da Imagem</label>
        <input
          type="url"
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
        />
      </div>

      <div>
        <label>Momento do Dia</label>
        <input
          type="text"
          value={formData.moment_of_day}
          onChange={(e) => setFormData({ ...formData, moment_of_day: e.target.value })}
          placeholder="Ex: Desayuno, Almuerzo, Cena"
        />
      </div>

      <div>
        <label>Benefícios</label>
        <textarea
          value={formData.benefits}
          onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
          rows={2}
        />
      </div>

      <div>
        <label>Modo de Preparo</label>
        <textarea
          value={formData.recipe_prep}
          onChange={(e) => setFormData({ ...formData, recipe_prep: e.target.value })}
          rows={4}
        />
      </div>

      <div>
        <label>Plano (opcional - deixe vazio para público)</label>
        <select
          value={formData.plan_id || ''}
          onChange={(e) => setFormData({ ...formData, plan_id: e.target.value || null })}
        >
          <option value="">Público (sem restrição)</option>
          {plans.map(plan => (
            <option key={plan.id} value={plan.id}>{plan.name}</option>
          ))}
        </select>
      </div>

      <div className="form-actions">
        <button type="submit">{product ? 'Atualizar' : 'Criar'}</button>
        <button type="button" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
}
```

---

## ⚠️ Observações Importantes

### 1. Segurança
- **Sempre verifique** se o usuário é admin antes de mostrar funcionalidades administrativas
- **Nunca confie apenas no frontend** - o backend sempre valida a role
- **Mantenha o token seguro** - não exponha em logs ou console

### 2. Validação
- **Valide dados no frontend** antes de enviar (melhor UX)
- **O backend também valida** - sempre trate erros de validação
- **Campos obrigatórios** são validados tanto no frontend quanto no backend

### 3. Performance
- **Use paginação** para listas grandes (não implementado ainda, mas recomendado)
- **Cache métricas** por alguns segundos para evitar requisições excessivas
- **Lazy loading** para componentes pesados

### 4. UX
- **Feedback visual** - mostre loading states
- **Confirmação** antes de deletar recursos importantes
- **Mensagens de sucesso/erro** claras
- **Validação em tempo real** nos formulários

### 5. Relacionamentos
- **Ao criar produtos/exercícios**, certifique-se de que categoria e pain_state existem
- **Ao criar usuários pagantes**, valide que o plano existe e está ativo
- **Ao remover planos**, verifique se há usuários associados (backend já valida)

---

## 📚 Recursos Adicionais

- [Documentação da API Swagger](http://localhost:3000/api) - Visualize todos os endpoints
- [Autenticação JWT](./AUTH.md) - Como funciona a autenticação
- [Controle de Acesso](./PERMISSIONS.md) - Sistema de roles e permissões
- [Data de nascimento e metas por idade](./FRONTEND_BIRTH_DATE_AND_GOALS.md) - Registro com `birth_date`, resposta de auth e filtro de metas de alimentação por faixa etária

---

## 🆘 Suporte

Se encontrar problemas:

1. Verifique se o token JWT está válido e não expirou
2. Confirme que o usuário tem role `admin` no token
3. Verifique os logs do backend para entender erros
4. Teste os endpoints diretamente no Swagger UI
5. Verifique se os relacionamentos (categorias, pain_states, planos) existem antes de criar recursos
