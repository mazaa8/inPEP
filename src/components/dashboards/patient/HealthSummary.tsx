import { Typography, Box, LinearProgress, Chip } from '@mui/material';

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
      {metrics.map(metric => (
        <Box key={metric.id} sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 600, color: 'white' }}>
              {metric.name}
            </Typography>
            <Chip 
              label={metric.status} 
              size="small" 
              sx={{ 
                bgcolor: metric.progress > 75 ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 152, 0, 0.2)',
                color: metric.progress > 75 ? '#8BC34A' : '#FFC107',
                fontWeight: 700,
              }} 
            />
          </Box>
          <Typography variant="h6" sx={{ color: '#21CBF3', fontWeight: 700, mb: 1 }}>
            {metric.value}
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={metric.progress} 
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
      ))}
    </>
  );
};

export default HealthSummary;
