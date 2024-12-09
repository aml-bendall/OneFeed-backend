const Recipe = require('../models/Recipe');

// Fetch recipes for scaling
exports.getRecipesForScaler = async (userId) => {
  try {
    const recipes = await Recipe.find({ createdBy: userId }).select('name ingredients');
    return recipes;
  } catch (error) {
    throw new Error('Error fetching recipes for scaler: ' + error.message);
  }
};
