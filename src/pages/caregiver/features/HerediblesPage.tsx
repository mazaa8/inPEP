import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Card,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  type SelectChangeEvent,
} from '@mui/material';
import Layout from '../../../components/layout/Layout';
import { useMealPlan } from '../../../context/MealPlanContext';
import { type Meal } from '../../../data/mealPlans';

const GROCERY_STORAGE_KEY = 'heredibles-weekly-menu';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const mealSlots = ['Breakfast', 'Lunch', 'Dinner'];

const HerediblesPage = () => {
  const navigate = useNavigate();
  const { weeklyPlan, availableMeals, updateMeal } = useMealPlan();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecipes, setSelectedRecipes] = useState<Meal[]>([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const handleSaveChanges = () => {
    // In a real app, this would make an API call to save the weeklyPlan from context
    console.log('Saving menu:', weeklyPlan);
    alert('Menu saved successfully!');
  };

  const handleClearDay = (day: string) => {
    updateMeal(day, 'breakfast', null);
    updateMeal(day, 'lunch', null);
    updateMeal(day, 'dinner', null);
  };

  const handleConfirmDay = (day: string) => {
    const dayPlan = weeklyPlan[day];
    if (!dayPlan || (!dayPlan.breakfast && !dayPlan.lunch && !dayPlan.dinner)) {
      alert('Please select at least one meal to confirm the day\'s plan.');
      return;
    }

    const mealIds = Object.values(dayPlan).filter((id): id is string => !!id);
    const recipes = availableMeals.filter(meal => mealIds.includes(meal.id));
    
    setSelectedRecipes(recipes);
    setIsModalOpen(true);

    try {
      localStorage.setItem(GROCERY_STORAGE_KEY, JSON.stringify(weeklyPlan));
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 5000); // Hide after 5 seconds
    } catch (error) {
      console.error('Failed to save menu to localStorage:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecipes([]);
  };

  const handleCopyToTomorrow = (day: string) => {
    const currentIndex = days.indexOf(day);
    if (currentIndex < days.length - 1) {
      const tomorrow = days[currentIndex + 1];
      const dayPlan = weeklyPlan[day];
      if (dayPlan) {
        updateMeal(tomorrow, 'breakfast', dayPlan.breakfast);
        updateMeal(tomorrow, 'lunch', dayPlan.lunch);
        updateMeal(tomorrow, 'dinner', dayPlan.dinner);
      }
    }
  };

  const handleMenuChange = (day: string, mealType: 'breakfast' | 'lunch' | 'dinner', event: SelectChangeEvent<string>) => {
    const mealId = event.target.value as string | null;
    updateMeal(day, mealType, mealId);
  };

  return (
    <>
      <Layout title="Heredibles™ Weekly Menu">
        <Box sx={{ p: 3 }}>
          <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
            Back
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.dark', m: 0 }}>
              Weekly Menu Planner
            </Typography>
            <Button variant="contained" color="primary" onClick={handleSaveChanges}>
              Save Changes
            </Button>
          </Box>
          {showSuccessAlert && (
            <Alert severity="success" onClose={() => setShowSuccessAlert(false)} sx={{ mb: 2 }}>
              The meal plan has been confirmed and is ready to be added to the grocery list.
            </Alert>
          )}
          <Grid container spacing={2}>
            {days.map(day => (
              <Grid item xs={12} md={6} lg={4} key={day}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
                      {day}
                    </Typography>
                    {mealSlots.map(mealSlot => (
                      <Box key={mealSlot} sx={{ mb: 2 }}>
                        <FormControl fullWidth size="small">
                          <InputLabel>{mealSlot}</InputLabel>
                          <Select
                            value={weeklyPlan[day]?.[mealSlot.toLowerCase() as 'breakfast' | 'lunch' | 'dinner'] || ''}
                            onChange={(e) => handleMenuChange(day, mealSlot.toLowerCase() as 'breakfast' | 'lunch' | 'dinner', e)}
                            label={mealSlot}
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            {availableMeals
                              .filter(p => p.category === mealSlot)
                              .map(option => (
                                <MenuItem key={option.id} value={option.id}>
                                  {option.name}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      </Box>
                    ))}
                  </CardContent>
                  <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Button size="small" onClick={() => handleClearDay(day)}>Clear</Button>
                    <Button size="small" onClick={() => handleCopyToTomorrow(day)}>Copy Next</Button>
                    <Button size="small" variant="contained" onClick={() => handleConfirmDay(day)}>Confirm</Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Layout>
      <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogTitle>Daily Recipe Plan</DialogTitle>
        <DialogContent dividers>
          {selectedRecipes.length > 0 ? (
            <List>
              {selectedRecipes.map((meal, index) => (
                <div key={meal.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={<Typography variant="h6">{meal.name} - {meal.category}</Typography>}
                      secondary={
                        <>
                          <Typography component="div" variant="body2" color="text.primary" sx={{ mt: 1 }}>
                            <strong>Ingredients:</strong>
                            <List dense sx={{ pl: 2 }}>
                              {meal.recipe.ingredients.map((ing, i) => <ListItem key={i} sx={{ display: 'list-item', listStyleType: 'disc', p: 0 }}>{ing}</ListItem>)}
                            </List>
                          </Typography>
                          <Typography component="div" variant="body2" color="text.primary" sx={{ mt: 1 }}>
                            <strong>Instructions:</strong>
                            <List dense sx={{ pl: 2 }}>
                              {meal.recipe.instructions.map((inst, i) => <ListItem key={i} sx={{ display: 'list-item', listStyleType: 'decimal', p: 0 }}>{inst}</ListItem>)}
                            </List>
                          </Typography>
                          <Typography component="div" variant="body2" sx={{ mt: 2, p: 1, backgroundColor: '#fff0f0', color: '#c62828', borderRadius: 1 }}>
                            <strong>Medical Notes:</strong> {meal.recipe.medicalNotes}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {index < selectedRecipes.length - 1 && <Divider variant="inset" component="li" />}
                </div>
              ))}
            </List>
          ) : (
            <Typography>No meals with recipes selected for this day.</Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
          <Button onClick={handleCloseModal}>Close</Button>
          <Button 
            variant="contained" 
            onClick={() => navigate('/caregiver/grocery-list')}
          >
            Update Grocery List
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default HerediblesPage;
