# Daily Healthy Goals Backend

Backend para sistema de gestão de metas diárias de saúde, desenvolvido com NestJS, MySQL e Docker.

## 🚀 Tecnologias

- **NestJS** - Framework Node.js
- **TypeORM** - ORM para MySQL
- **MySQL** - Banco de dados
- **Docker** - Containerização
- **class-validator** - Validação de dados
- **class-transformer** - Transformação de dados
- **bcrypt** - Hash de senhas

## 📋 Pré-requisitos

- Docker e Docker Compose instalados
- Node.js 20+ (para desenvolvimento local)

## 🛠️ Instalação e Execução

### Usando Docker (Recomendado)

1. Clone o repositório:
```bash
git clone <repository-url>
cd daily-healthy-goals-backend
```

2. Copie o arquivo de exemplo de variáveis de ambiente:
```bash
cp .env.example .env
```

3. Inicie os containers:
```bash
docker-compose up -d
```

Isso irá:
- Criar e iniciar o container MySQL
- Criar e iniciar o container da aplicação NestJS
- Criar automaticamente as tabelas no banco de dados (em modo desenvolvimento)

4. A aplicação estará disponível em: `http://localhost:3000`

5. (Opcional) Popular o banco com dados iniciais:
```bash
docker-compose exec app npm run seed
```

### Desenvolvimento Local

1. Instale as dependências:
```bash
npm install
```

2. Configure o arquivo `.env` com as credenciais do banco de dados

3. Certifique-se de que o MySQL está rodando

4. Execute a aplicação:
```bash
npm run start:dev
```

5. (Opcional) Popular o banco com dados iniciais (categorias e metas):
```bash
npm run seed
```

## 📚 Estrutura do Banco de Dados

### Tabelas

- **users** - Usuários do sistema
- **categories** - Categorias de estado físico (ex: "Com Dor", "Inchada", "Normal")
- **goal_library** - Biblioteca de metas vinculadas às categorias
- **daily_checkins** - Registros diários dos usuários
- **user_daily_goals** - Metas instanciadas para cada dia do usuário

## 🔌 Endpoints da API

### Autenticação

#### `POST /auth/register`
Cadastro de novo usuário.

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

**Resposta:**
```json
{
  "id": "uuid",
  "name": "João Silva",
  "email": "joao@example.com",
  "weight": 75.5,
  "height": 1.75,
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

#### `POST /auth/login`
Login de usuário existente.

**Body:**
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Resposta de Sucesso:**
```json
{
  "id": "uuid",
  "name": "João Silva",
  "email": "joao@example.com",
  "weight": 75.5,
  "height": 1.75,
  "created_at": "2024-01-01T00:00:00.000Z"
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

### Categorias

#### `GET /categories`
Lista todas as categorias disponíveis.

**Resposta:**
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

### Daily Check-in

#### `POST /daily-checkin`
Cria um registro diário e gera as metas automaticamente.

**Headers:**
```
user-id: <uuid-do-usuario>
```

**Body:**
```json
{
  "category_id": 1
}
```

**Resposta:**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "category_id": 1,
  "checkin_date": "2024-01-01",
  "category": {
    "id": 1,
    "name": "Com Dor"
  },
  "user_daily_goals": [
    {
      "id": "uuid",
      "is_completed": false,
      "goal_library": {
        "id": 1,
        "description": "Fazer alongamento"
      }
    }
  ]
}
```

**Nota:** Se já existir um check-in para o dia atual, retorna o existente (R1).

#### `DELETE /daily-checkin/today`
Remove o check-in do dia atual e todas as metas associadas (R2 - Delete em Cascata).

**Headers:**
```
user-id: <uuid-do-usuario>
```

### Daily Goals

#### `GET /daily-goals`
Retorna todas as metas do dia atual do usuário.

**Headers:**
```
user-id: <uuid-do-usuario>
```

**Resposta:**
```json
[
  {
    "id": "uuid",
    "checkin_id": "uuid",
    "goal_library_id": 1,
    "is_completed": false,
    "goal_library": {
      "id": 1,
      "category_id": 1,
      "description": "Fazer alongamento"
    }
  }
]
```

#### `PATCH /daily-goals/:id`
Atualiza o status de conclusão de uma meta.

**Body:**
```json
{
  "is_completed": true
}
```

**Resposta:**
```json
{
  "id": "uuid",
  "checkin_id": "uuid",
  "goal_library_id": 1,
  "is_completed": true
}
```

## 📝 Regras de Negócio

### R1: Fluxo de Registro Diário
- Ao criar um check-in, o sistema busca todas as metas da categoria na biblioteca
- Cria instâncias dessas metas na tabela `user_daily_goals`
- Se já existir um check-in para o dia, retorna o existente

### R2: Botão de Reset
- Ao deletar o check-in do dia, todas as metas associadas são removidas automaticamente (cascata)
- O usuário pode criar um novo check-in após o reset

### R3: Persistência de Dados
- As metas do dia são "congeladas" - mesmo que a descrição na biblioteca seja alterada, as metas já geradas permanecem intactas

## 🔒 Validação

Todos os endpoints utilizam `class-validator` e `class-transformer` para validação e transformação de dados:

- Campos obrigatórios são validados
- Tipos de dados são verificados
- Mensagens de erro personalizadas em português

## 🧪 Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod

# Testes
npm run test
npm run test:watch
npm run test:e2e

# Linting
npm run lint
npm run format
```

## 📦 Docker

### Comandos úteis

```bash
# Iniciar containers
docker-compose up -d

# Ver logs
docker-compose logs -f app

# Parar containers
docker-compose down

# Parar e remover volumes
docker-compose down -v
```

## 🔐 Segurança

⚠️ **Nota:** Atualmente, os endpoints que requerem autenticação estão usando um header temporário `user-id`. Para produção, é necessário implementar autenticação JWT completa.

## 📚 Documentação de Integração

Para integração com frontend, consulte a [Documentação de Integração](./INTEGRATION.md) completa, que inclui:

- Exemplos de código para React, Vue.js e outras frameworks
- Modelos de dados TypeScript
- Fluxo completo de integração
- Tratamento de erros
- Dicas de implementação

## 📄 Licença

MIT License - Copyright (c) 2026 José Eduardo Martins
