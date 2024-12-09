const recipeService = require('../services/recipeService');

// Import recipes
exports.importRecipes = async (req, res) => {
  try {
    const fileContent = req.file.buffer.toString(); // Read uploaded file
    const userId = req.user.id;

    const message = await recipeService.importRecipes(userId, fileContent);

    res.json({ message });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Export recipes
exports.exportRecipes = async (req, res) => {
  try {
    const userId = req.user.id;

    const fileContent = await recipeService.exportRecipes(userId);

    res.setHeader('Content-Disposition', 'attachment; filename=recipes.json');
    res.setHeader('Content-Type', 'application/json');
    res.send(fileContent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
