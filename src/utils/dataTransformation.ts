import { type Meal } from '../data/mealPlans';
import type { WeeklyMenu, MealItem, Ingredient } from '../types';

const parseIngredient = (ingredient: string): Ingredient => {
  const units = ['cup', 'cups', 'tsp', 'teaspoon', 'teaspoons', 'tbsp', 'tablespoon', 'tablespoons', 'oz', 'ounce', 'ounces', 'lb', 'pound', 'pounds', 'slice', 'slices', 'clove', 'cloves', 'can', 'cans'];
  const descriptors = ['large', 'small', 'medium', 'ripe', 'chopped', 'diced', 'minced', 'sliced', 'whole', 'ground', 'fresh', 'of'];

  let workingString = ingredient.toLowerCase();

  // Parse quantity, including fractions
  const qtyMatch = workingString.match(/^(\d+\/\d+|\d*\.?\d+)/);
  let qty = 1;
  if (qtyMatch) {
    const qtyStr = qtyMatch[0];
    if (qtyStr.includes('/')) {
      const [num, den] = qtyStr.split('/');
      qty = parseInt(num, 10) / parseInt(den, 10);
    } else {
      qty = parseFloat(qtyStr);
    }
    workingString = workingString.substring(qtyStr.length).trim();
  }

  // Remove units and descriptors
  const parts = workingString.split(' ').filter(part => !units.includes(part) && !descriptors.includes(part));

  // Singularize and title case
  let item = parts.join(' ').replace(/s$/, '');
  item = item.charAt(0).toUpperCase() + item.slice(1);

  return { item, qty };
};

// Transforms the menu from HerediblesPage into the format expected by GroceryShoppingListPage.
export const transformMenuForGroceryList = (herediblesMenu: any, mealPlans: Meal[]): WeeklyMenu => {
  const groceryListMenu: Partial<WeeklyMenu> = {};

  Object.keys(herediblesMenu).forEach(day => {
    const dayKey = day.toLowerCase() as keyof WeeklyMenu;
    const dayMeals = herediblesMenu[day];
    const mealNames = Object.values(dayMeals).filter(name => name && name !== '');

    groceryListMenu[dayKey] = mealPlans
      .filter(mealPlan => mealNames.includes(mealPlan.name))
      .map((meal): MealItem => ({
        meal: meal.name,
        // Transform ingredients from string array to object array
        ingredients: meal.recipe.ingredients.map(parseIngredient), // Already transformed
        recipe: meal.recipe, // Keep the rest of the recipe data
        rating: 0, // Default values
        comments: '',
      }));
  });

  // Ensure all days of the week are present, even if empty
  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  daysOfWeek.forEach(day => {
    const dayKey = day as keyof WeeklyMenu;
    if (!groceryListMenu[dayKey]) {
      groceryListMenu[dayKey] = [];
    }
  });

  return groceryListMenu as WeeklyMenu;
};
