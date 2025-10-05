import { Typography, Box, Avatar } from '@mui/material';
import { WbSunny, Mood, Notes } from '@mui/icons-material';
import { usePatientSummary } from '../../../context/PatientSummaryContext';
import { roleColors } from '../../../styles/glassmorphism';

const TodaysSummary = () => {
  const { summary } = usePatientSummary();

  return (
    <Box sx={{ 
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.8)',
      borderRadius: '20px',
      p: 3,
      boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1)',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 32px rgba(76, 175, 80, 0.15)',
      },
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar sx={{ 
          background: roleColors.CAREGIVER.gradient,
          color: '#fff', 
          mr: 2, 
          width: 48,
          height: 48,
          boxShadow: `0 4px 16px ${roleColors.CAREGIVER.primary}40`,
        }}>
          <WbSunny />
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1b5e20' }}>
          Today's Summary
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, pl: 1 }}>
        <Mood sx={{ mr: 1.5, color: roleColors.CAREGIVER.primary }} />
        <Typography variant="body1" sx={{ color: '#1b5e20', fontWeight: 600 }}>Feeling: {summary.mood}</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', pl: 1 }}>
        <Notes sx={{ mr: 1.5, color: roleColors.CAREGIVER.primary }} />
        <Typography variant="body1" sx={{ color: '#1b5e20', fontWeight: 600 }}>Notes: {summary.notes}</Typography>
      </Box>
    </Box>
  );
};

export default TodaysSummary;
