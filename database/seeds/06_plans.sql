-- Seed: Plans
-- Planos do sistema
-- IMPORTANTE: Execute este arquivo com charset UTF-8: mysql --default-character-set=utf8mb4

SET NAMES utf8mb4;

-- Plano Bronze
INSERT INTO plans (id, name, level, description, price, is_active)
SELECT UUID(), 'Bronze', 'bronze', 'Plano Bronze - Acesso básico', 29.90, TRUE
WHERE NOT EXISTS (SELECT 1 FROM plans WHERE level = 'bronze');

-- Plano Prata
INSERT INTO plans (id, name, level, description, price, is_active)
SELECT UUID(), 'Prata', 'prata', 'Plano Prata - Acesso intermediário', 59.90, TRUE
WHERE NOT EXISTS (SELECT 1 FROM plans WHERE level = 'prata');

-- Plano Ouro
INSERT INTO plans (id, name, level, description, price, is_active)
SELECT UUID(), 'Ouro', 'ouro', 'Plano Ouro - Acesso avançado', 99.90, TRUE
WHERE NOT EXISTS (SELECT 1 FROM plans WHERE level = 'ouro');
