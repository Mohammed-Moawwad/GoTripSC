const db = require("../config/database");

/**
 * Get all bookings for the logged-in user
 */
const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.userId;

    const [bookings] = await db.execute(
      `SELECT 
        hb.booking_id,
        hb.hotel_id,
        hb.check_in_date,
        hb.check_out_date,
        hb.number_of_rooms,
        hb.number_of_guests,
        hb.total_price,
        hb.booking_status,
        hb.payment_status,
        hb.created_at,
        h.hotel_name,
        h.location,
        h.city,
        h.country,
        h.rating,
        h.price_per_night
      FROM hotel_bookings hb
      LEFT JOIN hotels h ON hb.hotel_id = h.hotel_id
      WHERE hb.user_id = ?
      ORDER BY hb.created_at DESC`,
      [userId]
    );

    res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      data: {
        bookings: bookings,
        total: bookings.length,
      },
    });
  } catch (error) {
    console.error("Get User Bookings Error:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving bookings",
    });
  }
};

/**
 * Get active bookings (Pending or Confirmed)
 */
const getActiveBookings = async (req, res) => {
  try {
    const userId = req.user.userId;

    const [bookings] = await db.execute(
      `SELECT 
        hb.booking_id,
        hb.hotel_id,
        hb.check_in_date,
        hb.check_out_date,
        hb.number_of_rooms,
        hb.number_of_guests,
        hb.total_price,
        hb.booking_status,
        hb.payment_status,
        hb.created_at,
        h.hotel_name,
        h.location,
        h.city,
        h.country,
        h.rating
      FROM hotel_bookings hb
      LEFT JOIN hotels h ON hb.hotel_id = h.hotel_id
      WHERE hb.user_id = ? 
      AND hb.booking_status IN ('Pending', 'Confirmed')
      AND hb.check_out_date >= CURDATE()
      ORDER BY hb.check_in_date ASC`,
      [userId]
    );

    res.status(200).json({
      success: true,
      message: "Active bookings retrieved successfully",
      data: {
        bookings: bookings,
        total: bookings.length,
      },
    });
  } catch (error) {
    console.error("Get Active Bookings Error:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving active bookings",
    });
  }
};

/**
 * Get booking history (Completed or Cancelled)
 */
const getBookingHistory = async (req, res) => {
  try {
    const userId = req.user.userId;

    const [bookings] = await db.execute(
      `SELECT 
        hb.booking_id,
        hb.hotel_id,
        hb.check_in_date,
        hb.check_out_date,
        hb.number_of_rooms,
        hb.number_of_guests,
        hb.total_price,
        hb.booking_status,
        hb.payment_status,
        hb.created_at,
        h.hotel_name,
        h.location,
        h.city,
        h.country,
        h.rating
      FROM hotel_bookings hb
      LEFT JOIN hotels h ON hb.hotel_id = h.hotel_id
      WHERE hb.user_id = ? 
      AND (hb.booking_status IN ('Completed', 'Cancelled') 
           OR hb.check_out_date < CURDATE())
      ORDER BY hb.created_at DESC`,
      [userId]
    );

    res.status(200).json({
      success: true,
      message: "Booking history retrieved successfully",
      data: {
        bookings: bookings,
        total: bookings.length,
      },
    });
  } catch (error) {
    console.error("Get Booking History Error:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving booking history",
    });
  }
};

/**
 * Get booking statistics for dashboard
 */
const getBookingStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get total bookings
    const [totalBookings] = await db.execute(
      "SELECT COUNT(*) as total FROM hotel_bookings WHERE user_id = ?",
      [userId]
    );

    // Get active bookings
    const [activeBookings] = await db.execute(
      `SELECT COUNT(*) as total 
       FROM hotel_bookings 
       WHERE user_id = ? 
       AND booking_status IN ('Pending', 'Confirmed')
       AND check_out_date >= CURDATE()`,
      [userId]
    );

    // Get completed bookings
    const [completedBookings] = await db.execute(
      `SELECT COUNT(*) as total 
       FROM hotel_bookings 
       WHERE user_id = ? 
       AND booking_status = 'Completed'`,
      [userId]
    );

    // Get cancelled bookings
    const [cancelledBookings] = await db.execute(
      `SELECT COUNT(*) as total 
       FROM hotel_bookings 
       WHERE user_id = ? 
       AND booking_status = 'Cancelled'`,
      [userId]
    );

    // Get total spent
    const [totalSpent] = await db.execute(
      `SELECT COALESCE(SUM(total_price), 0) as total 
       FROM hotel_bookings 
       WHERE user_id = ? 
       AND payment_status = 'Paid'`,
      [userId]
    );

    res.status(200).json({
      success: true,
      message: "Booking statistics retrieved successfully",
      data: {
        total: totalBookings[0].total,
        active: activeBookings[0].total,
        completed: completedBookings[0].total,
        cancelled: cancelledBookings[0].total,
        totalSpent: parseFloat(totalSpent[0].total),
      },
    });
  } catch (error) {
    console.error("Get Booking Stats Error:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving booking statistics",
    });
  }
};

/**
 * Get single booking details
 */
const getBookingDetails = async (req, res) => {
  try {
    const userId = req.user.userId;
    const bookingId = req.params.bookingId;

    const [bookings] = await db.execute(
      `SELECT 
        hb.*,
        h.hotel_name,
        h.location,
        h.city,
        h.country,
        h.rating,
        h.amenities,
        h.description
      FROM hotel_bookings hb
      LEFT JOIN hotels h ON hb.hotel_id = h.hotel_id
      WHERE hb.booking_id = ? AND hb.user_id = ?`,
      [bookingId, userId]
    );

    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking details retrieved successfully",
      data: {
        booking: bookings[0],
      },
    });
  } catch (error) {
    console.error("Get Booking Details Error:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving booking details",
    });
  }
};

/**
 * Cancel a booking
 */
