require("dotenv").config();
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");

async function testAdminPassword() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "gotrip_db",
    });

    console.log("✅ Connected to database\n");

    // Get admin user with password hash
    const [users] = await connection.execute(
      `SELECT user_id, first_name, last_name, email, role, status, password_hash 
       FROM users 
       WHERE LOWER(email) = LOWER('Admin@gmail.com')`
    );

    if (users.length === 0) {
      console.log("❌ No admin user found with email 'Admin@gmail.com'");
    } else {
      const admin = users[0];
      console.log("👤 Admin User Found:");
      console.log("========================");
      console.log("User ID:", admin.user_id);
      console.log("Name:", admin.first_name, admin.last_name);
      console.log("Email:", admin.email);
      console.log("Role:", admin.role);
      console.log("Status:", admin.status);
      console.log(
        "Password Hash:",
        admin.password_hash.substring(0, 20) + "..."
      );
      console.log("========================\n");

      // Test password
      const testPassword = "Admin!123";
      console.log("🔐 Testing password:", testPassword);

      const isValid = await bcrypt.compare(testPassword, admin.password_hash);

      if (isValid) {
        console.log("✅ Password is CORRECT!");
      } else {
        console.log("❌ Password is INCORRECT!");
        console.log(
          "\nℹ️  The password hash in database doesn't match 'Admin!123'"
        );
        console.log("You need to reset the admin password.");
      }
    }

    await connection.end();
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

testAdminPassword();
