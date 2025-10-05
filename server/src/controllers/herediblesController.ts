import { Response } from 'express';
import prisma from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { AuthRequest } from '../types/index.js';

// Get all recipes
export const getRecipes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { category, difficulty, maxCalories, dietaryTags } = req.query;

    const whereClause: any = { isPublic: true };

    if (category) {
      whereClause.category = category;
    }

    if (difficulty) {
      whereClause.difficulty = difficulty;
    }

    if (maxCalories) {
      whereClause.calories = { lte: parseInt(maxCalories as string) };
    }

    const recipes = await prisma.recipe.findMany({
      where: whereClause,
      orderBy: { rating: 'desc' },
    });

    // Filter by dietary tags if provided
    let filteredRecipes = recipes;
    if (dietaryTags) {
      const tags = (dietaryTags as string).split(',');
      filteredRecipes = recipes.filter(recipe => {
        const recipeTags = JSON.parse(recipe.dietaryTags);
        return tags.some(tag => recipeTags.includes(tag));
      });
    }

    res.status(200).json(filteredRecipes);
  } catch (error) {
    console.error('Get recipes error:', error);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
};

// Get single recipe
export const getRecipe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const recipe = await prisma.recipe.findUnique({
      where: { id },
    });

    if (!recipe) {
      throw new AppError('Recipe not found', 404);
    }

    res.status(200).json(recipe);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('Get recipe error:', error);
      res.status(500).json({ error: 'Failed to fetch recipe' });
    }
  }
};

// Get meal plans for patient
export const getMealPlans = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { patientId } = req.query;
    const userId = patientId || req.user.id;

    const mealPlans = await prisma.mealPlan.findMany({
      where: { patientId: userId as string },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(mealPlans);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('Get meal plans error:', error);
      res.status(500).json({ error: 'Failed to fetch meal plans' });
    }
  }
};

// Get active meal plan
export const getActiveMealPlan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { patientId } = req.query;
    const userId = patientId || req.user.id;

    const mealPlan = await prisma.mealPlan.findFirst({
      where: {
        patientId: userId as string,
        isActive: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!mealPlan) {
      res.status(200).json(null);
      return;
    }

    // Get planned meals for this plan
    const plannedMeals = await prisma.plannedMeal.findMany({
      where: { mealPlanId: mealPlan.id },
      orderBy: { date: 'asc' },
    });

    res.status(200).json({
      ...mealPlan,
      meals: plannedMeals,
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('Get active meal plan error:', error);
      res.status(500).json({ error: 'Failed to fetch active meal plan' });
    }
  }
};

// Get planned meals for date range
export const getPlannedMeals = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { mealPlanId, startDate, endDate } = req.query;

    if (!mealPlanId) {
      throw new AppError('Meal plan ID is required', 400);
    }

    const whereClause: any = { mealPlanId: mealPlanId as string };

    if (startDate && endDate) {
      whereClause.date = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }

    const meals = await prisma.plannedMeal.findMany({
      where: whereClause,
      orderBy: { date: 'asc' },
    });

    res.status(200).json(meals);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('Get planned meals error:', error);
      res.status(500).json({ error: 'Failed to fetch planned meals' });
    }
  }
};

// Mark meal as completed
export const completeMeal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { id } = req.params;
    const { notes, photoUrl } = req.body;

    const meal = await prisma.plannedMeal.update({
      where: { id },
      data: {
        isCompleted: true,
        completedAt: new Date(),
        notes: notes || null,
        photoUrl: photoUrl || null,
        photoTakenBy: photoUrl ? req.user.id : null,
        photoTakenAt: photoUrl ? new Date() : null,
      },
    });

    res.status(200).json(meal);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('Complete meal error:', error);
      res.status(500).json({ error: 'Failed to complete meal' });
    }
  }
};

// Upload meal photo
export const uploadMealPhoto = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { id } = req.params;
    const { photoUrl } = req.body;

    if (!photoUrl) {
      throw new AppError('Photo URL is required', 400);
    }

    const meal = await prisma.plannedMeal.update({
      where: { id },
      data: {
        photoUrl,
        photoTakenBy: req.user.id,
        photoTakenAt: new Date(),
      },
    });

    res.status(200).json(meal);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('Upload meal photo error:', error);
      res.status(500).json({ error: 'Failed to upload meal photo' });
    }
  }
};

// Rate meal
export const rateMeal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { id } = req.params;
    const { rating, feedback } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      throw new AppError('Rating must be between 1 and 5', 400);
    }

    const meal = await prisma.plannedMeal.update({
      where: { id },
      data: {
        rating: parseInt(rating),
        ratedBy: req.user.id,
        ratedAt: new Date(),
        feedback: feedback || null,
      },
    });

    res.status(200).json(meal);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('Rate meal error:', error);
      res.status(500).json({ error: 'Failed to rate meal' });
    }
  }
};

