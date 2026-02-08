# Documentação de Controle de Acesso - Backend

Esta documentação explica como funciona o sistema de autenticação e controle de acesso do Daily Healthy Goals Backend.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Sistema de Autenticação JWT](#sistema-de-autenticação-jwt)
- [Tipos de Usuário (Roles)](#tipos-de-usuário-roles)
- [Sistema de Permissões](#sistema-de-permissões)
- [Como Funciona o Controle de Acesso](#como-funciona-o-controle-de-acesso)
- [Exemplos Práticos](#exemplos-práticos)
- [Implementação no Frontend](#implementação-no-frontend)

---

## 🎯 Visão Geral

O backend implementa um sistema de controle de acesso baseado em **JWT (JSON Web Tokens)** e **roles (tipos de usuário)**. O controle de acesso é **totalmente interno** - o frontend não precisa fazer filtragem, apenas enviar o token quando disponível.

### Características Principais

✅ **Autenticação JWT**: Login/registro retorna um token de acesso  
✅ **Role no Token**: O tipo de usuário (role) está incluído no token  
✅ **Acesso Anônimo**: Visitantes sem token podem acessar recursos públicos  
✅ **Filtragem Automática**: O backend filtra automaticamente produtos e exercícios baseado no role  
✅ **Sem Filtros no Frontend**: O frontend não precisa implementar lógica de filtragem  

---

## 🔐 Sistema de Autenticação JWT

### Fluxo de Autenticação

1. **Registro ou Login**: Usuário faz `POST /auth/register` ou `POST /auth/login`
2. **Token Gerado**: Backend retorna um `access_token` JWT
3. **Token no Header**: Frontend envia token em todas as requisições autenticadas
4. **Validação Automática**: Backend valida token e extrai informações do usuário

### Estrutura do Token

O token JWT contém as seguintes informações:

```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "role": "admin" | "visitante" | "pagante",
  "plan_id": "plan-uuid" | null,
  "user_type_id": "user-type-uuid" | null,
  "iat": 1234567890,
  "exp": 1234654290
}
```

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

```typescript
// Após login/registro bem-sucedido
interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    plan_id: string | null;
    user_type_id: string | null;
  };
}

// Armazenar token
localStorage.setItem('access_token', response.access_token);
localStorage.setItem('user', JSON.stringify(response.user));
```

### Enviando Token nas Requisições

```typescript
// Headers para requisições autenticadas
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${accessToken}`
};

// Exemplo: Buscar produtos
fetch('http://localhost:3000/products', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
  }
});
```

---

## 👥 Tipos de Usuário (Roles)

O sistema possui três tipos de usuário:

### 1. Admin (`admin`)

- **Acesso**: Total - pode ver todos os produtos e exercícios
- **Token**: Obrigatório (não pode ser anônimo)
- **Uso**: Administradores do sistema

### 2. Visitante (`visitante`)

- **Acesso**: 
  - Recursos públicos (sem restrições)
  - Recursos específicos de visitante
- **Token**: Opcional
  - **Com token**: Acesso a recursos públicos + recursos de visitante
  - **Sem token (anônimo)**: Apenas recursos públicos
- **Uso**: Usuários não autenticados ou usuários com tipo "visitante"

### 3. Pagante (`pagante`)

- **Acesso**:
  - Recursos públicos (sem restrições)
  - Recursos de visitante
  - Recursos do seu plano (ex: Bronze)
- **Token**: Obrigatório
- **Uso**: Usuários com plano de assinatura

---

## 🔒 Sistema de Permissões

### Regras de Acesso

#### Admin
```
✅ Todos os produtos
✅ Todos os exercícios
```

#### Visitante (com token)
```
✅ Produtos públicos (user_type_id = null, plan_id = null)
✅ Produtos de visitante (user_type_id = visitante, plan_id = null)
❌ Produtos de planos pagantes
```

#### Visitante (sem token - anônimo)
```
✅ Produtos públicos (user_type_id = null, plan_id = null)
❌ Produtos de visitante autenticado
❌ Produtos de planos pagantes
```

#### Pagante
```
✅ Produtos públicos (user_type_id = null, plan_id = null)
✅ Produtos de visitante (user_type_id = visitante, plan_id = null)
✅ Produtos do seu plano (plan_id = seu_plan_id)
❌ Produtos de outros planos
```

### Como Funciona Internamente

1. **Frontend envia requisição** (com ou sem token)
2. **Backend valida token** (se presente)
3. **Backend identifica role** do usuário:
   - Se tem token válido → extrai role do token
   - Se não tem token → role = `visitante` (anônimo)
4. **Backend aplica filtros SQL** baseado no role
5. **Backend retorna apenas recursos permitidos**

### Exemplo de Filtragem SQL

```sql
-- Para visitante anônimo (sem token)
WHERE (user_type_id IS NULL AND plan_id IS NULL)

-- Para visitante autenticado
WHERE (user_type_id IS NULL AND plan_id IS NULL) 
   OR (user_type_id = 'visitante-uuid' AND plan_id IS NULL)

-- Para pagante
WHERE (user_type_id IS NULL AND plan_id IS NULL)
   OR (plan_id = 'bronze-plan-uuid')

-- Para admin
-- Sem filtros (retorna tudo)
```

---

## 🚀 Como Funciona o Controle de Acesso

### Endpoints Protegidos

Todos os endpoints abaixo **aceitam requisições com ou sem token**:

- `GET /products` - Lista produtos (filtrados automaticamente)
- `GET /products/:id` - Detalhes de um produto
- `GET /exercises` - Lista exercícios (filtrados automaticamente)
- `GET /exercises/:id` - Detalhes de um exercício
- `POST /daily-checkin` - Criar check-in (requer token)
- `GET /daily-goals` - Listar plano do dia (requer token)
- `PATCH /daily-goals/:id` - Atualizar item do plano (requer token)
- `DELETE /daily-checkin/today` - Resetar dia (requer token)

### Endpoints Públicos (sem autenticação)

- `GET /pain-states` - Lista estados de dor
- `GET /categories` - Lista categorias
- `GET /user-types` - Lista tipos de usuário
- `GET /plans` - Lista planos disponíveis
- `POST /auth/register` - Registrar novo usuário
- `POST /auth/login` - Login de usuário

### Comportamento por Endpoint

#### `GET /products`

**Sem token (visitante anônimo):**
```json
// Retorna apenas produtos públicos
[
  {
    "id": "...",
    "name": "Produto Público",
    "user_type_id": null,
    "plan_id": null
  }
]
```

**Com token de visitante:**
```json
// Retorna produtos públicos + produtos de visitante
[
  {
    "id": "...",
    "name": "Produto Público",
    "user_type_id": null,
    "plan_id": null
  },
  {
    "id": "...",
    "name": "Produto de Visitante",
    "user_type_id": "visitante-uuid",
    "plan_id": null
  }
]
```

**Com token de pagante:**
```json
// Retorna produtos públicos + produtos de visitante + produtos do plano
[
  {
    "id": "...",
    "name": "Produto Público",
    "user_type_id": null,
    "plan_id": null
  },
  {
    "id": "...",
    "name": "Produto de Visitante",
    "user_type_id": "visitante-uuid",
    "plan_id": null
  },
  {
    "id": "...",
    "name": "Produto Bronze",
    "user_type_id": null,
    "plan_id": "bronze-plan-uuid"
  }
]
```

**Com token de admin:**
```json
// Retorna TODOS os produtos (sem filtros)
[
  // ... todos os produtos do sistema
]
```

---

## 💡 Exemplos Práticos

### Exemplo 1: Visitante Anônimo Buscando Produtos

```typescript
// Requisição SEM token
fetch('http://localhost:3000/products')
  .then(res => res.json())
  .then(products => {
    // Recebe apenas produtos públicos
    console.log(products);
    // [
    //   { name: "Produto Público", user_type_id: null, plan_id: null },
    //   ...
    // ]
  });
```

### Exemplo 2: Visitante Autenticado Buscando Produtos

```typescript
// Requisição COM token de visitante
const token = localStorage.getItem('access_token');

fetch('http://localhost:3000/products', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
  .then(res => res.json())
  .then(products => {
    // Recebe produtos públicos + produtos de visitante
    console.log(products);
    // [
    //   { name: "Produto Público", user_type_id: null, plan_id: null },
    //   { name: "Produto Visitante", user_type_id: "visitante-uuid", plan_id: null },
    //   ...
    // ]
  });
```

### Exemplo 3: Pagante Buscando Produtos

```typescript
// Requisição COM token de pagante
const token = localStorage.getItem('access_token');

fetch('http://localhost:3000/products', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
  .then(res => res.json())
  .then(products => {
    // Recebe produtos públicos + produtos de visitante + produtos do plano Bronze
    console.log(products);
    // [
    //   { name: "Produto Público", user_type_id: null, plan_id: null },
    //   { name: "Produto Visitante", user_type_id: "visitante-uuid", plan_id: null },
    //   { name: "Produto Bronze", user_type_id: null, plan_id: "bronze-uuid" },
    //   ...
    // ]
  });
```

### Exemplo 4: Acesso Negado (Produto de Outro Plano)

```typescript
// Pagante tenta acessar produto de plano Silver (não tem acesso)
const token = localStorage.getItem('access_token'); // token de pagante Bronze

fetch('http://localhost:3000/products/silver-product-uuid', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
  .then(res => res.json())
  .catch(err => {
    // Recebe 404 Not Found
    // Backend retorna: "Produto não encontrado"
    // (mesmo que o produto exista, o acesso é negado)
  });
```

---

## 🛠️ Implementação no Frontend

### 1. Service de API com Token

```typescript
// src/services/api.ts
class ApiService {
  private getAuthHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // Adiciona token se disponível
    const token = localStorage.getItem('access_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async getProducts(): Promise<Product[]> {
    const response = await fetch(`${API_URL}/products`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar produtos');
    }

    // Backend já retorna apenas produtos permitidos
    return response.json();
  }

  async getExercises(): Promise<Exercise[]> {
    const response = await fetch(`${API_URL}/exercises`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar exercícios');
    }

    // Backend já retorna apenas exercícios permitidos
    return response.json();
  }
}
```

### 2. Hook para Gerenciar Autenticação

```typescript
// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  plan_id: string | null;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carregar do localStorage
    const storedToken = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const login = (authResponse: AuthResponse) => {
    localStorage.setItem('access_token', authResponse.access_token);
    localStorage.setItem('user', JSON.stringify(authResponse.user));
    setToken(authResponse.access_token);
    setUser(authResponse.user);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;
  const isAdmin = user?.role === 'admin';
  const isPaying = user?.role === 'pagante';
  const isVisitor = user?.role === 'visitante' || !isAuthenticated;

  return {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    isPaying,
    isVisitor,
  };
}
```

### 3. Componente que Mostra Conteúdo Baseado no Role

```typescript
// src/components/ProductsList.tsx
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../services/api';

export function ProductsList() {
  const { user, isAuthenticated } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadProducts();
  }, [isAuthenticated]);

  async function loadProducts() {
    try {
      // Backend filtra automaticamente baseado no token
      const data = await apiService.getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Erro ao carregar produtos', err);
    }
  }

  return (
    <div>
      <h2>Produtos Disponíveis</h2>
      
      {/* Mostrar informação do usuário */}
      {isAuthenticated && user && (
        <div className="user-info">
          <p>Logado como: {user.name}</p>
          <p>Role: {user.role}</p>
          {user.plan_id && <p>Plano: {user.plan_id}</p>}
        </div>
      )}

      {/* Lista de produtos (já filtrados pelo backend) */}
      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            {/* Backend já retornou apenas produtos permitidos */}
          </div>
        ))}
      </div>

      {/* Mensagem se não há produtos */}
      {products.length === 0 && (
        <p>Nenhum produto disponível para seu tipo de acesso.</p>
      )}
    </div>
  );
}
```

### 4. Tratamento de Erros de Acesso

```typescript
// src/services/api.ts
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json();
    
    // Token expirado ou inválido
    if (response.status === 401) {
      // Limpar token e redirecionar para login
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Sessão expirada. Faça login novamente.');
    }

    // Recurso não encontrado (pode ser acesso negado)
    if (response.status === 404) {
      throw new Error(error.message || 'Recurso não encontrado');
    }

    throw new Error(error.message || 'Erro na requisição');
  }

  return response.json();
}
```

---

## ⚠️ Pontos Importantes

### 1. Não Fazer Filtragem no Frontend

❌ **ERRADO:**
```typescript
// NÃO faça isso!
const allProducts = await fetch('/products').then(r => r.json());
const filteredProducts = allProducts.filter(p => 
  p.user_type_id === user.user_type_id || p.plan_id === user.plan_id
);
```

✅ **CORRETO:**
```typescript
// Backend já filtra automaticamente
const products = await fetch('/products', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json());
```

### 2. Sempre Enviar Token Quando Disponível

Mesmo que o endpoint aceite requisições sem token, sempre envie o token quando o usuário estiver autenticado para garantir acesso máximo.

```typescript
// Sempre incluir token se disponível
const headers = {
  'Content-Type': 'application/json',
};

