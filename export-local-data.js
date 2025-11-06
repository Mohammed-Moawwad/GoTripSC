// Export data from LOCAL database
const mysql = require("mysql2/promise");
const fs = require("fs");

async function exportLocalData() {
  console.log("📦 Exporting data from LOCAL database...\n");

  // Connect to LOCAL database
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Modtha@7", // Your local password
    database: "gotrip_db",
    port: 3306,
  });

  try {
    const tables = [
      "users",
      "hotels",
      "flights",
      "buses",
      "hotel_bookings",
      "flight_bookings",
      "bus_bookings",
    ];
    let exportSQL = "-- GoTrip Data Export\n\n";

    for (const table of tables) {
      console.log(`📊 Exporting ${table}...`);

      const [rows] = await connection.query(`SELECT * FROM ${table}`);

      if (rows.length === 0) {
        console.log(`  ⚠️  No data in ${table}`);
        continue;
      }

      console.log(`  ✅ Found ${rows.length} rows`);

      exportSQL += `-- ${table.toUpperCase()} DATA\n`;
      exportSQL += `DELETE FROM ${table};\n`;

      for (const row of rows) {
        const columns = Object.keys(row).join(", ");
        const values = Object.values(row)
          .map((val) => {
            if (val === null) return "NULL";
            if (typeof val === "string") return `'${val.replace(/'/g, "''")}'`;
            if (val instanceof Date)
              return `'${val.toISOString().slice(0, 19).replace("T", " ")}'`;
            return val;
          })
          .join(", ");

        exportSQL += `INSERT INTO ${table} (${columns}) VALUES (${values});\n`;
      }

      exportSQL += "\n";
    }

    // Save to file
    fs.writeFileSync("export-local-data.sql", exportSQL);
    console.log("\n✅ Data exported to: export-local-data.sql");
    console.log("📤 You can now import this to Railway!");

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    await connection.end();
    process.exit(1);
  }
}

exportLocalData();
