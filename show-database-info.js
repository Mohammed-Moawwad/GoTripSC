// Script to show all tables in the database and their structure
const db = require("./backend/config/database");

async function showDatabaseInfo() {
  try {
    console.log("\n=================================");
    console.log("📊 DATABASE INFORMATION");
    console.log("=================================\n");

    // Show all tables
    console.log("📋 TABLES IN gotrip_db:\n");
    const [tables] = await db.execute("SHOW TABLES");

    if (tables.length === 0) {
      console.log("❌ No tables found\n");
    } else {
      tables.forEach((table, index) => {
        const tableName = Object.values(table)[0];
        console.log(`${index + 1}. ${tableName}`);
      });
    }

    console.log("\n---------------------------------\n");

    // Show structure of each table
    for (const table of tables) {
      const tableName = Object.values(table)[0];
      console.log(`📝 Structure of '${tableName}' table:\n`);

      const [columns] = await db.execute(`DESCRIBE ${tableName}`);

      console.log("Column Name          | Type                | Key | Extra");
      console.log(
        "---------------------|---------------------|-----|------------------"
      );
      columns.forEach((col) => {
        const name = col.Field.padEnd(20);
        const type = col.Type.padEnd(20);
        const key = col.Key.padEnd(4);
        const extra = col.Extra || "";
        console.log(`${name} | ${type} | ${key} | ${extra}`);
      });

      // Show row count
      const [count] = await db.execute(
        `SELECT COUNT(*) as count FROM ${tableName}`
      );
      console.log(`\n   Total rows: ${count[0].count}`);
      console.log("\n---------------------------------\n");
    }

    console.log("=================================\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

showDatabaseInfo();
