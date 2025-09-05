import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, FormControl, Select, MenuItem, type SelectChangeEvent } from '@mui/material';
import { useMealPlan } from '../../../context/MealPlanContext';
import type { DailyMealPlan } from '../../../context/MealPlanContext';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const mealTypes: (keyof DailyMealPlan)[] = ['breakfast', 'lunch', 'dinner'];

const WeeklyMealPlanner = () => {
  const { weeklyPlan, availableMeals, updateMeal } = useMealPlan();

  const handleMealChange = (day: string, mealType: keyof DailyMealPlan, event: SelectChangeEvent<string>) => {
    updateMeal(day, mealType, event.target.value);
  };

  return (
    <Paper sx={{ p: 2, mt: 3 }}>
      <Typography variant="h6" gutterBottom>Weekly Meal Planner</Typography>
      <TableContainer>
        <Table stickyHeader aria-label="weekly meal planner">
          <TableHead>
            <TableRow>
              <TableCell>Day</TableCell>
              <TableCell align="center">Breakfast</TableCell>
              <TableCell align="center">Lunch</TableCell>
              <TableCell align="center">Dinner</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {daysOfWeek.map((day) => (
              <TableRow key={day}>
                <TableCell component="th" scope="row">{day}</TableCell>
                {mealTypes.map((mealType) => {
                  const mealOptions = availableMeals.filter(m => m.category.toLowerCase() === mealType);
                  return (
                    <TableCell key={mealType} align="center">
                      <FormControl size="small" fullWidth>
                        <Select
                          value={weeklyPlan[day]?.[mealType] || ''}
                          onChange={(e) => handleMealChange(day, mealType, e)}
                        >
                          {mealOptions.map((meal) => (
                            <MenuItem key={meal.id} value={meal.id}>
                              {meal.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default WeeklyMealPlanner;
