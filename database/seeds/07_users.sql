-- Seed: Users
-- Usuários iniciais do sistema para testes

-- Usuário Admin
-- Email: admin@dailyhealthygoals.com
-- Senha: admin123
INSERT INTO users (id, name, email, password, weight, height, user_type_id, plan_id)
SELECT 
  UUID(),
  'Administrador',
  'admin@dailyhealthygoals.com',
  '$2b$10$pQ0zQxtm2LAQ9F21xV/xWOWBxIZ/dRSKaNxDgmcbNp.J2ZowuXCXC', -- senha: admin123
  75.0,
  1.75,
  (SELECT id FROM user_types WHERE name = 'admin' LIMIT 1),
  NULL
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@dailyhealthygoals.com');

-- Usuário Visitante
-- Email: visitante@dailyhealthygoals.com
-- Senha: visitante123
INSERT INTO users (id, name, email, password, weight, height, user_type_id, plan_id)
SELECT 
  UUID(),
  'Usuário Visitante',
  'visitante@dailyhealthygoals.com',
  '$2b$10$xvbmAwl4TmwkQZPznWzV8eNN0LmaSJi9x414Vb17LvZURzqe/lLKS', -- senha: visitante123
  70.0,
  1.70,
  (SELECT id FROM user_types WHERE name = 'visitante' LIMIT 1),
  NULL
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'visitante@dailyhealthygoals.com');

-- Usuário Plano Bronze
-- Email: bronze@dailyhealthygoals.com
-- Senha: bronze123
INSERT INTO users (id, name, email, password, weight, height, user_type_id, plan_id)
SELECT 
  UUID(),
  'Usuário Bronze',
  'bronze@dailyhealthygoals.com',
  '$2b$10$LXG9kI0KgoS3qya59rMuFOZflnYn6od4HCkSlCIEc8Dv/kePxGLTi', -- senha: bronze123
  72.0,
  1.72,
  (SELECT id FROM user_types WHERE name = 'pagante' LIMIT 1),
  (SELECT id FROM plans WHERE level = 'bronze' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'bronze@dailyhealthygoals.com');

-- Usuário Plano Prata
-- Email: prata@dailyhealthygoals.com
-- Senha: prata123
INSERT INTO users (id, name, email, password, weight, height, user_type_id, plan_id)
SELECT 
  UUID(),
  'Usuário Prata',
  'prata@dailyhealthygoals.com',
  '$2b$10$epp7oem10UrHpAYQLjIJgenAS/wbP.G4d98wv3wjqRtbl/8.4M3Ae', -- senha: prata123
  73.0,
  1.73,
  (SELECT id FROM user_types WHERE name = 'pagante' LIMIT 1),
  (SELECT id FROM plans WHERE level = 'prata' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'prata@dailyhealthygoals.com');

-- Usuário Plano Ouro
-- Email: ouro@dailyhealthygoals.com
-- Senha: ouro123
INSERT INTO users (id, name, email, password, weight, height, user_type_id, plan_id)
SELECT 
  UUID(),
  'Usuário Ouro',
  'ouro@dailyhealthygoals.com',
  '$2b$10$1uuOCZVal1bzNXmyqT4Dfuk3mHWGee150ftbbcLTLSn8vxWDvhYPS', -- senha: ouro123
  74.0,
  1.74,
  (SELECT id FROM user_types WHERE name = 'pagante' LIMIT 1),
  (SELECT id FROM plans WHERE level = 'ouro' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'ouro@dailyhealthygoals.com');
