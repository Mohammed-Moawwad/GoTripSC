const mysql = require("mysql2/promise");
require("dotenv").config();

async function insertSampleData() {
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

    // Insert sample flights
    const flights = [
      {
        flight_id: "FL001",
        flight_number: "AA101",
        airline: "American Airlines",
        departure_city: "New York",
        arrival_city: "Los Angeles",
        departure_time: "2024-12-10 08:00:00",
        arrival_time: "2024-12-10 11:30:00",
        duration_minutes: 330,
        price: 350.0,
        total_seats: 180,
        available_seats: 150,
        aircraft_type: "Boeing 737",
        status: "Scheduled",
      },
      {
        flight_id: "FL002",
        flight_number: "DL205",
        airline: "Delta Airlines",
        departure_city: "Chicago",
        arrival_city: "Miami",
        departure_time: "2024-12-15 14:00:00",
        arrival_time: "2024-12-15 18:00:00",
        duration_minutes: 240,
        price: 280.0,
        total_seats: 160,
        available_seats: 120,
        aircraft_type: "Airbus A320",
        status: "Scheduled",
      },
      {
        flight_id: "FL003",
        flight_number: "UA330",
        airline: "United Airlines",
        departure_city: "San Francisco",
        arrival_city: "Seattle",
        departure_time: "2024-11-20 10:30:00",
        arrival_time: "2024-11-20 12:45:00",
        duration_minutes: 135,
        price: 180.0,
        total_seats: 140,
        available_seats: 100,
        aircraft_type: "Boeing 757",
        status: "Completed",
      },
    ];

    for (const flight of flights) {
      try {
        await connection.execute(
          `INSERT INTO flights (flight_id, flight_number, airline, departure_city, arrival_city, 
           departure_time, arrival_time, duration_minutes, price, total_seats, available_seats, 
           aircraft_type, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE 
           departure_time = VALUES(departure_time),
           arrival_time = VALUES(arrival_time),
           available_seats = VALUES(available_seats)`,
          [
            flight.flight_id,
            flight.flight_number,
            flight.airline,
            flight.departure_city,
            flight.arrival_city,
            flight.departure_time,
            flight.arrival_time,
            flight.duration_minutes,
            flight.price,
            flight.total_seats,
            flight.available_seats,
            flight.aircraft_type,
            flight.status,
          ]
        );
        console.log(`✅ Inserted/Updated flight: ${flight.flight_number}`);
      } catch (err) {
        console.error(
          `❌ Error inserting flight ${flight.flight_number}:`,
          err.message
        );
      }
    }

    // Insert sample buses
    const buses = [
      {
        bus_id: "BUS001",
        bus_number: "GB101",
        company: "Greyhound",
        departure_city: "Boston",
        arrival_city: "Washington DC",
        departure_time: "2024-12-08 09:00:00",
        arrival_time: "2024-12-08 17:00:00",
        duration_minutes: 480,
        price: 65.0,
        total_seats: 50,
        available_seats: 30,
        bus_type: "Luxury Coach",
        amenities: "WiFi, Power Outlets, Restroom",
        status: "Active",
      },
      {
        bus_id: "BUS002",
        bus_number: "MB205",
        company: "Megabus",
        departure_city: "Philadelphia",
        arrival_city: "New York",
        departure_time: "2024-12-12 11:00:00",
        arrival_time: "2024-12-12 13:30:00",
        duration_minutes: 150,
        price: 35.0,
        total_seats: 55,
        available_seats: 40,
        bus_type: "Standard",
        amenities: "WiFi, Power Outlets",
        status: "Active",
      },
      {
        bus_id: "BUS003",
        bus_number: "PB330",
        company: "Peter Pan Bus",
        departure_city: "Baltimore",
        arrival_city: "Philadelphia",
        departure_time: "2024-10-15 08:00:00",
        arrival_time: "2024-10-15 10:30:00",
        duration_minutes: 150,
        price: 42.0,
        total_seats: 48,
        available_seats: 35,
        bus_type: "Express",
        amenities: "WiFi, Restroom",
        status: "Active",
      },
    ];

    for (const bus of buses) {
      try {
        await connection.execute(
          `INSERT INTO buses (bus_id, bus_number, company, departure_city, arrival_city, 
           departure_time, arrival_time, duration_minutes, price, total_seats, available_seats, 
           bus_type, amenities, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE 
           departure_time = VALUES(departure_time),
           arrival_time = VALUES(arrival_time),
           available_seats = VALUES(available_seats)`,
          [
            bus.bus_id,
            bus.bus_number,
            bus.company,
            bus.departure_city,
            bus.arrival_city,
            bus.departure_time,
            bus.arrival_time,
            bus.duration_minutes,
            bus.price,
            bus.total_seats,
            bus.available_seats,
            bus.bus_type,
            bus.amenities,
            bus.status,
          ]
        );
        console.log(`✅ Inserted/Updated bus: ${bus.bus_number}`);
      } catch (err) {
        console.error(`❌ Error inserting bus ${bus.bus_number}:`, err.message);
      }
    }

    // Get user_id for Mohammed@gmail.com
    const [users] = await connection.execute(
      "SELECT user_id FROM users WHERE email = ?",
      ["Mohammed@gmail.com"]
    );

    if (users.length === 0) {
      console.error("❌ User Mohammed@gmail.com not found");
      return;
    }

    const userId = users[0].user_id;
    console.log(`\n✅ Found user: ${userId}`);

    // Insert sample flight bookings
    const flightBookings = [
      {
        booking_id: "FLB001",
        user_id: userId,
        flight_id: "FL001",
        number_of_passengers: 2,
        seat_numbers: "12A, 12B",
        total_price: 700.0,
        booking_status: "Confirmed",
        payment_status: "Paid",
      },
      {
        booking_id: "FLB002",
        user_id: userId,
        flight_id: "FL003",
        number_of_passengers: 1,
        seat_numbers: "8C",
        total_price: 180.0,
        booking_status: "Completed",
        payment_status: "Paid",
      },
    ];

    for (const booking of flightBookings) {
      try {
        await connection.execute(
          `INSERT INTO flight_bookings (booking_id, user_id, flight_id, number_of_passengers, 
           seat_numbers, total_price, booking_status, payment_status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE 
           booking_status = VALUES(booking_status)`,
          [
            booking.booking_id,
            booking.user_id,
            booking.flight_id,
            booking.number_of_passengers,
            booking.seat_numbers,
            booking.total_price,
            booking.booking_status,
            booking.payment_status,
          ]
        );
        console.log(
          `✅ Inserted/Updated flight booking: ${booking.booking_id}`
        );
      } catch (err) {
        console.error(`❌ Error inserting flight booking:`, err.message);
      }
    }

    // Insert sample bus bookings
    const busBookings = [
      {
        booking_id: "BUSB001",
        user_id: userId,
        bus_id: "BUS001",
        number_of_passengers: 1,
        seat_numbers: "15",
        total_price: 65.0,
        booking_status: "Confirmed",
        payment_status: "Paid",
      },
      {
        booking_id: "BUSB002",
        user_id: userId,
        bus_id: "BUS003",
        number_of_passengers: 2,
        seat_numbers: "20, 21",
        total_price: 84.0,
        booking_status: "Completed",
        payment_status: "Paid",
      },
    ];

    for (const booking of busBookings) {
      try {
        await connection.execute(
          `INSERT INTO bus_bookings (booking_id, user_id, bus_id, number_of_passengers, 
           seat_numbers, total_price, booking_status, payment_status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE 
           booking_status = VALUES(booking_status)`,
          [
            booking.booking_id,
            booking.user_id,
            booking.bus_id,
            booking.number_of_passengers,
            booking.seat_numbers,
            booking.total_price,
            booking.booking_status,
            booking.payment_status,
          ]
        );
        console.log(`✅ Inserted/Updated bus booking: ${booking.booking_id}`);
      } catch (err) {
        console.error(`❌ Error inserting bus booking:`, err.message);
      }
    }

    console.log("\n✅ Sample data insertion completed!");
    console.log("\nSummary:");
    console.log("- 3 Flights added");
    console.log("- 3 Buses added");
    console.log("- 2 Flight bookings for Mohammed@gmail.com");
    console.log("- 2 Bus bookings for Mohammed@gmail.com");
  } catch (error) {
    console.error("❌ Database Error:", error);
  } finally {
    if (connection) {
      await connection.end();
      console.log("\n✅ Database connection closed");
    }
  }
}

insertSampleData();
