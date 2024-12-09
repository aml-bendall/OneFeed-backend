const express = require('express');
const router = express.Router();
const scalerController = require('../controllers/recipeScalerController');
const authMiddleware = require('../middleware/authMiddleware');

// Fetch recipes for scaler
router.get('/recipes', authMiddleware, scalerController.fetchRecipesForScaler);

// Save scaled recipe
router.post('/save', authMiddleware, scalerController.saveScaledRecipe);

module.exports = router;