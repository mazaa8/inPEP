import { Typography, Box, Button, Grid, Card, CardContent, CardActions } from '@mui/material';
import { Phone as PhoneIcon, VideoCall as VideoCallIcon } from '@mui/icons-material';
import Layout from '../../components/layout/Layout';

const PatientSupportPage = () => {
  return (
    <Layout title="Patient Support">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Patient Support
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Connect with hospital support staff and access telemedicine services directly.
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  Contact Hospital Support
                </Typography>
                <Typography color="text.secondary">
                  Reach out to our dedicated patient support team for any non-urgent questions, resource navigation, or guidance. Our team is available 24/7 to assist you.
                </Typography>
              </CardContent>
              <CardActions>
                <Button startIcon={<PhoneIcon />} variant="contained" size="large">
                  Message Support
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  Telemedicine Services
                </Typography>
                <Typography color="text.secondary">
                  Schedule a virtual appointment with a healthcare professional to discuss your patient's condition, review care plans, or address any medical concerns from the comfort of your home.
                </Typography>
              </CardContent>
              <CardActions>
                <Button startIcon={<VideoCallIcon />} variant="contained" size="large">
                  Request Telemedicine Appointment
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default PatientSupportPage;
