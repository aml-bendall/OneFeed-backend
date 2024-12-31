const mongoose = require('mongoose');

const SocialMediaAccountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  platform: { type: String, required: true },
  accessToken: { type: String, required: true },
  refreshToken: { type: String },
  expiresIn: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SocialMediaAccount', SocialMediaAccountSchema);
