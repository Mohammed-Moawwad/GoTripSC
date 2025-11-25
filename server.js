// ====================================
// GoTrip Backend Server
// ====================================

require("dotenv").config();
const express = require("express");
const path = require("path");

// Import database connection
const db = require("./backend/config/database");

// Import API routes
const hotelRoutes = require("./backend/routes/hotelRoutes");
const authRoutes = require("./backend/routes/authRoutes");
const bookingRoutes = require("./backend/routes/bookingRoutes");

// Create Express application
const app = express();

// ====================================
// Middleware
// ====================================
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Serve static files from root directory
app.use(express.static(__dirname));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`\n📨 ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', { ...req.body, password: req.body.password ? '***' : undefined });
  }
  next();
});

// Enable CORS (Cross-Origin Resource Sharing)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// ====================================
// Routes
// ====================================

// Root route - serve homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "HomePage", "HomePage.html"));
});

// API Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "GoTrip API is running! 🚀",
    timestamp: new Date().toISOString(),
  });
});

// Test database connection endpoint
app.get("/api/db-test", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT COUNT(*) as user_count FROM users");
    res.json({
      status: "success",
      message: "Database connected!",
      users: rows[0].user_count,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Database connection failed",
      error: error.message,
    });
  }
});

// ====================================
// API Routes
// ====================================

// Test endpoint
app.post("/api/auth/test", (req, res) => {
  console.log("✅ Test endpoint hit!");
  console.log("Body:", req.body);
  res.json({ success: true, message: "Test endpoint working", body: req.body });
});

// Authentication routes
app.use("/api/auth", authRoutes);

// Hotel routes
app.use("/api/hotels", hotelRoutes);

// Booking routes (with authentication)
app.use("/api/bookings", bookingRoutes);

// Future routes (uncomment when ready)
// const userRoutes = require('./backend/routes/userRoutes');
// const flightRoutes = require('./backend/routes/flightRoutes');
// const busRoutes = require('./backend/routes/busRoutes');
// app.use('/api/users', userRoutes);
// app.use('/api/flights', flightRoutes);
// app.use('/api/buses', busRoutes);

// ====================================
// Error Handling
// ====================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({
    status: "error",
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// ====================================
// Start Server
// ====================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("=================================");
  console.log(`🚀 GoTrip Server is running!`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log("=================================");
});
