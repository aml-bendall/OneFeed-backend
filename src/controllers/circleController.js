const circleService = require('../services/circleService');

// Create a new circle
exports.createCircle = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from authenticated request
    const { name, description } = req.body;

    const circle = await circleService.createCircle(userId, name, description);

    res.status(201).json(circle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get circle details
exports.getCircleDetails = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from authenticated request
    const circleId = req.params.id;

    const circle = await circleService.getCircleDetails(circleId, userId);

    res.status(200).json(circle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Join a circle
exports.joinCircle = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from authenticated request
    const circleId = req.params.id;

    const message = await circleService.joinCircle(circleId, userId);

    res.status(200).json({ message });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a circle
exports.deleteCircle = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from authenticated request
    const circleId = req.params.id;

    const message = await circleService.deleteCircle(circleId, userId);

    res.status(200).json({ message });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
