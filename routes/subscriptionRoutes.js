const express = require('express');
const router = express.Router();
const subscriptionController = require('../src/controllers/subscriptionController');
const { authMiddleware } = require('../src/middleware/authMiddleware');

// Upgrade to premium
router.post('/upgrade', authMiddleware, subscriptionController.upgradeToPremium);

// Fetch subscription details
router.get('/', authMiddleware, subscriptionController.getSubscription);

// Cancel subscription
router.post('/cancel', authMiddleware, subscriptionController.cancelSubscription);

module.exports = router;
