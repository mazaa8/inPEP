import { Paper, Typography, Box } from '@mui/material';
import { WavingHand } from '@mui/icons-material';

const WelcomeMessage = () => {
  return (
    <Paper sx={{ 
      p: 4, 
      background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.12) 0%, rgba(255, 193, 7, 0.08) 100%)',
      backdropFilter: 'blur(30px)',
      WebkitBackdropFilter: 'blur(30px)',
      border: '1px solid rgba(255, 152, 0, 0.4)',
      borderRadius: '24px',
      boxShadow: '0 8px 32px 0 rgba(255, 152, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #FF9800 0%, #FFC107 100%)',
      },
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Box sx={{
          width: 56,
          height: 56,
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #FF9800 0%, #FFC107 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(255, 152, 0, 0.4)',
        }}>
          <WavingHand sx={{ fontSize: 32, color: 'white' }} />
        </Box>
        <Typography variant="h4" component="h1" sx={{ 
          fontWeight: 700, 
          background: 'linear-gradient(135deg, #FFB74D 0%, #FFC107 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Welcome Back, Dr. Smith!
        </Typography>
      </Box>
      <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.1rem', lineHeight: 1.6 }}>
        Here's a summary of your key activities and patient updates for today.
      </Typography>
    </Paper>
  );
};

export default WelcomeMessage;
