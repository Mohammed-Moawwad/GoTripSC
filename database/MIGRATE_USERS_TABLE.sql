-- ====================================
-- SAFE Migration: Fix Users Table
-- ====================================
-- This script safely migrates users table to use auto-increment ID

USE gotrip_db;

-- Step 1: Check current users (for reference)
SELECT 'Current users in table:' as info;
SELECT * FROM users;

-- Step 2: Create backup of users table
CREATE TABLE IF NOT EXISTS users_backup AS SELECT * FROM users;
SELECT 'Backup created!' as info;

-- Step 3: Drop foreign key constraints (if any)
-- Check hotel_bookings for foreign key
SET FOREIGN_KEY_CHECKS = 0;

-- Step 4: Drop the old users table
DROP TABLE IF EXISTS users;

-- Step 5: Create new users table with AUTO_INCREMENT
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

SELECT 'New users table created with AUTO_INCREMENT!' as info;

-- Step 6: Migrate old data if backup has records
-- Note: This is optional - only if you had existing users
-- INSERT INTO users (first_name, last_name, email, phone, birth_date, password_hash, status, role)
-- SELECT first_name, last_name, email, phone, birth_date, password_hash, status, role 
-- FROM users_backup;

-- Step 7: Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Step 8: Verify the new structure
DESCRIBE users;

-- Step 9: Test the AUTO_INCREMENT by checking next ID
SELECT AUTO_INCREMENT 
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'gotrip_db' 
AND TABLE_NAME = 'users';

SELECT 'Migration complete! user_id is now AUTO_INCREMENT' as status;
SELECT 'You can now signup through the website!' as message;

-- ====================================
-- INSTRUCTIONS:
-- ====================================
-- 1. Open MySQL Workbench
-- 2. Connect to your database (localhost:3306)
-- 3. Copy this entire script
-- 4. Paste into a new SQL tab
-- 5. Click Execute (lightning bolt icon)
-- 6. Check for any errors in the output
-- 7. Restart your Node.js server: npm start
-- 8. Try signing up again!
-- ====================================
