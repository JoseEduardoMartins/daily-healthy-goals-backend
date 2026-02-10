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
docker-compose exec app npm run setup:db
# ou
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
npm run setup:db
# ou
npm run seed
```

## 📚 Estrutura do Banco de Dados

### Tabelas

- **users** - Usuários do sistema
- **user_types** - Tipos de usuário (admin, visitante, pagante) para controle de acesso
- **plans** - Planos de assinatura (bronze, silver, gold, etc.) para controle de acesso
- **pain_states** - Estados de dor/humor (ex: "Com Dor", "Inchada", "Normal")
- **categories** - Categorias de produtos e exercícios (tipo: 'diet' ou 'exercise')
- **products** - Produtos (comidas/bebidas) vinculados a categorias e estados de dor
- **exercise** - Exercícios vinculados a categorias e estados de dor
- **ingredients** - Ingredientes para produtos
- **product_ingredients** - Relação entre produtos e ingredientes
- **daily_checkins** - Registros diários dos usuários
- **user_daily_plan** - Plano diário do usuário (produtos e exercícios)
- **exercise_prescriptions** - Prescrições de exercícios (séries, repetições, descanso)

### Diagrama Completo

Para visualizar o diagrama completo de relacionamento de classes e todas as tabelas com seus campos e relacionamentos, consulte: [Diagrama de Banco de Dados](./docs/DATABASE_SCHEMA.md)

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

### Pain States (Estados de Dor)

#### `GET /pain-states`
Lista todos os estados de dor/humor disponíveis.

**Resposta:**
```json
[
  {
    "id": "uuid",
    "name": "Com Dor"
  },
  {
    "id": "uuid",
    "name": "Inchada"
  },
  {
    "id": "uuid",
    "name": "Normal"
  }
]
```

### Categorias

#### `GET /categories`
Lista todas as categorias disponíveis (tipo: 'diet' para alimentos ou 'exercise' para exercícios).

**Resposta:**
```json
[
  {
    "id": "uuid",
    "name": "Proteínas",
    "image_url": "https://example.com/images/proteinas.jpg",
    "type": "diet"
  },
  {
    "id": "uuid",
    "name": "Cardio",
    "image_url": null,
    "type": "exercise"
  }
]
```

### Daily Check-in

#### `POST /daily-checkin`
Cria um registro diário e gera automaticamente o plano do dia com produtos (comidas/bebidas) e exercícios baseados no estado de dor selecionado.

**Headers:**
```
user-id: <uuid-do-usuario>
```

**Body:**
```json
{
  "pain_state_id": "uuid"
}
```

**Resposta:**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "pain_state_id": "uuid",
  "checkin_date": "2024-01-01",
  "pain_state": {
    "id": "uuid",
    "name": "Com Dor"
  },
  "user_daily_plans": [
    {
      "id": "uuid",
      "checkin_id": "uuid",
      "product_id": "uuid",
      "is_completed": false,
      "product": {
        "id": "uuid",
        "name": "Smoothie de Banana e Aveia",
        "description": "Rico em fibras e potássio",
        "moment_of_day": "Desayuno",
        "benefits": "Ajuda na digestão",
        "recipe_prep": "Bater no liquidificador..."
      }
    },
    {
      "id": "uuid",
      "checkin_id": "uuid",
      "product_id": null,
      "is_completed": false,
      "exercise_prescription": {
        "id": "uuid",
        "exercise_id": "uuid",
        "sets": 3,
        "reps": "12 a 15",
        "rest_time": 60,
        "exercise": {
          "id": "uuid",
          "name": "Alongamento Suave",
          "description": "Exercícios de alongamento",
          "difficulty": "easy"
        }
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

### Daily Goals (Plano Diário)

#### `GET /daily-goals`
Retorna todo o plano do dia atual do usuário, incluindo produtos (comidas/bebidas) e exercícios com suas prescrições.

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
    "product_id": "uuid",
    "is_completed": false,
    "product": {
      "id": "uuid",
      "name": "Smoothie de Banana e Aveia",
      "description": "Rico em fibras e potássio",
      "moment_of_day": "Desayuno",
      "benefits": "Ajuda na digestão",
      "recipe_prep": "Bater no liquidificador..."
    },
    "exercise_prescription": null
  },
  {
    "id": "uuid",
    "checkin_id": "uuid",
    "product_id": null,
    "is_completed": false,
    "product": null,
    "exercise_prescription": {
      "id": "uuid",
      "exercise_id": "uuid",
      "sets": 3,
      "reps": "12 a 15",
      "rest_time": 60,
      "observations": "Fazer com cuidado",
      "exercise": {
        "id": "uuid",
        "name": "Alongamento Suave",
        "description": "Exercícios de alongamento",
        "difficulty": "easy",
        "video_url": "https://example.com/videos/alongamento.mp4"
      }
    }
  }
]
```

**Nota:** 
- Se `product_id` não é `null` → é um produto (comida/bebida)
- Se `product_id` é `null` e `exercise_prescription` não é `null` → é um exercício

#### `PATCH /daily-goals/:id`
Atualiza o status de conclusão de um item do plano (produto ou exercício).

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
  "product_id": "uuid",
  "is_completed": true
}
```

## 📝 Regras de Negócio

### R1: Fluxo de Registro Diário
- Ao criar um check-in com um `pain_state_id`, o sistema:
  - Busca produtos (comidas/bebidas) vinculados ao estado de dor
  - Busca exercícios vinculados ao estado de dor
  - Cria instâncias de produtos na tabela `user_daily_plan`
  - Cria instâncias de exercícios na tabela `user_daily_plan` com suas prescrições em `exercise_prescriptions`
- Se já existir um check-in para o dia, retorna o existente

### R2: Botão de Reset
- Ao deletar o check-in do dia, todos os itens do plano (produtos e exercícios) e prescrições são removidos automaticamente (cascata)
- O usuário pode criar um novo check-in após o reset

### R3: Persistência de Dados
- Os itens do plano do dia são "congelados" - mesmo que os produtos ou exercícios sejam alterados na biblioteca, os itens já gerados permanecem intactos

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

### Fluxo recomendado para subir o backend com Docker

Use estes comandos na raiz do projeto:

```bash
# 1) Derrubar qualquer stack existente
docker compose down

# 2) Rebuild da imagem do app (garante dependências atualizadas)
docker compose build app

# 3) Subir MySQL + app em background
docker compose up -d

# 4) Rodar setup/seed do banco dentro do container do app
docker compose exec app npm run setup:db
```

Após isso, a API estará disponível em `http://localhost:3000` e o Swagger em `http://localhost:3000/api`.

## 🔐 Segurança

⚠️ **Nota:** Atualmente, os endpoints que requerem autenticação estão usando um header temporário `user-id`. Para produção, é necessário implementar autenticação JWT completa.

## 📚 Documentação de Integração

Para integração com frontend, consulte a [Documentação de Integração](./docs/INTEGRATION.md) completa, que inclui:

- Exemplos de código para React, Vue.js e outras frameworks
- Modelos de dados TypeScript
- Fluxo completo de integração
- Tratamento de erros
- Dicas de implementação

## 📄 Licença

MIT License - Copyright (c) 2026 José Eduardo Martins
