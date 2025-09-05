import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useMealPlan } from '../../../context/MealPlanContext';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const MealPlan = () => {
  const { weeklyPlan, availableMeals } = useMealPlan();

  const getMealName = (mealId: string | null) => {
    if (!mealId) return 'Not set';
    return availableMeals.find(m => m.id === mealId)?.name || 'Unknown';
  };

  return (
    <Paper sx={{ p: 2, mt: 3 }}>
      <Typography variant="h6" gutterBottom>Weekly Meal Plan</Typography>
      <TableContainer>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>Day</TableCell>
              <TableCell>Breakfast</TableCell>
              <TableCell>Lunch</TableCell>
              <TableCell>Dinner</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {daysOfWeek.map((day) => (
              <TableRow key={day}>
                <TableCell>{day}</TableCell>
                <TableCell>{getMealName(weeklyPlan[day]?.breakfast)}</TableCell>
                <TableCell>{getMealName(weeklyPlan[day]?.lunch)}</TableCell>
                <TableCell>{getMealName(weeklyPlan[day]?.dinner)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default MealPlan;
