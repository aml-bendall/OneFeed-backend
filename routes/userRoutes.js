const express = require('express');
const router = express.Router();
const userController = require('../src/controllers/userController');

// User routes
router.get('/profile', userController.getUserDetails);
router.put('/profile', userController.updateUserDetails); // Ensure this references the correct function

module.exports = router;
