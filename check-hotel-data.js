// Quick script to check hotel data structure
require("dotenv").config();
const db = require("./backend/config/database");

async function checkHotelData() {
  try {
    const [hotels] = await db.query("SELECT * FROM hotels LIMIT 3");
    console.log("Sample Hotel Data:");
    console.log(JSON.stringify(hotels, null, 2));

    const [columns] = await db.query("DESCRIBE hotels");
    console.log("\nHotels Table Structure:");
    console.log(columns);

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

checkHotelData();
