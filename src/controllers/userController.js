const userService = require('../services/userService'); // Import the User Service

// Fetch user details
exports.getUserDetails = async (req, res) => {
  try {
    const userId = req.user.id; // Assume authentication middleware provides req.user
    const userDetails = await userService.getUserDetails(userId);

    res.json(userDetails);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assume authentication middleware provides req.user
    const updateData = req.body;

    const message = await userService.updateUserProfile(userId, updateData);

    res.json({ message });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Upgrade to premium
exports.upgradeToPremium = async (req, res) => {
  try {
    const userId = req.user.id;

    const message = await userService.upgradeToPremium(userId);

    res.json({ message });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Downgrade to free
exports.downgradeToFree = async (req, res) => {
  try {
    const userId = req.user.id;

    const message = await userService.downgradeToFree(userId);

    res.json({ message });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
