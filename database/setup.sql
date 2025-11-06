-- GoTrip Database Setup
-- Run this script in MySQL Workbench to create the database and tables

-- Create Database
CREATE DATABASE IF NOT EXISTS gotrip_db;
USE gotrip_db;

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(20) PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    birth_date DATE,
    password_hash VARCHAR(255) NOT NULL,
    registered_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    status ENUM('Active', 'InActive') DEFAULT 'Active',
    role ENUM('user', 'admin') DEFAULT 'user',
    INDEX idx_email (email),
    INDEX idx_status (status)
);

-- ============================================
-- 2. HOTELS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS hotels (
    hotel_id VARCHAR(20) PRIMARY KEY,
    hotel_name VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    city VARCHAR(50) NOT NULL,
    country VARCHAR(50) NOT NULL,
    address TEXT,
    rating DECIMAL(2,1) DEFAULT 0.0,
    price_per_night DECIMAL(10,2) NOT NULL,
    total_rooms INT DEFAULT 0,
    available_rooms INT DEFAULT 0,
    amenities TEXT,
    description TEXT,
    image_url VARCHAR(255),
    status ENUM('Active', 'InActive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_city (city),
    INDEX idx_status (status)
);

-- ============================================
-- 3. FLIGHTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS flights (
    flight_id VARCHAR(20) PRIMARY KEY,
    flight_number VARCHAR(20) UNIQUE NOT NULL,
    airline VARCHAR(50) NOT NULL,
    departure_city VARCHAR(50) NOT NULL,
    arrival_city VARCHAR(50) NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    duration_minutes INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    total_seats INT DEFAULT 0,
    available_seats INT DEFAULT 0,
    aircraft_type VARCHAR(50),
    status ENUM('Scheduled', 'Delayed', 'Cancelled', 'Completed') DEFAULT 'Scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_departure (departure_city, departure_time),
    INDEX idx_arrival (arrival_city),
    INDEX idx_status (status)
);

-- ============================================
-- 4. BUSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS buses (
    bus_id VARCHAR(20) PRIMARY KEY,
    bus_number VARCHAR(20) UNIQUE NOT NULL,
    company VARCHAR(50) NOT NULL,
    departure_city VARCHAR(50) NOT NULL,
    arrival_city VARCHAR(50) NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    duration_minutes INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    total_seats INT DEFAULT 0,
    available_seats INT DEFAULT 0,
    bus_type VARCHAR(50),
    amenities TEXT,
    status ENUM('Active', 'InActive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_departure (departure_city, departure_time),
    INDEX idx_arrival (arrival_city),
    INDEX idx_status (status)
);

-- ============================================
-- 5. HOTEL BOOKINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS hotel_bookings (
    booking_id VARCHAR(20) PRIMARY KEY,
    user_id VARCHAR(20) NOT NULL,
    hotel_id VARCHAR(20) NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    number_of_rooms INT DEFAULT 1,
    number_of_guests INT DEFAULT 1,
    total_price DECIMAL(10,2) NOT NULL,
    booking_status ENUM('Pending', 'Confirmed', 'Cancelled', 'Completed') DEFAULT 'Pending',
    payment_status ENUM('Pending', 'Paid', 'Refunded') DEFAULT 'Pending',
    special_requests TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_hotel (hotel_id),
    INDEX idx_status (booking_status)
);

-- ============================================
-- 6. FLIGHT BOOKINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS flight_bookings (
    booking_id VARCHAR(20) PRIMARY KEY,
    user_id VARCHAR(20) NOT NULL,
    flight_id VARCHAR(20) NOT NULL,
    number_of_passengers INT DEFAULT 1,
    seat_numbers TEXT,
    total_price DECIMAL(10,2) NOT NULL,
    booking_status ENUM('Pending', 'Confirmed', 'Cancelled', 'Completed') DEFAULT 'Pending',
    payment_status ENUM('Pending', 'Paid', 'Refunded') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (flight_id) REFERENCES flights(flight_id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_flight (flight_id),
    INDEX idx_status (booking_status)
);

-- ============================================
-- 7. BUS BOOKINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS bus_bookings (
    booking_id VARCHAR(20) PRIMARY KEY,
    user_id VARCHAR(20) NOT NULL,
    bus_id VARCHAR(20) NOT NULL,
    number_of_passengers INT DEFAULT 1,
    seat_numbers TEXT,
    total_price DECIMAL(10,2) NOT NULL,
    booking_status ENUM('Pending', 'Confirmed', 'Cancelled', 'Completed') DEFAULT 'Pending',
    payment_status ENUM('Pending', 'Paid', 'Refunded') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (bus_id) REFERENCES buses(bus_id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_bus (bus_id),
    INDEX idx_status (booking_status)
);

-- ============================================
-- 8. ADMIN LOGS TABLE (Track admin activities)
-- ============================================
CREATE TABLE IF NOT EXISTS admin_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id VARCHAR(20) NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    target_table VARCHAR(50),
    target_id VARCHAR(20),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_admin (admin_id),
    INDEX idx_action (action_type)
);

-- ============================================
-- INSERT SAMPLE DATA
-- ============================================

-- Sample Admin User (password: admin123 - will be hashed in real app)
INSERT INTO users (user_id, first_name, last_name, email, phone, birth_date, password_hash, role, status) 
VALUES 
('USR000', 'Admin', 'User', 'admin@gotrip.com', '+966 50 000 0000', '1990-01-01', '$2b$10$placeholder', 'admin', 'Active');

-- Sample Regular Users
INSERT INTO users (user_id, first_name, last_name, email, phone, birth_date, password_hash, registered_date, last_login, status, role) 
VALUES 
('USR001', 'John', 'Doe', 'john.doe@email.com', '+966 55 123 4567', '1990-05-15', '$2b$10$placeholder', '2024-01-15', '2025-11-01', 'Active', 'user'),
('USR002', 'Sarah', 'Smith', 'sarah.smith@email.com', '+966 50 234 5678', '1988-08-22', '$2b$10$placeholder', '2024-02-20', '2025-10-30', 'Active', 'user'),
('USR003', 'Ahmed', 'Hassan', 'ahmed.hassan@email.com', '+966 54 345 6789', '1992-03-10', '$2b$10$placeholder', '2024-03-10', '2025-10-28', 'Active', 'user'),
('USR004', 'Fatima', 'Ali', 'fatima.ali@email.com', '+966 56 456 7890', '1995-11-30', '$2b$10$placeholder', '2024-04-05', '2025-10-15', 'InActive', 'user'),
('USR005', 'Mike', 'Jones', 'mike.jones@email.com', '+966 53 567 8901', '1987-07-18', '$2b$10$placeholder', '2024-05-12', NULL, 'InActive', 'user'),
('USR006', 'Nora', 'Ahmed', 'nora.ahmed@email.com', '+966 55 678 9012', '1993-12-05', '$2b$10$placeholder', '2024-06-18', '2025-11-02', 'Active', 'user'),
('USR007', 'David', 'Wilson', 'david.wilson@email.com', '+966 50 789 0123', '1991-04-25', '$2b$10$placeholder', '2024-07-22', '2025-10-25', 'Active', 'user'),
('USR008', 'Layla', 'Omar', 'layla.omar@email.com', '+966 54 890 1234', '1994-09-14', '$2b$10$placeholder', '2024-08-30', '2025-09-10', 'InActive', 'user');

-- Sample Hotels
INSERT INTO hotels (hotel_id, hotel_name, location, city, country, address, rating, price_per_night, total_rooms, available_rooms, amenities, description, status) 
VALUES 
('HTL001', 'Luxury Palace Hotel', 'Downtown', 'Riyadh', 'Saudi Arabia', 'King Fahd Road, Riyadh', 4.8, 850.00, 150, 120, 'WiFi, Pool, Spa, Gym, Restaurant', 'Five-star luxury hotel in the heart of Riyadh', 'Active'),
('HTL002', 'Coastal Resort', 'Beachfront', 'Jeddah', 'Saudi Arabia', 'Corniche Road, Jeddah', 4.5, 650.00, 100, 85, 'WiFi, Beach Access, Pool, Restaurant', 'Beautiful beachfront resort with stunning views', 'Active'),
('HTL003', 'Business Suites', 'Business District', 'Dubai', 'UAE', 'Sheikh Zayed Road, Dubai', 4.3, 750.00, 80, 60, 'WiFi, Conference Rooms, Gym, Restaurant', 'Modern hotel for business travelers', 'Active');

-- Sample Flights
INSERT INTO flights (flight_id, flight_number, airline, departure_city, arrival_city, departure_time, arrival_time, duration_minutes, price, total_seats, available_seats, aircraft_type, status) 
VALUES 
('FLT001', 'SV123', 'Saudi Airlines', 'Riyadh', 'Jeddah', '2025-11-10 08:00:00', '2025-11-10 10:30:00', 150, 450.00, 180, 150, 'Boeing 777', 'Scheduled'),
('FLT002', 'EK456', 'Emirates', 'Dubai', 'Riyadh', '2025-11-10 14:00:00', '2025-11-10 16:15:00', 135, 650.00, 200, 180, 'Airbus A380', 'Scheduled'),
('FLT003', 'QR789', 'Qatar Airways', 'Doha', 'Jeddah', '2025-11-10 09:30:00', '2025-11-10 11:45:00', 135, 550.00, 150, 120, 'Boeing 787', 'Scheduled');

-- Sample Buses
INSERT INTO buses (bus_id, bus_number, company, departure_city, arrival_city, departure_time, arrival_time, duration_minutes, price, total_seats, available_seats, bus_type, amenities, status) 
VALUES 
('BUS001', 'SAPTCO-101', 'SAPTCO', 'Riyadh', 'Jeddah', '2025-11-10 06:00:00', '2025-11-10 16:00:00', 600, 150.00, 45, 35, 'VIP', 'WiFi, AC, Reclining Seats, Refreshments', 'Active'),
('BUS002', 'SAPTCO-102', 'SAPTCO', 'Jeddah', 'Mecca', '2025-11-10 07:00:00', '2025-11-10 08:30:00', 90, 50.00, 50, 40, 'Standard', 'AC, Standard Seats', 'Active'),
('BUS003', 'SAPTCO-103', 'SAPTCO', 'Riyadh', 'Dammam', '2025-11-10 08:00:00', '2025-11-10 12:30:00', 270, 120.00, 45, 30, 'VIP', 'WiFi, AC, Reclining Seats, Entertainment', 'Active');

-- Show success message
SELECT 'Database setup completed successfully!' AS Status;
SELECT 'Total tables created: 8' AS Info;
