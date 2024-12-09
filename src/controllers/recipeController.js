const recipeService = require('../services/recipeService');

// Save a new recipe
exports.saveRecipe = async (req, res, next) => {
  try {
    const { name, ingredients, instructions, visibility, familyId } = req.body;

    // Access the user ID from the authenticated request
    const userId = req.user.id;

    // Call the service to save the recipe, including the user ID and family association
    const response = await recipeService.saveRecipe(userId, name, ingredients, instructions, visibility, familyId);

    // Send the response back to the frontend
    res.json({ message: response });
  } catch (error) {
    next(error); // Pass any errors to the error handler
  }
};

// Get recipes
exports.getRecipes = async (req, res, next) => {
  try {
    const { visibility, familyId } = req.query;
    const userId = req.user.id;

    // Call the service to fetch recipes based on visibility and family scope
    const recipes = await recipeService.getRecipes(userId, visibility, familyId);

    res.json(recipes); // Return the list of recipes
  } catch (error) {
    next(error); // Pass any errors to the error handler
  }
};

// Delete a recipe
exports.deleteRecipe = async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    const userId = req.user.id;

    // Call the service to delete the recipe
    const response = await recipeService.deleteRecipe(userId, recipeId);

    res.json({ message: response });
  } catch (error) {
    next(error); // Pass any errors to the error handler
  }
};
