const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Import recipes
router.post('/import', authMiddleware, upload.single('file'), recipeController.importRecipes);

// Export recipes
router.get('/export', authMiddleware, recipeController.exportRecipes);

module.exports = router;
