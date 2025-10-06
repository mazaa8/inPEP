import { Typography, Button, Grid, Card, CardContent, CardActions } from '@mui/material';
import { Phone as PhoneIcon, VideoCall as VideoCallIcon, SupportAgent as SupportIcon } from '@mui/icons-material';
import CaregiverPageWrapper from '../../components/layout/CaregiverPageWrapper';
import { roleColors } from '../../styles/glassmorphism';

const PatientSupportPage = () => {
  return (
    <CaregiverPageWrapper
      title="Patient Support"
      subtitle="Connect with hospital support staff and access telemedicine services directly"
      icon={<SupportIcon />}
    >
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              height: '100%',
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
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  Contact Hospital Support
                </Typography>
                <Typography color="text.secondary">
                  Reach out to our dedicated patient support team for any non-urgent questions, resource navigation, or guidance. Our team is available 24/7 to assist you.
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 3, pt: 0 }}>
                <Button 
                  startIcon={<PhoneIcon />} 
                  variant="contained" 
                  size="large"
                  sx={{
                    background: roleColors.CAREGIVER.gradient,
                    color: 'white',
                    fontWeight: 700,
                    px: 3,
                    py: 1.5,
                    borderRadius: '12px',
                  }}
                >
                  Message Support
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              height: '100%',
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
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  Telemedicine Services
                </Typography>
                <Typography color="text.secondary">
                  Schedule a virtual appointment with a healthcare professional to discuss your patient's condition, review care plans, or address any medical concerns from the comfort of your home.
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 3, pt: 0 }}>
                <Button 
                  startIcon={<VideoCallIcon />} 
                  variant="contained" 
                  size="large"
                  sx={{
                    background: roleColors.CAREGIVER.gradient,
                    color: 'white',
                    fontWeight: 700,
                    px: 3,
                    py: 1.5,
                    borderRadius: '12px',
                  }}
                >
                  Request Telemedicine Appointment
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
    </CaregiverPageWrapper>
  );
};

export default PatientSupportPage;
