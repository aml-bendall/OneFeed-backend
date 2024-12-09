const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Associated user
  amount: { type: Number, required: true }, // Payment amount
  currency: { type: String, default: 'USD' }, // Currency (default to USD)
  transactionId: { type: String, required: true }, // Unique transaction ID
  status: { type: String, enum: ['success', 'failed'], default: 'success' }, // Payment status
  createdAt: { type: Date, default: Date.now } // Timestamp of payment
});

module.exports = mongoose.model('Payment', paymentSchema);