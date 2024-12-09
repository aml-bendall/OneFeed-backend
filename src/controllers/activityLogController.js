const activityLogService = require('../services/activityLogService'); // Import the Activity Log Service

/**
 * Controller to fetch all activity logs (admin access).
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 */
exports.getAllActivityLogs = async (req, res) => {
  try {
    // Ensure the requesting user has admin privileges
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const logs = await activityLogService.getActivityLogsByAction(); // Fetch all logs with default limit
    res.json(logs);
  } catch (error) {
    console.error('Error fetching all activity logs:', error.message);
    res.status(500).json({ message: 'Error fetching activity logs.' });
  }
};

/**
 * Controller to fetch activity logs for a specific user.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 */
exports.getUserActivityLogs = async (req, res) => {
  try {
    const { userId } = req.params;

    // Ensure the requesting user is either admin or the user in question
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Unauthorized user.' });
    }

    const logs = await activityLogService.getUserActivityLogs(userId);
    res.json(logs);
  } catch (error) {
    console.error('Error fetching user activity logs:', error.message);
    res.status(500).json({ message: 'Error fetching user activity logs.' });
  }
};
