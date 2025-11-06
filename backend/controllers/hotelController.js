// ====================================
// Hotel Controller
// This handles all hotel-related operations
// ====================================

const db = require("../config/database");

// ====================================
// 1. GET ALL HOTELS
// ====================================
// This function gets all hotels from the database
// URL: GET /api/hotels
// Example: http://localhost:3000/api/hotels

const getAllHotels = async (req, res) => {
  try {
    // Check if request wants all hotels (for admin) or just active (for users)
    const includeInactive = req.query.includeInactive === "true";

    // SQL Query: Select hotels based on admin/user view
    const query = includeInactive
      ? "SELECT * FROM hotels ORDER BY hotel_id DESC"
      : 'SELECT * FROM hotels WHERE status = "Active"';

    const [hotels] = await db.query(query);

    // Send success response with the hotels data
    res.status(200).json({
      success: true,
      count: hotels.length,
      data: hotels,
    });
  } catch (error) {
    console.error("Error getting hotels:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching hotels",
      error: error.message,
    });
  }
};

// ====================================
// 2. GET SINGLE HOTEL BY ID
// ====================================
// This function gets one specific hotel by its ID
// URL: GET /api/hotels/:id
// Example: http://localhost:3000/api/hotels/HTL001

const getHotelById = async (req, res) => {
  try {
    const hotelId = req.params.id; // Get hotel ID from URL

    // SQL Query: Select hotel with matching ID
    const [hotels] = await db.query("SELECT * FROM hotels WHERE hotel_id = ?", [
      hotelId,
    ]);

    // Check if hotel exists
    if (hotels.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Hotel with ID ${hotelId} not found`,
      });
    }

    // Send the hotel data
    res.status(200).json({
      success: true,
      data: hotels[0],
    });
  } catch (error) {
    console.error("Error getting hotel:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching hotel",
      error: error.message,
    });
  }
};

// ====================================
// 3. GET HOTELS BY CITY
// ====================================
// This function gets all hotels in a specific city
// URL: GET /api/hotels/city/:cityName
// Example: http://localhost:3000/api/hotels/city/Riyadh

const getHotelsByCity = async (req, res) => {
  try {
    const city = req.params.cityName;

    // SQL Query: Select hotels in specific city
    const [hotels] = await db.query(
      'SELECT * FROM hotels WHERE city = ? AND status = "Active"',
      [city]
    );

    res.status(200).json({
      success: true,
      city: city,
      count: hotels.length,
      data: hotels,
    });
  } catch (error) {
    console.error("Error getting hotels by city:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching hotels",
      error: error.message,
    });
  }
};

// ====================================
// 4. CREATE NEW HOTEL (Admin only - later)
// ====================================
// This function adds a new hotel to the database
// URL: POST /api/hotels
// Body: { hotel_name, city, price_per_night, etc. }

const createHotel = async (req, res) => {
  try {
    const {
      hotel_name,
      location,
      city,
      country,
      rating,
      price_per_night,
      total_rooms,
      available_rooms,
      amenities,
      description,
      status,
    } = req.body;

    // Generate hotel_id by finding the max numeric ID in database
    const [allIds] = await db.query(`SELECT hotel_id FROM hotels`);

    let hotel_id = "HTL001"; // Default first ID
    if (allIds.length > 0) {
      // Extract all numeric parts and find the maximum
      const numbers = allIds.map((row) => {
        const numStr = row.hotel_id.replace("HTL", "");
        return parseInt(numStr) || 0;
      });
      const maxNum = Math.max(...numbers);
      hotel_id = `HTL${String(maxNum + 1).padStart(3, "0")}`;
    }

    // SQL Query: Insert new hotel
    const [result] = await db.query(
      `INSERT INTO hotels 
      (hotel_id, hotel_name, location, city, country, rating, price_per_night, 
       total_rooms, available_rooms, amenities, description, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        hotel_id,
        hotel_name,
        location,
        city,
        country,
        rating,
        price_per_night,
        total_rooms,
        available_rooms,
        amenities,
        description,
        status || "Active", // Default to Active if not provided
      ]
    );

    res.status(201).json({
      success: true,
      message: "Hotel created successfully",
      data: { hotel_id },
    });
  } catch (error) {
    console.error("Error creating hotel:", error);
    res.status(500).json({
      success: false,
      message: "Error creating hotel",
      error: error.message,
    });
  }
};

