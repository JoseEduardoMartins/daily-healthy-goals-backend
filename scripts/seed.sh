#!/bin/bash

# Daily Healthy Goals - Database Setup Script
# Este script configura o banco de dados, executa migrations e seeds

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Load environment variables APENAS se DB_HOST não estiver definido.
# Isso evita sobrescrever as variáveis do Docker Compose dentro do container.
if [ -z "$DB_HOST" ] && [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Database configuration
DB_HOST=${DB_HOST:-127.0.0.1}
DB_PORT=${DB_PORT:-3308}
DB_USERNAME=${DB_USERNAME:-app_user}
DB_PASSWORD=${DB_PASSWORD:-app_password}
DB_DATABASE=${DB_DATABASE:-daily_healthy_goals}

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Daily Healthy Goals - Database Setup${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Check if MySQL client is available
if ! command -v mysql &> /dev/null; then
  echo -e "${RED}Error: mysql client not found. Please install MySQL client.${NC}"
  exit 1
fi

# Function to execute SQL file
execute_sql_file() {
  local file=$1
  local description=$2
  
  if [ ! -f "$file" ]; then
    echo -e "${YELLOW}Warning: File $file not found. Skipping...${NC}"
    return
  fi
  
  echo -e "${GREEN}Executing: $description${NC}"
  if [ "$file" = "database/schema.sql" ]; then
    # Para o schema, deixamos o próprio arquivo criar/selecionar o banco
    mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USERNAME" -p"$DB_PASSWORD" \
      --default-character-set=utf8mb4 \
      --ssl=0 \
      < "$file"
  else
    # Para migrations e seeds, conectamos direto no banco configurado
    mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USERNAME" -p"$DB_PASSWORD" \
      --default-character-set=utf8mb4 \
      --ssl=0 \
      "$DB_DATABASE" \
      < "$file"
  fi
  
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ $description completed${NC}"
  else
    echo -e "${RED}✗ Error executing $description${NC}"
    exit 1
  fi
}

# Step 0: aguardar o schema existir (TypeORM synchronize ao subir a app)
# Após "docker compose up -d", a app pode levar alguns segundos para criar as tabelas
echo ""
echo -e "${YELLOW}Step 0: Waiting for schema (TypeORM)...${NC}"
MAX_ATTEMPTS=40
for i in $(seq 1 $MAX_ATTEMPTS); do
  if mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USERNAME" -p"$DB_PASSWORD" \
    --default-character-set=utf8mb4 --ssl=0 -N -e \
    "SELECT 1 FROM information_schema.tables WHERE table_schema = '$DB_DATABASE' AND table_name = 'users' LIMIT 1" \
    "$DB_DATABASE" 2>/dev/null | grep -q 1; then
    echo -e "${GREEN}✓ Schema ready${NC}"
    break
  fi
  if [ "$i" -eq "$MAX_ATTEMPTS" ]; then
    echo -e "${RED}Timeout: schema not found. Ensure the app has started (e.g. 'docker compose up -d' and wait ~30s), then run seed again.${NC}"
    exit 1
  fi
  echo "  Waiting for schema... ($i/$MAX_ATTEMPTS)"
  sleep 3
done

# Step 1: rodar seeds (schema e migrations são responsabilidade do TypeORM em dev)
if [ -d "database/seeds" ] && [ "$(ls -A database/seeds/*.sql 2>/dev/null)" ]; then
  echo ""
  echo -e "${YELLOW}Step 1: Running seeds...${NC}"
  for seed in database/seeds/*.sql; do
    if [ -f "$seed" ]; then
      execute_sql_file "$seed" "Seed: $(basename $seed)"
    fi
  done
else
  echo -e "${YELLOW}Step 3: No seeds found. Skipping...${NC}"
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Database setup completed successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
