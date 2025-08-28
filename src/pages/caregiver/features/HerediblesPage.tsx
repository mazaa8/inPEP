import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
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
} from '@mui/material';
import Layout from '../../../components/layout/Layout';
import { mealPlans, type Meal } from '../../../data/mealPlans';

const GROCERY_STORAGE_KEY = 'heredibles-weekly-menu';

const initialMenu = {
  Monday: {
    'Breakfast (7-9 AM)': '',
    'Snack 1 (10-11 AM)': '',
    'Lunch (12-2 PM)': '',
    'Snack 2 (3-4 PM)': '',
    'Dinner (6-8 PM)': '',
    'Snack 3 (9-10 PM)': '',
  },
  Tuesday: {
    'Breakfast (7-9 AM)': '',
    'Snack 1 (10-11 AM)': '',
    'Lunch (12-2 PM)': '',
    'Snack 2 (3-4 PM)': '',
    'Dinner (6-8 PM)': '',
    'Snack 3 (9-10 PM)': '',
  },
  Wednesday: {
    'Breakfast (7-9 AM)': '',
    'Snack 1 (10-11 AM)': '',
    'Lunch (12-2 PM)': '',
    'Snack 2 (3-4 PM)': '',
    'Dinner (6-8 PM)': '',
    'Snack 3 (9-10 PM)': '',
  },
  Thursday: {
    'Breakfast (7-9 AM)': '',
    'Snack 1 (10-11 AM)': '',
    'Lunch (12-2 PM)': '',
    'Snack 2 (3-4 PM)': '',
    'Dinner (6-8 PM)': '',
    'Snack 3 (9-10 PM)': '',
  },
  Friday: {
    'Breakfast (7-9 AM)': '',
    'Snack 1 (10-11 AM)': '',
    'Lunch (12-2 PM)': '',
    'Snack 2 (3-4 PM)': '',
    'Dinner (6-8 PM)': '',
    'Snack 3 (9-10 PM)': '',
  },
  Saturday: {
    'Breakfast (7-9 AM)': '',
    'Snack 1 (10-11 AM)': '',
    'Lunch (12-2 PM)': '',
    'Snack 2 (3-4 PM)': '',
    'Dinner (6-8 PM)': '',
    'Snack 3 (9-10 PM)': '',
  },
  Sunday: {
    'Breakfast (7-9 AM)': '',
    'Snack 1 (10-11 AM)': '',
    'Lunch (12-2 PM)': '',
    'Snack 2 (3-4 PM)': '',
    'Dinner (6-8 PM)': '',
    'Snack 3 (9-10 PM)': '',
  },
};

const getMealCategory = (mealSlot: string): 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' => {
  if (mealSlot.toLowerCase().includes('breakfast')) return 'Breakfast';
  if (mealSlot.toLowerCase().includes('lunch')) return 'Lunch';
  if (mealSlot.toLowerCase().includes('dinner')) return 'Dinner';
  return 'Snack';
};

