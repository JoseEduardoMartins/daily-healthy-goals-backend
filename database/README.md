# Database Setup

Este diretório contém os arquivos SQL para configuração do banco de dados.

## Estrutura

```
database/
├── schema.sql              # Schema completo do banco de dados
├── migrations/            # Scripts de migração (executados em ordem)
└── seeds/                 # Scripts de seed (executados em ordem numérica)
    ├── 01_pain_states.sql
    ├── 02_categories.sql
    ├── 03_products.sql
    └── 04_exercises.sql
```

## Uso

### Opção 1: Script de Setup Automático (Recomendado)

Execute o script de setup que cria o banco, executa migrations e seeds:

```bash
npm run setup:db
# ou
./scripts/setup.sh
```

### Opção 2: Manual

1. **Criar schema:**
```bash
mysql -h localhost -P 3308 -u app_user -p app_password < database/schema.sql
```

2. **Executar seeds (em ordem):**
```bash
mysql -h localhost -P 3308 -u app_user -p app_password < database/seeds/01_pain_states.sql
mysql -h localhost -P 3308 -u app_user -p app_password < database/seeds/02_categories.sql
mysql -h localhost -P 3308 -u app_user -p app_password < database/seeds/03_products.sql
mysql -h localhost -P 3308 -u app_user -p app_password < database/seeds/04_exercises.sql
```

**Nota:** Os seeds SQL usam a função `UUID()` do MySQL 8.0+ para gerar IDs automaticamente. Certifique-se de estar usando MySQL 8.0 ou superior.

## Migrations

Para adicionar novas migrations:

1. Crie um arquivo SQL em `database/migrations/`
2. Use um prefixo numérico para ordenação: `001_description.sql`, `002_another_change.sql`
3. O script `setup.sh` executará as migrations em ordem alfabética

## Seeds

Os seeds são executados em ordem numérica (01_, 02_, etc.). Cada seed verifica se os dados já existem antes de inserir, evitando duplicatas.

**Importante:** Os seeds SQL usam subqueries para buscar IDs de tabelas relacionadas. Certifique-se de executar os seeds na ordem correta:
1. Pain States
2. Categories
3. Products (depende de Pain States e Categories)
4. Exercises (depende de Pain States e Categories)
