const express = require('express');
const router = express.Router();
const socialMediaController = require('../src/controllers/socialMediaController');

// Link a social media account
router.post('/link', socialMediaController.linkAccount);

// Unlink a social media account
router.delete('/unlink/:platform', socialMediaController.unlinkAccount);

// Fetch unified feed
router.get('/feed', socialMediaController.fetchUnifiedFeed);

module.exports = router;
