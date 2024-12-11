const Recipe = require('../models/Recipe'); // Import the Recipe model
const Circle = require('../models/Circle'); // Import the Circle model
const User = require('../models/User'); // Import the User model
const activityLogService = require('./activityLogService'); // Import the Activity Log Service

// Service function to save a new recipe
exports.saveRecipe = async (userId, name, ingredients, instructions, visibility, circleId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found.');
    if (!user.canCreateRecipe()) throw new Error('Free users can only save up to 10 recipes. Upgrade to Premium!');

    if (circleId) {
      const circle = await Circle.findById(circleId);
      if (!circle) throw new Error('Circle not found.');
      if (!circle.members.includes(userId)) throw new Error('User is not a member of the specified circle.');
    }

    const recipe = new Recipe({
      name,
      ingredients,
      instructions,
      visibility,
      circleId: circleId || null,
      createdBy: userId,
    });

    await recipe.save();

    user.recipeCount += 1;
    await user.save();

    // Log activity for premium users
    await activityLogService.logActivity(userId, 'save_recipe', { recipeId: recipe._id, recipeName: name });

    return 'Recipe saved successfully.';
  } catch (error) {
    throw new Error('Error saving recipe: ' + error.message);
  }
};

// Service function to fetch recipes
exports.getRecipes = async (userId, visibility, circleId) => {
  try {
    const query = {
      $or: [
        { visibility: 'public' },
        { visibility: 'circle', circleId: circleId },
        { visibility: 'private', createdBy: userId },
      ],
    };

    if (circleId) {
      const circle = await Circle.findById(circleId);
      if (!circle) throw new Error('Circle not found.');
      if (!circle.members.includes(userId)) throw new Error('User is not a member of the specified circle.');
    }

    const recipes = await Recipe.find(query);

    // Log activity for premium users
    await activityLogService.logActivity(userId, 'view_recipes', { circleId });

    return recipes;
  } catch (error) {
    throw new Error('Error fetching recipes: ' + error.message);
  }
};

// Service function to delete a recipe
exports.deleteRecipe = async (userId, recipeId) => {
  try {
    const recipe = await Recipe.findById(recipeId);

    if (!recipe) throw new Error('Recipe not found.');
    if (recipe.createdBy.toString() !== userId) {
      throw new Error('Unauthorized: Only the creator can delete this recipe.');
    }

    await Recipe.findByIdAndDelete(recipeId);

    const user = await User.findById(userId);
    user.recipeCount -= 1;
    await user.save();

    // Log activity for premium users
    await activityLogService.logActivity(userId, 'delete_recipe', { recipeId, recipeName: recipe.name });

    return 'Recipe deleted successfully.';
  } catch (error) {
    throw new Error('Error deleting recipe: ' + error.message);
  }
};

// Import recipe to scaler (premium feature)
exports.importToScaler = async (userId, recipeId) => {
  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) throw new Error('Recipe not found.');

    // Additional logic to convert and import recipe to the scaler
    return 'Recipe imported to scaler successfully.';
  } catch (error) {
    throw new Error('Error importing recipe to scaler: ' + error.message);
  }
};

// Service function to fetch a recipe by its ID
exports.getRecipeById = async (userId, recipeId) => {
  try {
    const recipe = await Recipe.findById(recipeId);

    if (!recipe) throw new Error('Recipe not found.');

    // Check if the user has permission to view the recipe
    if (
      recipe.visibility === 'private' && recipe.createdBy.toString() !== userId
    ) {
      throw new Error('Unauthorized: You do not have access to this recipe.');
    }

    if (
      recipe.visibility === 'circle' && 
      (!recipe.circleId || !(await Circle.findById(recipe.circleId)).members.includes(userId))
    ) {
      throw new Error('Unauthorized: You are not a member of the circle where this recipe is shared.');
    }

    // Log activity for premium users
    await activityLogService.logActivity(userId, 'view_recipe', { recipeId, recipeName: recipe.name });

    return recipe;
  } catch (error) {
    throw new Error('Error fetching recipe: ' + error.message);
  }
};

// Service function to update a recipe
exports.updateRecipe = async (userId, recipeId, updateData) => {
  try {
    const recipe = await Recipe.findById(recipeId);

    if (!recipe) throw new Error('Recipe not found.');

    // Ensure only the creator can update the recipe
    if (recipe.createdBy.toString() !== userId) {
      throw new Error('Unauthorized: Only the creator can update this recipe.');
    }

    // Update the allowed fields
    const allowedFields = ['name', 'ingredients', 'instructions', 'visibility', 'description'];
    Object.keys(updateData).forEach((key) => {
      if (allowedFields.includes(key)) {
        recipe[key] = updateData[key];
      }
    });

    await recipe.save();

    // Log activity for premium users
    await activityLogService.logActivity(userId, 'update_recipe', {
      recipeId,
      recipeName: recipe.name,
    });

    return 'Recipe updated successfully.';
  } catch (error) {
    throw new Error('Error updating recipe: ' + error.message);
  }
};
