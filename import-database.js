// Import database structure to Railway
const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function importDatabase() {
  console.log("📦 Importing database structure to Railway...\n");

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    multipleStatements: true,
  });

  try {
    // Read SQL file
    const sqlPath = path.join(__dirname, "database", "setup.sql");
    let sql = fs.readFileSync(sqlPath, "utf8");

    // Remove CREATE DATABASE and USE statements (Railway already has a database)
    sql = sql.replace(/CREATE DATABASE IF NOT EXISTS gotrip_db;/gi, "");
    sql = sql.replace(/USE gotrip_db;/gi, "");

    console.log("🔄 Executing SQL...");
    await connection.query(sql);

    console.log("✅ Database structure imported successfully!");

    // Show tables
    const [tables] = await connection.query("SHOW TABLES");
    console.log("\n📊 Tables created:");
    tables.forEach((table) => {
      console.log(`  - ${Object.values(table)[0]}`);
    });

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error importing database:", error.message);
    await connection.end();
    process.exit(1);
  }
}

importDatabase();
