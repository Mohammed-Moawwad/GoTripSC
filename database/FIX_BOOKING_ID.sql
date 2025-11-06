-- Fix booking_id column type from INT to VARCHAR
-- Run this in your MySQL database

USE gotrip_db;

-- Step 1: Check current foreign key names
-- SELECT * FROM information_schema.TABLE_CONSTRAINTS 
-- WHERE TABLE_NAME = 'hotel_bookings' AND CONSTRAINT_TYPE = 'FOREIGN KEY';

-- Step 2: Drop foreign keys (replace constraint names if different)
ALTER TABLE hotel_bookings DROP FOREIGN KEY hotel_bookings_ibfk_1;
ALTER TABLE hotel_bookings DROP FOREIGN KEY hotel_bookings_ibfk_2;

-- Step 3: Remove auto_increment first, then drop primary key
ALTER TABLE hotel_bookings 
MODIFY COLUMN booking_id INT;

-- Step 4: Drop the primary key
ALTER TABLE hotel_bookings DROP PRIMARY KEY;

-- Step 5: Change booking_id from INT to VARCHAR(20) and make it primary key
ALTER TABLE hotel_bookings 
MODIFY COLUMN booking_id VARCHAR(20) PRIMARY KEY;

-- Step 6: Re-add foreign keys
ALTER TABLE hotel_bookings 
ADD CONSTRAINT hotel_bookings_ibfk_1 
FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE;

ALTER TABLE hotel_bookings 
ADD CONSTRAINT hotel_bookings_ibfk_2 
FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id) ON DELETE CASCADE;

-- Verify the change
DESCRIBE hotel_bookings;

SELECT 'Booking ID column fixed successfully!' AS Status;
