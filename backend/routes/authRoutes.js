const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");

/**
 * Authentication Routes
 * Base URL: /api/auth
 */

// Public routes (no authentication required)
router.post("/signup", authController.signup);
router.post("/login", authController.login);

// Protected routes (authentication required)
router.get("/me", authenticate, authController.getMe);
router.put("/profile", authenticate, authController.updateProfile);
router.put("/change-password", authenticate, authController.changePassword);

module.exports = router;
