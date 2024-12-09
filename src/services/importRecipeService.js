const Recipe = require('../models/Recipe');

// Import recipes from a file
exports.importRecipes = async (userId, fileContent) => {
  try {
    const recipes = JSON.parse(fileContent); // Parse JSON content

    const newRecipes = recipes.map(recipe => ({
      name: recipe.name,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      visibility: 'private', // Default to private
      createdBy: userId,
    }));

    await Recipe.insertMany(newRecipes); // Save to database

    return `${newRecipes.length} recipes imported successfully.`;
  } catch (error) {
    throw new Error('Error importing recipes: ' + error.message);
  }
};

// Export recipes to a file
exports.exportRecipes = async (userId) => {
  try {
    const recipes = await Recipe.find({ createdBy: userId });

    if (!recipes.length) {
      throw new Error('No recipes found for export.');
    }

    return JSON.stringify(recipes, null, 2); // Format as JSON for download
  } catch (error) {
    throw new Error('Error exporting recipes: ' + error.message);
  }
};
