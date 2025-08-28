const categoryKeywords: { [key: string]: string[] } = {
  'Nuts & Confectioneries': ['donuts', 'nuts', 'ice cream', 'chocolate', 'candy', 'cookies'],
  'Pantry': ['flour', 'sugar', 'salt', 'pepper', 'olive oil', 'vegetable oil', 'vinegar', 'soy sauce', 'ketchup', 'mustard', 'mayonnaise', 'rice', 'cereal', 'canned tomatoes', 'tomato sauce', 'beans', 'lentils', 'seeds', 'peanut butter', 'jam', 'honey', 'syrup', 'spices', 'herbs', 'butter'],
  'Vegetables': ['lettuce', 'tomato', 'onion', 'potato', 'carrot', 'broccoli', 'spinach', 'cucumber', 'celery', 'bell pepper', 'garlic'],
  'Fruits': ['apple', 'banana', 'avocado', 'berries', 'grapes', 'lemon', 'lime'],
  'Meat & Seafood': ['chicken', 'beef', 'pork', 'lamb', 'turkey', 'fish', 'salmon', 'shrimp', 'tuna', 'sausage', 'bacon'],
  'Dairy & Eggs': ['milk', 'cheese', 'yogurt', 'cream', 'egg'],
  'Grains': ['bread', 'oats', 'pasta', 'tortilla', 'spaghetti'],
  'Frozen Foods': ['frozen vegetables', 'frozen fruit', 'pizza', 'frozen meals'],
  'Beverages': ['water', 'juice', 'soda', 'tea', 'coffee'],
};

export const getCategory = (ingredient: string): string => {
  const item = ingredient.toLowerCase();
  for (const category in categoryKeywords) {
    if (categoryKeywords[category].some(keyword => item.includes(keyword))) {
      return category;
    }
  }
  return 'Nuts & Confectioneries'; // Default category if no keyword matches
};
