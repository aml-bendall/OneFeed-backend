const express = require('express');
const router = express.Router();
const circleController = require('../src/controllers/circleController');
const { authMiddleware } = require('../src/middleware/authMiddleware');

// Create a new circle
router.post('/', authMiddleware, circleController.createCircle);

// Get circle details
router.get('/:id', authMiddleware, circleController.getCircleDetails);

// Join a circle
router.post('/:id/join', authMiddleware, circleController.joinCircle);

// Delete a circle
router.delete('/:id', authMiddleware, circleController.deleteCircle);

module.exports = router;
