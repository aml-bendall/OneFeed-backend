const recipeService = require('../services/recipeService');

// Fetch recipes for the scaler tool
exports.fetchRecipesForScaler = async (req, res) => {
  try {
    const userId = req.user.id;
    const recipes = await recipeService.getRecipesForScaler(userId);
    res.json(recipes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Save scaled recipe
exports.saveScaledRecipe = async (req, res) => {
  try {
    const { name, ingredients, originalServings, scaledServings } = req.body;
    const userId = req.user.id;

    const newRecipe = {
      name: `${name} (Scaled)`,
      ingredients,
      instructions: '', // Optionally, allow users to add instructions later
      visibility: 'private',
      createdBy: userId,
    };

    const savedRecipe = await recipeService.saveRecipe(
      userId,
      newRecipe.name,
      newRecipe.ingredients,
      newRecipe.instructions,
      newRecipe.visibility,
      null // No circle association
    );

    res.json({ message: 'Scaled recipe saved successfully', recipe: savedRecipe });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
