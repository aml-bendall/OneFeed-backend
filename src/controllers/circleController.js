const circleService = require('../services/circleService');

// Create a new circle (Premium only)
exports.createCircle = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from authenticated request
    const { name, description } = req.body;

    const user = req.user; // Use req.user populated by middleware

    // Check if user is a premium member
    if (!user.premium) {
      return res.status(403).json({
        message: 'Creating circles is a Premium feature. Upgrade to Premium for unlimited circle creation.',
      });
    }

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

// Join a circle (1 circle for free users, unlimited for premium)
exports.joinCircle = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from authenticated request
    const circleId = req.params.id;

    const user = req.user; // Use req.user populated by middleware

    console.log(user);

    // Check if the user has already joined the maximum number of circles
    if (!user.premium && user.circles.length >= 1) {
      return res.status(403).json({
        message: 'Free users can only join 1 circle. Upgrade to Premium for unlimited circle membership.',
      });
    }

    const message = await circleService.joinCircle(circleId, userId);

    res.status(200).json({ message });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a circle (allowed only if the user is the creator)
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

// Get all circles for a user
exports.getAllCircles = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from authenticated request

    const circles = await circleService.getAllCircles(userId);

    res.status(200).json(circles);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
