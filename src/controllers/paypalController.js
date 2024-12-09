const paypalService = require('../services/paypalService');

// Create PayPal order
exports.createPayPalOrder = async (req, res) => {
  try {
    const { amount } = req.body; // Expect amount from frontend
    const order = await paypalService.createOrder(amount);
    res.json({ orderId: order.id });
  } catch (error) {
    res.status(500).json({ message: 'Error creating PayPal order', error: error.message });
  }
};
