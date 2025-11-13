# 🏨 CRUD Operations Explanation - Hotel Management System

## GoTrip Project - Database Management

**Student:** [Mohammed] && [Ibrahim]
**Professor:** [Abo Baker]  
**Course:** Web development
**Date:** November 12, 2025

---

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Architecture & Technology Stack](#architecture)
3. [CREATE Operation](#create-operation)
4. [READ Operation](#read-operation)
5. [UPDATE Operation](#update-operation)
6. [DELETE Operation](#delete-operation)
7. [Database Schema](#database-schema)
8. [API Endpoints](#api-endpoints)
9. [Frontend-Backend Integration](#integration)
10. [Error Handling & Validation](#error-handling)

---

<a name="system-overview"></a>

## 1️⃣ SYSTEM OVERVIEW

### What is CRUD?

**CRUD** stands for the four basic database operations:

- **C**reate - Add new records
- **R**ead - Retrieve existing records
- **U**pdate - Modify existing records
- **D**elete - Remove records

### GoTrip Hotel Management System

Our system implements CRUD operations for managing hotels in a travel booking platform. The admin interface (`hotel-management.html`) allows administrators to:

- View all hotels (READ)
- Add new hotels (CREATE)
- Edit hotel information (UPDATE)
- Remove hotels permanently (DELETE)

---

<a name="architecture"></a>

## 2️⃣ ARCHITECTURE & TECHNOLOGY STACK

### Three-Tier Architecture

```
┌─────────────────────────────────────────┐
│         PRESENTATION LAYER              │
│  (Frontend - HTML/CSS/JavaScript)       │
│  - hotel-management.html                │
│  - hotel-management.js                  │
│  - hotel-management.css                 │
└─────────────────┬───────────────────────┘
                  │ HTTP Requests (AJAX/Fetch)
┌─────────────────▼───────────────────────┐
│         APPLICATION LAYER               │
│  (Backend - Node.js + Express)          │
│  - server.js                            │
│  - hotelController.js                   │
│  - hotelRoutes.js                       │
└─────────────────┬───────────────────────┘
                  │ SQL Queries
┌─────────────────▼───────────────────────┐
│         DATA LAYER                      │
│  (Database - MySQL on Railway Cloud)   │
│  - hotels table                         │
│  - hotel_bookings table                 │
│  - users table                          │
└─────────────────────────────────────────┘
```

### Technology Stack

| Layer              | Technology              | Purpose                         |
| ------------------ | ----------------------- | ------------------------------- |
| **Frontend**       | HTML5, CSS3, JavaScript | User interface and interaction  |
| **Backend**        | Node.js, Express.js     | Server-side logic and API       |
| **Database**       | MySQL (Railway Cloud)   | Data persistence                |
| **ORM**            | mysql2 (with promises)  | Database connection and queries |
| **Authentication** | JWT (JSON Web Tokens)   | Admin verification              |

---

<a name="create-operation"></a>

## 3️⃣ CREATE OPERATION (Add New Hotel)

### Overview

Allows admin to add a new hotel to the database.

### Frontend Flow (hotel-management.js)

```javascript
// 1. Admin clicks "Add New Hotel" button 
document.querySelector('.add-hotel-btn').addEventListener('click', () => {
  this.showAddHotelModal();
});

// 2. Modal opens with empty form
showAddHotelModal() {
  // Display modal with input fields:
  // - Hotel Name
  // - City, Country
  // - Location (address)
  // - Price per Night
  // - Total Rooms
  // - Available Rooms
  // - Rating (1-5 stars)
  // - Amenities (WiFi, Pool, Parking, etc.)
  // - Description
  // - Status (Active/InActive)
}

//When an admin wants to add a new hotel, they fill in a form with hotel information like the name, city, 
// price, number of rooms, and rating.

//  After clicking "Add Hotel," the handleAddHotel() function changes 
// the form data into JSON format using JSON.stringify() and sends it to the backend server using a POST request. 

// 3. Admin fills form and clicks "Add Hotel"
async handleAddHotel(hotelData) {
  // Send POST request to backend
  const response = await fetch(`${API_BASE_URL}/hotels`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(hotelData),
  });

  const result = await response.json();

  if (result.success) {
    // Show success message
    // Refresh hotel list
    this.fetchHotels();
  }
}

```

### Backend Implementation (hotelController.js)



```javascript
// On the backend, the createHotel() function gets the data, creates a unique hotel ID (like HTL006) by finding the last ID number and adding one, then saves the hotel into the MySQL database using a safe query method.

// The backend sends back a message saying { success: true, hotel_id: "HTL006" }. 

// The frontend checks if result.success is true—if yes, it shows a green success message and automatically updates the hotel table by calling fetchHotels() to get the new hotel list from the database.

// This whole process happens very quickly and shows the new hotel in the table right away without reloading the page.

const createHotel = async (req, res) => {
  try {
    // 1. Extract data from request body
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

    // 2. Auto-generate unique hotel_id
    // Query: Get all existing hotel IDs
    const [allIds] = await db.query(`SELECT hotel_id FROM hotels`);

    let hotel_id = "HTL001"; // Default first ID

    if (allIds.length > 0) {
      // Extract numeric parts: HTL001 → 1, HTL002 → 2
      const numbers = allIds.map((row) => {
        const numStr = row.hotel_id.replace("HTL", "");
        return parseInt(numStr) || 0;
      });

      // Find highest number
      const maxNum = Math.max(...numbers);

      // Generate next ID: maxNum=5 → HTL006
      hotel_id = `HTL${String(maxNum + 1).padStart(3, "0")}`;
    }

    // 3. Insert into database
    const [result] = await db.query(
      `INSERT INTO hotels 
      (hotel_id, hotel_name, location, city, country, rating, 
       price_per_night, total_rooms, available_rooms, amenities, 
       description, status) 
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
        status || "Active",
      ]
    );

    // 4. Send success response
    res.status(201).json({
      success: true,
      message: "Hotel created successfully",
      data: { hotel_id },
    });
  } catch (error) {
    // 5. Handle errors
    console.error("Error creating hotel:", error);
    res.status(500).json({
      success: false,
      message: "Error creating hotel",
      error: error.message,
    });
  }
};
```

### SQL Query Breakdown

**Query:**

```sql
INSERT INTO hotels
(hotel_id, hotel_name, location, city, country, rating,
 price_per_night, total_rooms, available_rooms, amenities,
 description, status)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
```

**Explanation:**

- `INSERT INTO hotels` - Specifies the target table
- Column names in parentheses - Defines which fields to populate
- `VALUES (?, ?, ...)` - Placeholders prevent SQL injection
- `?` replaced with actual values by mysql2 library

**Example:**

```sql
INSERT INTO hotels VALUES
('HTL012', 'Luxury Palace Hotel', 'Downtown', 'Riyadh', 'Saudi Arabia',
 4.5, 850.00, 100, 100, 'WiFi,Pool,Gym,Spa', 'Luxury hotel...', 'Active')
```

### Key Concepts

1. **Prepared Statements**: Using `?` placeholders prevents SQL injection attacks
2. **Auto-increment ID**: We manually generate sequential IDs (HTL001, HTL002, etc.)
3. **Default Values**: Status defaults to "Active" if not provided
4. **Validation**: Backend validates data before inserting
5. **Transaction Safety**: Database ensures atomic operations

---

<a name="read-operation"></a>

## 4️⃣ READ OPERATION (View Hotels)

### Overview

Retrieves hotel data from database and displays it to admin.

### Types of READ Operations

#### A. GET ALL HOTELS

**Frontend (hotel-management.js):**

```javascript
// When an admin opens the hotel management page, the fetchHotels() function automatically runs to get all hotels from the database.

//  This function sends a GET request to the backend at /api/hotels?includeInactive=true, which means the admin can see both active and inactive hotels

async fetchHotels() {
  // Admin sees ALL hotels (Active + InActive)
  const response = await fetch(
    `${API_BASE_URL}/hotels?includeInactive=true`
  );

  const result = await response.json();

  if (result.success) {
    // Transform data for display
    this.hotels = result.data.map((hotel) => ({
      id: hotel.hotel_id,
      name: hotel.hotel_name,
      location: `${hotel.city}, ${hotel.country}`,
      rooms: hotel.total_rooms,
      pricePerNight: `$${hotel.price_per_night}`,
      rating: parseFloat(hotel.rating).toFixed(1),
      status: hotel.status,
    }));

    // Render table with hotels
    this.renderHotelTable();
  }
}
```

**Backend (hotelController.js):**

```javascript
// The backend receives this request and the getAllHotels() function checks if the request includes inactive hotels.
//  Then it runs a SQL query SELECT * FROM hotels to get all hotel records from the database and sends them back to the frontend as a JSON array.
//  The frontend waits for the response using await and receives a list of hotels like { success: true, count: 10, data: [...] }. Next, the frontend uses .map() to change the data format—it converts hotel_id to id, combines city and country into one location field, adds a dollar sign to the price, and formats the rating to one decimal place.
//  After transforming the data, it saves it in this.hotels and calls renderHotelTable().
//  This function finds the table body in the HTML, clears old data, then creates a new row for each hotel showing the ID, name, location, rooms, price, rating, status, and action buttons (view, edit, delete).
//  The result is a complete table that displays all hotels from the database in an easy-to-read format.
const getAllHotels = async (req, res) => {
  try {
    // 1. Check if admin wants to see inactive hotels
    const includeInactive = req.query.includeInactive === "true";

    // 2. Build SQL query conditionally
    const query = includeInactive
      ? "SELECT * FROM hotels ORDER BY hotel_id DESC"
      : 'SELECT * FROM hotels WHERE status = "Active"';

    // 3. Execute query
    const [hotels] = await db.query(query);

    // 4. Return results
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
```

**SQL Queries:**

Admin view (shows all):

```sql
SELECT * FROM hotels ORDER BY hotel_id DESC
```

User view (active only):

```sql
SELECT * FROM hotels WHERE status = "Active"
```

#### B. GET SINGLE HOTEL BY ID

**Purpose:** View or edit specific hotel details

**Backend:**

```javascript
const getHotelById = async (req, res) => {
  try {
    // 1. Extract hotel ID from URL parameter
    const hotelId = req.params.id; // e.g., "HTL001"

    // 2. Query database for specific hotel
    const [hotels] = await db.query("SELECT * FROM hotels WHERE hotel_id = ?", [
      hotelId,
    ]);

    // 3. Check if hotel exists
    if (hotels.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Hotel with ID ${hotelId} not found`,
      });
    }

    // 4. Return hotel data
    res.status(200).json({
      success: true,
      data: hotels[0], // Return first (and only) result
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
```

**SQL Query:**

```sql
SELECT * FROM hotels WHERE hotel_id = 'HTL001'
```

#### C. GET HOTELS BY CITY

**Purpose:** Filter hotels by location

**Backend:**

```javascript
const getHotelsByCity = async (req, res) => {
  try {
    // 1. Get city from URL parameter
    const city = req.params.cityName;

    // 2. Query hotels in that city
    const [hotels] = await db.query(
      'SELECT * FROM hotels WHERE city = ? AND status = "Active"',
      [city]
    );

    // 3. Return filtered results
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
```

**SQL Query:**

```sql
SELECT * FROM hotels
WHERE city = 'Riyadh' AND status = 'Active'
```

### Frontend Display (hotel-management.js)

```javascript
renderHotelTable() {
  const tableBody = document.getElementById("hotel-table-body");
  tableBody.innerHTML = ""; // Clear existing rows

  // Create table row for each hotel
  this.hotels.forEach((hotel) => {
    const row = document.createElement("tr");

    // Determine status styling
    const statusClass = hotel.status === "Active"
      ? "status-active"
      : "status-inactive";

    // Build table row HTML
    row.innerHTML = `
      <td>${hotel.id}</td>
      <td>${hotel.name}</td>
      <td>${hotel.location}</td>
      <td>${hotel.rooms}</td>
      <td>${hotel.pricePerNight}</td>
      <td>⭐ ${hotel.rating}</td>
      <td><span class="${statusClass}">${hotel.status}</span></td>
      <td class="action-buttons">
        <button class="action-btn view-btn"
                data-id="${hotel.id}"
                title="View">
          <i class="fas fa-eye"></i>
        </button>
        <button class="action-btn edit-btn"
                data-id="${hotel.id}"
                title="Edit">
          <i class="fas fa-edit"></i>
        </button>
        <button class="action-btn delete-btn"
                data-id="${hotel.id}"
                title="Delete">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}
```

### Key Concepts

1. **Parameterized Queries**: Prevent SQL injection
2. **Conditional Logic**: Different queries for admin vs user
3. **Error Handling**: Graceful failure with meaningful messages
4. **Status Codes**: 200 (success), 404 (not found), 500 (server error)
5. **Data Transformation**: Backend data → Display format

---

<a name="update-operation"></a>

## 5️⃣ UPDATE OPERATION (Edit Hotel)

### Overview

Modifies existing hotel information in the database.



```javascript
async fetchHotels() {
  // 1. Call backend API to get hotels from database
  const response = await fetch(`${API_BASE_URL}/hotels?includeInactive=true`);

  // 2. Parse JSON response
  const result = await response.json();

  // 3. Store ALL hotels in memory (this.hotels array)
  this.hotels = result.data.map((hotel) => ({
    id: hotel.hotel_id,
    name: hotel.hotel_name,
    location: `${hotel.city}, ${hotel.country}`,
    rooms: hotel.total_rooms,
    pricePerNight: `$${hotel.price_per_night}`,
    rating: parseFloat(hotel.rating).toFixed(1),
    status: hotel.status,
  }));

  // Now this.hotels contains all hotels in browser memory
  // We can search it instantly without calling the database!
}
```
### Frontend Flow

```javascript
// 1. Admin clicks Edit button
handleEditHotel(hotelId) {
  // Search in memory (this.hotels array) - NOT database!
  // Uses .find() to locate the hotel with matching ID
  const hotel = this.hotels.find(h => h.id === hotelId);

  // Example: If hotelId = "HTL002"
  // Searches: [{id:"HTL001",...}, {id:"HTL002",...}, {id:"HTL003",...}]
  // Returns: {id:"HTL002", name:"Beach Resort", price:650, ...}

  // Show modal with pre-filled form
  this.showEditHotelModal(hotel);
}

// 2. Modal shows current data
showEditHotelModal(hotel) {
  // Display form with:
  // - Hotel ID (read-only)
  // - Hotel Name (editable)
  // - City, Country (editable)
  // - Price (editable)
  // - Rooms (editable)
  // - Rating (editable)
  // - Status (Active/InActive)
  // - etc.
}

// 3. Admin modifies fields and saves
async handleUpdateHotel(hotelId, updates) {
  try {
    // Send PUT request with changes
    const response = await fetch(
      `${API_BASE_URL}/hotels/${hotelId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      }
    );

    const result = await response.json();

    if (result.success) {
      this.showNotification("Hotel updated successfully!", "success");
      this.fetchHotels(); // Refresh table
    } else {
      this.showNotification("Error updating hotel", "error");
    }

  } catch (error) {
    console.error("Error updating hotel:", error);
    this.showNotification("Error updating hotel", "error");
  }
}
```

### Backend Implementation

```javascript
const updateHotel = async (req, res) => {
  try {
    // 1. Get hotel ID from URL // If URL is: PUT /api/hotels/HTL005
    const hotelId = req.params.id;

    // 2. Get updates from request body
    const updates = req.body;
    // Frontend sent this JSON:
/*{
  "hotel_name": "Grand Palace Hotel",
  "price_per_night": 950,
  "rating": 4.8
}

// Backend receives it as:
updates = {
  hotel_name: "Grand Palace Hotel",
  price_per_night: 950,
  rating: 4.8
} */

    // 3. Build dynamic SQL UPDATE query
    // Why dynamic? Admin might update 1 field or 10 fields

    // Create "field = ?" pairs: ["hotel_name = ?", "price_per_night = ?"]
    const fields = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(", ");

    // Extract values: ["New Name", 950]
    const values = [Object.values(updates), hotelId];

    // 4. Execute UPDATE query
    const [result] = await db.query(
      `UPDATE hotels SET ${fields} WHERE hotel_id = ?`,
      values
    ); 
    // The template string becomes:
"UPDATE hotels SET hotel_name = ?, price_per_night = ?, rating = ? WHERE hotel_id = ?"

// The values array:
["Grand Palace", 950, 4.8, "HTL005"]

// MySQL replaces ? with values:
"UPDATE hotels SET hotel_name = 'Grand Palace', price_per_night = 950, rating = 4.8 WHERE hotel_id = 'HTL005'"

    // 5. Check if hotel existed
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: `Hotel with ID ${hotelId} not found`,
      });
    }

    // 6. Send success response
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
```

### SQL Query Examples

**Update single field:**

```sql
UPDATE hotels
SET hotel_name = 'Grand Palace Hotel'
WHERE hotel_id = 'HTL001'
```

**Update multiple fields:**

```sql
UPDATE hotels
SET hotel_name = 'Grand Palace Hotel',
    price_per_night = 950.00,
    rating = 4.8,
    available_rooms = 85
WHERE hotel_id = 'HTL001'
```

**Update status (deactivate hotel):**

```sql
UPDATE hotels
SET status = 'InActive'
WHERE hotel_id = 'HTL001'
```

### Dynamic Query Building

**JavaScript code:**

```javascript
const updates = {
  hotel_name: "Grand Palace Hotel",
  price_per_night: 950,
  rating: 4.8,
};

// Step 1: Extract keys → ["hotel_name", "price_per_night", "rating"]
const keys = Object.keys(updates);

// Step 2: Build SET clause
const fields = keys.map((key) => `${key} = ?`).join(", ");
// Result: "hotel_name = ?, price_per_night = ?, rating = ?"

// Step 3: Extract values → ["Grand Palace Hotel", 950, 4.8, "HTL001"]
const values = [...Object.values(updates), hotelId];

// Step 4: Build final query
const query = `UPDATE hotels SET ${fields} WHERE hotel_id = ?`;
// Result: "UPDATE hotels SET hotel_name = ?, price_per_night = ?, rating = ? WHERE hotel_id = ?"

// Step 5: Execute with values
await db.query(query, values);
```

### Key Concepts

1. **Dynamic Queries**: Handle any combination of field updates
2. **Partial Updates**: Only update fields that changed
3. **Validation**: Check if hotel exists before updating
4. **affectedRows**: MySQL returns 0 if hotel not found
5. **Flexibility**: Same endpoint handles 1 or 100 field updates

---

<a name="delete-operation"></a>

## 6️⃣ DELETE OPERATION (Remove Hotel)

### Overview

Permanently removes hotel from database (hard delete).

### Frontend Flow with Confirmation

```javascript
// 1. Admin clicks Delete button
async handleDeleteHotel(hotelId) {
  // Show custom confirmation modal
  this.showDeleteConfirmation(hotelId);
}

// 2. Beautiful confirmation modal
showDeleteConfirmation(hotelId) {
  // Create modal overlay
  const modal = document.createElement('div');
  modal.className = 'delete-confirmation-modal';

  modal.innerHTML = `
    <div class="delete-confirmation-content">
      <div class="delete-confirmation-header">
        <i class="fas fa-exclamation-triangle warning-icon"></i>
        <h2>Delete Hotel Permanently?</h2>
      </div>

      <div class="delete-confirmation-body">
        <p>Are you sure you want to <strong>permanently delete</strong>
           hotel <strong>${hotelId}</strong>?</p>
        <p class="warning-text">
          ⚠️ This action cannot be undone!
          The hotel will be removed from the database.
        </p>
      </div>

      <div class="delete-confirmation-actions">
        <button class="cancel-btn" id="cancelDeleteBtn">
          <i class="fas fa-times"></i> Cancel
        </button>
        <button class="confirm-delete-btn" id="confirmDeleteBtn">
          <i class="fas fa-trash"></i> Yes, Delete Permanently
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Cancel button (blue) - close modal
  document.getElementById('cancelDeleteBtn')
    .addEventListener('click', () => {
      modal.remove();
    });

  // Confirm button (red) - proceed with deletion
  document.getElementById('confirmDeleteBtn')
    .addEventListener('click', async () => {
      modal.remove();
      await this.deleteHotelConfirmed(hotelId);
    });
}

// 3. Execute deletion
async deleteHotelConfirmed(hotelId) {
  try {
    console.log("🗑️ Attempting to delete hotel:", hotelId);

    this.showNotification("Deleting hotel...", "info");

    // Send DELETE request
    const response = await fetch(
      `${API_BASE_URL}/hotels/${hotelId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();
    console.log("📦 Response result:", result);

    if (result.success) {
      this.showNotification(
        `Hotel ${hotelId} permanently deleted!`,
        "success"
      );
      this.fetchHotels(); // Refresh table
    } else {
      this.showNotification(
        `Error: ${result.message}`,
        "error"
      );
    }

  } catch (error) {
    console.error("💥 Error deleting hotel:", error);
    this.showNotification(
      "Error deleting hotel from database",
      "error"
    );
  }
}
```

### Backend Implementation (CASCADE DELETE)

```javascript
const deleteHotel = async (req, res) => {
  try {
    const hotelId = req.params.id;
    console.log("🗑️ DELETE request received for hotel ID:", hotelId);

    // IMPORTANT: Handle foreign key constraints
    // We must delete related records first!

    // Step 1: Delete all hotel_bookings first
    // Why? Foreign key constraint prevents deleting hotels with bookings
    const [bookingsDeleted] = await db.query(
      "DELETE FROM hotel_bookings WHERE hotel_id = ?",
      [hotelId]
    );
    hotel_bookings table:
| booking_id | hotel_id | user_id | ...
| BK001      | HTL005   | USR123  | ...
| BK002      | HTL005   | USR456  | ...
| BK003      | HTL010   | USR789  | ...

-- After DELETE FROM hotel_bookings WHERE hotel_id = 'HTL005':
| booking_id | hotel_id | user_id | ...
| BK003      | HTL010   | USR789  | ...

    console.log(`📋 Deleted ${bookingsDeleted.affectedRows} booking(s)`);

    // Step 2: Now safe to delete the hotel
    const [result] = await db.query("DELETE FROM hotels WHERE hotel_id = ?", [
      hotelId,
    ]);

    console.log("📊 Delete query result:", result);
    console.log("📈 Affected rows:", result.affectedRows);

    // Step 3: Check if hotel existed
    if (result.affectedRows === 0) {
      console.log("❌ Hotel not found:", hotelId);
      return res.status(404).json({
        success: false,
        message: `Hotel with ID ${hotelId} not found`,
      });
    }

    // Step 4: Success response
    console.log("✅ Hotel deleted successfully:", hotelId);
    res.status(200).json({
      success: true,
      message: "Hotel and all related bookings permanently deleted",
    });
  } catch (error) {
    console.error("💥 Error deleting hotel:", error);

    // Step 5: Handle foreign key errors
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(400).json({
        success: false,
        message: "Cannot delete hotel - it has existing references",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error deleting hotel",
      error: error.message,
    });
  }
};
```

### SQL Queries

**Step 1: Delete related bookings**

```sql
DELETE FROM hotel_bookings WHERE hotel_id = 'HTL001'
```

**Step 2: Delete the hotel**

```sql
DELETE FROM hotels WHERE hotel_id = 'HTL001'
```

### Foreign Key Constraints

**Database Schema:**

```sql
CREATE TABLE hotel_bookings (
  booking_id VARCHAR(20) PRIMARY KEY,
  hotel_id VARCHAR(20),
  user_id VARCHAR(20),
  -- ... other fields

  -- Foreign key constraint
  FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id)
);
```

**Problem:** Cannot delete hotel if bookings reference it

**Solution:** CASCADE DELETE

1. Delete child records (bookings) first
2. Then delete parent record (hotel)

**Alternative:** Use `ON DELETE CASCADE` in schema:

```sql
FOREIGN KEY (hotel_id)
  REFERENCES hotels(hotel_id)
  ON DELETE CASCADE
```

### Key Concepts

1. **Hard Delete vs Soft Delete:**

   - **Soft Delete**: Set status = 'InActive' (keeps data)
   - **Hard Delete**: Permanently remove from database (we use this)

2. **Foreign Key Integrity**: Database prevents orphaned records

3. **Transaction Safety**: Both deletes succeed or both fail

4. **User Confirmation**: Prevent accidental deletions

5. **Logging**: Console logs help debug issues

---

<a name="database-schema"></a>

## 7️⃣ DATABASE SCHEMA

### Hotels Table Structure

```sql
CREATE TABLE hotels (
  hotel_id VARCHAR(20) PRIMARY KEY,      -- Unique identifier (HTL001, HTL002...)
  hotel_name VARCHAR(200) NOT NULL,      -- Hotel name
  location VARCHAR(300),                  -- Address/location description
  city VARCHAR(100),                      -- City name
  country VARCHAR(100),                   -- Country name
  rating DECIMAL(2,1),                    -- Star rating (1.0 - 5.0)
  price_per_night DECIMAL(10,2),         -- Nightly rate in SAR
  total_rooms INT,                        -- Total room capacity
  available_rooms INT,                    -- Currently available rooms
  amenities TEXT,                         -- WiFi,Pool,Gym,Spa (comma-separated)
  description TEXT,                       -- Hotel description
  status VARCHAR(20) DEFAULT 'Active',   -- Active or InActive
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Related Tables

**hotel_bookings:**

```sql
CREATE TABLE hotel_bookings (
  booking_id VARCHAR(20) PRIMARY KEY,
  hotel_id VARCHAR(20),                  -- Links to hotels table
  user_id VARCHAR(20),
  check_in_date DATE,
  check_out_date DATE,
  total_price DECIMAL(10,2),
  status VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id)
);
```

**users:**

```sql
CREATE TABLE users (
  user_id VARCHAR(20) PRIMARY KEY,
  email VARCHAR(100) UNIQUE,
  password_hash VARCHAR(255),
  user_role VARCHAR(20) DEFAULT 'customer',  -- admin or customer
  status VARCHAR(20) DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Indexes for Performance

```sql
-- Speed up searches by city
CREATE INDEX idx_city ON hotels(city);

-- Speed up searches by status
CREATE INDEX idx_status ON hotels(status);

-- Speed up price range searches
CREATE INDEX idx_price ON hotels(price_per_night);

-- Speed up rating queries
CREATE INDEX idx_rating ON hotels(rating);
```

---

<a name="api-endpoints"></a>

## 8️⃣ API ENDPOINTS

### Complete API Documentation

| Method     | Endpoint                           | Description            | Auth Required |
| ---------- | ---------------------------------- | ---------------------- | ------------- |
| **GET**    | `/api/hotels`                      | Get all hotels         | ❌ No         |
| **GET**    | `/api/hotels?includeInactive=true` | Get all hotels (admin) | ✅ Yes        |
| **GET**    | `/api/hotels/:id`                  | Get single hotel       | ❌ No         |
| **GET**    | `/api/hotels/city/:cityName`       | Get hotels by city     | ❌ No         |
| **GET**    | `/api/hotels/search?query=...`     | Search hotels          | ❌ No         |
| **POST**   | `/api/hotels`                      | Create new hotel       | ✅ Admin      |
| **PUT**    | `/api/hotels/:id`                  | Update hotel           | ✅ Admin      |
| **DELETE** | `/api/hotels/:id`                  | Delete hotel           | ✅ Admin      |

### Request/Response Examples

#### CREATE (POST /api/hotels)

**Request:**

```javascript
POST http://localhost:3000/api/hotels
Content-Type: application/json

{
  "hotel_name": "Grand Palace Hotel",
  "location": "King Fahd Road, Downtown",
  "city": "Riyadh",
  "country": "Saudi Arabia",
  "rating": 4.5,
  "price_per_night": 850.00,
  "total_rooms": 100,
  "available_rooms": 100,
  "amenities": "WiFi,Pool,Gym,Spa,Parking,Restaurant",
  "description": "Luxury 5-star hotel in the heart of Riyadh...",
  "status": "Active"
}
```

**Response:**

```javascript
{
  "success": true,
  "message": "Hotel created successfully",
  "data": {
    "hotel_id": "HTL012"
  }
}
```

#### READ (GET /api/hotels/:id)

**Request:**

```javascript
GET http://localhost:3000/api/hotels/HTL001
```

**Response:**

```javascript
{
  "success": true,
  "data": {
    "hotel_id": "HTL001",
    "hotel_name": "Luxury Palace Hotel",
    "location": "Downtown",
    "city": "Riyadh",
    "country": "Saudi Arabia",
    "rating": 4.5,
    "price_per_night": 850.00,
    "total_rooms": 100,
    "available_rooms": 85,
    "amenities": "WiFi,Pool,Gym,Spa",
    "description": "Luxury hotel...",
    "status": "Active",
    "created_at": "2025-11-01T10:30:00Z",
    "updated_at": "2025-11-12T15:45:00Z"
  }
}
```

#### UPDATE (PUT /api/hotels/:id)

**Request:**

```javascript
PUT http://localhost:3000/api/hotels/HTL001
Content-Type: application/json

{
  "price_per_night": 950.00,
  "available_rooms": 82,
  "rating": 4.7
}
```

**Response:**

```javascript
{
  "success": true,
  "message": "Hotel updated successfully"
}
```

#### DELETE (DELETE /api/hotels/:id)

**Request:**

```javascript
DELETE http://localhost:3000/api/hotels/HTL001
```

**Response:**

```javascript
{
  "success": true,
  "message": "Hotel and all related bookings permanently deleted from database"
}
```

---

<a name="integration"></a>

## 9️⃣ FRONTEND-BACKEND INTEGRATION

### How They Communicate

```
┌──────────────────────────────────────┐
│        FRONTEND (Browser)            │
│  hotel-management.html/js            │
└────────────┬─────────────────────────┘
             │
             │ 1. User Action (Click button)
             │
             ▼
┌──────────────────────────────────────┐
│    JavaScript Event Handler          │
│  handleAddHotel(hotelData)           │
└────────────┬─────────────────────────┘
             │
             │ 2. HTTP Request (Fetch API)
             │    POST /api/hotels
             │    Body: { hotel_name: "...", ... }
             │
             ▼
┌──────────────────────────────────────┐
│        BACKEND (Node.js Server)      │
│  Port 3000                           │
└────────────┬─────────────────────────┘
             │
             │ 3. Route Handler
             │    Express Router
             │
             ▼
┌──────────────────────────────────────┐
│      Controller Function             │
│  createHotel(req, res)               │
└────────────┬─────────────────────────┘
             │
             │ 4. SQL Query
             │    INSERT INTO hotels...
             │
             ▼
┌──────────────────────────────────────┐
│      DATABASE (MySQL)                │
│  Railway Cloud                       │
└────────────┬─────────────────────────┘
             │
             │ 5. Query Result
             │    { insertId: 12 }
             │
             ▼
┌──────────────────────────────────────┐
│      Response to Frontend            │
│  { success: true, hotel_id: "..." } │
└────────────┬─────────────────────────┘
             │
             │ 6. Update UI
             │    Show success message
             │    Refresh table
             │
             ▼
┌──────────────────────────────────────┐
│      USER SEES RESULT                │
│  ✅ Hotel added successfully!        │
└──────────────────────────────────────┘
```

### Fetch API Usage

```javascript
// Modern JavaScript HTTP requests
const response = await fetch(url, {
  method: "POST", // GET, POST, PUT, DELETE
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(data), // Convert object to JSON string
});

const result = await response.json(); // Parse JSON response
```

### Async/Await Pattern

```javascript
// Old way (callback hell):
fetch(url)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.error(error);
  });

// Modern way (async/await):
try {
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
} catch (error) {
  console.error(error);
}
```

---

<a name="error-handling"></a>

## 🔟 ERROR HANDLING & VALIDATION

### HTTP Status Codes

| Code    | Meaning      | When Used                      |
| ------- | ------------ | ------------------------------ |
| **200** | OK           | Successful GET, PUT, DELETE    |
| **201** | Created      | Successful POST (new resource) |
| **400** | Bad Request  | Invalid data from client       |
| **404** | Not Found    | Hotel doesn't exist            |
| **500** | Server Error | Database or code error         |

### Backend Error Handling

```javascript
try {
  // Attempt database operation
  const [result] = await db.query(...);

  // Check if operation succeeded
  if (result.affectedRows === 0) {
    return res.status(404).json({
      success: false,
      message: "Hotel not found"
    });
  }

  // Success
  res.status(200).json({
    success: true,
    message: "Operation successful"
  });

} catch (error) {
  // Log error for debugging
  console.error("Error:", error);

  // Return user-friendly error
  res.status(500).json({
    success: false,
    message: "Database error",
    error: error.message
  });
}
```

### Frontend Error Handling

```javascript
async function performOperation() {
  try {
    const response = await fetch(url, options);
    const result = await response.json();

    if (result.success) {
      // Show success notification
      this.showNotification("Success!", "success");
    } else {
      // Show error notification
      this.showNotification(result.message, "error");
    }
  } catch (error) {
    // Network or parse error
    console.error("Error:", error);
    this.showNotification("Connection error", "error");
  }
}
```

### Validation Examples

**Frontend Validation:**

```javascript
function validateHotelData(data) {
  const errors = [];

  if (!data.hotel_name || data.hotel_name.trim() === "") {
    errors.push("Hotel name is required");
  }

  if (data.price_per_night <= 0) {
    errors.push("Price must be greater than 0");
  }

  if (data.rating < 1 || data.rating > 5) {
    errors.push("Rating must be between 1 and 5");
  }

  if (data.total_rooms < data.available_rooms) {
    errors.push("Available rooms cannot exceed total rooms");
  }

  return errors;
}
```

**Backend Validation:**

```javascript
// Check for required fields
if (!hotel_name || !city || !price_per_night) {
  return res.status(400).json({
    success: false,
    message: "Missing required fields",
  });
}

// Validate data types
if (typeof price_per_night !== "number" || price_per_night <= 0) {
  return res.status(400).json({
    success: false,
    message: "Invalid price",
  });
}
```

---

## 📚 CONCLUSION

### Summary of CRUD Implementation

Our Hotel Management system implements all four CRUD operations:

✅ **CREATE** - Add new hotels with auto-generated IDs  
✅ **READ** - View all hotels, filter by city/status, search  
✅ **UPDATE** - Modify any hotel field dynamically  
✅ **DELETE** - Permanently remove hotels (with cascade delete)

### Key Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Database**: MySQL (hosted on Railway Cloud)
- **Communication**: RESTful API with JSON
- **Security**: Parameterized queries, JWT authentication

### Best Practices Implemented

1. **Separation of Concerns**: Frontend, Backend, Database layers
2. **Error Handling**: Try-catch blocks, meaningful error messages
3. **SQL Injection Prevention**: Parameterized queries (?)
4. **User Experience**: Confirmation modals, loading states, notifications
5. **Code Organization**: Modular structure, clear naming conventions
6. **Database Integrity**: Foreign key constraints, cascading deletes
7. **Logging**: Console logs for debugging and monitoring

### Learning Outcomes

Through this project, we learned:

- How to design and implement a complete CRUD system
- Database relationships and foreign key constraints
- RESTful API design principles
- Asynchronous JavaScript (async/await)
- Frontend-backend integration
- Error handling and validation
- User interface design for admin tools

---

## 📞 QUESTIONS FOR DEMONSTRATION

**Be prepared to answer:**

1. "Explain how you prevent SQL injection attacks"
2. "What happens if you try to delete a hotel that has bookings?"
3. "How does the system generate unique hotel IDs?"
4. "Why do you use parameterized queries instead of string concatenation?"
5. "What's the difference between soft delete and hard delete?"
6. "How do you handle errors on the frontend vs backend?"
7. "Explain the request-response cycle for creating a hotel"
8. "How do you ensure data consistency in the database?"

---

**End of Documentation**

_This document was created to explain the CRUD operations in the GoTrip Hotel Management System._
