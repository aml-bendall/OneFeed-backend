const express = require('express');
const router = express.Router();
const recipeController = require('../src/controllers/recipeController');
const authMiddleware = require('../src/middleware/authMiddleware');

// Create a new recipe
router.post('/create', authMiddleware, recipeController.createRecipe);

// Fetch all recipes (public/private/circle)
router.get('/', authMiddleware, recipeController.getRecipes);

// Fetch a single recipe by ID
router.get('/:id', authMiddleware, recipeController.getRecipeById);

// Update an existing recipe
router.put('/:id', authMiddleware, recipeController.updateRecipe);

// Delete a recipe
router.delete('/:id', authMiddleware, recipeController.deleteRecipe);

// Import a recipe into the Recipe Scaler tool
router.post('/import', authMiddleware, recipeController.importToScaler);

module.exports = router;
