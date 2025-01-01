const express = require('express');
const router = express.Router();
const userController = require('../src/controllers/userController');
const { authMiddleware } = require('../src/middleware/authMiddleware');

// Routes for users
router.get('/profile', authMiddleware, userController.getUserDetails);
router.put('/profile', authMiddleware, userController.updateUserDetails);

module.exports = router;
