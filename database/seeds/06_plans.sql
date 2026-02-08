-- Seed: Plans
-- Planos do sistema (preparado para expansão futura)

INSERT INTO plans (id, name, level, description, price, is_active)
SELECT UUID(), 'Bronze', 'bronze', 'Plano Bronze - Acesso básico', 29.90, TRUE
WHERE NOT EXISTS (SELECT 1 FROM plans WHERE level = 'bronze');

-- Planos futuros (comentados para referência)
-- INSERT INTO plans (id, name, level, description, price, is_active)
-- SELECT UUID(), 'Silver', 'silver', 'Plano Silver - Acesso intermediário', 59.90, TRUE
-- WHERE NOT EXISTS (SELECT 1 FROM plans WHERE level = 'silver');

-- INSERT INTO plans (id, name, level, description, price, is_active)
-- SELECT UUID(), 'Gold', 'gold', 'Plano Gold - Acesso avançado', 99.90, TRUE
-- WHERE NOT EXISTS (SELECT 1 FROM plans WHERE level = 'gold');

-- INSERT INTO plans (id, name, level, description, price, is_active)
-- SELECT UUID(), 'Platinum', 'platinum', 'Plano Platinum - Acesso premium', 149.90, TRUE
-- WHERE NOT EXISTS (SELECT 1 FROM plans WHERE level = 'platinum');
