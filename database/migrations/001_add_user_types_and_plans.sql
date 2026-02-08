-- Migration: Add User Types and Plans
-- Adiciona tabelas de tipos de usuário e planos, e relacionamentos

-- Table: user_types
CREATE TABLE IF NOT EXISTS user_types (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: plans
CREATE TABLE IF NOT EXISTS plans (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  level VARCHAR(50) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  is_active BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Adicionar colunas em users (verifica se já existem)
SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
  WHERE TABLE_SCHEMA = DATABASE() 
  AND TABLE_NAME = 'users' 
  AND COLUMN_NAME = 'user_type_id');
SET @sql = IF(@col_exists = 0, 
  'ALTER TABLE users ADD COLUMN user_type_id VARCHAR(36) NULL', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
  WHERE TABLE_SCHEMA = DATABASE() 
  AND TABLE_NAME = 'users' 
  AND COLUMN_NAME = 'plan_id');
SET @sql = IF(@col_exists = 0, 
  'ALTER TABLE users ADD COLUMN plan_id VARCHAR(36) NULL', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Adicionar foreign keys em users
SET @fk_exists = (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS 
  WHERE CONSTRAINT_SCHEMA = DATABASE() 
  AND TABLE_NAME = 'users' 
  AND CONSTRAINT_NAME = 'users_ibfk_1');
SET @sql = IF(@fk_exists = 0, 
  'ALTER TABLE users ADD CONSTRAINT users_ibfk_1 FOREIGN KEY (user_type_id) REFERENCES user_types(id) ON DELETE SET NULL', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @fk_exists = (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS 
  WHERE CONSTRAINT_SCHEMA = DATABASE() 
  AND TABLE_NAME = 'users' 
  AND CONSTRAINT_NAME = 'users_ibfk_2');
SET @sql = IF(@fk_exists = 0, 
  'ALTER TABLE users ADD CONSTRAINT users_ibfk_2 FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE SET NULL', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Adicionar colunas em products
SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
  WHERE TABLE_SCHEMA = DATABASE() 
  AND TABLE_NAME = 'products' 
  AND COLUMN_NAME = 'user_type_id');
SET @sql = IF(@col_exists = 0, 
  'ALTER TABLE products ADD COLUMN user_type_id VARCHAR(36) NULL', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
  WHERE TABLE_SCHEMA = DATABASE() 
  AND TABLE_NAME = 'products' 
  AND COLUMN_NAME = 'plan_id');
SET @sql = IF(@col_exists = 0, 
  'ALTER TABLE products ADD COLUMN plan_id VARCHAR(36) NULL', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Adicionar foreign keys em products
SET @fk_exists = (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS 
  WHERE CONSTRAINT_SCHEMA = DATABASE() 
  AND TABLE_NAME = 'products' 
  AND CONSTRAINT_NAME = 'products_ibfk_user_type');
SET @sql = IF(@fk_exists = 0, 
  'ALTER TABLE products ADD CONSTRAINT products_ibfk_user_type FOREIGN KEY (user_type_id) REFERENCES user_types(id) ON DELETE SET NULL', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @fk_exists = (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS 
  WHERE CONSTRAINT_SCHEMA = DATABASE() 
  AND TABLE_NAME = 'products' 
  AND CONSTRAINT_NAME = 'products_ibfk_plan');
SET @sql = IF(@fk_exists = 0, 
  'ALTER TABLE products ADD CONSTRAINT products_ibfk_plan FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE SET NULL', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Adicionar colunas em exercise
SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
  WHERE TABLE_SCHEMA = DATABASE() 
  AND TABLE_NAME = 'exercise' 
  AND COLUMN_NAME = 'user_type_id');
SET @sql = IF(@col_exists = 0, 
  'ALTER TABLE exercise ADD COLUMN user_type_id VARCHAR(36) NULL', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
  WHERE TABLE_SCHEMA = DATABASE() 
  AND TABLE_NAME = 'exercise' 
  AND COLUMN_NAME = 'plan_id');
SET @sql = IF(@col_exists = 0, 
  'ALTER TABLE exercise ADD COLUMN plan_id VARCHAR(36) NULL', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Adicionar foreign keys em exercise
SET @fk_exists = (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS 
  WHERE CONSTRAINT_SCHEMA = DATABASE() 
  AND TABLE_NAME = 'exercise' 
  AND CONSTRAINT_NAME = 'exercise_ibfk_user_type');
SET @sql = IF(@fk_exists = 0, 
  'ALTER TABLE exercise ADD CONSTRAINT exercise_ibfk_user_type FOREIGN KEY (user_type_id) REFERENCES user_types(id) ON DELETE SET NULL', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @fk_exists = (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS 
  WHERE CONSTRAINT_SCHEMA = DATABASE() 
  AND TABLE_NAME = 'exercise' 
  AND CONSTRAINT_NAME = 'exercise_ibfk_plan');
SET @sql = IF(@fk_exists = 0, 
  'ALTER TABLE exercise ADD CONSTRAINT exercise_ibfk_plan FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE SET NULL', 
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Indexes (se não existirem)
CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type_id);
CREATE INDEX IF NOT EXISTS idx_users_plan ON users(plan_id);
CREATE INDEX IF NOT EXISTS idx_products_user_type ON products(user_type_id);
CREATE INDEX IF NOT EXISTS idx_products_plan ON products(plan_id);
CREATE INDEX IF NOT EXISTS idx_exercise_user_type ON exercise(user_type_id);
CREATE INDEX IF NOT EXISTS idx_exercise_plan ON exercise(plan_id);