const cancelBooking = async (req, res) => {
  try {
    const userId = req.user.userId;
    const bookingId = req.params.bookingId;

    // Check if booking exists and belongs to user
    const [bookings] = await db.execute(
      `SELECT * FROM hotel_bookings 
       WHERE booking_id = ? AND user_id = ?`,
      [bookingId, userId]
    );

    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const booking = bookings[0];

    // Check if booking can be cancelled
    if (
      booking.booking_status === "Cancelled" ||
      booking.booking_status === "Completed"
    ) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a ${booking.booking_status.toLowerCase()} booking`,
      });
    }

    // Get a connection from the pool for transaction
    const connection = await db.getConnection();

    try {
      // Start transaction
      await connection.beginTransaction();

      // Update booking status
      await connection.execute(
        `UPDATE hotel_bookings 
         SET booking_status = 'Cancelled' 
         WHERE booking_id = ?`,
        [bookingId]
      );

      // Restore available rooms to hotel
      await connection.execute(
        `UPDATE hotels 
         SET available_rooms = available_rooms + ? 
         WHERE hotel_id = ?`,
        [booking.number_of_rooms, booking.hotel_id]
      );

      // Commit transaction
      await connection.commit();

      // Release connection back to pool
      connection.release();

      res.status(200).json({
        success: true,
        message: "Booking cancelled successfully and rooms restored",
      });
    } catch (transactionError) {
      // Rollback on error
      await connection.rollback();
      // Release connection back to pool
      connection.release();
      throw transactionError;
    }
  } catch (error) {
    console.error("Cancel Booking Error:", error);
    res.status(500).json({
      success: false,
      message: "Error cancelling booking",
    });
  }
};

/**
 * Get all flight bookings for the logged-in user
 */
const getFlightBookings = async (req, res) => {
  try {
    const userId = req.user.userId;

    const [bookings] = await db.execute(
      `SELECT 
        fb.booking_id,
        fb.flight_id,
        fb.number_of_passengers,
        fb.seat_numbers,
        fb.total_price,
        fb.booking_status,
        fb.payment_status,
        fb.created_at,
        f.flight_number,
        f.airline,
        f.departure_city,
        f.arrival_city,
        f.departure_time,
        f.arrival_time,
        f.duration_minutes,
        'flight' as service_type
      FROM flight_bookings fb
      LEFT JOIN flights f ON fb.flight_id = f.flight_id
      WHERE fb.user_id = ?
      ORDER BY fb.created_at DESC`,
      [userId]
    );

    res.status(200).json({
      success: true,
      message: "Flight bookings retrieved successfully",
      data: {
        bookings: bookings,
        total: bookings.length,
      },
    });
  } catch (error) {
    console.error("Get Flight Bookings Error:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving flight bookings",
    });
  }
};

/**
 * Get all bus bookings for the logged-in user
 */
const getBusBookings = async (req, res) => {
  try {
    const userId = req.user.userId;

    const [bookings] = await db.execute(
      `SELECT 
        bb.booking_id,
        bb.bus_id,
        bb.number_of_passengers,
        bb.seat_numbers,
        bb.total_price,
        bb.booking_status,
        bb.payment_status,
        bb.created_at,
        b.bus_number,
        b.company,
        b.departure_city,
        b.arrival_city,
        b.departure_time,
        b.arrival_time,
        b.duration_minutes,
        'bus' as service_type
      FROM bus_bookings bb
      LEFT JOIN buses b ON bb.bus_id = b.bus_id
      WHERE bb.user_id = ?
      ORDER BY bb.created_at DESC`,
      [userId]
    );

    res.status(200).json({
      success: true,
      message: "Bus bookings retrieved successfully",
      data: {
        bookings: bookings,
        total: bookings.length,
      },
    });
  } catch (error) {
    console.error("Get Bus Bookings Error:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving bus bookings",
    });
  }
};

/**
 * Get all bookings (hotels, flights, buses) for the logged-in user
 */
const getAllBookings = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get hotel bookings
    const [hotelBookings] = await db.execute(
      `SELECT 
        hb.booking_id,
        hb.hotel_id as service_id,
        hb.check_in_date,
        hb.check_out_date,
        hb.number_of_rooms,
        hb.number_of_guests,
        hb.total_price,
        hb.booking_status,
        hb.payment_status,
        hb.created_at,
        h.hotel_name as service_name,
        h.location,
        h.city,
        h.country,
        'hotel' as service_type
      FROM hotel_bookings hb
      LEFT JOIN hotels h ON hb.hotel_id = h.hotel_id
      WHERE hb.user_id = ?`,
      [userId]
    );

    // Get flight bookings
    const [flightBookings] = await db.execute(
      `SELECT 
        fb.booking_id,
        fb.flight_id as service_id,
        fb.number_of_passengers,
        fb.seat_numbers,
        fb.total_price,
        fb.booking_status,
        fb.payment_status,
        fb.created_at,
        f.flight_number,
        f.airline as service_name,
        f.departure_city,
        f.arrival_city,
        f.departure_time,
        f.arrival_time,
        'flight' as service_type
      FROM flight_bookings fb
      LEFT JOIN flights f ON fb.flight_id = f.flight_id
      WHERE fb.user_id = ?`,
      [userId]
    );

    // Get bus bookings
    const [busBookings] = await db.execute(
      `SELECT 
        bb.booking_id,
        bb.bus_id as service_id,
        bb.number_of_passengers,
        bb.seat_numbers,
        bb.total_price,
        bb.booking_status,
        bb.payment_status,
        bb.created_at,
        b.bus_number,
        b.company as service_name,
        b.departure_city,
        b.arrival_city,
        b.departure_time,
        b.arrival_time,
        'bus' as service_type
      FROM bus_bookings bb
      LEFT JOIN buses b ON bb.bus_id = b.bus_id
      WHERE bb.user_id = ?`,
      [userId]
    );

    // Combine all bookings
    const allBookings = [
      ...hotelBookings.map((b) => ({ ...b, service_type: "hotel" })),
      ...flightBookings.map((b) => ({ ...b, service_type: "flight" })),
      ...busBookings.map((b) => ({ ...b, service_type: "bus" })),
    ];

    // Sort by creation date
    allBookings.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.status(200).json({
      success: true,
      message: "All bookings retrieved successfully",
      data: {
        bookings: allBookings,
        total: allBookings.length,
        byService: {
          hotels: hotelBookings.length,
          flights: flightBookings.length,
          buses: busBookings.length,
        },
      },
    });
  } catch (error) {
    console.error("Get All Bookings Error:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving bookings",
    });
  }
};

/**
 * Create a new hotel booking
 */
const createHotelBooking = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      hotel_id,
      check_in_date,
      check_out_date,
      number_of_rooms,
      number_of_guests,
      total_price,
    } = req.body;

    // Validate required fields
    if (
      !hotel_id ||
      !check_in_date ||
      !check_out_date ||
      !number_of_rooms ||
      !number_of_guests
    ) {
      return res.status(400).json({
        success: false,
        message: "All booking details are required",
      });
    }

    // Check if hotel exists and has available rooms
    const [hotels] = await db.execute(
      "SELECT hotel_id, hotel_name, available_rooms, price_per_night FROM hotels WHERE hotel_id = ? AND status = 'Active'",
      [hotel_id]
    );

    if (hotels.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found or inactive",
      });
    }

    const hotel = hotels[0];

    // Check room availability
    if (hotel.available_rooms < number_of_rooms) {
      return res.status(400).json({
        success: false,
        message: `Only ${hotel.available_rooms} rooms available`,
      });
    }

    // Generate booking ID
    const bookingId = `BK${Date.now()}`;

    // Get a connection from the pool for transaction
    const connection = await db.getConnection();

    try {
      // Start transaction
      await connection.beginTransaction();

      // Insert booking
      await connection.execute(
        `INSERT INTO hotel_bookings 
        (booking_id, user_id, hotel_id, check_in_date, check_out_date, 
         number_of_rooms, number_of_guests, total_price, booking_status, payment_status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Confirmed', 'Paid')`,
        [
          bookingId,
          userId,
          hotel_id,
          check_in_date,
          check_out_date,
          number_of_rooms,
          number_of_guests,
          total_price,
        ]
      );

      // Update hotel available rooms
      console.log(
        `Decreasing available rooms by ${number_of_rooms} for hotel ${hotel_id}`
      );
      const [updateResult] = await connection.execute(
        "UPDATE hotels SET available_rooms = available_rooms - ? WHERE hotel_id = ?",
        [number_of_rooms, hotel_id]
      );
      console.log(`Rooms update result:`, updateResult);

      // Commit transaction
      await connection.commit();
      console.log(`✅ Transaction committed successfully`);

      // Release connection back to pool
      connection.release();

      // Fetch the created booking with hotel details
      const [newBooking] = await db.execute(
        `SELECT 
          hb.*,
          h.hotel_name,
          h.location,
          h.city,
          h.country,
          h.rating
        FROM hotel_bookings hb
        LEFT JOIN hotels h ON hb.hotel_id = h.hotel_id
        WHERE hb.booking_id = ?`,
        [bookingId]
      );

      res.status(201).json({
        success: true,
        message: "Booking created successfully",
        data: {
          booking: newBooking[0],
        },
      });
    } catch (transactionError) {
      // Rollback on error
      await connection.rollback();
      // Release connection back to pool
      connection.release();
      throw transactionError;
    }
  } catch (error) {
    console.error("Create Booking Error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating booking",
      error: error.message,
    });
  }
};

