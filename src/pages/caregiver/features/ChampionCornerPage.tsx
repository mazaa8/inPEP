import { Box, Typography, Button, Card, CardContent, Grid } from '@mui/material';
import { EmojiEvents as TrophyIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import CaregiverPageWrapper from '../../../components/layout/CaregiverPageWrapper';
import { roleColors } from '../../../styles/glassmorphism';

const ChampionCornerPage = () => {
  const navigate = useNavigate();
  return (
    <CaregiverPageWrapper
      title="Champion Corner"
      subtitle="Championing the caregiver voice in the healing journey"
      icon={<TrophyIcon />}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={8}>
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              borderRadius: '20px',
              boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 32px rgba(76, 175, 80, 0.15)',
              },
            }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  What is a ReclaiMe Champion™?
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  You are the heart of the healing journey. A ReclaiMe Champion™ is a caregiver who is recognized for their dedication, empowered with exclusive resources, and connected to a community that understands. It’s not about promoting a brand; it’s about elevating your voice.
                </Typography>
                <Button 
                  variant="contained"
                  sx={{
                    background: roleColors.CAREGIVER.gradient,
                    color: 'white',
                    fontWeight: 700,
                    px: 4,
                    py: 1.5,
                    borderRadius: '12px',
                  }}
                >
                  Become a Champion
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              borderRadius: '20px',
              boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 32px rgba(76, 175, 80, 0.15)',
              },
            }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  Caregiver Spotlight
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  Here we share stories of resilience, hope, and connection from caregivers just like you. Your voice matters.
                </Typography>
                <Button 
                  variant="outlined"
                  onClick={() => navigate('/share-your-story')}
                  sx={{
                    borderColor: roleColors.CAREGIVER.primary,
                    color: roleColors.CAREGIVER.primary,
                    fontWeight: 700,
                    px: 4,
                    py: 1.5,
                    borderRadius: '12px',
                    '&:hover': {
                      borderColor: roleColors.CAREGIVER.primary,
                      bgcolor: 'rgba(76, 175, 80, 0.05)',
                    },
                  }}
                >
                  Share Your Story
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </CaregiverPageWrapper>
  );
};

export default ChampionCornerPage;
