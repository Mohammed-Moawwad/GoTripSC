-- ====================================
-- Fix User Table for Auto-Increment ID
-- ====================================
-- This script modifies the users table to use auto-increment integer IDs

USE gotrip_db;

-- Step 1: Drop the existing users table (if you want to start fresh)
-- WARNING: This will delete all existing user data!
-- If you have important data, backup first!
DROP TABLE IF EXISTS users;

-- Step 2: Create users table with auto-increment ID
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,    -- Auto-incrementing ID
    first_name VARCHAR(50) NOT NULL,           -- User's first name
    last_name VARCHAR(50) NOT NULL,            -- User's last name
    email VARCHAR(100) UNIQUE NOT NULL,        -- Email (must be unique)
    phone VARCHAR(20),                         -- Phone number
    birth_date DATE,                           -- Date of birth
    password_hash VARCHAR(255) NOT NULL,       -- Encrypted password
    registered_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- When they signed up
    last_login TIMESTAMP NULL,                 -- Last time they logged in
    status ENUM('Active', 'InActive') DEFAULT 'Active',   -- Account status
    role ENUM('user', 'admin') DEFAULT 'user'  -- User role (normal user or admin)
);

-- Step 3: Create an admin user (optional)
-- Password: Admin!123 (hashed with bcrypt)
-- You can login with: Admin@gmail.com / Admin!123
INSERT INTO users (first_name, last_name, email, password_hash, status, role)
VALUES (
    'Admin',
    'User',
    'Admin@gmail.com',
    '$2a$10$YourHashedPasswordHere',  -- This needs to be replaced with actual bcrypt hash
    'Active',
    'admin'
);

-- Verify the table structure
DESCRIBE users;

-- Check if table is empty
SELECT COUNT(*) as user_count FROM users;

-- ====================================
-- INSTRUCTIONS:
-- ====================================
-- 1. Open MySQL Workbench
-- 2. Connect to your database
-- 3. Copy and paste this entire script
-- 4. Click the lightning bolt icon to execute
-- 5. Refresh your schemas
-- 6. Try signing up again through the website
-- ====================================
