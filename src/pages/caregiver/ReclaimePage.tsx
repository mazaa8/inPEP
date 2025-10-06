import { Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { WorkspacePremium as ChampionIcon } from '@mui/icons-material';
import CaregiverPageWrapper from '../../components/layout/CaregiverPageWrapper';
import { roleColors } from '../../styles/glassmorphism';

const ReclaimePage = () => {
  return (
    <CaregiverPageWrapper
      title="ReclaiMe Champion™"
      subtitle="Your dedicated hub for exclusive caregiver features and resources"
      icon={<ChampionIcon />}
    >
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              borderRadius: '20px',
              boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1)',
              transition: 'all 0.3s ease',
              height: '100%',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 32px rgba(76, 175, 80, 0.15)',
              },
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  Self-Care for Caregivers
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  Explore guided modules on preventing burnout and managing stress.
                </Typography>
                <Button 
                  variant="contained"
                  sx={{
                    background: roleColors.CAREGIVER.gradient,
                    color: 'white',
                    fontWeight: 700,
                  }}
                >
                  Access Module
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              borderRadius: '20px',
              boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1)',
              transition: 'all 0.3s ease',
              height: '100%',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 32px rgba(76, 175, 80, 0.15)',
              },
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  Expert Q&A Sessions
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  Watch recordings of live Q&A sessions with healthcare professionals.
                </Typography>
                <Button 
                  variant="outlined"
                  sx={{
                    borderColor: roleColors.CAREGIVER.primary,
                    color: roleColors.CAREGIVER.primary,
                    fontWeight: 700,
                    '&:hover': {
                      borderColor: roleColors.CAREGIVER.primary,
                      bgcolor: 'rgba(76, 175, 80, 0.05)',
                    },
                  }}
                >
                  View Sessions
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
    </CaregiverPageWrapper>
  );
};

export default ReclaimePage;
