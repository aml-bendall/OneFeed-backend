const mongoose = require('mongoose');

const UnifiedFeedSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  platform: { type: String, required: true },
  postId: { type: String, required: true },
  content: { type: String },
  mediaUrl: { type: String },
  timestamp: { type: Date, required: true },
});

module.exports = mongoose.model('UnifiedFeed', UnifiedFeedSchema);
