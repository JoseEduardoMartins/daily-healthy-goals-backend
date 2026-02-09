-- Seed: Pain States
SET NAMES utf8mb4;
-- Estados de dor/humor do sistema
-- MySQL 8.0+ suporta UUID() nativamente

INSERT INTO pain_states (id, name)
SELECT UUID(), 'Com Dor'
WHERE NOT EXISTS (SELECT 1 FROM pain_states WHERE name = 'Com Dor');

INSERT INTO pain_states (id, name)
SELECT UUID(), 'Inchada'
WHERE NOT EXISTS (SELECT 1 FROM pain_states WHERE name = 'Inchada');

INSERT INTO pain_states (id, name)
SELECT UUID(), 'Normal'
WHERE NOT EXISTS (SELECT 1 FROM pain_states WHERE name = 'Normal');
