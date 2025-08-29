import { Typography, Box, LinearProgress } from '@mui/material';

export interface HealthMetric {
  id: number;
  name: string;
  value: string;
  status: string;
  progress: number;
}

interface HealthSummaryProps {
  metrics: HealthMetric[];
}

const HealthSummary = ({ metrics }: HealthSummaryProps) => {
  return (
    <>
      <Typography variant="h6" gutterBottom>Health Summary</Typography>
      {metrics.map(metric => (
        <Box key={metric.id} sx={{ mb: 2 }}>
          <Typography variant="body2">{metric.name}: {metric.value} ({metric.status})</Typography>
          <LinearProgress variant="determinate" value={metric.progress} sx={{ mt: 1 }} />
        </Box>
      ))}
    </>
  );
};

export default HealthSummary;
