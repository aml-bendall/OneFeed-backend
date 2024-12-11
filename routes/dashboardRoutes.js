const express = require('express');
const router = express.Router();
const dashboardController = require('../src/controllers/dashboardController');
const { authMiddleware } = require('../src/middleware/authMiddleware');

// Route to fetch dashboard data
router.get('/', authMiddleware, dashboardController.getDashboardData);

module.exports = router;
