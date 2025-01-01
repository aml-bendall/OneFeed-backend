const express = require('express');
const router = express.Router();
const youtubeController = require('../src/controllers/googleOAuthController'); // Import the controller

// Route to handle YouTube OAuth
router.post('/auth/youtube', youtubeController.connectYouTube);

module.exports = router;