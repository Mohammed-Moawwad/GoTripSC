const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/database");

// JWT Secret Key (In production, this should be in .env file)
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-this-in-production";
const JWT_EXPIRES_IN = "7d"; // Token expires in 7 days

/**
 * User Signup (Registration)
 * Creates a new user account
 */
const signup = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, birth_date, password } =
      req.body;

    // Validation: Check if all required fields are provided
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide all required fields: first_name, last_name, email, password",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // Validate password strength (minimum 6 characters)
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Check if user already exists (case-insensitive)
    const [existingUsers] = await db.execute(
      "SELECT user_id FROM users WHERE LOWER(email) = LOWER(?)",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message:
          "Email already registered. Please use a different email or login.",
      });
    }

    // Hash the password (10 salt rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate unique user ID (USR + timestamp + random)
    const userId = `USR${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Insert new user into database
    const [result] = await db.execute(
      `INSERT INTO users 
       (user_id, first_name, last_name, email, phone, birth_date, password_hash, status, role) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'Active', 'user')`,
      [
        userId,
        first_name,
        last_name,
        email,
        phone || null,
        birth_date || null,
        hashedPassword,
      ]
    );

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: userId,
        email: email,
        role: "user",
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Return success response with token and user info
    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      data: {
        token: token,
        user: {
          user_id: userId,
          first_name: first_name,
          last_name: last_name,
          email: email,
          phone: phone,
          birth_date: birth_date,
          role: "user",
          status: "Active",
        },
      },
    });
  } catch (error) {
    // Determine user-friendly error message
    let userMessage = "Error creating account. Please try again.";
    let errorDetails = error.message || error.toString() || "Unknown error";

    // Check for common database errors
    if (
      error.code === "ER_DUP_ENTRY" ||
      (error.message && error.message.includes("Duplicate entry"))
    ) {
      userMessage =
        "This email is already registered. Please use a different email or try logging in.";
      errorDetails = "Duplicate email address";
    } else if (error.code === "ER_BAD_NULL_ERROR") {
      userMessage =
        "Required fields are missing. Please fill in all required information.";
      errorDetails = "Missing required database fields";
    } else if (error.code === "ECONNREFUSED" || error.code === "ETIMEDOUT") {
      userMessage = "Database connection error. Please try again later.";
      errorDetails = "Cannot connect to database";
    }

    // Log error details to console
    console.error("\n========== SIGNUP ERROR ==========");
    console.error("Time:", new Date().toISOString());
    console.error("Error object:", error);
    console.error("Message:", error.message || "No message");
    console.error("Code:", error.code || "No code");
    console.error("SQL State:", error.sqlState || "No SQL state");
    console.error("SQL Message:", error.sqlMessage || "No SQL message");
    console.error("==================================\n");

    res.status(500).json({
      success: false,
      message: userMessage,
      error: errorDetails,
      errorCode: error.code || "UNKNOWN",
      sqlMessage: error.sqlMessage || null,
    });
  }
};

/**
 * User Login
 * Authenticates user and returns JWT token
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation: Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Find user by email (case-insensitive)
    const [users] = await db.execute(
      `SELECT user_id, first_name, last_name, email, phone, birth_date, 
              password_hash, status, role, registered_date 
       FROM users 
       WHERE LOWER(email) = LOWER(?)`,
      [email]
    );

    // Check if user exists
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = users[0];

    // Verify password first
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // If account is inactive, automatically reactivate it (user logged in successfully)
    if (user.status !== "Active") {
      console.log(
        `🔄 Auto-reactivating account for ${user.email} due to successful login`
      );
      await db.execute(
        `UPDATE users SET status = 'Active', last_login = NOW() WHERE user_id = ?`,
        [user.user_id]
      );
      // Update the user object to reflect active status
      user.status = "Active";
    } else {
      // Update last_login timestamp
      await db.execute(
        "UPDATE users SET last_login = NOW() WHERE user_id = ?",
        [user.user_id]
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.user_id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Return success response with token and user info (without password)
    res.status(200).json({
      success: true,
      message: "Login successful!",
      data: {
        token: token,
        user: {
          user_id: user.user_id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          phone: user.phone,
          birth_date: user.birth_date,
          role: user.role,
          status: user.status,
          registered_date: user.registered_date,
        },
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Error logging in. Please try again.",
      error: error.message,
    });
  }
};

/**
 * Get Current User Profile
 * Returns the logged-in user's information
 * (Requires authentication middleware)
 */
const getMe = async (req, res) => {
  try {
    const userId = req.user.userId; // Set by auth middleware

    // Fetch user details
    const [users] = await db.execute(
      `SELECT user_id, first_name, last_name, email, phone, birth_date, 
              status, role, registered_date, last_login
       FROM users 
       WHERE user_id = ?`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: users[0],
      },
    });
  } catch (error) {
    console.error("Get Me Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user profile",
      error: error.message,
    });
  }
};

/**
 * Update User Profile
 * Allows user to update their own information
 * (Requires authentication middleware)
 */
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // Set by auth middleware
    const { first_name, last_name, email, phone, birth_date } = req.body;

    // Build dynamic update query
    const updates = [];
    const values = [];

    if (first_name) {
      updates.push("first_name = ?");
      values.push(first_name);
    }
    if (last_name) {
      updates.push("last_name = ?");
      values.push(last_name);
    }
    if (email) {
      // Check if email is already taken by another user
      const [existingUsers] = await db.execute(
        "SELECT user_id FROM users WHERE email = ? AND user_id != ?",
        [email, userId]
      );

      if (existingUsers.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Email is already in use by another account",
        });
      }

      updates.push("email = ?");
      values.push(email);
    }
    if (phone !== undefined) {
      updates.push("phone = ?");
      values.push(phone);
    }
    if (birth_date !== undefined) {
      updates.push("birth_date = ?");
      values.push(birth_date);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    values.push(userId);

    // Update user in database
    await db.execute(
      `UPDATE users SET ${updates.join(", ")} WHERE user_id = ?`,
      values
    );

    // Fetch updated user data
    const [users] = await db.execute(
      `SELECT user_id, first_name, last_name, email, phone, birth_date, 
              status, role, registered_date
       FROM users 
       WHERE user_id = ?`,
      [userId]
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: users[0],
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};

/**
 * Change Password
 * Allows user to change their password
 * (Requires authentication middleware)
 */
const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide current password and new password",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long",
      });
    }

    // Get current password hash
    const [users] = await db.execute(
      "SELECT password_hash FROM users WHERE user_id = ?",
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      users[0].password_hash
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await db.execute("UPDATE users SET password_hash = ? WHERE user_id = ?", [
      hashedPassword,
      userId,
    ]);

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change Password Error:", error);
    res.status(500).json({
      success: false,
      message: "Error changing password",
      error: error.message,
    });
  }
};

/**
 * Get all users (Admin only)
 * Returns list of all users with their details
 */
const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.execute(
      `SELECT user_id, first_name, last_name, email, phone, birth_date, status, role, registered_date, last_login 
       FROM users 
       ORDER BY registered_date DESC`
    );

    // Count users by status
    const activeUsers = users.filter((u) => u.status === "Active").length;
    const inactiveUsers = users.filter((u) => u.status === "InActive").length;

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: {
        users: users,
        statistics: {
          totalUsers: users.length,
          activeUsers: activeUsers,
          inactiveUsers: inactiveUsers,
        },
      },
    });
  } catch (error) {
    console.error("Get All Users Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve users",
      error: error.message,
    });
  }
};

/**
 * Reactivate Account (after being marked inactive)
 * User can manually reactivate their account
 */
const reactivateAccount = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Update user status to Active
    const [result] = await db.execute(
      `UPDATE users SET status = 'Active', last_login = NOW() WHERE user_id = ?`,
      [userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log(`✅ User ${userId} reactivated their account`);

    res.status(200).json({
      success: true,
      message: "Your account has been reactivated successfully!",
      data: {
        status: "Active",
        reactivatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Reactivate Account Error:", error);
    res.status(500).json({
      success: false,
      message: "Error reactivating account. Please try again.",
      error: error.message,
    });
  }
};

module.exports = {
  signup,
  login,
  getMe,
  updateProfile,
  changePassword,
  getAllUsers,
  reactivateAccount,
};
