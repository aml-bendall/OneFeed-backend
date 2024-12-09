const express = require('express');
const router = express.Router();
const paypalController = require('../src/controllers/paypalController');

// Create a new PayPal order
router.post('/create-order', paypalController.createPayPalOrder);

module.exports = router;
