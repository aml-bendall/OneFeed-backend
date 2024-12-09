const express = require('express');
const router = express.Router();
const recipeController = require('../src/controllers/recipeController');
const { authMiddleware } = require('../src/middleware/authMiddleware');
const premiumMiddleware = require('../src/middleware/authMiddleware').premiumMiddleware;

// Create a new recipe
router.post('/create', authMiddleware, recipeController.createRecipe);

// Fetch all recipes accessible to the user
router.get('/', authMiddleware, recipeController.getRecipes);

// Fetch a single recipe by ID
router.get('/:id', authMiddleware, recipeController.getRecipeById);

// Update a recipe
router.put('/:id', authMiddleware, recipeController.updateRecipe);

// Delete a recipe
router.delete('/:id', authMiddleware, recipeController.deleteRecipe);

// Import recipe to scaler (premium feature)
router.post('/import', authMiddleware, premiumMiddleware, recipeController.importToScaler);

module.exports = router;
