const recipeService = require('../services/recipeService');

// Create a new recipe
exports.createRecipe = async (req, res) => {
  try {
    const { name, ingredients, instructions, visibility, circleId } = req.body;
    const userId = req.user.id;
    const message = await recipeService.saveRecipe(userId, name, ingredients, instructions, visibility, circleId);
    res.json({ message });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Fetch all recipes accessible to the user
exports.getRecipes = async (req, res) => {
  try {
    const { visibility, circleId } = req.query;
    const userId = req.user.id;
    const recipes = await recipeService.getRecipes(userId, visibility, circleId);
    res.json(recipes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Fetch a single recipe by ID
exports.getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const recipe = await recipeService.getRecipeById(userId, id);
    res.json(recipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a recipe
exports.updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, ingredients, instructions, visibility } = req.body;
    const userId = req.user.id;
    const message = await recipeService.updateRecipe(userId, id, { name, ingredients, instructions, visibility });
    res.json({ message });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a recipe
exports.deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const message = await recipeService.deleteRecipe(userId, id);
    res.json({ message });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Import recipe to scaler (premium feature)
exports.importToScaler = async (req, res) => {
  try {
    const { recipeId } = req.body;
    const userId = req.user.id;
    const message = await recipeService.importToScaler(userId, recipeId);
    res.json({ message });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
