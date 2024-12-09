const express = require('express');
const router = express.Router();
const authController = require('../src/controllers/authController');

// Register a new user
router.post('/register', authController.register);

// Log in an existing user
router.post('/login', authController.login);

// Refresh token
router.post('/refresh-token', authController.refreshToken);

// Log out a user (optional, depending on your token handling strategy)
router.post('/logout', authController.logout);

module.exports = router;