const token = localStorage.getItem('access_token');
if (token) {
  headers['Authorization'] = `Bearer ${token}`;
}
```

### 3. Tratar Token Expirado

```typescript
// Interceptor para verificar token expirado
fetch(url, options)
  .then(response => {
    if (response.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      // Redirecionar para login
      window.location.href = '/login';
    }
    return response;
  });
```

### 4. Endpoints que Requerem Autenticação

Alguns endpoints **exigem** token (não funcionam sem autenticação):

- `POST /daily-checkin` - Criar check-in
- `GET /daily-goals` - Listar plano do dia
- `PATCH /daily-goals/:id` - Atualizar item do plano
- `DELETE /daily-checkin/today` - Resetar dia

Para esses endpoints, sempre verificar se o usuário está autenticado antes de fazer a requisição.

---

## 📊 Resumo das Regras de Acesso

| Role | Token | Produtos Públicos | Produtos Visitante | Produtos do Plano | Produtos Outros Planos |
|------|-------|-------------------|-------------------|-------------------|------------------------|
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ |
| Visitante (autenticado) | ✅ | ✅ | ✅ | ❌ | ❌ |
| Visitante (anônimo) | ❌ | ✅ | ❌ | ❌ | ❌ |
| Pagante | ✅ | ✅ | ✅ | ✅ | ❌ |

---

## 🔍 Testando o Sistema

### Teste 1: Visitante Anônimo

```bash
# Sem token - deve retornar apenas produtos públicos
curl http://localhost:3000/products
```

### Teste 2: Visitante Autenticado

```bash
# 1. Fazer login como visitante
TOKEN=$(curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "visitante@example.com", "password": "senha"}' \
  | jq -r '.access_token')

# 2. Buscar produtos com token
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/products
```

### Teste 3: Pagante

```bash
# 1. Fazer login como pagante
TOKEN=$(curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "pagante@example.com", "password": "senha"}' \
  | jq -r '.access_token')

# 2. Buscar produtos com token
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/products
```

### Teste 4: Admin

```bash
# 1. Fazer login como admin
TOKEN=$(curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@dailyhealthygoals.com", "password": "admin123"}' \
  | jq -r '.access_token')

# 2. Buscar produtos com token (deve retornar TODOS)
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/products
```

---

## 📞 Suporte

Para dúvidas sobre o sistema de controle de acesso:

1. Verifique se o token está sendo enviado corretamente
2. Confirme o role do usuário no token (decodifique o JWT)
3. Verifique os logs do backend para ver quais filtros foram aplicados
4. Teste com diferentes tipos de usuário para validar o comportamento

---

**Última atualização:** Fevereiro 2026
