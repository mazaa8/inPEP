import { Typography, Box, Grid, Card, CardContent, Button } from '@mui/material';
import Layout from '../../components/layout/Layout';

const ReclaimePage = () => {
  return (
    <Layout title="ReclaiMe Champion™">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          ReclaiMe Champion™ Toolbox
        </Typography>
        <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 4 }}>
          Your dedicated hub for exclusive caregiver features and resources.
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Self-Care for Caregivers
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  Explore guided modules on preventing burnout and managing stress.
                </Typography>
                <Button variant="contained">Access Module</Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Expert Q&A Sessions
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  Watch recordings of live Q&A sessions with healthcare professionals.
                </Typography>
                <Button variant="outlined">View Sessions</Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default ReclaimePage;
