require("dotenv").config();
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");

async function resetAdminPassword() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "gotrip_db",
    });

    console.log("✅ Connected to database\n");

    // New password
    const newPassword = "Admin!123";
    console.log("🔐 Setting admin password to:", newPassword);

    // Hash the password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log("✅ Password hashed successfully");

    // Update admin password
    const [result] = await connection.execute(
      `UPDATE users 
       SET password_hash = ? 
       WHERE LOWER(email) = LOWER('admin@gmail.com')`,
      [hashedPassword]
    );

    if (result.affectedRows > 0) {
      console.log("✅ Admin password updated successfully!\n");
      console.log("========================");
      console.log("Email: admin@gmail.com (or Admin@gmail.com)");
      console.log("Password: Admin!123");
      console.log("========================\n");
      console.log("You can now login with these credentials!");
    } else {
      console.log("❌ No admin user found to update");
    }

    // Verify the update
    console.log("\n🔍 Verifying password...");
    const [users] = await connection.execute(
      `SELECT password_hash FROM users WHERE LOWER(email) = LOWER('admin@gmail.com')`
    );

    if (users.length > 0) {
      const isValid = await bcrypt.compare(newPassword, users[0].password_hash);
      if (isValid) {
        console.log("✅ Password verification successful!");
      } else {
        console.log("❌ Password verification failed!");
      }
    }

    await connection.end();
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

resetAdminPassword();
