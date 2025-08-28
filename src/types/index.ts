export interface Ingredient {
  item: string;
  qty: number;
}

export interface Recipe {
  // From original grocery list page
  preparation?: string;
  timing?: string;
  temperature?: string;
  utensils?: string;
  // From heredibles meal plans
  ingredients?: string[];
  instructions?: string[];
  medicalNotes?: string;
}

export interface MealItem {
  meal: string;
  ingredients: Ingredient[];
  recipe: Recipe;
  rating: number;
  comments: string;
}

export interface WeeklyMenu {
  monday: MealItem[];
  tuesday: MealItem[];
  wednesday: MealItem[];
  thursday: MealItem[];
  friday: MealItem[];
  saturday: MealItem[];
  sunday: MealItem[];
  snacks: MealItem[];
}
