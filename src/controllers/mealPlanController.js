const mealPlanService = require('../services/mealPlanService');

// Create a meal plan
exports.createMealPlan = async (req, res) => {
  try {
    const { weekStart, meals } = req.body;
    const userId = req.user.id;

    if (!weekStart || !Array.isArray(meals)) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    const mealPlan = await mealPlanService.createMealPlan(userId, weekStart, meals);
    res.status(201).json({ message: 'Meal plan created successfully', mealPlan });
  } catch (error) {
    console.error('Error creating meal plan:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all meal plans for a user
exports.getMealPlans = async (req, res) => {
  try {
    const userId = req.user.id;
    const mealPlans = await mealPlanService.getMealPlans(userId);
    res.status(200).json(mealPlans);
  } catch (error) {
    console.error('Error fetching meal plans:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a specific meal plan
exports.getMealPlanById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const mealPlan = await mealPlanService.getMealPlanById(userId, id);
    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }

    res.status(200).json(mealPlan);
  } catch (error) {
    console.error('Error fetching meal plan:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a meal plan
exports.updateMealPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const updateData = req.body;

    const updatedMealPlan = await mealPlanService.updateMealPlan(userId, id, updateData);
    if (!updatedMealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }

    res.status(200).json({ message: 'Meal plan updated successfully', updatedMealPlan });
  } catch (error) {
    console.error('Error updating meal plan:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a meal plan
exports.deleteMealPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deletedMealPlan = await mealPlanService.deleteMealPlan(userId, id);
    if (!deletedMealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }

    res.status(200).json({ message: 'Meal plan deleted successfully', deletedMealPlan });
  } catch (error) {
    console.error('Error deleting meal plan:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
