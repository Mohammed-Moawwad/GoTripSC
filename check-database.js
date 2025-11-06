// Quick script to check database tables and structure
const db = require("./backend/config/database");

async function checkDatabase() {
  console.log("🔍 Checking Railway Database...\n");

  try {
    // List all tables
    const [tables] = await db.execute("SHOW TABLES");
    console.log("📊 Tables in database:");
    console.log(tables);
    console.log("\n");

    // Check each table structure
    for (const table of tables) {
      const tableName = Object.values(table)[0];
      console.log(`\n📋 Structure of ${tableName}:`);
      const [structure] = await db.execute(`DESCRIBE ${tableName}`);
      console.table(structure);
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

checkDatabase();
