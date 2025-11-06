// Quick test - Check users in Railway database
const db = require("./backend/config/database");

async function testRailwayConnection() {
  console.log("🔍 Testing Railway Database Connection...\n");

  try {
    // Get connection info
    console.log("📡 Connected to:");
    console.log(`   Host: ${process.env.DB_HOST}`);
    console.log(`   Database: ${process.env.DB_NAME}`);
    console.log(`   Port: ${process.env.DB_PORT}\n`);

    // Count users
    const [users] = await db.execute("SELECT COUNT(*) as count FROM users");
    console.log(`👥 Total Users in Railway: ${users[0].count}`);

    // Show last 3 users
    const [recentUsers] = await db.execute(
      "SELECT user_id, first_name, last_name, email, registered_date FROM users ORDER BY registered_date DESC LIMIT 3"
    );

    console.log("\n📋 Most Recent Users:");
    recentUsers.forEach((user, i) => {
      console.log(
        `   ${i + 1}. ${user.first_name} ${user.last_name} (${user.email})`
      );
    });

    console.log("\n✅ When a new user signs up, they will appear here!");
    console.log("🌍 All teammates will see the same data!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

testRailwayConnection();
