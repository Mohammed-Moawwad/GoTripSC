// Import LOCAL data to Railway database
const mysql = require("mysql2/promise");
const fs = require("fs");
require("dotenv").config();

async function importToRailway() {
  console.log("📤 Importing your local data to Railway...\n");

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    multipleStatements: true,
  });

  try {
    // Read exported data
    const sql = fs.readFileSync("export-local-data.sql", "utf8");

    console.log("🔄 Clearing Railway database and inserting your data...");
    await connection.query(sql);

    console.log("✅ Your local data imported successfully!\n");

    // Verify data
    console.log("📊 Verification:");
    const [users] = await connection.query(
      "SELECT COUNT(*) as count FROM users"
    );
    console.log(`  Users: ${users[0].count}`);

    const [hotels] = await connection.query(
      "SELECT COUNT(*) as count FROM hotels"
    );
    console.log(`  Hotels: ${hotels[0].count}`);

    const [bookings] = await connection.query(
      "SELECT COUNT(*) as count FROM hotel_bookings"
    );
    console.log(`  Hotel Bookings: ${bookings[0].count}`);

    console.log("\n✅ Railway database now has your actual data!");

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error importing data:", error.message);
    await connection.end();
    process.exit(1);
  }
}

importToRailway();
