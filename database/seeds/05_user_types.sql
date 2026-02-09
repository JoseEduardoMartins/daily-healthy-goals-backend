-- Seed: User Types
SET NAMES utf8mb4;
-- Tipos de usuário do sistema

INSERT INTO user_types (id, name, description)
SELECT UUID(), 'admin', 'Administrador com acesso total ao sistema'
WHERE NOT EXISTS (SELECT 1 FROM user_types WHERE name = 'admin');

INSERT INTO user_types (id, name, description)
SELECT UUID(), 'visitante', 'Usuário visitante com acesso limitado'
WHERE NOT EXISTS (SELECT 1 FROM user_types WHERE name = 'visitante');

INSERT INTO user_types (id, name, description)
SELECT UUID(), 'pagante', 'Usuário pagante com acesso a planos'
WHERE NOT EXISTS (SELECT 1 FROM user_types WHERE name = 'pagante');
