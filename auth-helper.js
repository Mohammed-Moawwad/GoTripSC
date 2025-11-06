/**
 * ====================================
 * GoTrip Authentication Helper
 * ====================================
 * This script checks if a user is logged in and provides
 * functions to show/hide UI elements accordingly.
 *
 * Include this in ALL pages: <script src="/auth-helper.js"></script>
 */

// ====================================
// Core Authentication Functions
// ====================================

/**
 * Check if user is currently logged in
 * @returns {boolean} True if user is logged in, false otherwise
 */
function isLoggedIn() {
  const token = localStorage.getItem("authToken");
  const user = localStorage.getItem("user");
  return token !== null && user !== null;
}

/**
 * Get current logged-in user information
 * @returns {Object|null} User object or null if not logged in
 */
function getCurrentUser() {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
}

/**
 * Get current authentication token
 * @returns {string|null} JWT token or null
 */
function getAuthToken() {
  return localStorage.getItem("authToken");
}

/**
 * Check if current user is admin
 * @returns {boolean} True if user is admin
 */
function isAdmin() {
  const user = getCurrentUser();
  return user && user.role === "admin";
}

/**
 * Logout user - clear all authentication data
 */
function logout() {
  // Clear localStorage
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");

  // Show logout message
  alert("You have been logged out successfully!");

  // Redirect to homepage
  window.location.href = "/HomePage/HomePage.html";
}

/**
 * Logout with confirmation
 */
function logoutWithConfirmation() {
  if (confirm("Are you sure you want to logout?")) {
    logout();
  }
}

// ====================================
// UI Update Functions
// ====================================

/**
 * Update navigation UI based on login status
 * Call this in your page's DOMContentLoaded event
 */
function updateNavigationUI() {
  const loggedIn = isLoggedIn();
  const user = getCurrentUser();

  // Find navigation elements
  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");
  const myTripsBtn = document.getElementById("myTripsBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const userNameDisplay = document.getElementById("userNameDisplay");

  if (loggedIn && user) {
    // User is logged in
    // Hide login/signup buttons
    if (loginBtn) loginBtn.style.display = "none";
    if (signupBtn) signupBtn.style.display = "none";

    // Show My Trips and Logout buttons
    if (myTripsBtn) myTripsBtn.style.display = "inline-block";
    if (logoutBtn) logoutBtn.style.display = "inline-block";

    // Display user's name
    if (userNameDisplay) {
      userNameDisplay.textContent = `Welcome, ${user.first_name}!`;
      userNameDisplay.style.display = "inline-block";
    }

    console.log(`✅ User logged in: ${user.first_name} ${user.last_name}`);
  } else {
    // User is NOT logged in
    // Show login/signup buttons
    if (loginBtn) loginBtn.style.display = "inline-block";
    if (signupBtn) signupBtn.style.display = "inline-block";

    // Hide My Trips and Logout buttons
    if (myTripsBtn) myTripsBtn.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "none";

    // Hide user name
    if (userNameDisplay) userNameDisplay.style.display = "none";

    console.log("❌ No user logged in");
  }
}

/**
 * Show/hide elements by class name based on login status
 * @param {string} className - Class name of elements to toggle
 * @param {boolean} showWhenLoggedIn - If true, show when logged in; if false, show when logged out
 */
function toggleElementsByClass(className, showWhenLoggedIn) {
  const elements = document.getElementsByClassName(className);
  const loggedIn = isLoggedIn();
  const shouldShow = showWhenLoggedIn ? loggedIn : !loggedIn;

  Array.from(elements).forEach((element) => {
    element.style.display = shouldShow ? "" : "none";
  });
}

/**
 * Require authentication - redirect to login if not logged in
 * Use this on protected pages (like user dashboard, bookings, etc.)
 */
function requireAuth() {
  if (!isLoggedIn()) {
    alert("Please login to access this page");
    window.location.href = "/Login/signin.html";
  }
}

/**
 * Require admin access - redirect if not admin
 * Use this on admin-only pages
 */
function requireAdmin() {
  if (!isLoggedIn()) {
    alert("Please login to access this page");
    window.location.href = "/Login/signin.html";
    return;
  }

  if (!isAdmin()) {
    alert("Access denied. Admin privileges required.");
    window.location.href = "/HomePage/HomePage.html";
  }
}

// ====================================
// Auto-initialize on page load
// ====================================

// Automatically update navigation when page loads
document.addEventListener("DOMContentLoaded", function () {
  console.log("🔐 Auth Helper Loaded");
  updateNavigationUI();
});

// ====================================
// Export for use in other scripts
// ====================================

// Make functions available globally
window.authHelper = {
  isLoggedIn,
  getCurrentUser,
  getAuthToken,
  isAdmin,
  logout,
  logoutWithConfirmation,
  updateNavigationUI,
  toggleElementsByClass,
  requireAuth,
  requireAdmin,
};
