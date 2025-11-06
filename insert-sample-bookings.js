const mysql = require("mysql2/promise");
require("dotenv").config();

async function insertSampleBookings() {
  let connection;

  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "gotrip_db",
    });

    console.log("Connected to database");

    // Get the first user ID (assuming Mohammed@gmail.com exists)
    const [users] = await connection.execute(
      "SELECT user_id, email FROM users WHERE LOWER(email) = LOWER(?)",
      ["Mohammed@gmail.com"]
    );

    if (users.length === 0) {
      console.log("No user found with email Mohammed@gmail.com");
      console.log("Creating a test user...");

      // Create test user
      await connection.execute(
        "INSERT INTO users (first_name, last_name, email, password_hash, phone, birth_date) VALUES (?, ?, ?, ?, ?, ?)",
        [
          "Mohammed",
          "Test",
          "Mohammed@gmail.com",
          "$2a$10$test",
          "+966555123456",
          "1990-01-01",
        ]
      );

      const [newUsers] = await connection.execute(
        "SELECT user_id FROM users WHERE email = ?",
        ["Mohammed@gmail.com"]
      );

      userId = newUsers[0].user_id;
    } else {
      userId = users[0].user_id;
    }

    console.log(`Using user ID: ${userId}`);

    // Get some hotels
    const [hotels] = await connection.execute(
      "SELECT hotel_id, hotel_name FROM hotels LIMIT 5"
    );

    if (hotels.length === 0) {
      console.log("No hotels found in database");
      return;
    }

    console.log(`Found ${hotels.length} hotels`);

    // Sample bookings data
    const sampleBookings = [
      {
        hotel_id: hotels[0].hotel_id,
        hotel_name: hotels[0].hotel_name,
        check_in: "2025-12-15",
        check_out: "2025-12-20",
        rooms: 1,
        guests: 2,
        price: 750.0,
        status: "Confirmed",
        payment: "Paid",
      },
      {
        hotel_id: hotels[1].hotel_id,
        hotel_name: hotels[1].hotel_name,
        check_in: "2025-11-25",
        check_out: "2025-11-28",
        rooms: 1,
        guests: 1,
        price: 450.0,
        status: "Pending",
        payment: "Pending",
      },
      {
        hotel_id: hotels[2].hotel_id,
        hotel_name: hotels[2].hotel_name,
        check_in: "2025-10-10",
        check_out: "2025-10-15",
        rooms: 2,
        guests: 4,
        price: 1200.0,
        status: "Completed",
        payment: "Paid",
      },
      {
        hotel_id: hotels[3].hotel_id,
        hotel_name: hotels[3].hotel_name,
        check_in: "2025-09-05",
        check_out: "2025-09-08",
        rooms: 1,
        guests: 2,
        price: 600.0,
        status: "Completed",
        payment: "Paid",
      },
      {
        hotel_id: hotels[4].hotel_id,
        hotel_name: hotels[4].hotel_name,
        check_in: "2025-08-20",
        check_out: "2025-08-25",
        rooms: 1,
        guests: 3,
        price: 850.0,
        status: "Cancelled",
        payment: "Refunded",
      },
    ];

    console.log("\nInserting sample bookings...");

    for (const booking of sampleBookings) {
      await connection.execute(
        `INSERT INTO hotel_bookings 
        (user_id, hotel_id, check_in_date, check_out_date, number_of_rooms, number_of_guests, total_price, booking_status, payment_status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          booking.hotel_id,
          booking.check_in,
          booking.check_out,
          booking.rooms,
          booking.guests,
          booking.price,
          booking.status,
          booking.payment,
        ]
      );

      console.log(
        `✓ Added ${booking.status} booking for ${booking.hotel_name}`
      );
    }

    console.log("\n✅ Sample bookings inserted successfully!");
    console.log("\nBookings Summary:");
    console.log(`- 2 Active bookings (Confirmed + Pending)`);
    console.log(`- 2 Completed bookings`);
    console.log(`- 1 Cancelled booking`);
    console.log(`- Total: ${sampleBookings.length} bookings`);
    console.log(
      `- Total spent: $${sampleBookings
        .filter((b) => b.payment === "Paid")
        .reduce((sum, b) => sum + b.price, 0)
        .toFixed(2)}`
    );
  } catch (error) {
    console.error("Error inserting sample bookings:", error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log("\nDatabase connection closed");
    }
  }
}

// Run the script
insertSampleBookings();
