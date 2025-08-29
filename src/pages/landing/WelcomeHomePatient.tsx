import { Box, Typography, Container, Button, Grid, Paper, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { Event as EventIcon, RestaurantMenu as RestaurantMenuIcon, Chat as ChatIcon, HealthAndSafety as HealthAndSafetyIcon } from '@mui/icons-material';

const HeroBox = styled(Box)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.secondary.main} 30%, ${theme.palette.secondary.dark} 90%)`,
  color: theme.palette.secondary.contrastText,
  padding: theme.spacing(10, 2),
  textAlign: 'center',
  marginBottom: theme.spacing(6),
}));

const FeaturePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  height: '100%',
  borderRadius: theme.shape.borderRadius * 2,
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  boxShadow: theme.shadows[3],
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[12],
  },
}));

const FeatureAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  width: theme.spacing(7),
  height: theme.spacing(7),
  marginBottom: theme.spacing(2),
}));

const WelcomeHomePatient = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      <HeroBox>
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
            Welcome to Your Health Hub
          </Typography>
          <Typography variant="h5" component="p" sx={{ mb: 4 }}>
            Your personalized space to manage your health journey, connect with your care team, and access valuable resources.
          </Typography>
          <Button variant="contained" color="primary" size="large" onClick={() => navigate('/dashboard/patient')}>
            Go to My Dashboard
          </Button>
        </Container>
      </HeroBox>

      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <FeaturePaper>
              <FeatureAvatar><HealthAndSafetyIcon /></FeatureAvatar>
              <Typography variant="h6" fontWeight="bold">My Wellness Plan</Typography>
              <Typography>Access your personalized care plan and track your progress.</Typography>
            </FeaturePaper>
          </Grid>
          <Grid item xs={12} md={3}>
            <FeaturePaper>
              <FeatureAvatar><EventIcon /></FeatureAvatar>
              <Typography variant="h6" fontWeight="bold">Appointments</Typography>
              <Typography>View and manage your upcoming appointments with ease.</Typography>
            </FeaturePaper>
          </Grid>
          <Grid item xs={12} md={3}>
            <FeaturePaper>
              <FeatureAvatar><ChatIcon /></FeatureAvatar>
              <Typography variant="h6" fontWeight="bold">Messages</Typography>
              <Typography>Communicate securely with your care team and caregivers.</Typography>
            </FeaturePaper>
          </Grid>
          <Grid item xs={12} md={3}>
            <FeaturePaper>
              <FeatureAvatar><RestaurantMenuIcon /></FeatureAvatar>
              <Typography variant="h6" fontWeight="bold">Meal Plans</Typography>
              <Typography>Explore healthy, culturally-tailored meal recommendations.</Typography>
            </FeaturePaper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default WelcomeHomePatient;
