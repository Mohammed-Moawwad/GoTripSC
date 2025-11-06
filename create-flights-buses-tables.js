const mysql = require("mysql2/promise");
require("dotenv").config();

async function createTables() {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || "gotrip_db",
      port: process.env.DB_PORT || 3306,
    });

    console.log("✅ Connected to database");

    // Create flights table
    await connection.execute(`
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
      )
    `);
    console.log("✅ Created flights table");

    // Create buses table
    await connection.execute(`
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
      )
    `);
    console.log("✅ Created buses table");

    // Create flight_bookings table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS flight_bookings (
        booking_id VARCHAR(20) PRIMARY KEY,
        user_id INT NOT NULL,
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
      )
    `);
    console.log("✅ Created flight_bookings table");

    // Create bus_bookings table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS bus_bookings (
        booking_id VARCHAR(20) PRIMARY KEY,
        user_id INT NOT NULL,
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
      )
    `);
    console.log("✅ Created bus_bookings table");

    console.log("\n✅ All tables created successfully!");
  } catch (error) {
    console.error("❌ Database Error:", error);
  } finally {
    if (connection) {
      await connection.end();
      console.log("\n✅ Database connection closed");
    }
  }
}

createTables();