// ====================================
// 5. UPDATE HOTEL (Admin only - later)
// ====================================
// This function updates an existing hotel
// URL: PUT /api/hotels/:id

const updateHotel = async (req, res) => {
  try {
    const hotelId = req.params.id;
    const updates = req.body;

    // Build dynamic SQL update query
    const fields = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = [...Object.values(updates), hotelId];

    const [result] = await db.query(
      `UPDATE hotels SET ${fields} WHERE hotel_id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: `Hotel with ID ${hotelId} not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Hotel updated successfully",
    });
  } catch (error) {
    console.error("Error updating hotel:", error);
    res.status(500).json({
      success: false,
      message: "Error updating hotel",
      error: error.message,
    });
  }
};

// ====================================
// 6. DELETE HOTEL (Admin only - later)
// ====================================
// This function deletes a hotel (sets status to InActive)
// URL: DELETE /api/hotels/:id

const deleteHotel = async (req, res) => {
  try {
    const hotelId = req.params.id;

    // Instead of deleting, we set status to InActive (soft delete)
    const [result] = await db.query(
      'UPDATE hotels SET status = "InActive" WHERE hotel_id = ?',
      [hotelId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: `Hotel with ID ${hotelId} not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Hotel deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting hotel:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting hotel",
      error: error.message,
    });
  }
};

// ====================================
// 7. SEARCH HOTELS WITH FILTERS
// ====================================
// This function searches hotels by city/name with filters
// URL: GET /api/hotels/search?query=value&minPrice=100&maxPrice=500&rating=4&amenities=wifi,pool
// Query params: query, minPrice, maxPrice, rating, amenities, roomType

const searchHotels = async (req, res) => {
  try {
    const {
      query = "",
      minPrice = 0,
      maxPrice = 999999,
      rating = 0,
      amenities = "",
      roomType = "",
    } = req.query;

    // Build SQL query with filters
    let sqlQuery = `
      SELECT * FROM hotels 
      WHERE status = "Active" 
      AND (city LIKE ? OR hotel_name LIKE ?)
      AND price_per_night >= ?
      AND price_per_night <= ?
      AND rating >= ?
    `;

    const params = [
      `%${query}%`,
      `%${query}%`,
      parseFloat(minPrice),
      parseFloat(maxPrice),
      parseFloat(rating),
    ];

    // Add amenities filter if provided
    if (amenities) {
      const amenitiesList = amenities.split(",").map((a) => a.trim());
      amenitiesList.forEach((amenity) => {
        sqlQuery += ` AND amenities LIKE ?`;
        params.push(`%${amenity}%`);
      });
    }

    // Add room type filter if provided
    if (roomType) {
      sqlQuery += ` AND room_types LIKE ?`;
      params.push(`%${roomType}%`);
    }

    sqlQuery += ` ORDER BY rating DESC, price_per_night ASC`;

    const [hotels] = await db.query(sqlQuery, params);

    res.status(200).json({
      success: true,
      count: hotels.length,
      data: hotels,
      filters: {
        query,
        minPrice,
        maxPrice,
        rating,
        amenities,
        roomType,
      },
    });
  } catch (error) {
    console.error("Error searching hotels:", error);
    res.status(500).json({
      success: false,
      message: "Error searching hotels",
      error: error.message,
    });
  }
};

// ====================================
// EXPORT ALL FUNCTIONS
// ====================================
// Make these functions available to other files

module.exports = {
  getAllHotels,
  getHotelById,
  getHotelsByCity,
  createHotel,
  updateHotel,
  deleteHotel,
  searchHotels,
};