const HerediblesPage = () => {
  const navigate = useNavigate();
  const [menu, setMenu] = useState(initialMenu);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecipes, setSelectedRecipes] = useState<Meal[]>([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const handleSaveChanges = () => {
    console.log('Saving menu:', menu);
    // Here you would typically make an API call to save the data
    alert('Menu saved successfully!');
  };

  const handleClearDay = (day: string) => {
    setMenu(prevMenu => ({
      ...prevMenu,
      [day]: Object.keys(prevMenu[day as keyof typeof prevMenu]).reduce((acc, meal) => ({ ...acc, [meal]: '' }), {}),
    }));
  };

      const handleConfirmDay = (day: string) => {
    const dayMenu = menu[day as keyof typeof menu];
    const mealNames = Object.values(dayMenu).filter(name => name !== '');

    if (mealNames.length === 0) {
      alert('Please select at least one meal to confirm the day\'s plan.');
      return;
    }

    const recipes = mealPlans.filter(meal => mealNames.includes(meal.name));
    setSelectedRecipes(recipes);
    setIsModalOpen(true);

    // Save the entire menu to localStorage for the grocery page to use
    try {
      localStorage.setItem(GROCERY_STORAGE_KEY, JSON.stringify(menu));
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
    const daysOfWeek = Object.keys(initialMenu);
    const currentIndex = daysOfWeek.indexOf(day);
    if (currentIndex < daysOfWeek.length - 1) {
      const tomorrow = daysOfWeek[currentIndex + 1];
      setMenu(prevMenu => ({
        ...prevMenu,
        [tomorrow]: prevMenu[day as keyof typeof prevMenu],
      }));
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    const sourceDay = source.droppableId;
    const destDay = destination.droppableId;

    const sourceDayMeals = Object.keys(menu[sourceDay as keyof typeof menu]);
    const destDayMeals = Object.keys(menu[destDay as keyof typeof menu]);

    const sourceMealName = sourceDayMeals[source.index];
    const destMealName = destDayMeals[destination.index];

    if (sourceDay === destDay && source.index === destination.index) {
      return;
    }

    setMenu(prevMenu => {
      const newMenu = JSON.parse(JSON.stringify(prevMenu));
      const sourceContent = newMenu[sourceDay as keyof typeof menu][sourceMealName as keyof typeof newMenu[keyof typeof newMenu]];
      const destContent = newMenu[destDay as keyof typeof menu][destMealName as keyof typeof newMenu[keyof typeof newMenu]];

      newMenu[sourceDay as keyof typeof menu][sourceMealName as keyof typeof newMenu[keyof typeof newMenu]] = destContent;
      newMenu[destDay as keyof typeof menu][destMealName as keyof typeof newMenu[keyof typeof newMenu]] = sourceContent;

      return newMenu;
    });
  };

  const handleMenuChange = (day: string, meal: string, value: string) => {
    setMenu(prevMenu => ({
      ...prevMenu,
      [day]: {
        ...prevMenu[day as keyof typeof prevMenu],
        [meal]: value,
      },
    }));
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
            Tuesday's meal plan has been confirmed and is ready to be added to the grocery list.
          </Alert>
        )}
        <DragDropContext onDragEnd={onDragEnd}>
        <Grid container spacing={2}>
          {Object.keys(menu).map(day => (
            <Grid item xs={12} md={6} lg={4} key={day}>
              <Droppable droppableId={day}>
                {(provided) => (
              <Card {...provided.droppableProps} ref={provided.innerRef} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
                    {day}
                  </Typography>
                  {Object.keys(menu[day as keyof typeof menu]).map((meal, index) => (
                    <Draggable key={meal} draggableId={`${day}-${meal}`} index={index}>
                      {(provided) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={{ mb: 2, p: 1, border: '1px solid #eee', borderRadius: '4px', backgroundColor: 'white' }}
                        >
                          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                            {meal}
                          </Typography>
                          <FormControl fullWidth size="small">
                            <InputLabel>{getMealCategory(meal)}</InputLabel>
                            <Select
                              value={menu[day as keyof typeof menu][meal as keyof typeof menu[keyof typeof menu]]}
                              onChange={e => handleMenuChange(day, meal, e.target.value)}
                              label={getMealCategory(meal)}
                            >
                              <MenuItem value="">
                                <em>None</em>
                              </MenuItem>
                              {mealPlans
                                .filter(p => p.category === getMealCategory(meal))
                                .map(option => (
                                  <MenuItem key={option.id} value={option.name}>
                                    {option.name}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>
                        </Box>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                                  </CardContent>
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Button size="small" onClick={() => handleClearDay(day)}>Clear</Button>
                  <Button size="small" onClick={() => handleCopyToTomorrow(day)}>Copy Next</Button>
                  <Button size="small" variant="contained" onClick={() => handleConfirmDay(day)}>Confirm</Button>
                </Box>
              </Card>
                )}
              </Droppable>
            </Grid>
          ))}
        </Grid>
      </DragDropContext>
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
