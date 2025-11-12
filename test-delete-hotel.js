// Quick test to see what's happening with DELETE
require("dotenv").config();
const db = require("./backend/config/database");

async function testDelete() {
  try {
    console.log("🔗 Connecting to database...\n");

    // First, let's see what hotels exist
    const [hotels] = await db.query(
      "SELECT hotel_id, hotel_name FROM hotels LIMIT 5"
    );
    console.log("📋 Current hotels in database:");
    console.table(hotels);

    if (hotels.length === 0) {
      console.log("❌ No hotels found!");
      process.exit(0);
    }

    const testHotelId = hotels[0].hotel_id;
    console.log(`\n🎯 Testing DELETE on hotel: ${testHotelId}\n`);

    // Check if this hotel has bookings
    const [bookings] = await db.query(
      "SELECT COUNT(*) as count FROM bookings WHERE hotel_id = ?",
      [testHotelId]
    );
    console.log(`📋 This hotel has ${bookings[0].count} booking(s)\n`);

    // Try to delete bookings first
    console.log("🗑️  Step 1: Deleting bookings...");
    const [bookingResult] = await db.query(
      "DELETE FROM bookings WHERE hotel_id = ?",
      [testHotelId]
    );
    console.log(`✅ Deleted ${bookingResult.affectedRows} booking(s)\n`);

    // Try to delete the hotel
    console.log("🗑️  Step 2: Deleting hotel...");
    const [hotelResult] = await db.query(
      "DELETE FROM hotels WHERE hotel_id = ?",
      [testHotelId]
    );
    console.log(`✅ Deleted ${hotelResult.affectedRows} hotel(s)\n`);

    if (hotelResult.affectedRows > 0) {
      console.log("🎉 SUCCESS! Hotel was deleted!");

      // Verify it's gone
      const [verify] = await db.query(
        "SELECT * FROM hotels WHERE hotel_id = ?",
        [testHotelId]
      );

      if (verify.length === 0) {
        console.log("✅ Verified: Hotel no longer exists in database");
      } else {
        console.log("⚠️  WARNING: Hotel still exists!");
      }
    } else {
      console.log("❌ FAILED! No rows were deleted");
    }
  } catch (error) {
    console.error("💥 ERROR:", error.message);
    console.error("Error code:", error.code);
  } finally {
    process.exit(0);
  }
}

testDelete();
