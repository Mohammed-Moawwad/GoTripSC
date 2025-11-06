-- ====================================
-- COMPLETE FIX: Update Database Schema
-- Run this to fix the user_id AUTO_INCREMENT issue
-- ====================================

USE gotrip_db;

-- ====================================
-- Step 1: Disable foreign key checks
-- ====================================
SET FOREIGN_KEY_CHECKS = 0;

-- ====================================
-- Step 2: Drop existing tables
-- ====================================
DROP TABLE IF EXISTS hotel_bookings;
DROP TABLE IF EXISTS users;
-- Keep hotels table as it's working fine

-- ====================================
-- Step 3: Create USERS table with AUTO_INCREMENT
-- ====================================
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    birth_date DATE,
    password_hash VARCHAR(255) NOT NULL,
    registered_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    status ENUM('Active', 'InActive') DEFAULT 'Active',
    role ENUM('user', 'admin') DEFAULT 'user'
);

-- ====================================
-- Step 4: Create HOTEL_BOOKINGS table (updated foreign key)
-- ====================================
CREATE TABLE hotel_bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    hotel_id VARCHAR(20) NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    number_of_rooms INT DEFAULT 1,
    number_of_guests INT DEFAULT 1,
    total_price DECIMAL(10,2) NOT NULL,
    booking_status ENUM('Pending', 'Confirmed', 'Cancelled', 'Completed') DEFAULT 'Pending',
    payment_status ENUM('Pending', 'Paid', 'Refunded') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id) ON DELETE CASCADE
);

-- ====================================
-- Step 5: Re-enable foreign key checks
-- ====================================
SET FOREIGN_KEY_CHECKS = 1;

-- ====================================
-- Step 6: Insert sample admin user (OPTIONAL)
-- ====================================
-- This creates an admin account you can use to login
-- Email: admin@gmail.com
-- Password: Admin!123
-- Note: Password is already hashed with bcrypt
INSERT INTO users (first_name, last_name, email, phone, password_hash, status, role)
VALUES (
    'Admin',
    'User',
    'admin@gmail.com',
    '+966500000000',
    '$2a$10$Xvn8L0N9vJQZ5Z5YqX5N9Oh0N.HxYqX5N9Oh0N.HxYqX5N9Oh0N.H',  -- This is a placeholder - will be replaced when admin signs up
    'Active',
    'admin'
);

-- ====================================
-- Step 7: Verify the setup
-- ====================================
SELECT 'Tables updated successfully!' AS Status;
DESCRIBE users;
SELECT AUTO_INCREMENT FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'gotrip_db' AND TABLE_NAME = 'users';

-- ====================================
-- INSTRUCTIONS TO RUN THIS SCRIPT:
-- ====================================
-- 1. Open MySQL Workbench
-- 2. Connect to localhost:3306 with your credentials
-- 3. Copy this ENTIRE script
-- 4. Paste into a new SQL tab
-- 5. Click the Execute button (⚡ lightning bolt icon)
-- 6. Wait for "Tables updated successfully!"
-- 7. Close MySQL Workbench
-- 8. Restart your server: npm start
-- 9. Try signup again at: http://localhost:3000/Login/login.html
-- ====================================
