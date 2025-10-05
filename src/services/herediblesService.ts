import { apiRequest } from '../config/api';

export interface Recipe {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: string;
  category: string;
  cuisine?: string;
  dietaryTags: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  goodFor?: string;
  restrictions?: string;
  ingredients: string;
  instructions: string;
  tips?: string;
  rating: number;
  reviewCount: number;
}

export interface MealPlan {
  id: string;
  patientId: string;
  patientName: string;
  planName: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  targetCalories?: number;
  targetProtein?: number;
  targetCarbs?: number;
  targetFat?: number;
  dietType?: string;
  restrictions?: string;
  allergies?: string;
  healthConditions?: string;
  notes?: string;
  meals?: PlannedMeal[];
}

export interface PlannedMeal {
  id: string;
  mealPlanId: string;
  date: string;
  mealType: string;
  recipeId?: string;
  recipeName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  isCompleted: boolean;
  completedAt?: string;
  notes?: string;
  photoUrl?: string;
  photoTakenBy?: string;
  photoTakenAt?: string;
  rating?: number;
  ratedBy?: string;
  ratedAt?: string;
  feedback?: string;
}

export interface NutritionSummary {
  date: string;
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  targets: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  } | null;
  mealsCompleted: number;
  percentages: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  } | null;
}

export const herediblesService = {
  // Get all recipes
  getRecipes: async (params?: {
    category?: string;
    difficulty?: string;
    maxCalories?: number;
    dietaryTags?: string;
  }): Promise<Recipe[]> => {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.difficulty) queryParams.append('difficulty', params.difficulty);
    if (params?.maxCalories) queryParams.append('maxCalories', params.maxCalories.toString());
    if (params?.dietaryTags) queryParams.append('dietaryTags', params.dietaryTags);

    const query = queryParams.toString();
    const endpoint = query ? `/heredibles/recipes?${query}` : '/heredibles/recipes';

    return apiRequest<Recipe[]>(endpoint, {
      method: 'GET',
    });
  },

  // Get single recipe
  getRecipe: async (id: string): Promise<Recipe> => {
    return apiRequest<Recipe>(`/heredibles/recipes/${id}`, {
      method: 'GET',
    });
  },

  // Get meal plans
  getMealPlans: async (patientId?: string): Promise<MealPlan[]> => {
    const query = patientId ? `?patientId=${patientId}` : '';
    return apiRequest<MealPlan[]>(`/heredibles/meal-plans${query}`, {
      method: 'GET',
    });
  },

  // Get active meal plan
  getActiveMealPlan: async (patientId?: string): Promise<MealPlan | null> => {
    const query = patientId ? `?patientId=${patientId}` : '';
    return apiRequest<MealPlan | null>(`/heredibles/meal-plans/active${query}`, {
      method: 'GET',
    });
  },

  // Get planned meals
  getPlannedMeals: async (mealPlanId: string, startDate?: string, endDate?: string): Promise<PlannedMeal[]> => {
    const queryParams = new URLSearchParams({ mealPlanId });
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);

    return apiRequest<PlannedMeal[]>(`/heredibles/planned-meals?${queryParams.toString()}`, {
      method: 'GET',
    });
  },

  // Complete meal
  completeMeal: async (mealId: string, notes?: string, photoUrl?: string): Promise<PlannedMeal> => {
    return apiRequest<PlannedMeal>(`/heredibles/planned-meals/${mealId}/complete`, {
      method: 'PATCH',
      body: JSON.stringify({ notes, photoUrl }),
    });
  },

  // Upload meal photo
  uploadMealPhoto: async (mealId: string, photoUrl: string): Promise<PlannedMeal> => {
    return apiRequest<PlannedMeal>(`/heredibles/planned-meals/${mealId}/photo`, {
      method: 'PATCH',
      body: JSON.stringify({ photoUrl }),
    });
  },

  // Rate meal
  rateMeal: async (mealId: string, rating: number, feedback?: string): Promise<PlannedMeal> => {
    return apiRequest<PlannedMeal>(`/heredibles/planned-meals/${mealId}/rate`, {
      method: 'PATCH',
      body: JSON.stringify({ rating, feedback }),
    });
  },

  // Get meal preferences
  getMealPreferences: async (patientId?: string): Promise<any> => {
    const query = patientId ? `?patientId=${patientId}` : '';
    return apiRequest<any>(`/heredibles/meal-preferences${query}`, {
      method: 'GET',
    });
  },

  // Get nutrition summary
  getNutritionSummary: async (patientId?: string, date?: string): Promise<NutritionSummary> => {
    const queryParams = new URLSearchParams();
    if (patientId) queryParams.append('patientId', patientId);
    if (date) queryParams.append('date', date);

    const query = queryParams.toString();
    const endpoint = query ? `/heredibles/nutrition-summary?${query}` : '/heredibles/nutrition-summary';

    return apiRequest<NutritionSummary>(endpoint, {
      method: 'GET',
    });
  },

  // Get recommended recipes
  getRecommendedRecipes: async (patientId?: string): Promise<Recipe[]> => {
    const query = patientId ? `?patientId=${patientId}` : '';
    return apiRequest<Recipe[]>(`/heredibles/recommended-recipes${query}`, {
      method: 'GET',
    });
  },
};
