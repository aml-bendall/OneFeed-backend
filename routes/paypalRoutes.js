const express = require('express');
const router = express.Router();
const paypalController = require('../src/controllers/paypalController');
const { authMiddleware } = require('../src/middleware/authMiddleware');

// Create a new PayPal order
router.post('/create', authMiddleware, paypalController.createOrder);

// Capture a PayPal order
router.post('/capture', authMiddleware, paypalController.captureOrder);

// Get PayPal order details
router.get('/details', authMiddleware, paypalController.getOrderDetails);

module.exports = router;
