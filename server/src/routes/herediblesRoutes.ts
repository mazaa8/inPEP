import { Router } from 'express';
import {
  getRecipes,
  getRecipe,
  getMealPlans,
  getActiveMealPlan,
  getPlannedMeals,
  completeMeal,
  uploadMealPhoto,
  rateMeal,
  getMealPreferences,
  getNutritionLogs,
  getNutritionSummary,
  getRecommendedRecipes,
} from '../controllers/herediblesController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Public routes (recipes can be viewed without auth for demo)
router.get('/recipes', getRecipes);
router.get('/recipes/:id', getRecipe);

// Protected routes
router.use(authenticate);

// Meal plans
router.get('/meal-plans', getMealPlans);
router.get('/meal-plans/active', getActiveMealPlan);

// Planned meals
router.get('/planned-meals', getPlannedMeals);
router.patch('/planned-meals/:id/complete', completeMeal);
router.patch('/planned-meals/:id/photo', uploadMealPhoto);
router.patch('/planned-meals/:id/rate', rateMeal);

// Nutrition tracking
router.get('/nutrition-logs', getNutritionLogs);
router.get('/nutrition-summary', getNutritionSummary);

// Preferences and recommendations
router.get('/meal-preferences', getMealPreferences);
router.get('/recommended-recipes', getRecommendedRecipes);

export default router;
