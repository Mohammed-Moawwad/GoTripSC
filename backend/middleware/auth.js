const jwt = require("jsonwebtoken");

// JWT Secret Key (should match authController)
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-this-in-production";

/**
 * Authentication Middleware
 * Verifies JWT token and adds user info to request object
 * Usage: Add this middleware to any route that requires authentication
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from Authorization header
    // Expected format: "Authorization: Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided. Please login.",
      });
    }

    // Extract token (remove "Bearer " prefix)
    const token = authHeader.substring(7);

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Add user info to request object
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    // Continue to next middleware/route handler
    next();
  } catch (error) {
    // Token is invalid or expired
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please login again.",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please login again.",
      });
    }

    console.error("Authentication Error:", error);
    res.status(500).json({
      success: false,
      message: "Authentication error",
      error: error.message,
    });
  }
};

/**
 * Admin Authorization Middleware
 * Checks if authenticated user has admin role
 * Usage: Use AFTER authenticate middleware
 */
const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  }
  next();
};

/**
 * Optional Authentication Middleware
 * Adds user info if token is provided, but doesn't require it
 * Useful for routes that change behavior based on auth status
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, JWT_SECRET);

      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      };
    }

    next();
  } catch (error) {
    // If token is invalid, just continue without user info
    next();
  }
};

module.exports = {
  authenticate,
  authorizeAdmin,
  optionalAuth,
};
