const Subscription = require('../models/Subscription');
const paypalClient = require('../utils/paypal');

// Create a new subscription
exports.createSubscription = async (userId, plan, paymentId) => {
  try {
    const subscription = new Subscription({
      userId,
      plan,
      startDate: new Date(),
      endDate: plan === 'premium' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null, // Premium valid for 30 days
      status: 'active',
      paymentId,
    });

    await subscription.save();

    return 'Subscription created successfully.';
  } catch (error) {
    throw new Error('Error creating subscription: ' + error.message);
  }
};

// Handle PayPal payment
exports.processPayment = async (userId, orderId) => {
  try {
    // Capture PayPal payment
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    const response = await paypalClient.execute(request);

    // Check payment status
    if (response.result.status !== 'COMPLETED') {
      throw new Error('Payment not completed.');
    }

    // Create subscription
    const paymentId = response.result.id;
    return await this.createSubscription(userId, 'premium', paymentId);
  } catch (error) {
    throw new Error('Error processing payment: ' + error.message);
  }
};

// Fetch subscription details
exports.getSubscription = async (userId) => {
  try {
    const subscription = await Subscription.findOne({ userId, status: 'active' });
    if (!subscription) throw new Error('No active subscription found.');

    return subscription;
  } catch (error) {
    throw new Error('Error fetching subscription: ' + error.message);
  }
};

// Service to upgrade to premium
exports.upgradeToPremium = async (userId, subscriptionId, expiresAt) => {
    try {
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found.');
  
      user.subscription = {
        status: 'premium',
        subscriptionId,
        paymentMethod: 'PayPal',
        startedAt: new Date(),
        expiresAt,
      };
  
      await user.save();
      return 'User upgraded to premium.';
    } catch (error) {
      throw new Error('Error upgrading subscription: ' + error.message);
    }
  };
  
  // Service to cancel premium subscription
  exports.cancelSubscription = async (userId) => {
    try {
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found.');
  
      user.subscription.status = 'expired';
      user.subscription.expiresAt = new Date();
  
      await user.save();
      return 'Subscription cancelled.';
    } catch (error) {
      throw new Error('Error cancelling subscription: ' + error.message);
    }
  };