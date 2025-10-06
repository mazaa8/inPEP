import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Grid,
  Button,
  Chip,
  CircularProgress,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import {
  Restaurant as RestaurantIcon,
  CheckCircle as CheckIcon,
  LocalFireDepartment as CaloriesIcon,
  Egg as ProteinIcon,
  ShoppingCart as CartIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  CameraAlt as CameraIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from '@mui/icons-material';
import Layout from '../../components/layout/Layout';
import MealPhotoCapture from '../../components/heredibles/MealPhotoCapture';
import FoodDrugInteractionWarning from '../../components/heredibles/FoodDrugInteractionWarning';
import { herediblesService, type MealPlan, type PlannedMeal, type Recipe, type NutritionSummary } from '../../services/herediblesService';
import { medicationService, type Prescription } from '../../services/medicationService';
import { FoodDrugInteractionChecker } from '../../utils/foodDrugInteractions';
import { roleColors } from '../../styles/glassmorphism';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const CaregiverHerediblesPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [nutritionSummary, setNutritionSummary] = useState<NutritionSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [recipeDialogOpen, setRecipeDialogOpen] = useState(false);
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<PlannedMeal | null>(null);
  const [cuisineFilter, setCuisineFilter] = useState<string>('ALL');
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

  const patientId = 'b805ec90-e553-4de7-9de0-45f2eb73d1ba'; // Abdeen White

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [mealPlanData, recipesData, nutritionData, prescriptionsData] = await Promise.all([
        herediblesService.getActiveMealPlan(patientId),
        herediblesService.getRecipes(),
        herediblesService.getNutritionSummary(patientId),
        medicationService.getPatientPrescriptions(patientId, 'active'),
      ]);
      setMealPlan(mealPlanData);
      setRecipes(recipesData);
      setNutritionSummary(nutritionData);
      setPrescriptions(prescriptionsData);
    } catch (err) {
      console.error('Failed to load Heredibles data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteMeal = async (mealId: string) => {
    try {
      await herediblesService.completeMeal(mealId);
      await fetchAllData();
    } catch (err) {
      console.error('Failed to complete meal:', err);
    }
  };

  const handleOpenPhotoCapture = (meal: PlannedMeal) => {
    setSelectedMeal(meal);
    setPhotoDialogOpen(true);
  };

  const handlePhotoCapture = async (photoDataUrl: string) => {
    if (!selectedMeal) return;
    
    try {
      await herediblesService.uploadMealPhoto(selectedMeal.id, photoDataUrl);
      await fetchAllData();
    } catch (err) {
      console.error('Failed to upload photo:', err);
    }
  };

  const handleRateMeal = async (mealId: string, rating: number) => {
    try {
      await herediblesService.rateMeal(mealId, rating);
      await fetchAllData();
    } catch (err) {
      console.error('Failed to rate meal:', err);
    }
  };

  const handleViewRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setRecipeDialogOpen(true);
  };

  const getTodaysMeals = () => {
    if (!mealPlan?.meals) return [];
    const today = new Date().toLocaleDateString();
    return mealPlan.meals.filter(meal => 
      new Date(meal.date).toLocaleDateString() === today
    );
  };

  const getGroceryList = () => {
    if (!mealPlan?.meals) return [];
    
    const ingredientsMap = new Map<string, { amount: string; unit: string; count: number }>();
    
    mealPlan.meals.forEach(meal => {
      const recipe = recipes.find(r => r.id === meal.recipeId);
      if (recipe) {
        const ingredients = JSON.parse(recipe.ingredients);
        ingredients.forEach((ing: any) => {
          const key = ing.name.toLowerCase();
          if (ingredientsMap.has(key)) {
            const existing = ingredientsMap.get(key)!;
            ingredientsMap.set(key, { ...existing, count: existing.count + 1 });
          } else {
            ingredientsMap.set(key, { amount: ing.amount, unit: ing.unit, count: 1 });
          }
        });
      }
    });

    return Array.from(ingredientsMap.entries()).map(([name, data]) => ({
      name,
      amount: data.amount,
      unit: data.unit,
      count: data.count,
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Layout title="Heredibles™ - Meal Management">
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  const todaysMeals = getTodaysMeals();
  const groceryList = getGroceryList();

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f1f8f4 0%, #e8f5e9 50%, #dcedc8 100%)',
      p: 0,
    }}>
      <Layout title="" darkMode={false} themeColor="CAREGIVER">
        <Box>
        {/* Header */}
        <Box sx={{ 
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          borderRadius: '24px',
          p: 4,
          mb: 4,
          boxShadow: '0 8px 32px 0 rgba(76, 175, 80, 0.15)',
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                width: 64,
                height: 64,
                borderRadius: '16px',
                background: roleColors.CAREGIVER.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 8px 24px ${roleColors.CAREGIVER.primary}40`,
              }}>
                <RestaurantIcon sx={{ fontSize: 36, color: 'white' }} />
              </Box>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#1b5e20', mb: 0.5 }}>
                  Heredibles™ Meal Manager
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(27, 94, 32, 0.7)' }}>
                  Managing meals for Abdeen White
                </Typography>
              </Box>
            </Box>
            <IconButton 
              onClick={fetchAllData}
              sx={{ 
                color: roleColors.CAREGIVER.primary,
                bgcolor: 'rgba(76, 175, 80, 0.1)',
                '&:hover': {
                  bgcolor: 'rgba(76, 175, 80, 0.2)',
                  transform: 'rotate(180deg)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Nutrition Summary */}
        {nutritionSummary && nutritionSummary.targets && (
          <Box sx={{ 
            p: 4, 
            mb: 4,
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            borderRadius: '20px',
            boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1)',
          }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1b5e20', mb: 3 }}>
              Today's Nutrition Progress
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Calories
                  </Typography>
                  <Typography variant="h6">
                    {nutritionSummary.totals.calories} / {nutritionSummary.targets.calories}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(nutritionSummary.percentages?.calories || 0, 100)}
                    sx={{ mt: 1, height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {nutritionSummary.percentages?.calories || 0}%
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Protein (g)
                  </Typography>
                  <Typography variant="h6">
                    {nutritionSummary.totals.protein.toFixed(0)} / {nutritionSummary.targets.protein}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(nutritionSummary.percentages?.protein || 0, 100)}
                    sx={{ mt: 1, height: 8, borderRadius: 4 }}
                    color="success"
                  />
                  <Typography variant="caption" color="text.secondary">
                    {nutritionSummary.percentages?.protein || 0}%
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Carbs (g)
                  </Typography>
                  <Typography variant="h6">
                    {nutritionSummary.totals.carbs.toFixed(0)} / {nutritionSummary.targets.carbs}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(nutritionSummary.percentages?.carbs || 0, 100)}
                    sx={{ mt: 1, height: 8, borderRadius: 4 }}
                    color="warning"
                  />
                  <Typography variant="caption" color="text.secondary">
                    {nutritionSummary.percentages?.carbs || 0}%
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Fat (g)
                  </Typography>
                  <Typography variant="h6">
                    {nutritionSummary.totals.fat.toFixed(0)} / {nutritionSummary.targets.fat}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(nutritionSummary.percentages?.fat || 0, 100)}
                    sx={{ mt: 1, height: 8, borderRadius: 4 }}
                    color="info"
                  />
                  <Typography variant="caption" color="text.secondary">
                    {nutritionSummary.percentages?.fat || 0}%
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Tabs */}
        <Box sx={{ 
          mb: 4,
          background: 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1)',
        }}>
          <Tabs 
            value={tabValue} 
            onChange={(_, newValue) => setTabValue(newValue)} 
            variant="scrollable" 
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                color: 'rgba(27, 94, 32, 0.7)',
                fontWeight: 600,
                '&.Mui-selected': {
                  color: roleColors.CAREGIVER.primary,
                },
              },
              '& .MuiTabs-indicator': {
                background: roleColors.CAREGIVER.gradient,
                height: 3,
              },
            }}
          >
            <Tab label="Today's Meals" icon={<RestaurantIcon />} />
            <Tab label="Weekly Plan" icon={<CheckIcon />} />
            <Tab label="Recipe Browser" icon={<RestaurantIcon />} />
            <Tab label="Grocery List" icon={<CartIcon />} />
            <Tab label="Preferences" icon={<StarIcon />} />
          </Tabs>
        </Box>

        {/* Tab 1: Today's Meal Checklist */}
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h5" gutterBottom>
            Today's Meal Checklist
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Track Abdeen's meals and snacks for today • {todaysMeals.filter(m => m.isCompleted).length}/{todaysMeals.length} completed
          </Typography>
          <Grid container spacing={3}>
            {todaysMeals.length > 0 ? (
              todaysMeals.map((meal) => (
                <Grid item xs={12} sm={6} md={4} key={meal.id}>
                  <Card sx={{ height: '100%', position: 'relative' }}>
                    {meal.isCompleted && (
                      <Chip
                        icon={<CheckIcon />}
                        label="Completed"
                        color="success"
                        size="small"
                        sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }}
                      />
                    )}
                    <CardContent>
                      <Chip label={meal.mealType} size="small" sx={{ mb: 2 }} color="primary" />
                      <Typography variant="h6" gutterBottom>
                        {meal.recipeName}
                      </Typography>
                      
                      {meal.photoUrl && (
                        <Box
                          component="img"
                          src={meal.photoUrl}
                          alt={meal.recipeName}
                          sx={{
                            width: '100%',
                            height: 150,
                            objectFit: 'cover',
                            borderRadius: 1,
                            my: 2,
                          }}
                        />
                      )}
                      
                      <Divider sx={{ my: 2 }} />
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <CaloriesIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                            <Typography variant="body2">
                              {meal.calories} cal
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <ProteinIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                            <Typography variant="body2">
                              {meal.protein.toFixed(0)}g protein
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                      
                      {/* Star Rating */}
                      {meal.isCompleted && (
                        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                          <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                            How did Abdeen like it?
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <IconButton
                                key={star}
                                size="small"
                                onClick={() => handleRateMeal(meal.id, star)}
                                sx={{
                                  color: meal.rating && star <= meal.rating ? '#ffc107' : '#e0e0e0',
                                  p: 0.5,
                                }}
                              >
                                {meal.rating && star <= meal.rating ? (
                                  <StarIcon fontSize="small" />
                                ) : (
                                  <StarBorderIcon fontSize="small" />
                                )}
                              </IconButton>
                            ))}
                            {meal.rating && (
                              <Typography variant="caption" sx={{ ml: 1, alignSelf: 'center' }}>
                                {meal.rating}/5
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      )}
                    </CardContent>
                    <CardActions sx={{ flexDirection: 'column', gap: 1, p: 2 }}>
                      {!meal.photoUrl && (
                        <Button
                          size="small"
                          variant="outlined"
                          fullWidth
                          startIcon={<CameraIcon />}
                          onClick={() => handleOpenPhotoCapture(meal)}
                        >
                          📸 Add Photo
                        </Button>
                      )}
                      {!meal.isCompleted ? (
                        <Button
                          size="small"
                          variant="contained"
                          fullWidth
                          color="success"
                          onClick={() => handleCompleteMeal(meal.id)}
                        >
                          ✓ Mark as Eaten
                        </Button>
                      ) : (
                        <Button size="small" variant="outlined" fullWidth disabled>
                          Completed
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    No meals planned for today
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </TabPanel>

        {/* Tab 2: Weekly Plan */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h5" gutterBottom>
            7-Day Meal Plan
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {mealPlan?.planName || 'No active plan'}
          </Typography>
          {mealPlan?.meals && (
            <Grid container spacing={2}>
              {Array.from({ length: 7 }, (_, i) => {
                const date = new Date(mealPlan.startDate);
                date.setDate(date.getDate() + i);
                const dateKey = date.toLocaleDateString();
                const dayMeals = mealPlan.meals?.filter(m => 
                  new Date(m.date).toLocaleDateString() === dateKey
                ) || [];

                return (
                  <Grid item xs={12} key={i}>
                    <Box sx={{ p: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        {formatDate(date.toISOString())}
                      </Typography>
                      <Grid container spacing={2}>
                        {dayMeals.map((meal) => (
                          <Grid item xs={12} sm={4} key={meal.id}>
                            <Box
                              sx={{
                                p: 2,
                                border: '1px solid',
                                borderColor: meal.isCompleted ? 'success.main' : 'divider',
                                borderRadius: 1,
                                bgcolor: meal.isCompleted ? '#e8f5e9' : 'background.paper',
                              }}
                            >
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Chip label={meal.mealType} size="small" />
                                {meal.isCompleted && <CheckIcon color="success" fontSize="small" />}
                              </Box>
                              <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                {meal.recipeName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {meal.calories} cal • {meal.protein.toFixed(0)}g protein
                              </Typography>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </TabPanel>

        {/* Tab 3: Recipe Browser */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h5" gutterBottom>
                Recipe Browser
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Browse {recipes.filter(r => cuisineFilter === 'ALL' || r.cuisine === cuisineFilter).length} heart-healthy recipes from around the world
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {['ALL', 'AMERICAN', 'MEDITERRANEAN', 'ARABIC', 'INDIAN', 'BRAZILIAN', 'ITALIAN', 'MEXICAN', 'TURKISH', 'ASIAN'].map((cuisine) => (
                <Chip
                  key={cuisine}
                  label={cuisine === 'ALL' ? '🌍 All' : cuisine}
                  onClick={() => setCuisineFilter(cuisine)}
                  color={cuisineFilter === cuisine ? 'primary' : 'default'}
                  variant={cuisineFilter === cuisine ? 'filled' : 'outlined'}
                />
              ))}
            </Box>
          </Box>
          <Grid container spacing={3}>
            {recipes
              .filter(r => cuisineFilter === 'ALL' || r.cuisine === cuisineFilter)
              .map((recipe) => (
              <Grid item xs={12} md={6} lg={4} key={recipe.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Chip label={recipe.category} size="small" color="primary" />
                        {recipe.cuisine && (
                          <Chip 
                            label={`🌍 ${recipe.cuisine}`} 
                            size="small" 
                            sx={{ bgcolor: '#e3f2fd', color: '#1976d2' }}
                          />
                        )}
                      </Box>
                      <Chip label={recipe.difficulty} size="small" variant="outlined" />
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      {recipe.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {recipe.description}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Calories
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {recipe.calories}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Protein
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {recipe.protein.toFixed(0)}g
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Prep Time
                        </Typography>
                        <Typography variant="body2">
                          {recipe.prepTime} min
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Cook Time
                        </Typography>
                        <Typography variant="body2">
                          {recipe.cookTime} min
                        </Typography>
                      </Grid>
                    </Grid>
                    <Box sx={{ mt: 2 }}>
                      {JSON.parse(recipe.dietaryTags).slice(0, 3).map((tag: string) => (
                        <Chip key={tag} label={tag} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                      ))}
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button size="small" fullWidth onClick={() => handleViewRecipe(recipe)}>
                      View Recipe
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Tab 4: Grocery List */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h5" gutterBottom>
            Weekly Grocery List
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Ingredients needed for this week's meal plan
          </Typography>
          <Box>
            <List>
              {groceryList.map((item, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <Checkbox edge="start" />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                    secondary={`${item.amount} ${item.unit}${item.count > 1 ? ` (needed for ${item.count} recipes)` : ''}`}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </TabPanel>

        {/* Tab 5: Preferences Analytics */}
        <TabPanel value={tabValue} index={4}>
          <Typography variant="h5" gutterBottom>
            Abdeen's Meal Preferences
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Discover what Abdeen loves based on meal ratings
          </Typography>
          
          {mealPlan?.meals && (
            <Grid container spacing={3}>
              {/* Top Rated Meals */}
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <StarIcon sx={{ color: '#ffc107' }} />
                    Favorite Meals
                  </Typography>
                  <List>
                    {mealPlan.meals
                      .filter(m => m.rating && m.rating >= 4)
                      .slice(0, 5)
                      .map((meal, idx) => (
                        <ListItem key={idx}>
                          <ListItemText
                            primary={meal.recipeName}
                            secondary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                {Array.from({ length: meal.rating || 0 }).map((_, i) => (
                                  <StarIcon key={i} sx={{ fontSize: 16, color: '#ffc107' }} />
                                ))}
                                <Typography variant="caption" sx={{ ml: 0.5 }}>
                                  {meal.rating}/5 • {meal.mealType}
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    {mealPlan.meals.filter(m => m.rating && m.rating >= 4).length === 0 && (
                      <ListItem>
                        <ListItemText
                          secondary="No highly rated meals yet. Rate meals after Abdeen eats them!"
                        />
                      </ListItem>
                    )}
                  </List>
                </Box>
              </Grid>

              {/* Needs Improvement */}
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <StarBorderIcon sx={{ color: '#f57c00' }} />
                    Needs Improvement
                  </Typography>
                  <List>
                    {mealPlan.meals
                      .filter(m => m.rating && m.rating <= 2)
                      .slice(0, 5)
                      .map((meal, idx) => (
                        <ListItem key={idx}>
                          <ListItemText
                            primary={meal.recipeName}
                            secondary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                {Array.from({ length: meal.rating || 0 }).map((_, i) => (
                                  <StarIcon key={i} sx={{ fontSize: 16, color: '#ffc107' }} />
                                ))}
                                <Typography variant="caption" sx={{ ml: 0.5 }}>
                                  {meal.rating}/5 • {meal.mealType}
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    {mealPlan.meals.filter(m => m.rating && m.rating <= 2).length === 0 && (
                      <ListItem>
                        <ListItemText
                          secondary="Great! No low-rated meals yet."
                        />
                      </ListItem>
                    )}
                  </List>
                </Box>
              </Grid>

              {/* Insights */}
              <Grid item xs={12}>
                <Box sx={{ p: 3, bgcolor: '#e3f2fd' }}>
                  <Typography variant="h6" gutterBottom>
                    🤖 AI Insights
                  </Typography>
                  <Typography variant="body2">
                    {mealPlan.meals.filter(m => m.rating).length > 0 ? (
                      <>
                        Based on {mealPlan.meals.filter(m => m.rating).length} ratings, we're learning Abdeen's preferences.
                        {mealPlan.meals.filter(m => m.rating && m.rating >= 4).length > 0 && (
                          <> He particularly enjoys {mealPlan.meals.filter(m => m.rating && m.rating >= 4)[0]?.recipeName}.</>
                        )}
                        {' '}Keep rating meals to help us personalize future meal plans!
                      </>
                    ) : (
                      'Start rating meals to discover Abdeen\'s preferences and get personalized recommendations!'
                    )}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          )}
        </TabPanel>

        {/* Recipe Detail Dialog */}
        <Dialog
          open={recipeDialogOpen}
          onClose={() => setRecipeDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          {selectedRecipe && (
            <>
              <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h5">{selectedRecipe.name}</Typography>
                  <IconButton onClick={() => setRecipeDialogOpen(false)}>
                    <CloseIcon />
                  </IconButton>
                </Box>
              </DialogTitle>
              <DialogContent dividers>
                {/* Food-Drug Interaction Warning */}
                {prescriptions.length > 0 && (() => {
                  const ingredients = selectedRecipe.ingredients ? JSON.parse(selectedRecipe.ingredients) : [];
                  const medications = prescriptions.map(p => ({
                    name: p.medication.name,
                    category: p.medication.category,
                  }));
                  const interactions = FoodDrugInteractionChecker.checkRecipeInteractions(ingredients, medications);
                  return <FoodDrugInteractionWarning interactions={interactions} />;
                })()}

                <Typography variant="body1" color="text.secondary" paragraph>
                  {selectedRecipe.description}
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={3}>
                      <Typography variant="caption" color="text.secondary">
                        Prep Time
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {selectedRecipe.prepTime} min
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="caption" color="text.secondary">
                        Cook Time
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {selectedRecipe.cookTime} min
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="caption" color="text.secondary">
                        Servings
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {selectedRecipe.servings}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="caption" color="text.secondary">
                        Difficulty
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {selectedRecipe.difficulty}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>
                  Nutrition Facts (per serving)
                </Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={4}>
                    <Box sx={{ p: 2, textAlign: 'center', bgcolor: '#f5f5f5' }}>
                      <Typography variant="h6">{selectedRecipe.calories}</Typography>
                      <Typography variant="caption">Calories</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ p: 2, textAlign: 'center', bgcolor: '#f5f5f5' }}>
                      <Typography variant="h6">{selectedRecipe.protein.toFixed(0)}g</Typography>
                      <Typography variant="caption">Protein</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ p: 2, textAlign: 'center', bgcolor: '#f5f5f5' }}>
                      <Typography variant="h6">{selectedRecipe.fiber.toFixed(0)}g</Typography>
                      <Typography variant="caption">Fiber</Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Typography variant="h6" gutterBottom>
                  Ingredients
                </Typography>
                <List dense>
                  {JSON.parse(selectedRecipe.ingredients).map((ing: any, idx: number) => (
                    <ListItem key={idx}>
                      <ListItemText primary={`${ing.amount} ${ing.unit} ${ing.name}`} />
                    </ListItem>
                  ))}
                </List>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Instructions
                </Typography>
                <List>
                  {JSON.parse(selectedRecipe.instructions).map((step: string, idx: number) => (
                    <ListItem key={idx}>
                      <ListItemText
                        primary={`${idx + 1}. ${step}`}
                        sx={{ '& .MuiListItemText-primary': { mb: 1 } }}
                      />
                    </ListItem>
                  ))}
                </List>

                {selectedRecipe.tips && (
                  <Box sx={{ p: 2, bgcolor: '#e3f2fd', mt: 3 }}>
                    <Typography variant="subtitle2" color="primary" gutterBottom>
                      💡 Chef's Tip
                    </Typography>
                    <Typography variant="body2">{selectedRecipe.tips}</Typography>
                  </Box>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setRecipeDialogOpen(false)}>Close</Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Meal Photo Capture Dialog */}
        <MealPhotoCapture
          open={photoDialogOpen}
          onClose={() => setPhotoDialogOpen(false)}
          onPhotoCapture={handlePhotoCapture}
          mealName={selectedMeal?.recipeName || ''}
        />
      </Box>
      </Layout>
    </Box>
  );
};

export default CaregiverHerediblesPage;
