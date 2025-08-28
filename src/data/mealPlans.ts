export interface Meal {
  id: string;
  name: string;
  category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  recipe: {
    ingredients: string[];
    instructions: string[];
    medicalNotes: string;
  };
}

export const mealPlans: Meal[] = [
  // Breakfast
  {
    id: 'b1',
    name: 'Oatmeal with Berries',
    category: 'Breakfast',
    recipe: {
      ingredients: ['1/2 cup rolled oats', '1 cup water or milk', '1/2 cup mixed berries (fresh or frozen)', '1 tbsp honey or maple syrup (optional)'],
      instructions: [
        '1. In a small saucepan, bring the water or milk to a boil.',
        '2. Stir in the oats and reduce heat to a simmer.',
        '3. Cook for 5-7 minutes, stirring occasionally, until the oats are tender.',
        '4. Top with mixed berries and a drizzle of honey or maple syrup if desired.',
      ],
      medicalNotes: 'Excellent source of fiber. For diabetic patients, use water instead of milk and omit sweeteners. Berries provide antioxidants.',
    },
  },
  {
    id: 'b2',
    name: 'Scrambled Eggs with Toast',
    category: 'Breakfast',
    recipe: {
      ingredients: ['2 large eggs', '2 tbsp milk', '1 slice whole-wheat toast', 'Salt and pepper to taste', '1 tsp butter or oil'],
      instructions: [
        '1. Whisk eggs, milk, salt, and pepper in a bowl.',
        '2. Heat butter or oil in a non-stick skillet over medium heat.',
        '3. Pour in the egg mixture and cook, stirring gently, until the eggs are set.',
        '4. Serve immediately with whole-wheat toast.',
      ],
      medicalNotes: 'Good source of protein. Use a low-sodium salt substitute for hypertensive patients. Whole-wheat toast adds fiber.',
    },
  },

  // Lunch
  {
    id: 'l1',
    name: 'Grilled Chicken Salad',
    category: 'Lunch',
    recipe: {
      ingredients: ['4 oz grilled chicken breast, sliced', '2 cups mixed greens', '1/2 cucumber, sliced', '1/4 red onion, thinly sliced', '2 tbsp olive oil vinaigrette'],
      instructions: [
        '1. In a large bowl, combine the mixed greens, cucumber, and red onion.',
        '2. Top with the sliced grilled chicken.',
        '3. Drizzle with olive oil vinaigrette and toss to combine.',
      ],
      medicalNotes: 'Lean protein and vegetables. Low-carb and suitable for diabetic diets. Ensure vinaigrette is low in sugar and sodium.',
    },
  },

  // Dinner
  {
    id: 'd5',
    name: 'Beef Tacos (Mexican-inspired)',
    category: 'Dinner',
    recipe: {
      ingredients: ['1 lb lean ground beef', '1 packet low-sodium taco seasoning', '8 small corn tortillas', 'Toppings: shredded lettuce, diced tomatoes, low-fat cheese, salsa'],
      instructions: [
        '1. In a large skillet, cook the ground beef over medium-high heat until browned. Drain excess fat.',
        '2. Stir in the taco seasoning and 1/4 cup of water. Simmer for 5 minutes.',
        '3. Warm the corn tortillas in a dry skillet or microwave.',
        '4. Assemble the tacos with the beef and desired toppings.',
      ],
      medicalNotes: 'A cultural favorite. Using lean beef and corn tortillas makes it healthier. Opt for low-sodium seasoning and be mindful of high-fat toppings like sour cream. A great option for patient morale.',
    },
  },
  {
    id: 'd2',
    name: 'Spaghetti Carbonara (Italian-inspired)',
    category: 'Dinner',
    recipe: {
      ingredients: ['8 oz spaghetti', '2 large eggs', '1/2 cup grated Parmesan cheese', '4 slices of turkey bacon, chopped', '2 cloves garlic, minced', 'Black pepper'],
      instructions: [
        '1. Cook spaghetti according to package directions. Reserve 1/2 cup of pasta water.',
        '2. While pasta cooks, cook turkey bacon in a skillet until crisp. Add garlic and cook for 1 minute.',
        '3. In a bowl, whisk eggs and Parmesan. Season with black pepper.',
        '4. Drain the pasta and immediately add it to the skillet with the bacon. Remove from heat.',
        '5. Slowly pour in the egg mixture, tossing quickly to coat the pasta. The heat from the pasta will cook the eggs. Add reserved pasta water as needed to create a creamy sauce.',
      ],
      medicalNotes: 'Modified for health. Using turkey bacon reduces fat content. Portion control is key due to carbohydrates. Avoid adding extra salt.',
    },
  },

  // Snacks
  {
    id: 's1',
    name: 'Apple with Peanut Butter',
    category: 'Snack',
    recipe: {
      ingredients: ['1 medium apple, sliced', '2 tbsp natural peanut butter'],
      instructions: ['Slice the apple and serve with peanut butter for dipping.'],
      medicalNotes: 'Balanced snack with fiber and protein. Choose natural peanut butter with no added sugar or salt.',
    },
  },
];
