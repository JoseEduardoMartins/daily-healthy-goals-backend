# Diagrama de Relacionamento de Classes - Daily Healthy Goals

## Diagrama de Banco de Dados

```sql
// 1. Perfil do Usuário
Table users {
  id           varchar(36) [pk]
  name         varchar(300) [not null]
  email        varchar(300) [not null, unique]
  password     varchar(255) [not null]
  weight       float [not null]
  height       float [not null]
  user_type_id varchar(36) [null, ref: > user_types.id]
  plan_id      varchar(36) [null, ref: > plans.id]
  created_at   datetime [default: `now()`]
}

// 2. Tipos de Usuário e Planos (Controle de Acesso)
Table user_types {
  id          varchar(36) [pk]
  name        varchar(100) [not null, unique]
  description text
}

Table plans {
  id          varchar(36) [pk]
  name        varchar(100) [not null, unique]
  level       varchar(50) [not null]
  description text
  price       decimal(10, 2)
  is_active   boolean [default: true]
}

// 3. Classificações
Table categories {
  id        varchar(36) [pk]
  name      varchar(300) [not null]
  image_url text
  type      enum('diet', 'exercise') [not null]
}

Table pain_states {
  id   varchar(36) [pk]
  name varchar(100) [not null]
}

// 4. Biblioteca: Comidas/Produtos
Table products {
  id            varchar(36) [pk]
  category_id   varchar(36) [ref: > categories.id]
  pain_state_id varchar(36) [ref: > pain_states.id]
  name          varchar(300) [not null]
  description   text
  image_url     text
  moment_of_day varchar(100)
  benefits      text
  recipe_prep   text
  user_type_id  varchar(36) [null, ref: > user_types.id]
  plan_id       varchar(36) [null, ref: > plans.id]
  is_active     boolean [default: true]
}

// 5. Biblioteca: Exercícios
Table exercise {
  id            varchar(36) [pk]
  category_id   varchar(36) [ref: > categories.id]
  pain_state_id varchar(36) [ref: > pain_states.id]
  name          varchar(300) [not null]
  description   text
  image_url     text
  video_url     text
  difficulty    enum('easy', 'medium', 'hard')
  user_type_id  varchar(36) [null, ref: > user_types.id]
  plan_id       varchar(36) [null, ref: > plans.id]
}

// 6. Ingredientes (Comida)
Table ingredients {
  id   varchar(36) [pk]
  name varchar(300)
  unit enum('g', 'kg', 'ml', 'L', 'un')
}

Table product_ingredients {
  id                varchar(36) [pk]
  product_id        varchar(36) [ref: > products.id]
  ingredient_id     varchar(36) [ref: > ingredients.id]
  units             int
  quantity_per_unit int
}

// 7. Registro Diário e Plano Gerado
Table daily_checkins {
  id            varchar(36) [pk]
  user_id       varchar(36) [ref: > users.id]
  pain_state_id varchar(36) [ref: > pain_states.id]
  checkin_date  date [default: `now()`]
}

Table user_daily_plan {
  id           varchar(36) [pk]
  checkin_id   varchar(36) [ref: > daily_checkins.id]
  product_id   varchar(36) [null, ref: > products.id]
  is_completed boolean [default: false]
}

// 8. TABELA AUXILIAR: Detalhes dinâmicos da prescrição do exercício
Table exercise_prescriptions {
  id           varchar(36) [pk]
  plan_id      varchar(36) [unique, ref: > user_daily_plan.id]
  exercise_id  varchar(36) [null, ref: > exercise.id]
  sets         int [not null]         // ex: 3
  reps         varchar(50) [not null] // ex: "12 a 15"
  rest_time    int                    // ex: 60 (segundos)
  observations text
}
```

## Relacionamentos Principais

### Controle de Acesso
- **users** → **user_types**: Um usuário pode ter um tipo (admin, visitante, pagante)
- **users** → **plans**: Um usuário pode ter um plano (bronze, silver, gold, etc.)
- **products** → **user_types**: Produtos podem ser restritos a um tipo de usuário
- **products** → **plans**: Produtos podem ser restritos a um plano específico
- **exercise** → **user_types**: Exercícios podem ser restritos a um tipo de usuário
- **exercise** → **plans**: Exercícios podem ser restritos a um plano específico

### Classificações
- **categories** → **products**: Uma categoria pode ter múltiplos produtos
- **categories** → **exercise**: Uma categoria pode ter múltiplos exercícios
- **pain_states** → **products**: Um estado de dor pode ter múltiplos produtos
- **pain_states** → **exercise**: Um estado de dor pode ter múltiplos exercícios
- **pain_states** → **daily_checkins**: Um check-in está vinculado a um estado de dor

### Biblioteca de Conteúdo
- **products** → **product_ingredients**: Um produto pode ter múltiplos ingredientes
- **ingredients** → **product_ingredients**: Um ingrediente pode estar em múltiplos produtos

### Fluxo Diário
- **users** → **daily_checkins**: Um usuário pode ter múltiplos check-ins
- **daily_checkins** → **user_daily_plan**: Um check-in gera múltiplos itens no plano
- **products** → **user_daily_plan**: Um produto pode estar em múltiplos planos
- **user_daily_plan** → **exercise_prescriptions**: Um item do plano pode ter uma prescrição de exercício
- **exercise** → **exercise_prescriptions**: Um exercício pode ter múltiplas prescrições

## Regras de Negócio

### Controle de Acesso
- **Admin**: Acesso total a todos os recursos
- **Visitante**: Acesso apenas a recursos públicos (user_type_id = null, plan_id = null) ou recursos específicos de visitante
- **Pagante**: Acesso a recursos públicos + recursos de visitante + recursos do seu plano

### Valores NULL em Controle de Acesso
- Se `user_type_id` e `plan_id` forem `NULL` em `products` ou `exercise`, o recurso é **público** (acessível por todos)
- Se `user_type_id` for definido, o recurso é restrito àquele tipo de usuário
- Se `plan_id` for definido, o recurso é restrito àquele plano

### Fluxo Diário
- Um usuário pode ter apenas um check-in por dia
- Ao criar um check-in, o sistema busca produtos e exercícios baseados no `pain_state_id`
- Os produtos e exercícios são filtrados automaticamente baseado no tipo de usuário e plano
- Os itens do plano são "congelados" - mesmo que o produto/exercício seja alterado na biblioteca, o item do plano permanece intacto
