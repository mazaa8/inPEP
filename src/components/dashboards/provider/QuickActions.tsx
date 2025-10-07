import { Paper, Typography, Button, Stack, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AddCircleOutline, MailOutline, EventAvailable, VideoCall } from '@mui/icons-material';
import { roleColors } from '../../../styles/glassmorphism';

const QuickActions = () => {
  const navigate = useNavigate();
  return (
    <Paper sx={{ 
      p: 3,
      background: 'rgba(255, 255, 255, 0.06)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 152, 0, 0.25)',
      borderRadius: '20px',
      boxShadow: '0 4px 20px rgba(255, 152, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
    }}>
      <Typography variant="h6" gutterBottom sx={{ color: '#FFA726', fontWeight: 700, mb: 2 }}>
        Quick Actions
      </Typography>
      <Stack direction="row" spacing={2} flexWrap="wrap" gap={2}>
        <Button 
          variant="contained" 
          startIcon={<AddCircleOutline />}
          sx={{
            background: roleColors.PROVIDER.gradient,
            color: 'white',
            fontWeight: 600,
            px: 3,
            py: 1.5,
            borderRadius: '12px',
            boxShadow: `0 4px 16px ${roleColors.PROVIDER.primary}40`,
            '&:hover': {
              background: roleColors.PROVIDER.gradient,
              transform: 'translateY(-2px)',
              boxShadow: `0 6px 20px ${roleColors.PROVIDER.primary}60`,
            },
            transition: 'all 0.3s ease',
          }}
        >
          New Admission
        </Button>
        <Button 
          variant="outlined" 
          startIcon={<VideoCall />}
          sx={{
            borderColor: 'rgba(255, 152, 0, 0.5)',
            color: '#FFA726',
            fontWeight: 600,
            px: 3,
            py: 1.5,
            borderRadius: '12px',
            '&:hover': {
              borderColor: '#FFA726',
              background: 'rgba(255, 152, 0, 0.1)',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Start Telehealth
        </Button>
        <Button 
          variant="outlined" 
          startIcon={<MailOutline />} 
          onClick={() => navigate('/provider/messages')}
          sx={{
            borderColor: 'rgba(255, 152, 0, 0.5)',
            color: '#FFA726',
            fontWeight: 600,
            px: 3,
            py: 1.5,
            borderRadius: '12px',
            '&:hover': {
              borderColor: '#FFA726',
              background: 'rgba(255, 152, 0, 0.1)',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Messages
        </Button>
        <Button 
          variant="outlined" 
          startIcon={<EventAvailable />} 
          onClick={() => navigate('/provider/appointments')}
          sx={{
            borderColor: 'rgba(255, 152, 0, 0.5)',
            color: '#FFA726',
            fontWeight: 600,
            px: 3,
            py: 1.5,
            borderRadius: '12px',
            '&:hover': {
              borderColor: '#FFA726',
              background: 'rgba(255, 152, 0, 0.1)',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Appointments
        </Button>
      </Stack>
    </Paper>
  );
};

export default QuickActions;
