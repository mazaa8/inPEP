import { Typography, Box } from '@mui/material';
import { EmojiEmotions as MoodIcon } from '@mui/icons-material';
import PatientDailySummary from './PatientDailySummary';

const MyWellnessPlan = () => {
  return (
    <Box sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <MoodIcon sx={{ color: '#21CBF3', mr: 1 }} />
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
          My Mood Board
        </Typography>
      </Box>
      <PatientDailySummary />
    </Box>
  );
};

export default MyWellnessPlan;
