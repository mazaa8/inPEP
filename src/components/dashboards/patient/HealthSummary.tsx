import { Typography, Box, LinearProgress } from '@mui/material';

const healthMetrics = [
  { id: 1, name: 'Blood Pressure', value: '120/80', status: 'Normal' },
  { id: 2, name: 'Blood Glucose', value: '95 mg/dL', status: 'Good' },
  { id: 3, name: 'Cholesterol', value: '180 mg/dL', status: 'Excellent' },
];

const HealthSummary = () => {
  return (
    <>
      <Typography variant="h6" gutterBottom>Health Summary</Typography>
      {healthMetrics.map(metric => (
        <Box key={metric.id} sx={{ mb: 2 }}>
          <Typography variant="body2">{metric.name}: {metric.value} ({metric.status})</Typography>
          <LinearProgress variant="determinate" value={80} sx={{ mt: 1 }} />
        </Box>
      ))}
    </>
  );
};

export default HealthSummary;
