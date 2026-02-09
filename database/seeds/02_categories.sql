-- Seed: Categories
SET NAMES utf8mb4;
-- Categorias de produtos (diet) e exercícios (exercise)
-- MySQL 8.0+ suporta UUID() nativamente

-- Categorias de Alimentação (Diet)
INSERT INTO categories (id, name, image_url, type)
SELECT UUID(), 'Bebidas', NULL, 'diet'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Bebidas' AND type = 'diet');

INSERT INTO categories (id, name, image_url, type)
SELECT UUID(), 'Comidas', NULL, 'diet'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Comidas' AND type = 'diet');

INSERT INTO categories (id, name, image_url, type)
SELECT UUID(), 'Proteínas', NULL, 'diet'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Proteínas' AND type = 'diet');

INSERT INTO categories (id, name, image_url, type)
SELECT UUID(), 'Frutas', NULL, 'diet'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Frutas' AND type = 'diet');

INSERT INTO categories (id, name, image_url, type)
SELECT UUID(), 'Vegetais', NULL, 'diet'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Vegetais' AND type = 'diet');

-- Categorias de Exercícios (Exercise)
INSERT INTO categories (id, name, image_url, type)
SELECT UUID(), 'Cardio', NULL, 'exercise'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Cardio' AND type = 'exercise');

INSERT INTO categories (id, name, image_url, type)
SELECT UUID(), 'Força', NULL, 'exercise'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Força' AND type = 'exercise');

INSERT INTO categories (id, name, image_url, type)
SELECT UUID(), 'Flexibilidade', NULL, 'exercise'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Flexibilidade' AND type = 'exercise');

INSERT INTO categories (id, name, image_url, type)
SELECT UUID(), 'Relaxamento', NULL, 'exercise'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Relaxamento' AND type = 'exercise');
