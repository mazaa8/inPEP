import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import { WbSunny, Mood, Notes } from '@mui/icons-material';
import { usePatientSummary } from '../../../context/PatientSummaryContext';

const TodaysSummary = () => {
  const { summary } = usePatientSummary();

  return (
    <Card sx={{ background: 'linear-gradient(135deg, #F4F7F6 0%, #E9EFEE 100%)', color: '#2D4A43', borderRadius: '16px', boxShadow: '0 12px 32px rgba(0,0,0,0.1)' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ background: 'linear-gradient(135deg, #78A698 0%, #4A7C6E 100%)', color: '#fff', mr: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
            <WbSunny />
          </Avatar>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', letterSpacing: '0.5px' }}>
            Today's Summary
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, pl: 1 }}>
          <Mood sx={{ mr: 1.5, color: '#4A7C6E' }} />
          <Typography variant="body1">Feeling: {summary.mood}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1 }}>
          <Notes sx={{ mr: 1.5, color: '#4A7C6E' }} />
          <Typography variant="body1">Notes: {summary.notes}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TodaysSummary;
