const express = require('express');
const router = express.Router();
const userController = require('../src/controllers/userController');
const authMiddleware = require('../src/middleware/authMiddleware');

// Fetch user profile
router.get('/profile', authMiddleware, userController.getUserDetails);

// Update user profile
router.put('/profile', authMiddleware, userController.updateUserProfile);

// Upgrade to premium
router.post('/premium/upgrade', authMiddleware, userController.upgradeToPremium);

// Downgrade to free
router.post('/premium/downgrade', authMiddleware, userController.downgradeToFree);

// Fetch activity logs (premium feature)
router.get('/activities', authMiddleware, userController.getUserActivities);

module.exports = router;