/**
 * Create a new flight booking
 */
const createFlightBooking = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      flight_id,
      airline,
      flight_number,
      from_city,
      to_city,
      departure_date,
      departure_time,
      arrival_time,
      number_of_passengers,
      class_type,
      total_price,
      passengers,
    } = req.body;

    // Validate required fields
    if (
      !airline ||
      !flight_number ||
      !from_city ||
      !to_city ||
      !departure_date ||
      !number_of_passengers ||
      !total_price
    ) {
      return res.status(400).json({
        success: false,
        message: "All booking details are required",
      });
    }

    // Generate booking ID
    const bookingId = `FLTBK${Date.now()}`;

    // Get a connection from the pool for transaction
    const connection = await db.getConnection();

    try {
      // Start transaction
      await connection.beginTransaction();

      // First, try to insert with extended fields if columns exist
      // Otherwise fall back to basic schema
      try {
        await connection.execute(
          `INSERT INTO flight_bookings 
          (booking_id, user_id, flight_id, airline, flight_number, from_city, to_city, 
           departure_date, departure_time, arrival_time, number_of_passengers, class_type, 
           total_price, booking_status, payment_status, passengers_data)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Confirmed', 'Paid', ?)`,
          [
            bookingId,
            userId,
            flight_id || `FL${Date.now()}`,
            airline,
            flight_number,
            from_city,
            to_city,
            departure_date,
            departure_time || "00:00:00",
            arrival_time || "00:00:00",
            number_of_passengers,
            class_type || "Economy",
            total_price,
            passengers && Array.isArray(passengers)
              ? JSON.stringify(passengers)
              : null,
          ]
        );
      } catch (insertError) {
        // If extended schema doesn't exist, use basic schema
        console.log("Using basic flight_bookings schema");
        await connection.execute(
          `INSERT INTO flight_bookings 
          (booking_id, user_id, flight_id, number_of_passengers, total_price, 
           booking_status, payment_status)
          VALUES (?, ?, ?, ?, ?, 'Confirmed', 'Paid')`,
          [
            bookingId,
            userId,
            flight_id || `FL${Date.now()}`,
            number_of_passengers,
            total_price,
          ]
        );
      }

      // Commit transaction
      await connection.commit();

      res.status(201).json({
        success: true,
        message: "Flight booking created successfully",
        data: {
          bookingId,
          booking_status: "Confirmed",
          payment_status: "Paid",
        },
      });
    } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      throw error;
    } finally {
      // Release connection back to pool
      connection.release();
    }
  } catch (error) {
    console.error("Create Flight Booking Error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating flight booking",
      error: error.message,
    });
  }
};

