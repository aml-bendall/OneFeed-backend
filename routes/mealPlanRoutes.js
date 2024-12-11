const express = require('express');
const router = express.Router();
const mealPlanController = require('../controllers/mealPlanController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Routes
router.post('/', authMiddleware, mealPlanController.createMealPlan);
router.get('/', authMiddleware, mealPlanController.getMealPlans);
router.get('/:id', authMiddleware, mealPlanController.getMealPlanById);
router.put('/:id', authMiddleware, mealPlanController.updateMealPlan);
router.delete('/:id', authMiddleware, mealPlanController.deleteMealPlan);

module.exports = router;
