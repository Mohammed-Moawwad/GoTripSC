// Quick script to show all users in the database
const db = require("./backend/config/database");

async function showUsers() {
  try {
    console.log("\n=================================");
    console.log("📊 USERS IN DATABASE");
    console.log("=================================\n");

    const [users] = await db.execute(`
      SELECT 
        user_id,
        first_name,
        last_name,
        email,
        phone,
        birth_date,
        role,
        status,
        DATE_FORMAT(registered_date, '%Y-%m-%d %H:%i') as registered_date
      FROM users
      ORDER BY user_id DESC
    `);

    if (users.length === 0) {
      console.log("❌ No users found in database\n");
    } else {
      console.log(`✅ Found ${users.length} user(s):\n`);

      users.forEach((user, index) => {
        console.log(`${index + 1}. User ID: ${user.user_id}`);
        console.log(`   Name: ${user.first_name} ${user.last_name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Phone: ${user.phone || "N/A"}`);
        console.log(`   Birth Date: ${user.birth_date || "N/A"}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Status: ${user.status}`);
        console.log(`   Registered: ${user.registered_date}`);
        console.log("   ---");
      });
    }

    console.log("\n=================================\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

showUsers();
