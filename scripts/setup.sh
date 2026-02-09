#!/bin/bash

# Daily Healthy Goals - Database Setup Script
# Este script configura o banco de dados, executa migrations e seeds

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Load environment variables
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# Database configuration
DB_HOST=${DB_HOST:-localhost}
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
  mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USERNAME" -p"$DB_PASSWORD" --default-character-set=utf8mb4 < "$file"
  
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ $description completed${NC}"
  else
    echo -e "${RED}✗ Error executing $description${NC}"
    exit 1
  fi
}

# Step 1: Create database and schema
echo -e "${YELLOW}Step 1: Creating database schema...${NC}"
execute_sql_file "database/schema.sql" "Database schema"

# Step 2: Run migrations (if any)
if [ -d "database/migrations" ] && [ "$(ls -A database/migrations/*.sql 2>/dev/null)" ]; then
  echo ""
  echo -e "${YELLOW}Step 2: Running migrations...${NC}"
  for migration in database/migrations/*.sql; do
    if [ -f "$migration" ]; then
      execute_sql_file "$migration" "Migration: $(basename $migration)"
    fi
  done
else
  echo -e "${YELLOW}Step 2: No migrations found. Skipping...${NC}"
fi

# Step 3: Run seeds
if [ -d "database/seeds" ] && [ "$(ls -A database/seeds/*.sql 2>/dev/null)" ]; then
  echo ""
  echo -e "${YELLOW}Step 3: Running seeds...${NC}"
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
