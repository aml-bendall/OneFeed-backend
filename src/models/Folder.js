const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Folder name (e.g., "Breakfast")
  description: { type: String }, // Optional description of the folder
  image: { type: String }, // URL/path to the folder image
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who created the folder
  recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }], // Array of recipe IDs stored in the folder
  createdAt: { type: Date, default: Date.now }, // Timestamp of folder creation
});

module.exports = mongoose.model('Folder', folderSchema);