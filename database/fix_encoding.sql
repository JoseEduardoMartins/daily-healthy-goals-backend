-- Script para corrigir encoding de dados corrompidos
-- Execute com: mysql --default-character-set=utf8mb4 < fix_encoding.sql

SET NAMES utf8mb4;

-- Corrigir produtos
UPDATE products SET 
  name = CONVERT(CAST(CONVERT(name USING latin1) AS BINARY) USING utf8mb4),
  description = CONVERT(CAST(CONVERT(description USING latin1) AS BINARY) USING utf8mb4),
  benefits = CONVERT(CAST(CONVERT(benefits USING latin1) AS BINARY) USING utf8mb4),
  recipe_prep = CONVERT(CAST(CONVERT(recipe_prep USING latin1) AS BINARY) USING utf8mb4),
  moment_of_day = CONVERT(CAST(CONVERT(moment_of_day USING latin1) AS BINARY) USING utf8mb4)
WHERE name LIKE '%Ã%' OR description LIKE '%Ã%' OR benefits LIKE '%Ã%' OR recipe_prep LIKE '%Ã%' OR moment_of_day LIKE '%Ã%';

-- Corrigir exercícios
UPDATE exercise SET 
  name = CONVERT(CAST(CONVERT(name USING latin1) AS BINARY) USING utf8mb4),
  description = CONVERT(CAST(CONVERT(description USING latin1) AS BINARY) USING utf8mb4)
WHERE name LIKE '%Ã%' OR description LIKE '%Ã%';

-- Corrigir categorias
UPDATE categories SET 
  name = CONVERT(CAST(CONVERT(name USING latin1) AS BINARY) USING utf8mb4)
WHERE name LIKE '%Ã%';

-- Corrigir planos (caso necessário)
UPDATE plans SET 
  name = CONVERT(CAST(CONVERT(name USING latin1) AS BINARY) USING utf8mb4),
  description = CONVERT(CAST(CONVERT(description USING latin1) AS BINARY) USING utf8mb4)
WHERE name LIKE '%Ã%' OR description LIKE '%Ã%';
