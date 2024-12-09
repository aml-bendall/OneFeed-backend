const subscriptionService = require('../services/subscriptionService');

// Fetch subscription details
exports.getSubscription = async (req, res) => {
  try {
    const userId = req.user.id;

    const subscription = await subscriptionService.getSubscription(userId);

    res.json(subscription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Upgrade to premium
exports.upgradeToPremium = async (req, res) => {
    try {
      const userId = req.user.id;
      const { subscriptionId, expiresAt } = req.body;
  
      const message = await subscriptionService.upgradeToPremium(userId, subscriptionId, expiresAt);
      res.json({ message });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  // Cancel subscription
  exports.cancelSubscription = async (req, res) => {
    try {
      const userId = req.user.id;
  
      const message = await subscriptionService.cancelSubscription(userId);
      res.json({ message });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
