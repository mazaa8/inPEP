import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Paper,
  Button,
  Grid,
  Box,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  ListItemIcon,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StorefrontIcon from '@mui/icons-material/Storefront';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import { Rating } from '@mui/material';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { useLocation } from 'react-router-dom';
import Layout from '../../../components/layout/Layout';
import { mealPlans } from '../../../data/mealPlans';
import { transformMenuForGroceryList } from '../../../utils/dataTransformation';
import { getCategory } from '../../../utils/categorizeIngredients';
import { herediblesService } from '../../../services/herediblesService';
import type { WeeklyMenu, MealItem, Ingredient } from '../../../types';

const GROCERY_STORAGE_KEY = 'heredibles-weekly-menu';

// Mock Data
const initialWeeklyMenu: WeeklyMenu = {
  monday: [
    {
      meal: 'Scrambled Eggs & Toast',
      ingredients: [{ item: 'Eggs', qty: 2 }, { item: 'Bread', qty: 2 }, { item: 'Butter', qty: 1 }],
      recipe: {
        preparation: '1. Whisk eggs in a bowl with a pinch of salt and pepper.\n2. Melt butter in a non-stick skillet over medium heat.\n3. Pour in eggs and cook, stirring gently, until they reach desired consistency.\n4. Toast bread and serve with eggs.',
        timing: '10 minutes',
        temperature: 'Medium heat',
        utensils: 'Bowl, whisk, non-stick skillet, spatula, toaster',
      },
      rating: 0,
      comments: '',
    },
    {
      meal: 'Chicken Salad Sandwich',
      ingredients: [{ item: 'Chicken Breast', qty: 1 }, { item: 'Mayonnaise', qty: 1 }, { item: 'Bread', qty: 2 }, { item: 'Lettuce', qty: 1 }],
      recipe: {
        preparation: '1. Poach or bake chicken breast until cooked through. Let it cool and shred it.\n2. Mix shredded chicken with mayonnaise, salt, and pepper.\n3. Serve on bread with a leaf of lettuce.',
        timing: '25 minutes',
        temperature: 'N/A',
        utensils: 'Pot, bowl, fork',
      },
      rating: 0,
      comments: '',
    },
    {
      meal: 'Spaghetti Bolognese',
      ingredients: [{ item: 'Ground Beef', qty: 1 }, { item: 'Spaghetti', qty: 1 }, { item: 'Tomato Sauce', qty: 1 }, { item: 'Onion', qty: 1 }],
      recipe: {
        preparation: '1. Brown ground beef in a large pot. Drain fat.\n2. Add chopped onion and cook until soft.\n3. Stir in tomato sauce and simmer for 15 minutes.\n4. Cook spaghetti according to package directions. Serve sauce over spaghetti.',
        timing: '30 minutes',
        temperature: 'Medium-high heat',
        utensils: 'Large pot, wooden spoon',
      },
      rating: 0,
      comments: '',
    },
  ],
  tuesday: [
    {
      meal: 'Oatmeal with Fruits',
      ingredients: [{ item: 'Oats', qty: 1 }, { item: 'Banana', qty: 1 }, { item: 'Blueberries', qty: 1 }],
      recipe: {
        preparation: '1. Cook oats with water or milk according to package directions.\n2. Top with sliced banana and blueberries.',
        timing: '5 minutes',
        temperature: 'N/A',
        utensils: 'Bowl, spoon',
      },
      rating: 0,
      comments: '',
    },
    {
      meal: 'Tuna Salad',
      ingredients: [{ item: 'Canned Tuna', qty: 1 }, { item: 'Mayonnaise', qty: 1 }, { item: 'Celery', qty: 1 }, { item: 'Cucumber', qty: 1 }],
      recipe: {
        preparation: '1. Drain canned tuna.\n2. Mix with mayonnaise, chopped celery, and cucumber.\n3. Serve as is or on crackers.',
        timing: '10 minutes',
        temperature: 'N/A',
        utensils: 'Bowl, fork',
      },
      rating: 0,
      comments: '',
    },
    {
      meal: 'Salmon with Roasted Veggies',
      ingredients: [{ item: 'Salmon Fillet', qty: 1 }, { item: 'Broccoli', qty: 1 }, { item: 'Carrots', qty: 2 }, { item: 'Olive Oil', qty: 1 }],
      recipe: {
        preparation: '1. Preheat oven to 400°F (200°C).\n2. Toss broccoli and carrots with olive oil, salt, and pepper. Spread on a baking sheet.\n3. Place salmon fillet on the same sheet. Season with salt and pepper.\n4. Roast for 15-20 minutes, or until salmon is cooked through and veggies are tender.',
        timing: '25 minutes',
        temperature: '400°F (200°C)',
        utensils: 'Baking sheet, bowl',
      },
      rating: 0,
      comments: '',
    },
  ],
  wednesday: [],
  thursday: [],
  friday: [],
  saturday: [],
  sunday: [],
  snacks: [
    { meal: 'Apple with Peanut Butter', ingredients: [{ item: 'Apple', qty: 1 }, { item: 'Peanut Butter', qty: 1 }], recipe: { preparation: 'Slice apple and serve with peanut butter.', timing: '2 minutes', temperature: 'N/A', utensils: 'Knife' }, rating: 0, comments: '' },
    { meal: 'Handful of Almonds', ingredients: [{ item: 'Almonds', qty: 1 }], recipe: { preparation: 'Serve a handful of almonds.', timing: '1 minute', temperature: 'N/A', utensils: 'N/A' }, rating: 0, comments: '' },
    { meal: 'Greek Yogurt', ingredients: [{ item: 'Greek Yogurt', qty: 1 }], recipe: { preparation: 'Serve Greek yogurt.', timing: '1 minute', temperature: 'N/A', utensils: 'Spoon' }, rating: 0, comments: '' },
  ],
};

