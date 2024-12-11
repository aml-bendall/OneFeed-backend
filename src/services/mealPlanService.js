const MealPlan = require('../models/MealPlan');

// Create a new meal plan
exports.createMealPlan = async (userId, weekStart, meals) => {
  const mealPlan = new MealPlan({ userId, weekStart, meals });
  await mealPlan.save();
  return mealPlan;
};

// Get meal plans for a user
exports.getMealPlans = async (userId) => {
  return MealPlan.find({ userId }).sort({ weekStart: -1 }); // Sorted by weekStart descending
};

// Get a specific meal plan
exports.getMealPlanById = async (userId, mealPlanId) => {
  return MealPlan.findOne({ _id: mealPlanId, userId });
};

// Update a meal plan
exports.updateMealPlan = async (userId, mealPlanId, updateData) => {
  return MealPlan.findOneAndUpdate(
    { _id: mealPlanId, userId },
    updateData,
    { new: true } // Return the updated document
  );
};

// Delete a meal plan
exports.deleteMealPlan = async (userId, mealPlanId) => {
  return MealPlan.findOneAndDelete({ _id: mealPlanId, userId });
};
