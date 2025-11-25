const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { authenticate } = require("../middleware/auth");

// All routes require authentication
router.use(authenticate);

// Get booking statistics
router.get("/stats", bookingController.getBookingStats);

// Get all bookings
router.get("/", bookingController.getUserBookings);

// Get active bookings
router.get("/active", bookingController.getActiveBookings);

// Get booking history
router.get("/history", bookingController.getBookingHistory);

// Create new hotel booking
router.post("/hotels", bookingController.createHotelBooking);

// Create new flight booking
router.post("/flights", bookingController.createFlightBooking);

// Get all bookings (hotels, flights, buses combined)
router.get("/all", bookingController.getAllBookings);

// Get flight bookings only
router.get("/flights", bookingController.getFlightBookings);

// Get bus bookings only
router.get("/buses", bookingController.getBusBookings);

// Get specific booking details
router.get("/:bookingId", bookingController.getBookingDetails);

// Cancel a booking
router.put("/:bookingId/cancel", bookingController.cancelBooking);

module.exports = router;
