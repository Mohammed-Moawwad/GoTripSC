// ====================================
// Hotel Routes
// This defines all the URLs for hotel operations
// ====================================

const express = require("express");
const router = express.Router();

// Import the hotel controller functions
const {
  getAllHotels,
  getHotelById,
  getHotelsByCity,
  createHotel,
  updateHotel,
  deleteHotel,
  searchHotels,
} = require("../controllers/hotelController");

// ====================================
// DEFINE ROUTES
// ====================================

// GET /api/hotels/search - Search hotels with filters
// Example: http://localhost:3000/api/hotels/search?query=Riyadh&minPrice=100&maxPrice=500
router.get("/search", searchHotels);

// GET /api/hotels - Get all active hotels
// Example: http://localhost:3000/api/hotels
router.get("/", getAllHotels);

// GET /api/hotels/city/:cityName - Get hotels by city
// Example: http://localhost:3000/api/hotels/city/Riyadh
router.get("/city/:cityName", getHotelsByCity);

// GET /api/hotels/:id - Get single hotel by ID
// Example: http://localhost:3000/api/hotels/HTL001
router.get("/:id", getHotelById);

// POST /api/hotels - Create new hotel (Admin only)
// Body: { hotel_id, hotel_name, city, price_per_night, etc. }
router.post("/", createHotel);

// PUT /api/hotels/:id - Update hotel (Admin only)
// Body: { field_to_update: new_value }
router.put("/:id", updateHotel);

// DELETE /api/hotels/:id - Delete hotel (Admin only)
// This sets status to InActive
router.delete("/:id", deleteHotel);

// Export the router
module.exports = router;
