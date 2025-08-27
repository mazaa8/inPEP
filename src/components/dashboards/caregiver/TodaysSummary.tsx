import { Card, CardContent, Typography, Box, Avatar, Chip } from '@mui/material';
import { WbSunny, Mood, Notes } from '@mui/icons-material';

const TodaysSummary = () => {
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
          <Typography variant="body1">Feeling: Cheerful and energetic</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1 }}>
          <Notes sx={{ mr: 1.5, color: '#4A7C6E' }} />
          <Typography variant="body1">Notes: Watched a movie in the afternoon.</Typography>
        </Box>
        <Box sx={{ mt: 2, pl: 1 }}>
          <Chip 
            label="Morning medication due" 
            sx={{ 
              backgroundColor: 'rgba(255, 215, 0, 0.2)', 
              color: '#A67C00', 
              fontWeight: 'bold', 
              border: '1px solid rgba(255, 215, 0, 0.3)' 
            }} 
            size="small" 
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default TodaysSummary;
