-- Seed: Users
-- Usuários iniciais do sistema

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
