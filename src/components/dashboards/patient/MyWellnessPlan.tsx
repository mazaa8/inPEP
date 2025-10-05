import { Paper, Typography } from '@mui/material';
import PatientDailySummary from './PatientDailySummary';

const MyWellnessPlan = () => {
  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        My Mood Board
      </Typography>
      <PatientDailySummary />
    </Paper>
  );
};

export default MyWellnessPlan;
