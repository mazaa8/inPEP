import prisma from '../config/database.js';

const sampleRecipes = [
  // BREAKFAST
  {
    name: 'Heart-Healthy Oatmeal Bowl',
    description: 'Warm oatmeal topped with fresh berries, nuts, and a drizzle of honey. Perfect for managing cholesterol and heart health.',
    prepTime: 5,
    cookTime: 10,
    servings: 1,
    difficulty: 'EASY',
    category: 'BREAKFAST',
    cuisine: 'AMERICAN',
    dietaryTags: JSON.stringify(['VEGETARIAN', 'HEART_HEALTHY', 'HIGH_FIBER']),
    calories: 320,
    protein: 12,
    carbs: 52,
    fat: 8,
    fiber: 10,
    sugar: 12,
    sodium: 150,
    goodFor: JSON.stringify(['HEART_DISEASE', 'DIABETES', 'HYPERTENSION']),
    ingredients: JSON.stringify([
      { name: 'Rolled oats', amount: '1/2', unit: 'cup' },
      { name: 'Water or milk', amount: '1', unit: 'cup' },
      { name: 'Blueberries', amount: '1/4', unit: 'cup' },
      { name: 'Strawberries', amount: '1/4', unit: 'cup' },
      { name: 'Walnuts', amount: '1', unit: 'tbsp' },
      { name: 'Honey', amount: '1', unit: 'tsp' },
      { name: 'Cinnamon', amount: '1/4', unit: 'tsp' },
    ]),
    instructions: JSON.stringify([
      'Bring water or milk to a boil in a small pot',
      'Add oats and reduce heat to medium',
      'Cook for 5 minutes, stirring occasionally',
      'Transfer to a bowl',
      'Top with berries, walnuts, honey, and cinnamon',
      'Serve warm',
    ]),
    tips: 'Use steel-cut oats for extra fiber and better blood sugar control',
    rating: 4.8,
    reviewCount: 124,
  },
  {
    name: 'Avocado Toast with Poached Egg',
    description: 'Creamy avocado on whole grain toast topped with a perfectly poached egg. Protein-packed breakfast!',
    prepTime: 5,
    cookTime: 8,
    servings: 1,
    difficulty: 'EASY',
    category: 'BREAKFAST',
    cuisine: 'AMERICAN',
    dietaryTags: JSON.stringify(['VEGETARIAN', 'HIGH_PROTEIN', 'HEART_HEALTHY']),
    calories: 340,
    protein: 16,
    carbs: 28,
    fat: 18,
    fiber: 9,
    sugar: 3,
    sodium: 280,
    goodFor: JSON.stringify(['HEART_DISEASE', 'DIABETES']),
    ingredients: JSON.stringify([
      { name: 'Whole grain bread', amount: '2', unit: 'slices' },
      { name: 'Ripe avocado', amount: '1/2', unit: 'medium' },
      { name: 'Egg', amount: '1', unit: 'large' },
      { name: 'Lemon juice', amount: '1', unit: 'tsp' },
      { name: 'Red pepper flakes', amount: '1', unit: 'pinch' },
      { name: 'Salt and pepper', amount: 'to taste', unit: '' },
    ]),
    instructions: JSON.stringify([
      'Toast the bread until golden',
      'Mash avocado with lemon juice, salt, and pepper',
      'Bring water to a gentle simmer for poaching',
      'Crack egg into a small bowl',
      'Create a gentle whirlpool in the water and add egg',
      'Poach for 3-4 minutes',
      'Spread avocado on toast',
      'Top with poached egg and red pepper flakes',
    ]),
    tips: 'Add cherry tomatoes for extra vitamins and color',
    rating: 4.7,
    reviewCount: 98,
  },
  {
    name: 'Mediterranean Grilled Salmon',
    description: 'Omega-3 rich salmon with lemon, herbs, and olive oil. Excellent for heart health and inflammation.',
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    difficulty: 'MEDIUM',
    category: 'DINNER',
    cuisine: 'MEDITERRANEAN',
    dietaryTags: JSON.stringify(['GLUTEN_FREE', 'HEART_HEALTHY', 'HIGH_PROTEIN', 'LOW_CARB']),
    calories: 380,
    protein: 34,
    carbs: 4,
    fat: 24,
    fiber: 1,
    sugar: 1,
    sodium: 320,
    goodFor: JSON.stringify(['HEART_DISEASE', 'HYPERTENSION']),
    ingredients: JSON.stringify([
      { name: 'Salmon fillets', amount: '2', unit: 'pieces (6oz each)' },
      { name: 'Olive oil', amount: '2', unit: 'tbsp' },
      { name: 'Lemon juice', amount: '2', unit: 'tbsp' },
      { name: 'Garlic', amount: '2', unit: 'cloves, minced' },
      { name: 'Fresh dill', amount: '2', unit: 'tbsp' },
      { name: 'Salt', amount: '1/4', unit: 'tsp' },
      { name: 'Black pepper', amount: '1/4', unit: 'tsp' },
    ]),
    instructions: JSON.stringify([
      'Preheat grill to medium-high heat',
      'Mix olive oil, lemon juice, garlic, and dill in a bowl',
      'Brush salmon with the mixture',
      'Season with salt and pepper',
      'Grill salmon for 6-7 minutes per side',
      'Serve with steamed vegetables',
    ]),
    tips: 'Wild-caught salmon has higher omega-3 content than farmed',
    rating: 4.9,
    reviewCount: 89,
  },
  {
    name: 'Diabetic-Friendly Veggie Stir-Fry',
    description: 'Colorful vegetable stir-fry with lean chicken and low-sodium sauce. Great for blood sugar management.',
    prepTime: 15,
    cookTime: 12,
    servings: 4,
    difficulty: 'EASY',
    category: 'DINNER',
    cuisine: 'ASIAN',
    dietaryTags: JSON.stringify(['GLUTEN_FREE', 'LOW_CARB', 'HIGH_PROTEIN', 'DIABETIC_FRIENDLY']),
    calories: 285,
    protein: 28,
    carbs: 18,
    fat: 12,
    fiber: 5,
    sugar: 8,
    sodium: 420,
    goodFor: JSON.stringify(['DIABETES', 'HEART_DISEASE']),
    ingredients: JSON.stringify([
      { name: 'Chicken breast', amount: '1', unit: 'lb, sliced' },
      { name: 'Broccoli florets', amount: '2', unit: 'cups' },
      { name: 'Bell peppers', amount: '2', unit: 'cups, sliced' },
      { name: 'Snap peas', amount: '1', unit: 'cup' },
      { name: 'Garlic', amount: '3', unit: 'cloves, minced' },
      { name: 'Ginger', amount: '1', unit: 'tbsp, grated' },
      { name: 'Low-sodium soy sauce', amount: '3', unit: 'tbsp' },
      { name: 'Sesame oil', amount: '1', unit: 'tbsp' },
      { name: 'Olive oil', amount: '2', unit: 'tbsp' },
    ]),
    instructions: JSON.stringify([
      'Heat olive oil in a large wok or skillet over high heat',
      'Add chicken and cook until browned, about 5 minutes',
      'Remove chicken and set aside',
      'Add more oil if needed, then add garlic and ginger',
      'Add all vegetables and stir-fry for 5-6 minutes',
      'Return chicken to the pan',
      'Add soy sauce and sesame oil',
      'Toss everything together for 2 minutes',
      'Serve hot',
    ]),
    tips: 'Serve over cauliflower rice instead of white rice for lower carbs',
    rating: 4.7,
    reviewCount: 156,
  },
  {
    name: 'Low-Sodium Lentil Soup',
    description: 'Hearty lentil soup packed with vegetables and fiber. Perfect for heart health and weight management.',
    prepTime: 10,
    cookTime: 35,
    servings: 6,
    difficulty: 'EASY',
    category: 'LUNCH',
    cuisine: 'MEDITERRANEAN',
    dietaryTags: JSON.stringify(['VEGAN', 'GLUTEN_FREE', 'HIGH_FIBER', 'LOW_SODIUM']),
    calories: 245,
    protein: 14,
    carbs: 42,
    fat: 3,
    fiber: 16,
    sugar: 6,
    sodium: 180,
    goodFor: JSON.stringify(['HEART_DISEASE', 'DIABETES', 'HYPERTENSION']),
    ingredients: JSON.stringify([
      { name: 'Green or brown lentils', amount: '1.5', unit: 'cups' },
      { name: 'Carrots', amount: '2', unit: 'large, diced' },
      { name: 'Celery', amount: '2', unit: 'stalks, diced' },
      { name: 'Onion', amount: '1', unit: 'large, diced' },
      { name: 'Garlic', amount: '4', unit: 'cloves, minced' },
      { name: 'Tomatoes', amount: '1', unit: 'can (14oz), diced' },
      { name: 'Vegetable broth', amount: '6', unit: 'cups, low-sodium' },
      { name: 'Cumin', amount: '1', unit: 'tsp' },
      { name: 'Turmeric', amount: '1/2', unit: 'tsp' },
      { name: 'Bay leaves', amount: '2', unit: 'leaves' },
    ]),
    instructions: JSON.stringify([
      'Heat olive oil in a large pot over medium heat',
      'Sauté onion, carrots, and celery for 5 minutes',
      'Add garlic and cook for 1 minute',
      'Add lentils, tomatoes, broth, and spices',
      'Bring to a boil, then reduce heat',
      'Simmer for 30 minutes until lentils are tender',
      'Remove bay leaves',
      'Season to taste and serve',
    ]),
    tips: 'Make a large batch and freeze portions for easy meals',
    rating: 4.6,
    reviewCount: 203,
  },
  {
    name: 'Greek Yogurt Parfait',
    description: 'Protein-rich Greek yogurt layered with fresh fruit and granola. Great for breakfast or snack.',
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    difficulty: 'EASY',
    category: 'BREAKFAST',
    cuisine: 'AMERICAN',
    dietaryTags: JSON.stringify(['VEGETARIAN', 'HIGH_PROTEIN', 'PROBIOTIC']),
    calories: 280,
    protein: 20,
    carbs: 38,
    fat: 6,
    fiber: 5,
    sugar: 22,
    sodium: 85,
    goodFor: JSON.stringify(['DIABETES', 'HEART_DISEASE']),
    ingredients: JSON.stringify([
      { name: 'Plain Greek yogurt', amount: '1', unit: 'cup' },
      { name: 'Mixed berries', amount: '1/2', unit: 'cup' },
      { name: 'Granola', amount: '1/4', unit: 'cup' },
      { name: 'Honey', amount: '1', unit: 'tsp' },
      { name: 'Chia seeds', amount: '1', unit: 'tsp' },
    ]),
    instructions: JSON.stringify([
      'Layer half the yogurt in a glass or bowl',
      'Add half the berries',
      'Add remaining yogurt',
      'Top with remaining berries and granola',
      'Drizzle with honey',
      'Sprinkle chia seeds on top',
    ]),
    tips: 'Choose low-sugar granola or make your own',
    rating: 4.5,
    reviewCount: 178,
  },
  {
    name: 'Quinoa Buddha Bowl',
    description: 'Nutrient-dense bowl with quinoa, roasted vegetables, and tahini dressing. Complete plant-based meal.',
    prepTime: 15,
    cookTime: 30,
    servings: 2,
    difficulty: 'MEDIUM',
    category: 'LUNCH',
    cuisine: 'MEDITERRANEAN',
    dietaryTags: JSON.stringify(['VEGAN', 'GLUTEN_FREE', 'HIGH_FIBER', 'HIGH_PROTEIN']),
    calories: 420,
    protein: 16,
    carbs: 58,
    fat: 16,
    fiber: 12,
    sugar: 8,
    sodium: 340,
    goodFor: JSON.stringify(['DIABETES', 'HEART_DISEASE', 'HYPERTENSION']),
    ingredients: JSON.stringify([
      { name: 'Quinoa', amount: '1', unit: 'cup, uncooked' },
      { name: 'Sweet potato', amount: '1', unit: 'large, cubed' },
      { name: 'Chickpeas', amount: '1', unit: 'can (15oz), drained' },
      { name: 'Kale', amount: '2', unit: 'cups, chopped' },
      { name: 'Cherry tomatoes', amount: '1', unit: 'cup, halved' },
      { name: 'Avocado', amount: '1', unit: 'sliced' },
      { name: 'Tahini', amount: '3', unit: 'tbsp' },
      { name: 'Lemon juice', amount: '2', unit: 'tbsp' },
      { name: 'Olive oil', amount: '2', unit: 'tbsp' },
    ]),
    instructions: JSON.stringify([
      'Cook quinoa according to package directions',
      'Preheat oven to 400°F',
      'Toss sweet potato and chickpeas with olive oil',
      'Roast for 25-30 minutes until golden',
      'Massage kale with a bit of olive oil',
      'Make dressing by mixing tahini, lemon juice, and water',
      'Assemble bowls with quinoa, roasted veggies, kale, tomatoes, and avocado',
      'Drizzle with tahini dressing',
    ]),
    tips: 'Meal prep by making multiple bowls for the week',
    rating: 4.8,
    reviewCount: 142,
  },
  // SNACKS
  {
    name: 'Hummus & Veggie Sticks',
    description: 'Creamy homemade hummus with colorful crunchy vegetables. Perfect guilt-free snack!',
    prepTime: 10,
    cookTime: 0,
    servings: 4,
    difficulty: 'EASY',
    category: 'SNACK',
    cuisine: 'MEDITERRANEAN',
    dietaryTags: JSON.stringify(['VEGAN', 'GLUTEN_FREE', 'HIGH_FIBER', 'LOW_CALORIE']),
    calories: 145,
    protein: 6,
    carbs: 18,
    fat: 6,
    fiber: 5,
    sugar: 4,
    sodium: 180,
    goodFor: JSON.stringify(['HEART_DISEASE', 'DIABETES', 'HYPERTENSION']),
    ingredients: JSON.stringify([
      { name: 'Chickpeas', amount: '1', unit: 'can (15oz), drained' },
      { name: 'Tahini', amount: '2', unit: 'tbsp' },
      { name: 'Lemon juice', amount: '2', unit: 'tbsp' },
      { name: 'Garlic', amount: '1', unit: 'clove' },
      { name: 'Olive oil', amount: '2', unit: 'tbsp' },
      { name: 'Carrots', amount: '2', unit: 'large, cut into sticks' },
      { name: 'Celery', amount: '3', unit: 'stalks, cut into sticks' },
      { name: 'Bell peppers', amount: '1', unit: 'sliced' },
      { name: 'Cucumber', amount: '1', unit: 'sliced' },
    ]),
    instructions: JSON.stringify([
      'In a food processor, combine chickpeas, tahini, lemon juice, and garlic',
      'Blend until smooth',
      'Add olive oil and blend again',
      'Add water if needed to reach desired consistency',
      'Transfer to a bowl',
      'Serve with fresh veggie sticks',
    ]),
    tips: 'Store hummus in fridge for up to 5 days',
    rating: 4.9,
    reviewCount: 215,
  },
  {
    name: 'Apple Slices with Almond Butter',
    description: 'Crisp apple slices paired with creamy almond butter. Simple, satisfying, and nutritious!',
    prepTime: 3,
    cookTime: 0,
    servings: 1,
    difficulty: 'EASY',
    category: 'SNACK',
    cuisine: 'AMERICAN',
    dietaryTags: JSON.stringify(['VEGAN', 'GLUTEN_FREE', 'NO_COOK']),
    calories: 195,
    protein: 4,
    carbs: 25,
    fat: 10,
    fiber: 5,
    sugar: 18,
    sodium: 2,
    goodFor: JSON.stringify(['HEART_DISEASE', 'DIABETES']),
    ingredients: JSON.stringify([
      { name: 'Apple', amount: '1', unit: 'medium' },
      { name: 'Almond butter', amount: '2', unit: 'tbsp' },
      { name: 'Cinnamon', amount: '1', unit: 'pinch (optional)' },
    ]),
    instructions: JSON.stringify([
      'Wash and slice apple into wedges',
      'Arrange on a plate',
      'Serve with almond butter for dipping',
      'Sprinkle with cinnamon if desired',
    ]),
    tips: 'Choose natural almond butter without added sugar',
    rating: 4.6,
    reviewCount: 167,
  },
  {
    name: 'Trail Mix Energy Bites',
    description: 'No-bake energy bites packed with nuts, seeds, and dried fruit. Perfect on-the-go snack!',
    prepTime: 15,
    cookTime: 0,
    servings: 12,
    difficulty: 'EASY',
    category: 'SNACK',
    cuisine: 'AMERICAN',
    dietaryTags: JSON.stringify(['VEGETARIAN', 'NO_COOK', 'HIGH_PROTEIN', 'HIGH_FIBER']),
    calories: 120,
    protein: 4,
    carbs: 14,
    fat: 6,
    fiber: 3,
    sugar: 8,
    sodium: 25,
    goodFor: JSON.stringify(['HEART_DISEASE', 'DIABETES']),
    ingredients: JSON.stringify([
      { name: 'Rolled oats', amount: '1', unit: 'cup' },
      { name: 'Almond butter', amount: '1/2', unit: 'cup' },
      { name: 'Honey', amount: '1/3', unit: 'cup' },
      { name: 'Chia seeds', amount: '2', unit: 'tbsp' },
      { name: 'Dried cranberries', amount: '1/4', unit: 'cup' },
      { name: 'Dark chocolate chips', amount: '1/4', unit: 'cup' },
      { name: 'Vanilla extract', amount: '1', unit: 'tsp' },
    ]),
    instructions: JSON.stringify([
      'Mix all ingredients in a large bowl',
      'Stir until well combined',
      'Refrigerate for 30 minutes',
      'Roll into 12 balls',
      'Store in refrigerator for up to 1 week',
    ]),
    tips: 'Make a double batch and freeze half for later',
    rating: 4.8,
    reviewCount: 189,
  },
  // DESSERTS
  {
    name: 'Dark Chocolate Avocado Mousse',
    description: 'Rich, creamy chocolate mousse made with avocado. Decadent yet heart-healthy!',
    prepTime: 10,
    cookTime: 0,
    servings: 4,
    difficulty: 'EASY',
    category: 'DESSERT',
    cuisine: 'AMERICAN',
    dietaryTags: JSON.stringify(['VEGAN', 'GLUTEN_FREE', 'NO_COOK', 'HEART_HEALTHY']),
    calories: 185,
    protein: 3,
    carbs: 22,
    fat: 11,
    fiber: 6,
    sugar: 14,
    sodium: 15,
    goodFor: JSON.stringify(['HEART_DISEASE']),
    ingredients: JSON.stringify([
      { name: 'Ripe avocados', amount: '2', unit: 'medium' },
      { name: 'Cocoa powder', amount: '1/4', unit: 'cup' },
      { name: 'Maple syrup', amount: '1/4', unit: 'cup' },
      { name: 'Vanilla extract', amount: '1', unit: 'tsp' },
      { name: 'Almond milk', amount: '1/4', unit: 'cup' },
      { name: 'Sea salt', amount: '1', unit: 'pinch' },
    ]),
    instructions: JSON.stringify([
      'Blend avocados until smooth',
      'Add cocoa powder, maple syrup, vanilla, and salt',
      'Blend until creamy',
      'Add almond milk to reach desired consistency',
      'Refrigerate for 1 hour',
      'Serve chilled with fresh berries',
    ]),
    tips: 'Top with whipped coconut cream for extra indulgence',
    rating: 4.7,
    reviewCount: 142,
  },
  {
    name: 'Baked Cinnamon Apples',
    description: 'Warm, tender apples with cinnamon and a touch of sweetness. Comfort food that\'s actually healthy!',
    prepTime: 10,
    cookTime: 25,
    servings: 4,
    difficulty: 'EASY',
    category: 'DESSERT',
    cuisine: 'AMERICAN',
    dietaryTags: JSON.stringify(['VEGAN', 'GLUTEN_FREE', 'LOW_CALORIE', 'NO_ADDED_SUGAR']),
    calories: 95,
    protein: 0.5,
    carbs: 25,
    fat: 0.3,
    fiber: 4,
    sugar: 19,
    sodium: 2,
    goodFor: JSON.stringify(['DIABETES', 'HEART_DISEASE', 'HYPERTENSION']),
    ingredients: JSON.stringify([
      { name: 'Apples', amount: '4', unit: 'medium, cored and sliced' },
      { name: 'Cinnamon', amount: '2', unit: 'tsp' },
      { name: 'Nutmeg', amount: '1/4', unit: 'tsp' },
      { name: 'Lemon juice', amount: '1', unit: 'tbsp' },
      { name: 'Water', amount: '1/4', unit: 'cup' },
    ]),
    instructions: JSON.stringify([
      'Preheat oven to 350°F',
      'Place apple slices in a baking dish',
      'Sprinkle with cinnamon and nutmeg',
      'Drizzle with lemon juice',
      'Add water to the dish',
      'Cover with foil and bake for 20 minutes',
      'Remove foil and bake 5 more minutes',
      'Serve warm',
    ]),
    tips: 'Serve with a dollop of Greek yogurt for added protein',
    rating: 4.5,
    reviewCount: 134,
  },
  {
    name: 'Frozen Banana "Nice Cream"',
    description: 'Creamy, ice cream-like treat made from just bananas! Add your favorite toppings for variety.',
    prepTime: 5,
    cookTime: 0,
    servings: 2,
    difficulty: 'EASY',
    category: 'DESSERT',
    cuisine: 'AMERICAN',
    dietaryTags: JSON.stringify(['VEGAN', 'GLUTEN_FREE', 'NO_COOK', 'NO_ADDED_SUGAR']),
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fat: 0.4,
    fiber: 3,
    sugar: 14,
    sodium: 1,
    goodFor: JSON.stringify(['DIABETES', 'HEART_DISEASE']),
    ingredients: JSON.stringify([
      { name: 'Frozen bananas', amount: '3', unit: 'medium, sliced' },
      { name: 'Vanilla extract', amount: '1/2', unit: 'tsp' },
      { name: 'Cinnamon', amount: '1/4', unit: 'tsp (optional)' },
      { name: 'Dark chocolate chips', amount: '1', unit: 'tbsp (optional)' },
    ]),
    instructions: JSON.stringify([
      'Place frozen banana slices in a food processor',
      'Blend until smooth and creamy (2-3 minutes)',
      'Add vanilla and cinnamon if using',
      'Blend again',
      'Serve immediately for soft-serve texture',
      'Or freeze for 1 hour for firmer consistency',
      'Top with dark chocolate chips if desired',
    ]),
    tips: 'Freeze ripe bananas in advance for best results',
    rating: 4.9,
    reviewCount: 276,
  },
];

