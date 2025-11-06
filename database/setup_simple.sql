-- ====================================
-- GoTrip Simplified Database (For Learning)
-- Only 3 Tables: Users, Hotels, Hotel Bookings
-- ====================================

-- Step 1: Create the database
CREATE DATABASE IF NOT EXISTS gotrip_db;
USE gotrip_db;

-- ====================================
-- Table 1: USERS TABLE
-- ====================================
-- This stores information about all users (customers and admins)

CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(20) PRIMARY KEY,           -- Unique ID like "USR001"
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

-- ====================================
-- Table 2: HOTELS TABLE
-- ====================================
-- This stores information about all available hotels

CREATE TABLE IF NOT EXISTS hotels (
    hotel_id VARCHAR(20) PRIMARY KEY,          -- Unique ID like "HTL001"
    hotel_name VARCHAR(100) NOT NULL,          -- Hotel name
    location VARCHAR(100) NOT NULL,            -- Location/area
    city VARCHAR(50) NOT NULL,                 -- City name
    country VARCHAR(50) NOT NULL,              -- Country
    rating DECIMAL(2,1) DEFAULT 0.0,           -- Rating out of 5.0
    price_per_night DECIMAL(10,2) NOT NULL,    -- Price per night in SAR
    total_rooms INT DEFAULT 0,                 -- Total rooms in hotel
    available_rooms INT DEFAULT 0,             -- Currently available rooms
    amenities TEXT,                            -- Hotel amenities (WiFi, Pool, etc)
    description TEXT,                          -- Hotel description
    status ENUM('Active', 'InActive') DEFAULT 'Active',  -- Is hotel active?
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP       -- When hotel was added
);

-- ====================================
-- Table 3: HOTEL BOOKINGS TABLE
-- ====================================
-- This stores all hotel reservations made by users

CREATE TABLE IF NOT EXISTS hotel_bookings (
    booking_id VARCHAR(20) PRIMARY KEY,        -- Unique booking ID like "BK001"
    user_id VARCHAR(20) NOT NULL,              -- Which user made the booking
    hotel_id VARCHAR(20) NOT NULL,             -- Which hotel was booked
    check_in_date DATE NOT NULL,               -- Check-in date
    check_out_date DATE NOT NULL,              -- Check-out date
    number_of_rooms INT DEFAULT 1,             -- How many rooms booked
    number_of_guests INT DEFAULT 1,            -- How many guests
    total_price DECIMAL(10,2) NOT NULL,        -- Total booking price
    booking_status ENUM('Pending', 'Confirmed', 'Cancelled', 'Completed') DEFAULT 'Pending',
    payment_status ENUM('Pending', 'Paid', 'Refunded') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- When booking was made
    
    -- Foreign Keys (Links to other tables)
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id) ON DELETE CASCADE
);

-- ====================================
-- INSERT SAMPLE DATA
-- ====================================

-- Sample Users
INSERT INTO users (user_id, first_name, last_name, email, phone, birth_date, password_hash, registered_date, last_login, status, role) 
VALUES 
-- Admin account (username: admin@gotrip.com, password will be: admin123)
('USR000', 'Admin', 'User', 'admin@gotrip.com', '+966 50 000 0000', '1990-01-01', 'admin123', '2024-01-01', '2025-11-04', 'Active', 'admin'),

-- Regular users
('USR001', 'John', 'Doe', 'john.doe@email.com', '+966 55 123 4567', '1990-05-15', 'password123', '2024-01-15', '2025-11-01', 'Active', 'user'),
('USR002', 'Sarah', 'Smith', 'sarah.smith@email.com', '+966 50 234 5678', '1988-08-22', 'password123', '2024-02-20', '2025-10-30', 'Active', 'user'),
('USR003', 'Ahmed', 'Hassan', 'ahmed.hassan@email.com', '+966 54 345 6789', '1992-03-10', 'password123', '2024-03-10', '2025-10-28', 'Active', 'user'),
('USR004', 'Fatima', 'Ali', 'fatima.ali@email.com', '+966 56 456 7890', '1995-11-30', 'password123', '2024-04-05', '2025-10-15', 'InActive', 'user'),
('USR005', 'Mike', 'Jones', 'mike.jones@email.com', '+966 53 567 8901', '1987-07-18', 'password123', '2024-05-12', NULL, 'InActive', 'user');

-- Sample Hotels
INSERT INTO hotels (hotel_id, hotel_name, location, city, country, rating, price_per_night, total_rooms, available_rooms, amenities, description, status) 
VALUES 
('HTL001', 'Luxury Palace Hotel', 'Downtown', 'Riyadh', 'Saudi Arabia', 4.8, 850.00, 150, 120, 'WiFi, Pool, Spa, Gym, Restaurant', 'Five-star luxury hotel in the heart of Riyadh', 'Active'),
('HTL002', 'Coastal Resort', 'Beachfront', 'Jeddah', 'Saudi Arabia', 4.5, 650.00, 100, 85, 'WiFi, Beach Access, Pool, Restaurant', 'Beautiful beachfront resort with stunning views', 'Active'),
('HTL003', 'Business Suites', 'Business District', 'Dubai', 'UAE', 4.3, 750.00, 80, 60, 'WiFi, Conference Rooms, Gym, Restaurant', 'Modern hotel for business travelers', 'Active'),
('HTL004', 'Desert Oasis Resort', 'Al Ula', 'Al Ula', 'Saudi Arabia', 4.9, 1200.00, 50, 40, 'WiFi, Pool, Desert Tours, Fine Dining', 'Exclusive desert experience', 'Active'),
('HTL005', 'City Center Inn', 'City Center', 'Dammam', 'Saudi Arabia', 4.0, 450.00, 60, 50, 'WiFi, Breakfast, Parking', 'Comfortable budget hotel in city center', 'Active');

-- Sample Bookings
INSERT INTO hotel_bookings (booking_id, user_id, hotel_id, check_in_date, check_out_date, number_of_rooms, number_of_guests, total_price, booking_status, payment_status)
VALUES
('BK001', 'USR001', 'HTL001', '2025-11-15', '2025-11-18', 1, 2, 2550.00, 'Confirmed', 'Paid'),
('BK002', 'USR002', 'HTL002', '2025-11-20', '2025-11-25', 2, 4, 6500.00, 'Confirmed', 'Paid'),
('BK003', 'USR003', 'HTL003', '2025-12-01', '2025-12-03', 1, 1, 1500.00, 'Pending', 'Pending'),
('BK004', 'USR001', 'HTL004', '2025-12-10', '2025-12-12', 1, 2, 2400.00, 'Confirmed', 'Paid');

-- ====================================
-- VERIFY SETUP
-- ====================================

-- Show how many records in each table
SELECT 'Setup Complete!' AS Status;
SELECT 'Total Users:' AS Info, COUNT(*) AS Count FROM users;
SELECT 'Total Hotels:' AS Info, COUNT(*) AS Count FROM hotels;
SELECT 'Total Bookings:' AS Info, COUNT(*) AS Count FROM hotel_bookings;
