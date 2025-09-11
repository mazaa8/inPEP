import { Paper, Typography, FormControl, InputLabel, Select, MenuItem, type SelectChangeEvent } from '@mui/material';
import { useMealPlan } from '../../../context/MealPlanContext';

const MealSelector = () => {
  const { availableMeals, selectedMeal, selectMeal } = useMealPlan();

  const handleMealChange = (event: SelectChangeEvent<string>) => {
    selectMeal(event.target.value as string);
  };

  // For simplicity, we're only allowing selection of dinner options.
  const dinnerOptions = availableMeals.filter(meal => meal.category === 'Dinner');

  return (
    <Paper sx={{ p: 2, mt: 3 }}>
      <Typography variant="h6" gutterBottom>Select Patient's Dinner</Typography>
      <FormControl fullWidth>
        <InputLabel id="dinner-select-label">Dinner Choice</InputLabel>
        <Select
          labelId="dinner-select-label"
          value={selectedMeal || ''}
          label="Dinner Choice"
          onChange={handleMealChange}
        >
          {dinnerOptions.map((meal) => (
            <MenuItem key={meal.id} value={meal.id}>
              {meal.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Paper>
  );
};

export default MealSelector;
