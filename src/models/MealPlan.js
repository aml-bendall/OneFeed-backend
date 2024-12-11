const mongoose = require('mongoose');

const mealPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  weekStart: { type: Date, required: true }, // Start of the week (e.g., Monday)
  meals: [
    {
      date: { type: Date, required: true }, // Specific day
      mealType: { type: String, required: true }, // Breakfast, Lunch, etc.
      recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }, // Linked recipe
    },
  ],
  createdAt: { type: Date, default: Date.now }, // Auto-generated timestamp
});

module.exports = mongoose.model('MealPlan', mealPlanSchema);
