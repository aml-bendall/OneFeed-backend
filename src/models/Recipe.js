const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  quantity: { type: String, required: true }, // Quantity of the ingredient (e.g., "1 cup")
  unit: { type: String, required: true },     // Unit of measurement (e.g., "cups", "grams")
  name: { type: String, required: true }      // Ingredient name (e.g., "Flour")
});

const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true },                // Recipe name (e.g., "Chocolate Cake")
  description: { type: String },                        // Optional short description of the recipe
  ingredients: [ingredientSchema],                      // List of ingredients
  instructions: { type: String, required: true },       // Step-by-step instructions
  visibility: { type: String, enum: ['private', 'circle', 'public'], default: 'private' }, // Recipe visibility
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who created the recipe
  circleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Circle' }, // Optional circle ID for shared recipes
  folderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder' }, // NEW: Folder association
  createdAt: { type: Date, default: Date.now }          // Timestamp for recipe creation
});

module.exports = mongoose.model('Recipe', recipeSchema);