/**
 * Get all hotel bookings (for admin dashboard)
 * Returns all bookings across all users
 */
const getAdminHotelBookings = async (req, res) => {
  try {
    const [bookings] = await db.execute(`
      SELECT 
        hb.booking_id,
        hb.hotel_id,
        hb.user_id,
        hb.check_in_date,
        hb.check_out_date,
        hb.number_of_rooms,
        hb.number_of_guests,
        hb.total_price,
        hb.booking_status,
        hb.payment_status,
        hb.created_at,
        h.hotel_name,
        h.location,
        h.city,
        h.country,
        h.rating,
        h.price_per_night,
        u.email as user_email,
        u.user_id as customer_id
      FROM hotel_bookings hb
      LEFT JOIN hotels h ON hb.hotel_id = h.hotel_id
      LEFT JOIN users u ON hb.user_id = u.user_id
      ORDER BY hb.created_at DESC
    `);

    // Count by status
    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter(
      (b) => b.booking_status === "Pending"
    ).length;
    const confirmedBookings = bookings.filter(
      (b) => b.booking_status === "Confirmed"
    ).length;
    const cancelledBookings = bookings.filter(
      (b) => b.booking_status === "Cancelled"
    ).length;

    res.status(200).json({
      success: true,
      message: "Admin hotel bookings retrieved successfully",
      data: {
        bookings: bookings,
        statistics: {
          totalBookings,
          pendingBookings,
          confirmedBookings,
          cancelledBookings,
        },
      },
    });
  } catch (error) {
    console.error("Get Admin Hotel Bookings Error:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving bookings",
      error: error.message,
    });
  }
};

module.exports = {
  getUserBookings,
  getActiveBookings,
  getBookingHistory,
  getBookingStats,
  getBookingDetails,
  cancelBooking,
  getFlightBookings,
  getBusBookings,
  getAllBookings,
  createHotelBooking,
  createFlightBooking,
  getAdminHotelBookings,
};