const initialFavoriteShops = [
  { name: 'Global Foods', location: '123 Market St', phone: '555-1234' },
  { name: 'Fresh Mart', location: '456 Oak Ave', phone: '555-5678' },
];

const CHECKLIST_STORAGE_KEY = 'grocery-checklist';
const SHOPS_STORAGE_KEY = 'favorite-shops';
const ALLERGIES_STORAGE_KEY = 'allergic-foods';

const initialAllergicFoods = [
  { name: 'Peanuts' },
  { name: 'Shellfish' },
  { name: 'Gluten' },
];

const initialConfectioneries = [
  { item: 'Nuts', checked: false },
  { item: 'Ice Cream', checked: false },
  { item: 'Cake', checked: false },
  { item: 'Chocolate', checked: false },
  { item: 'Cookies', checked: false },
  { item: 'Candy', checked: false },
  { item: 'Donuts', checked: false },
  { item: 'Water', checked: false },
  { item: 'Juice', checked: false },
  { item: 'Soda', checked: false },
];

const GroceryShoppingListPage = () => {
  const navigate = useNavigate();
  const [weeklyMenu, setWeeklyMenu] = useState<WeeklyMenu>(initialWeeklyMenu);

  const aggregatedList = useMemo(() => {
    const allItems: { [key: string]: number } = {};
    Object.values(weeklyMenu).forEach((day: MealItem[]) => {
      day.forEach((meal: MealItem) => {
        meal.ingredients.forEach((ingredient: Ingredient) => {
          allItems[ingredient.item] = (allItems[ingredient.item] || 0) + ingredient.qty;
        });
      });
    });
    return Object.entries(allItems)
      .map(([item, qty]) => ({ item, qty, checked: false }))
      .sort((a, b) => a.item.localeCompare(b.item));
  }, [weeklyMenu]);

  const [checklist, setChecklist] = useState([...aggregatedList].sort((a, b) => a.item.localeCompare(b.item)));

  const allCategories = [
    'Nuts & Confectioneries',
    'Pantry',
    'Vegetables',
    'Fruits',
    'Meat & Seafood',
    'Dairy & Eggs',
    'Grains',
    'Frozen Foods',
    'Beverages',
  ];

  const categorizedList = useMemo(() => {
    const categories: { [key: string]: typeof checklist } = {};
    allCategories.forEach(category => {
      categories[category] = [];
    });

    checklist.forEach(item => {
      const category = getCategory(item.item);
      if (categories[category]) {
        categories[category].push(item);
      } else {
        // Handle items with categories not in allCategories, though the logic tries to prevent this
        if (!categories['Nuts & Confectioneries']) {
          categories['Nuts & Confectioneries'] = [];
        }
        categories['Nuts & Confectioneries'].push(item);
      }
    });

    return Object.entries(categories).sort(([a], [b]) => a.localeCompare(b));
  }, [checklist]);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [favoriteShops, setFavoriteShops] = useState(initialFavoriteShops);
  const [open, setOpen] = useState(false);
  const [currentShop, setCurrentShop] = useState<{ name: string; location: string; phone: string } | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [allergicFoods, setAllergicFoods] = useState(initialAllergicFoods);
  const [allergyDialogOpen, setAllergyDialogOpen] = useState(false);
  const [currentAllergy, setCurrentAllergy] = useState<{ name: string } | null>(null);
  const [isEditingAllergy, setIsEditingAllergy] = useState(false);
  const location = useLocation();


  const [recipeModalOpen, setRecipeModalOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<MealItem | null>(null);
  const [currentRating, setCurrentRating] = useState(0);
  const [currentComment, setCurrentComment] = useState('');

  const handleRecipeOpen = (meal: MealItem) => {
    setSelectedMeal(meal);
    setCurrentRating(meal.rating || 0);
    setCurrentComment(meal.comments || '');
    setRecipeModalOpen(true);
  };

  const handleRecipeClose = () => {
    setRecipeModalOpen(false);
    setSelectedMeal(null);
    setCurrentRating(0);
    setCurrentComment('');
  };

  useEffect(() => {
    const storedMenu = localStorage.getItem(GROCERY_STORAGE_KEY);
    if (storedMenu) {
      const herediblesMenu = JSON.parse(storedMenu);
      const transformedMenu = transformMenuForGroceryList(herediblesMenu, mealPlans);
      setWeeklyMenu(transformedMenu);
    }

    const storedShops = localStorage.getItem(SHOPS_STORAGE_KEY);
    if (storedShops) setFavoriteShops(JSON.parse(storedShops));

    const storedAllergies = localStorage.getItem(ALLERGIES_STORAGE_KEY);
    if (storedAllergies) setAllergicFoods(JSON.parse(storedAllergies));


    setCurrentWeek(new Date());
  }, [location]);

  useEffect(() => {
    localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify({ week: currentWeek, list: checklist }));
  }, [checklist, currentWeek]);

  useEffect(() => {
    localStorage.setItem(SHOPS_STORAGE_KEY, JSON.stringify(favoriteShops));
  }, [favoriteShops]);

  useEffect(() => {
    localStorage.setItem(ALLERGIES_STORAGE_KEY, JSON.stringify(allergicFoods));
  }, [allergicFoods]);


  const handleOpen = (shop: any = null) => {
    setCurrentShop(shop ? { ...shop } : { name: '', location: '', phone: '' });
    setIsEditing(!!shop);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentShop(null);
  };

  const handleSave = () => {
    if (!currentShop) return;
    if (isEditing) {
      setFavoriteShops(shops => shops.map(s => (s.name === currentShop.name ? currentShop : s)));
    } else {
      setFavoriteShops(shops => [...shops, currentShop]);
    }
    handleClose();
  };

  const handleDelete = (shopName: string) => {
    setFavoriteShops(shops => shops.filter(s => s.name !== shopName));
  };

  const handleAllergyOpen = (allergy: any = null) => {
    setCurrentAllergy(allergy ? { ...allergy } : { name: '' });
    setIsEditingAllergy(!!allergy);
    setAllergyDialogOpen(true);
  };

  const handleAllergyClose = () => {
    setAllergyDialogOpen(false);
    setCurrentAllergy(null);
  };

  const handleAllergySave = () => {
    if (!currentAllergy || !currentAllergy.name) return;
    if (isEditingAllergy) {
      setAllergicFoods(foods => foods.map(f => (f.name === currentAllergy.name ? currentAllergy : f)));
    } else {
      setAllergicFoods(foods => [...foods, currentAllergy]);
    }
    handleAllergyClose();
  };

  const handleAllergyDelete = (foodName: string) => {
    setAllergicFoods(foods => foods.filter(f => f.name !== foodName));
  };

  const handleToggle = (item: string) => {
    setChecklist(prev =>
      prev.map(i => (i.item === item ? { ...i, checked: !i.checked } : i))
    );
  };

  const handleSaveFeedback = () => {
    if (!selectedMeal) return;

    // In a real application, this would be an API call to the backend.
    // For now, we'll just log it to demonstrate the data is captured.
    console.log({
      meal: selectedMeal.meal,
      rating: currentRating,
      comment: currentComment,
    });

    // Here you would update the main `weeklyMenu` state if it were managed by React state.
    // Since it's a constant, we cannot update it directly.

    handleRecipeClose();
  };

  const handleConfectioneryToggle = (item: string) => {
    setChecklist(prev => {
      const existingItem = prev.find(i => i.item === item);
      // If the item is not in the checklist, add it.
      if (!existingItem) {
        return [...prev, { item, qty: 1, checked: false }].sort((a, b) => a.item.localeCompare(b.item));
      }

      // If the item came from the meal plan, it should not be removable by unchecking.
      // Instead, we just toggle its checked status in the main list.
      if (aggregatedList.some(aggItem => aggItem.item === item)) {
        return prev.map(i => i.item === item ? { ...i, checked: !i.checked } : i);
      }

      // If it's a confectionery item added manually, remove it from the list upon toggle.
      return prev.filter(i => i.item !== item);
    });
  };

  return (
    <Layout title="Grocery Shopping List">
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Back
      </Button>
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Shopping List for {format(startOfWeek(currentWeek, { weekStartsOn: 1 }), 'MMM d')} - {format(endOfWeek(currentWeek, { weekStartsOn: 1 }), 'MMM d, yyyy')}
      </Typography>
      <Grid container spacing={3}>
        {/* Left Side: Weekly Plan & Aggregated List */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ mb: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ bgcolor: 'primary.main', color: 'white', p: 1, borderTopLeftRadius: 4, borderTopRightRadius: 4 }}>Weekly Meal Plan & Ingredients</Typography>
            <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
              {Object.entries(weeklyMenu).map(([day, meals]: [string, MealItem[]]) => (
                <Accordion key={day}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{day}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {meals.map((meal: MealItem, i: number) => (
                      <Box key={i} sx={{ mb: 1 }}>
                        <Typography variant="subtitle1" onClick={() => handleRecipeOpen(meal)} sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>{meal.meal}</Typography>
                        <List dense>
                          {meal.ingredients.map((ing: Ingredient, j: number) => (
                            <ListItem key={j}><ListItemText primary={`${ing.item} (Qty: ${ing.qty})`} /></ListItem>
                          ))}
                        </List>
                      </Box>
                    ))}
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Paper>

          <Paper sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'primary.main', color: 'white', p: 1, borderTopLeftRadius: 4, borderTopRightRadius: 4 }}>
              <Typography variant="h6" sx={{ color: 'white' }}>Allergic or Prohibited Foods</Typography>
              <Button variant="contained" size="small" onClick={() => handleAllergyOpen()} sx={{ bgcolor: 'white', color: 'primary.dark', '&:hover': { bgcolor: 'grey.200' }, fontWeight: 900 }}>Add</Button>
            </Box>
            <List sx={{ maxHeight: 200, overflow: 'auto' }}>
              {allergicFoods.map((food, i) => (
                <ListItem
                  key={i}
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={() => handleAllergyDelete(food.name)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemIcon><BlockIcon /></ListItemIcon>
                  <ListItemText primary={food.name} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Right Side: Favorite Shops */}
        <Grid item xs={12} md={4}>
          <Paper sx={{}}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'primary.main', color: 'white', p: 1, borderTopLeftRadius: 4, borderTopRightRadius: 4 }}>
              <Typography variant="h6" sx={{ color: 'white' }}>Favorite Grocery Shops</Typography>
              <Button variant="contained" size="small" onClick={() => handleOpen()} sx={{ bgcolor: 'white', color: 'primary.dark', '&:hover': { bgcolor: 'grey.200' }, fontWeight: 900 }}>Add</Button>
            </Box>
            <List>
              {favoriteShops.map((shop, i) => (
                <React.Fragment key={i}>
                  <ListItem
                    secondaryAction={
                      <>
                        <IconButton edge="end" aria-label="edit" onClick={() => handleOpen(shop)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(shop.name)}>
                          <DeleteIcon />
                        </IconButton>
                      </>
                    }
                  >
                    <ListItemIcon><StorefrontIcon /></ListItemIcon>
                    <ListItemText primary={shop.name} secondary={`${shop.location} | ${shop.phone}`} />
                  </ListItem>
                  {i < favoriteShops.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>

          <Paper sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ bgcolor: 'primary.main', color: 'white', p: 1, borderTopLeftRadius: 4, borderTopRightRadius: 4 }}>Confectioneries</Typography>
            <List sx={{ maxHeight: 380, overflow: 'auto' }}>
              {initialConfectioneries.map(({ item }) => {
                const isChecked = checklist.some(checklistItem => checklistItem.item === item);
                return (
                  <ListItem key={item} dense button onClick={() => handleConfectioneryToggle(item)}>
                    <ListItemIcon>
                      <Checkbox edge="start" checked={isChecked} tabIndex={-1} disableRipple />
                    </ListItemIcon>
                    <ListItemText primary={item} />
                  </ListItem>
                );
              })}
            </List>
          </Paper>
        </Grid>

        {/* Bottom: Smart Shopping List */}
        <Grid item xs={12}>
          <Paper sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ bgcolor: 'primary.main', color: 'white', p: 1, borderTopLeftRadius: 4, borderTopRightRadius: 4 }}>Smart Shopping List</Typography>
            <Box sx={{ maxHeight: 400, overflow: 'auto', flexGrow: 1 }}>
              {categorizedList.map(([category, items]) => (
                <Accordion key={category} defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{ fontWeight: 'bold' }}>{category}</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 0 }}>
                    <List dense sx={{ width: '100%' }}>
                      {items.map(({ item, qty, checked }) => (
                        <ListItem key={item} dense button onClick={() => handleToggle(item)}>
                          <ListItemIcon>
                            <Checkbox edge="start" checked={checked} tabIndex={-1} disableRipple />
                          </ListItemIcon>
                          <ListItemText primary={`${item} (Qty: ${qty})`} style={{ textDecoration: checked ? 'line-through' : 'none' }} />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEditing ? 'Edit Shop' : 'Add New Shop'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            variant="standard"
            value={currentShop?.name || ''}
            onChange={(e) => setCurrentShop({ ...currentShop!, name: e.target.value })}
            disabled={isEditing}
          />
          <TextField
            margin="dense"
            label="Location"
            fullWidth
            variant="standard"
            value={currentShop?.location || ''}
            onChange={(e) => setCurrentShop({ ...currentShop!, location: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Phone"
            fullWidth
            variant="standard"
            value={currentShop?.phone || ''}
            onChange={(e) => setCurrentShop({ ...currentShop!, phone: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={allergyDialogOpen} onClose={handleAllergyClose}>
        <DialogTitle>{isEditingAllergy ? 'Edit Food' : 'Add Food'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Food Name"
            fullWidth
            variant="standard"
            value={currentAllergy?.name || ''}
            onChange={(e) => setCurrentAllergy({ ...currentAllergy!, name: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAllergyClose}>Cancel</Button>
          <Button onClick={handleAllergySave}>Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={recipeModalOpen} onClose={handleRecipeClose} maxWidth="md" fullWidth>
        <DialogTitle>{selectedMeal?.meal}</DialogTitle>
        <DialogContent dividers>
          {selectedMeal && selectedMeal.recipe && (
            <Box>
              <Typography variant="h6">Ingredients</Typography>
              <List dense>
                {selectedMeal.ingredients.map((ing: Ingredient, i: number) => (
                  <ListItem key={i}>
                    <ListItemText primary={`${ing.item} (Qty: ${ing.qty})`} />
                  </ListItem>
                ))}
              </List>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6">Preparation</Typography>
              <Typography sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>{selectedMeal.recipe.preparation || selectedMeal.recipe.instructions?.join('\n')}</Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6">Details</Typography>
              <Typography><strong>Timing:</strong> {selectedMeal.recipe.timing}</Typography>
              <Typography><strong>Temperature:</strong> {selectedMeal.recipe.temperature}</Typography>
              <Typography><strong>Utensils:</strong> {selectedMeal.recipe.utensils}</Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6">Feedback</Typography>
              <Rating
                name="meal-rating"
                value={currentRating}
                onChange={(_, newValue) => {
                  setCurrentRating(newValue || 0);
                }}
              />
              <TextField
                fullWidth
                multiline
                rows={3}
                margin="normal"
                label="Comments"
                value={currentComment}
                onChange={(e) => setCurrentComment(e.target.value)}
                variant="outlined"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRecipeClose}>Cancel</Button>
          <Button onClick={handleSaveFeedback} variant="contained">Save Feedback</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default GroceryShoppingListPage;
