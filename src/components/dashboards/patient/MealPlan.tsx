import { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Box,
  CircularProgress,
  Alert,
  LinearProgress,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Restaurant as RestaurantIcon,
  CheckCircle as CheckIcon,
  AccessTime as TimeIcon,
  LocalFireDepartment as CaloriesIcon,
  Egg as ProteinIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { herediblesService, type MealPlan as MealPlanType, type PlannedMeal, type NutritionSummary } from '../../../services/herediblesService';

const MealPlan = () => {
  const [mealPlan, setMealPlan] = useState<MealPlanType | null>(null);
  const [nutritionSummary, setNutritionSummary] = useState<NutritionSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMealPlan();
    fetchNutritionSummary();
  }, []);

  const fetchMealPlan = async () => {
    try {
      setLoading(true);
      const data = await herediblesService.getActiveMealPlan();
      setMealPlan(data);
    } catch (err) {
      console.error('Failed to load meal plan:', err);
      setError('Failed to load meal plan');
    } finally {
      setLoading(false);
    }
  };

  const fetchNutritionSummary = async () => {
    try {
      const data = await herediblesService.getNutritionSummary();
      setNutritionSummary(data);
    } catch (err) {
      console.error('Failed to load nutrition summary:', err);
    }
  };

  const handleCompleteMeal = async (mealId: string) => {
    try {
      await herediblesService.completeMeal(mealId);
      await fetchMealPlan();
      await fetchNutritionSummary();
    } catch (err) {
      console.error('Failed to complete meal:', err);
    }
  };

  const getMealsByDate = () => {
    if (!mealPlan?.meals) return {};
    
    const grouped: { [key: string]: PlannedMeal[] } = {};
    mealPlan.meals.forEach(meal => {
      const dateKey = new Date(meal.date).toLocaleDateString();
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(meal);
    });
    
    return grouped;
  };

  const getTodaysMeals = () => {
    const today = new Date().toLocaleDateString();
    const mealsByDate = getMealsByDate();
    return mealsByDate[today] || [];
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
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!mealPlan) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <RestaurantIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          No Active Meal Plan
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Contact your healthcare provider to create a personalized meal plan
        </Typography>
      </Paper>
    );
  }

  const todaysMeals = getTodaysMeals();

  return (
    <Box>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              🥗 {mealPlan.planName}
            </Typography>
            <Typography variant="body1">
              {formatDate(mealPlan.startDate)} - {formatDate(mealPlan.endDate)}
            </Typography>
          </Box>
          <IconButton onClick={fetchMealPlan} sx={{ color: 'white' }}>
            <RefreshIcon />
          </IconButton>
        </Box>
      </Paper>

      {/* Nutrition Summary */}
      {nutritionSummary && nutritionSummary.targets && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
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
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Today's Meals */}
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Today's Menu
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {todaysMeals.filter(m => m.isCompleted).length}/{todaysMeals.length} meals completed
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
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
                  <Chip label={meal.mealType} size="small" sx={{ mb: 2 }} />
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
                        border: '2px solid',
                        borderColor: 'success.light',
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
                </CardContent>
                <CardActions>
                  {!meal.isCompleted && (
                    <Button
                      size="small"
                      variant="contained"
                      fullWidth
                      onClick={() => handleCompleteMeal(meal.id)}
                    >
                      Mark as Eaten
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                No meals planned for today
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Weekly Overview */}
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        7-Day Meal Plan
      </Typography>
      <Grid container spacing={2}>
        {Object.entries(getMealsByDate()).map(([date, meals]) => (
          <Grid item xs={12} key={date}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                {formatDate(meals[0].date)}
              </Typography>
              <Grid container spacing={2}>
                {meals.map((meal) => (
                  <Grid item xs={12} sm={4} key={meal.id}>
                    <Box
                      sx={{
                        p: 2,
                        border: '1px solid',
                        borderColor: meal.isCompleted ? 'success.main' : 'divider',
                        borderRadius: 1,
                        bgcolor: meal.isCompleted ? 'success.50' : 'background.paper',
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
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MealPlan;