async function seedHeredibles() {
  console.log('🥗 Seeding Heredibles data...');

  // Get patient
  const patient = await prisma.user.findUnique({
    where: { email: 'patient@test.com' },
  });

  if (!patient) {
    console.error('❌ Patient not found');
    return;
  }

  console.log(`✅ Found patient: ${patient.name}`);

  // Create recipes
  console.log('📖 Creating recipes...');
  for (const recipe of sampleRecipes) {
    await prisma.recipe.create({ data: recipe });
  }
  console.log(`✅ Created ${sampleRecipes.length} recipes`);

  // Create a meal plan for Abdeen White
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 7); // 7-day plan

  const mealPlan = await prisma.mealPlan.create({
    data: {
      patientId: patient.id,
      patientName: patient.name,
      planName: 'Heart-Healthy 7-Day Plan with Treats',
      startDate,
      endDate,
      isActive: true,
      targetCalories: 2000,
      targetProtein: 100,
      targetCarbs: 230,
      targetFat: 70,
      dietType: 'HEART_HEALTHY',
      restrictions: JSON.stringify(['LOW_SODIUM']),
      healthConditions: JSON.stringify(['HEART_DISEASE', 'HYPERTENSION']),
      notes: 'Balanced plan with snacks and occasional desserts for enjoyment',
    },
  });

  console.log('📅 Creating meal plan...');
  console.log(`✅ Created meal plan: ${mealPlan.planName}`);

  // Create planned meals for the week
  const recipes = await prisma.recipe.findMany();
  const plannedMeals = [];

  const breakfasts = recipes.filter(r => r.category === 'BREAKFAST');
  const lunches = recipes.filter(r => r.category === 'LUNCH');
  const dinners = recipes.filter(r => r.category === 'DINNER');
  const snacks = recipes.filter(r => r.category === 'SNACK');
  const desserts = recipes.filter(r => r.category === 'DESSERT');

  for (let day = 0; day < 7; day++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + day);

    // Breakfast - alternate between options
    const breakfast = breakfasts[day % breakfasts.length];
    if (breakfast) {
      plannedMeals.push({
        mealPlanId: mealPlan.id,
        date,
        mealType: 'BREAKFAST',
        recipeId: breakfast.id,
        recipeName: breakfast.name,
        calories: breakfast.calories,
        protein: breakfast.protein,
        carbs: breakfast.carbs,
        fat: breakfast.fat,
      });
    }

    // Morning Snack - alternate
    const morningSnack = snacks[day % snacks.length];
    if (morningSnack) {
      plannedMeals.push({
        mealPlanId: mealPlan.id,
        date,
        mealType: 'SNACK',
        recipeId: morningSnack.id,
        recipeName: morningSnack.name,
        calories: morningSnack.calories,
        protein: morningSnack.protein,
        carbs: morningSnack.carbs,
        fat: morningSnack.fat,
      });
    }

    // Lunch - alternate
    const lunch = lunches[day % lunches.length];
    if (lunch) {
      plannedMeals.push({
        mealPlanId: mealPlan.id,
        date,
        mealType: 'LUNCH',
        recipeId: lunch.id,
        recipeName: lunch.name,
        calories: lunch.calories,
        protein: lunch.protein,
        carbs: lunch.carbs,
        fat: lunch.fat,
      });
    }

    // Dinner - alternate
    const dinner = dinners[day % dinners.length];
    if (dinner) {
      plannedMeals.push({
        mealPlanId: mealPlan.id,
        date,
        mealType: 'DINNER',
        recipeId: dinner.id,
        recipeName: dinner.name,
        calories: dinner.calories,
        protein: dinner.protein,
        carbs: dinner.carbs,
        fat: dinner.fat,
      });
    }

    // Dessert - only on certain days (not every day to keep it special!)
    if (day % 2 === 0 && desserts.length > 0) {
      const dessert = desserts[Math.floor(day / 2) % desserts.length];
      plannedMeals.push({
        mealPlanId: mealPlan.id,
        date,
        mealType: 'DESSERT',
        recipeId: dessert.id,
        recipeName: dessert.name,
        calories: dessert.calories,
        protein: dessert.protein,
        carbs: dessert.carbs,
        fat: dessert.fat,
      });
    }
  }

  await prisma.plannedMeal.createMany({ data: plannedMeals });
  console.log(`✅ Created ${plannedMeals.length} planned meals`);

  console.log('\n🎉 Heredibles seeding complete!');
  console.log('\n📊 Summary:');
  console.log(`   - ${sampleRecipes.length} recipes`);
  console.log(`   - 1 meal plan (7 days)`);
  console.log(`   - ${plannedMeals.length} planned meals`);
  console.log(`   - Target: ${mealPlan.targetCalories} calories/day`);
}

seedHeredibles()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
