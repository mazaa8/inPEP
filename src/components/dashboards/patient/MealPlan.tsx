import { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
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
  LocalFireDepartment as CaloriesIcon,
  Egg as ProteinIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { herediblesService, type MealPlan as MealPlanType, type PlannedMeal, type NutritionSummary } from '../../../services/herediblesService';
import { roleColors } from '../../../styles/glassmorphism';

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
        <CircularProgress sx={{ color: '#21CBF3' }} />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ bgcolor: 'rgba(244, 67, 54, 0.1)', color: 'white' }}>{error}</Alert>;
  }

  if (!mealPlan) {
    return (
      <Box sx={{ 
        p: 6, 
        textAlign: 'center',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '20px',
        border: '1px dashed rgba(255,255,255,0.2)',
      }}>
        <RestaurantIcon sx={{ fontSize: 80, color: 'rgba(33, 150, 243, 0.5)', mb: 2 }} />
        <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
          No Active Meal Plan
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
          Contact your healthcare provider to create a personalized meal plan
        </Typography>
      </Box>
    );
  }

  const todaysMeals = getTodaysMeals();

  return (
    <Box>
      {/* Header */}
      <Box sx={{ 
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '24px',
        p: 4,
        mb: 4,
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              width: 64,
              height: 64,
              borderRadius: '16px',
              background: roleColors.PATIENT.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 8px 24px ${roleColors.PATIENT.primary}40`,
            }}>
              <RestaurantIcon sx={{ fontSize: 36, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: 'white', mb: 0.5 }}>
                {mealPlan.planName}
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                {formatDate(mealPlan.startDate)} - {formatDate(mealPlan.endDate)}
              </Typography>
            </Box>
          </Box>
          <IconButton 
            onClick={fetchMealPlan}
            sx={{ 
              color: '#21CBF3',
              bgcolor: 'rgba(33, 150, 243, 0.1)',
              '&:hover': {
                bgcolor: 'rgba(33, 150, 243, 0.2)',
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
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}>
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 3 }}>
            Today's Nutrition Progress
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={6} md={3}>
              <Box>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 1 }}>
                  Calories
                </Typography>
                <Typography variant="h5" sx={{ color: '#21CBF3', fontWeight: 700, mb: 1 }}>
                  {nutritionSummary.totals.calories} / {nutritionSummary.targets.calories}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(nutritionSummary.percentages?.calories || 0, 100)}
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #FF9800 0%, #FFC107 100%)',
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 1 }}>
                  Protein (g)
                </Typography>
                <Typography variant="h5" sx={{ color: '#8BC34A', fontWeight: 700, mb: 1 }}>
                  {nutritionSummary.totals.protein.toFixed(0)} / {nutritionSummary.targets.protein}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(nutritionSummary.percentages?.protein || 0, 100)}
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #4CAF50 0%, #8BC34A 100%)',
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 1 }}>
                  Carbs (g)
                </Typography>
                <Typography variant="h5" sx={{ color: '#FFD54F', fontWeight: 700, mb: 1 }}>
                  {nutritionSummary.totals.carbs.toFixed(0)} / {nutritionSummary.targets.carbs}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(nutritionSummary.percentages?.carbs || 0, 100)}
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #FFC107 0%, #FFD54F 100%)',
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 1 }}>
                  Fat (g)
                </Typography>
                <Typography variant="h5" sx={{ color: '#21CBF3', fontWeight: 700, mb: 1 }}>
                  {nutritionSummary.totals.fat.toFixed(0)} / {nutritionSummary.targets.fat}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(nutritionSummary.percentages?.fat || 0, 100)}
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #2196F3 0%, #21CBF3 100%)',
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Today's Meals */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 0.5 }}>
            Today's Menu
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            {todaysMeals.filter(m => m.isCompleted).length}/{todaysMeals.length} meals completed
          </Typography>
        </Box>
      </Box>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {todaysMeals.length > 0 ? (
          todaysMeals.map((meal) => (
            <Grid item xs={12} sm={6} md={4} key={meal.id}>
              <Box sx={{ 
                height: '100%', 
                position: 'relative',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 32px rgba(33, 150, 243, 0.2)',
                },
              }}>
                {meal.isCompleted && (
                  <Chip
                    icon={<CheckIcon />}
                    label="Completed"
                    size="small"
                    sx={{ 
                      position: 'absolute', 
                      top: 16, 
                      right: 16, 
                      zIndex: 1,
                      bgcolor: 'rgba(76, 175, 80, 0.9)',
                      color: 'white',
                      fontWeight: 700,
                    }}
                  />
                )}
                <Box sx={{ p: 3 }}>
                  <Chip 
                    label={meal.mealType} 
                    size="small" 
                    sx={{ 
                      mb: 2,
                      bgcolor: 'rgba(33, 150, 243, 0.2)',
                      color: '#21CBF3',
                      fontWeight: 700,
                      border: '1px solid rgba(33, 150, 243, 0.3)',
                    }} 
                  />
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
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
                        borderRadius: '12px',
                        my: 2,
                        border: '2px solid rgba(76, 175, 80, 0.5)',
                      }}
                    />
                  )}
                  
                  <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CaloriesIcon sx={{ fontSize: 20, color: '#FFC107' }} />
                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                          {meal.calories} cal
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ProteinIcon sx={{ fontSize: 20, color: '#8BC34A' }} />
                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                          {meal.protein.toFixed(0)}g
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  
                  {!meal.isCompleted && (
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => handleCompleteMeal(meal.id)}
                      sx={{
                        mt: 2,
                        background: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)',
                        color: 'white',
                        fontWeight: 700,
                        py: 1.5,
                        borderRadius: '12px',
                        boxShadow: '0 4px 16px rgba(76, 175, 80, 0.4)',
                        '&:hover': {
                          transform: 'scale(1.02)',
                          boxShadow: '0 8px 24px rgba(76, 175, 80, 0.5)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      Mark as Eaten
                    </Button>
                  )}
                </Box>
              </Box>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box sx={{ 
              p: 4, 
              textAlign: 'center',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '16px',
              border: '1px dashed rgba(255,255,255,0.2)',
            }}>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                No meals planned for today
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>

      {/* Weekly Overview */}
      <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 3 }}>
        7-Day Meal Plan
      </Typography>
      <Grid container spacing={3}>
        {Object.entries(getMealsByDate()).map(([date, meals]) => (
          <Grid item xs={12} key={date}>
            <Box sx={{ 
              p: 3,
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            }}>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 3 }}>
                {formatDate(meals[0].date)}
              </Typography>
              <Grid container spacing={2}>
                {meals.map((meal) => (
                  <Grid item xs={12} sm={4} key={meal.id}>
                    <Box
                      sx={{
                        p: 2,
                        border: '1px solid',
                        borderColor: meal.isCompleted ? 'rgba(76, 175, 80, 0.5)' : 'rgba(255,255,255,0.15)',
                        borderRadius: '12px',
                        bgcolor: meal.isCompleted ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255,255,255,0.03)',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: 'rgba(33, 150, 243, 0.05)',
                          borderColor: 'rgba(33, 150, 243, 0.3)',
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Chip 
                          label={meal.mealType} 
                          size="small" 
                          sx={{
                            bgcolor: 'rgba(33, 150, 243, 0.2)',
                            color: '#21CBF3',
                            fontWeight: 600,
                            border: '1px solid rgba(33, 150, 243, 0.3)',
                          }}
                        />
                        {meal.isCompleted && <CheckIcon sx={{ color: '#8BC34A' }} fontSize="small" />}
                      </Box>
                      <Typography variant="body1" sx={{ fontWeight: 700, mb: 1, color: 'white' }}>
                        {meal.recipeName}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                        {meal.calories} cal • {meal.protein.toFixed(0)}g protein
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MealPlan;
