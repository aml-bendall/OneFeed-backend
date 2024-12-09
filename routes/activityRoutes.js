const express = require('express');
const router = express.Router();
const activityController = require('../src/controllers/activityController');
const authMiddleware = require('../src/middleware/authMiddleware');

// Fetch all activity logs (admin access)
router.get('/all', authMiddleware, activityController.getAllActivityLogs);

// Fetch activity logs for a specific user
router.get('/user/:userId', authMiddleware, activityController.getUserActivityLogs);

module.exports = router;
