const express = require('express');
const router = express.Router();
const circleController = require('../src/controllers/circleController');
const authMiddleware = require('../src/middleware/authMiddleware');

// Create a new circle
router.post('/create', authMiddleware, circleController.createCircle);

// Fetch details of a circle
router.get('/:id', authMiddleware, circleController.getCircleDetails);

// Join a circle
router.post('/:id/join', authMiddleware, circleController.joinCircle);

// Leave a circle
router.post('/:id/leave', authMiddleware, circleController.leaveCircle);

// Delete a circle
router.delete('/:id', authMiddleware, circleController.deleteCircle);

module.exports = router;
