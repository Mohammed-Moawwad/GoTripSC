/**
 * Inactivity Job
 * Marks user accounts as inactive if they haven't logged in for 3 months
 * Runs every day at midnight
 */

const db = require("../config/database");

const THREE_MONTHS_MS = 90 * 24 * 60 * 60 * 1000; // 90 days in milliseconds

/**
 * Check for inactive users (not logged in for 3+ months)
 * and mark them as inactive
 */
const markInactiveUsers = async () => {
  try {
    console.log("\n=================================");
    console.log("🔍 Starting inactivity check job...");
    console.log("=================================");

    // Calculate the date 3 months ago
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    console.log(
      `📅 Checking for users inactive since: ${threeMonthsAgo.toISOString()}`
    );

    // Find users who:
    // 1. Have status = 'Active'
    // 2. Have last_login older than 3 months OR have never logged in (last_login is NULL)
    const [inactiveUsers] = await db.execute(
      `SELECT user_id, first_name, last_name, email, last_login 
       FROM users 
       WHERE status = 'Active' 
       AND (last_login < ? OR last_login IS NULL)`,
      [threeMonthsAgo]
    );

    console.log(`📊 Found ${inactiveUsers.length} potentially inactive users`);

    if (inactiveUsers.length === 0) {
      console.log("✅ No inactive users to process");
      console.log("=================================\n");
      return {
        success: true,
        message: "No inactive users found",
        usersMarked: 0,
      };
    }

    // Mark these users as inactive
    const [updateResult] = await db.execute(
      `UPDATE users 
       SET status = 'InActive' 
       WHERE status = 'Active' 
       AND (last_login < ? OR last_login IS NULL)`,
      [threeMonthsAgo]
    );

    console.log(
      `\n✅ Successfully marked ${updateResult.affectedRows} users as inactive:`
    );

    inactiveUsers.forEach((user, index) => {
      const lastLogin = user.last_login
        ? new Date(user.last_login).toLocaleDateString("en-US")
        : "Never";
      console.log(
        `   ${index + 1}. ${user.first_name} ${user.last_name} (${
          user.email
        }) - Last login: ${lastLogin}`
      );
    });

    console.log("=================================\n");

    return {
      success: true,
      message: `Marked ${updateResult.affectedRows} users as inactive`,
      usersMarked: updateResult.affectedRows,
      inactiveUsers: inactiveUsers,
    };
  } catch (error) {
    console.error("❌ Error in inactivity check job:", error);
    return {
      success: false,
      message: "Error checking for inactive users",
      error: error.message,
    };
  }
};

/**
 * Reactivate a user account
 */
const reactivateUser = async (userId) => {
  try {
    console.log(`🔄 Reactivating user: ${userId}`);

    await db.execute(
      `UPDATE users 
       SET status = 'Active', updated_at = NOW() 
       WHERE user_id = ?`,
      [userId]
    );

    console.log(`✅ User ${userId} reactivated`);
    return {
      success: true,
      message: "User account reactivated",
    };
  } catch (error) {
    console.error("❌ Error reactivating user:", error);
    return {
      success: false,
      message: "Failed to reactivate user",
      error: error.message,
    };
  }
};

module.exports = {
  markInactiveUsers,
  reactivateUser,
};
