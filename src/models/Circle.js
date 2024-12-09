const mongoose = require('mongoose');

const circleSchema = new mongoose.Schema({
  name: { type: String, required: true },                  // Circle name (e.g., "Culinary School Group")
  description: { type: String },                          // Optional description of the circle
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who created the circle
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // List of members in the circle
  recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }], // Recipes shared in the circle
  createdAt: { type: Date, default: Date.now }            // Timestamp for circle creation
});

module.exports = mongoose.model('Circle', circleSchema);
