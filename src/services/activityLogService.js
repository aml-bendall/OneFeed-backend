const ActivityLog = require('../models/ActivityLog'); // Import the Activity Log model

/**
 * Logs user activity if the user is eligible (e.g., premium users only).
 * @param {ObjectId} userId - The ID of the user performing the action.
 * @param {String} action - The type of action being performed (e.g., "save_recipe", "join_circle").
 * @param {Object} metadata - Additional context or details about the action.
 * @returns {Promise<void>} - Resolves if the log is created successfully.
 */
exports.logActivity = async (userId, action, metadata) => {
  try {
    // Create the activity log entry
    await ActivityLog.create({
      userId,
      action,
      metadata,
    });
  } catch (error) {
    console.error(`Error logging activity (${action}):`, error.message);
    // Optional: Implement a retry mechanism or send alerts for failures
  }
};

/**
 * Fetch activity logs for a user.
 * @param {ObjectId} userId - The ID of the user whose logs are being fetched.
 * @param {Number} limit - The maximum number of logs to fetch (default: 10).
 * @returns {Promise<Array>} - Returns an array of activity logs.
 */
exports.getUserActivityLogs = async (userId, limit = 10) => {
  try {
    return await ActivityLog.find({ userId }).sort({ createdAt: -1 }).limit(limit);
  } catch (error) {
    console.error('Error fetching user activity logs:', error.message);
    throw new Error('Unable to fetch activity logs.');
  }
};

/**
 * Fetch activity logs based on action type.
 * @param {String} action - The type of action to filter logs by (e.g., "save_recipe").
 * @param {Number} limit - The maximum number of logs to fetch (default: 10).
 * @returns {Promise<Array>} - Returns an array of filtered activity logs.
 */
exports.getActivityLogsByAction = async (action, limit = 10) => {
  try {
    return await ActivityLog.find({ action }).sort({ createdAt: -1 }).limit(limit);
  } catch (error) {
    console.error(`Error fetching logs for action (${action}):`, error.message);
    throw new Error('Unable to fetch activity logs.');
  }
};
