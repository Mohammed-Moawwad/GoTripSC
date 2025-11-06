require("dotenv").config();
const mysql = require("mysql2/promise");

async function checkAdmin() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "gotrip_db",
    });

    console.log("✅ Connected to database\n");

    // Get admin user
    const [users] = await connection.execute(
      `SELECT user_id, first_name, last_name, email, role, status 
       FROM users 
       WHERE email = 'Admin@gmail.com'`
    );

    if (users.length === 0) {
      console.log("❌ No admin user found with email 'Admin@gmail.com'");
    } else {
      console.log("👤 Admin User Details:");
      console.log("========================");
      console.log("User ID:", users[0].user_id);
      console.log("Name:", users[0].first_name, users[0].last_name);
      console.log("Email:", users[0].email);
      console.log("Role:", users[0].role);
      console.log("Status:", users[0].status);
      console.log("========================\n");

      if (users[0].role !== "admin") {
        console.log(
          "⚠️  WARNING: User role is NOT 'admin', it's:",
          users[0].role
        );
        console.log("This user will not be redirected to admin dashboard!");
      } else {
        console.log("✅ Role is correctly set to 'admin'");
      }
    }

    await connection.end();
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

checkAdmin();
