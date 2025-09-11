import { Paper, Typography, Grid } from '@mui/material';
import HealthSummary, { type HealthMetric } from './HealthSummary';
import HealthDataChart, { type HealthData } from './HealthDataChart';
import PatientDailySummary from './PatientDailySummary';

// Data that was previously in PatientDashboard.tsx
const healthSummaryData: HealthMetric[] = [
  { id: 1, name: 'Blood Pressure', value: '120/80', status: 'Normal', progress: 80 },
  { id: 2, name: 'Blood Glucose', value: '95 mg/dL', status: 'Good', progress: 70 },
  { id: 3, name: 'Cholesterol', value: '180 mg/dL', status: 'Excellent', progress: 90 },
];

const healthChartData: HealthData[] = [
  { name: 'Jan', weight: 65 },
  { name: 'Feb', weight: 66 },
  { name: 'Mar', weight: 67 },
  { name: 'Apr', weight: 66 },
  { name: 'May', weight: 68 },
  { name: 'Jun', weight: 70 },
];

const MyWellnessPlan = () => {
  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        My Wellness Plan
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <PatientDailySummary />
        </Grid>
        <Grid item xs={12} md={6}>
          <HealthSummary metrics={healthSummaryData} />
        </Grid>
        <Grid item xs={12} md={6}>
          <HealthDataChart data={healthChartData} />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default MyWellnessPlan;