// Get meal preferences analytics
export const getMealPreferences = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { patientId } = req.query;
    const userId = patientId || req.user.id;

    // Get all rated meals
    const ratedMeals = await prisma.plannedMeal.findMany({
      where: {
        rating: { not: null },
      },
    });

    // Get meal plan to filter by patient
    const mealPlans = await prisma.mealPlan.findMany({
      where: { patientId: userId as string },
    });

    const mealPlanIds = mealPlans.map(mp => mp.id);
    const patientRatedMeals = ratedMeals.filter(m => mealPlanIds.includes(m.mealPlanId));

    // Calculate averages by meal type
    const byMealType: { [key: string]: { total: number; count: number; meals: string[] } } = {};
    
    patientRatedMeals.forEach(meal => {
      if (!byMealType[meal.mealType]) {
        byMealType[meal.mealType] = { total: 0, count: 0, meals: [] };
      }
      byMealType[meal.mealType].total += meal.rating || 0;
      byMealType[meal.mealType].count += 1;
      byMealType[meal.mealType].meals.push(meal.recipeName);
    });

    // Calculate averages by recipe
    const byRecipe: { [key: string]: { total: number; count: number; recipeId?: string } } = {};
    
    patientRatedMeals.forEach(meal => {
      if (!byRecipe[meal.recipeName]) {
        byRecipe[meal.recipeName] = { total: 0, count: 0, recipeId: meal.recipeId || undefined };
      }
      byRecipe[meal.recipeName].total += meal.rating || 0;
      byRecipe[meal.recipeName].count += 1;
    });

    // Get top rated and least rated
    const recipeAverages = Object.entries(byRecipe).map(([name, data]) => ({
      recipeName: name,
      recipeId: data.recipeId,
      averageRating: data.total / data.count,
      timesRated: data.count,
    }));

    const topRated = recipeAverages.sort((a, b) => b.averageRating - a.averageRating).slice(0, 5);
    const leastRated = recipeAverages.sort((a, b) => a.averageRating - b.averageRating).slice(0, 5);

    res.status(200).json({
      totalRatings: patientRatedMeals.length,
      averageRating: patientRatedMeals.reduce((sum, m) => sum + (m.rating || 0), 0) / patientRatedMeals.length,
      byMealType: Object.entries(byMealType).map(([type, data]) => ({
        mealType: type,
        averageRating: data.total / data.count,
        count: data.count,
      })),
      topRated,
      leastRated,
      recentRatings: patientRatedMeals.slice(-10).reverse(),
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('Get meal preferences error:', error);
      res.status(500).json({ error: 'Failed to fetch meal preferences' });
    }
  }
};

// Get nutrition logs
export const getNutritionLogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { patientId, startDate, endDate } = req.query;
    const userId = patientId || req.user.id;

    const whereClause: any = { patientId: userId as string };

    if (startDate && endDate) {
      whereClause.date = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }

    const logs = await prisma.nutritionLog.findMany({
      where: whereClause,
      orderBy: { date: 'desc' },
    });

    res.status(200).json(logs);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('Get nutrition logs error:', error);
      res.status(500).json({ error: 'Failed to fetch nutrition logs' });
    }
  }
};

// Get nutrition summary
export const getNutritionSummary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { patientId, date } = req.query;
    const userId = patientId || req.user.id;
    const targetDate = date ? new Date(date as string) : new Date();

    // Set date range for the day
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Get completed meals for the day
    const mealPlan = await prisma.mealPlan.findFirst({
      where: {
        patientId: userId as string,
        isActive: true,
      },
    });

    let completedMeals = [];
    if (mealPlan) {
      completedMeals = await prisma.plannedMeal.findMany({
        where: {
          mealPlanId: mealPlan.id,
          date: {
            gte: startOfDay,
            lte: endOfDay,
          },
          isCompleted: true,
        },
      });
    }

    // Calculate totals
    const totals = completedMeals.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.calories,
        protein: acc.protein + meal.protein,
        carbs: acc.carbs + meal.carbs,
        fat: acc.fat + meal.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    // Get targets from meal plan
    const targets = mealPlan
      ? {
          calories: mealPlan.targetCalories || 2000,
          protein: mealPlan.targetProtein || 100,
          carbs: mealPlan.targetCarbs || 250,
          fat: mealPlan.targetFat || 70,
        }
      : null;

    res.status(200).json({
      date: targetDate,
      totals,
      targets,
      mealsCompleted: completedMeals.length,
      percentages: targets
        ? {
            calories: Math.round((totals.calories / targets.calories) * 100),
            protein: Math.round((totals.protein / targets.protein) * 100),
            carbs: Math.round((totals.carbs / targets.carbs) * 100),
            fat: Math.round((totals.fat / targets.fat) * 100),
          }
        : null,
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('Get nutrition summary error:', error);
      res.status(500).json({ error: 'Failed to fetch nutrition summary' });
    }
  }
};

// Get recommended recipes based on health conditions
export const getRecommendedRecipes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { patientId } = req.query;
    const userId = patientId || req.user.id;

    // Get patient's meal plan to understand health conditions
    const mealPlan = await prisma.mealPlan.findFirst({
      where: {
        patientId: userId as string,
        isActive: true,
      },
    });

    let healthConditions: string[] = [];
    if (mealPlan && mealPlan.healthConditions) {
      healthConditions = JSON.parse(mealPlan.healthConditions);
    }

    // Get all recipes
    const recipes = await prisma.recipe.findMany({
      where: { isPublic: true },
      orderBy: { rating: 'desc' },
    });

    // Filter recipes good for patient's conditions
    const recommended = recipes.filter(recipe => {
      if (!recipe.goodFor) return false;
      const recipeConditions = JSON.parse(recipe.goodFor);
      return healthConditions.some(condition => recipeConditions.includes(condition));
    });

    res.status(200).json(recommended.slice(0, 10)); // Top 10 recommendations
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('Get recommended recipes error:', error);
      res.status(500).json({ error: 'Failed to fetch recommended recipes' });
    }
  }
};
