-- Daily Healthy Goals Database Schema
-- MySQL 8.0+

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS daily_healthy_goals CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE daily_healthy_goals;

-- Table: users
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(300) NOT NULL,
  email VARCHAR(300) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  weight FLOAT NOT NULL,
  height FLOAT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: pain_states
CREATE TABLE IF NOT EXISTS pain_states (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: categories
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(300) NOT NULL,
  image_url TEXT,
  type ENUM('diet', 'exercise') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: products
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(36) PRIMARY KEY,
  category_id VARCHAR(36) NOT NULL,
  pain_state_id VARCHAR(36) NOT NULL,
  name VARCHAR(300) NOT NULL,
  description TEXT,
  image_url TEXT,
  moment_of_day VARCHAR(100),
  benefits TEXT,
  recipe_prep TEXT,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  FOREIGN KEY (pain_state_id) REFERENCES pain_states(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: exercise
CREATE TABLE IF NOT EXISTS exercise (
  id VARCHAR(36) PRIMARY KEY,
  category_id VARCHAR(36) NOT NULL,
  pain_state_id VARCHAR(36) NOT NULL,
  name VARCHAR(300) NOT NULL,
  description TEXT,
  image_url TEXT,
  video_url TEXT,
  difficulty ENUM('easy', 'medium', 'hard'),
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  FOREIGN KEY (pain_state_id) REFERENCES pain_states(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: ingredients
CREATE TABLE IF NOT EXISTS ingredients (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(300),
  unit ENUM('g', 'kg', 'ml', 'L', 'un')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: product_ingredients
CREATE TABLE IF NOT EXISTS product_ingredients (
  id VARCHAR(36) PRIMARY KEY,
  product_id VARCHAR(36) NOT NULL,
  ingredient_id VARCHAR(36) NOT NULL,
  units INT,
  quantity_per_unit INT,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: daily_checkins
CREATE TABLE IF NOT EXISTS daily_checkins (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  pain_state_id VARCHAR(36) NOT NULL,
  checkin_date DATE DEFAULT (CURDATE()),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (pain_state_id) REFERENCES pain_states(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: user_daily_plan
CREATE TABLE IF NOT EXISTS user_daily_plan (
  id VARCHAR(36) PRIMARY KEY,
  checkin_id VARCHAR(36) NOT NULL,
  product_id VARCHAR(36),
  is_completed BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (checkin_id) REFERENCES daily_checkins(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: exercise_prescriptions
CREATE TABLE IF NOT EXISTS exercise_prescriptions (
  id VARCHAR(36) PRIMARY KEY,
  plan_id VARCHAR(36) UNIQUE NOT NULL,
  exercise_id VARCHAR(36),
  sets INT NOT NULL,
  reps VARCHAR(50) NOT NULL,
  rest_time INT,
  observations TEXT,
  FOREIGN KEY (plan_id) REFERENCES user_daily_plan(id) ON DELETE CASCADE,
  FOREIGN KEY (exercise_id) REFERENCES exercise(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes for better performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_pain_state ON products(pain_state_id);
CREATE INDEX idx_exercise_category ON exercise(category_id);
CREATE INDEX idx_exercise_pain_state ON exercise(pain_state_id);
CREATE INDEX idx_daily_checkins_user ON daily_checkins(user_id);
CREATE INDEX idx_daily_checkins_date ON daily_checkins(checkin_date);
CREATE INDEX idx_user_daily_plan_checkin ON user_daily_plan(checkin_id);
