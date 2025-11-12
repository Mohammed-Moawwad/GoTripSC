// Check hotel foreign key constraints
require("dotenv").config();
const mysql = require("mysql2/promise");

async function checkConstraints() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  });

  console.log("✅ Connected to database\n");

  // Check bookings table structure
  console.log("📋 Checking BOOKINGS table structure:");
  const [bookings] = await connection.query("SHOW CREATE TABLE bookings");
  console.log(bookings[0]["Create Table"]);
  console.log("\n" + "=".repeat(80) + "\n");

  // Check if there are any bookings
  const [bookingCount] = await connection.query(
    "SELECT COUNT(*) as count FROM bookings"
  );
  console.log(`📊 Total bookings in database: ${bookingCount[0].count}\n`);

  // Try to delete a specific hotel and see what error we get
  console.log("🧪 Testing delete on hotel HTL1002...");
  try {
    const [result] = await connection.query(
      "DELETE FROM hotels WHERE hotel_id = ?",
      ["HTL1002"]
    );
    console.log("✅ Delete successful! Affected rows:", result.affectedRows);
  } catch (error) {
    console.log("❌ Delete failed!");
    console.log("Error code:", error.code);
    console.log("Error message:", error.message);
    console.log("SQL State:", error.sqlState);
  }

  await connection.end();
}

checkConstraints().catch(console.error);
