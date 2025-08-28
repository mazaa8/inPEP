import { Box, Typography, Button, Card, CardContent, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../components/layout/Layout';

const ChampionCornerPage = () => {
  const navigate = useNavigate();
  return (
    <Layout title="Champion Corner">
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to the Champion Corner
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Championing the caregiver voice in the healing journey.
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  What is a ReclaiMe Champion™?
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  You are the heart of the healing journey. A ReclaiMe Champion™ is a caregiver who is recognized for their dedication, empowered with exclusive resources, and connected to a community that understands. It’s not about promoting a brand; it’s about elevating your voice.
                </Typography>
                <Button variant="contained" color="primary">
                  Become a Champion
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Caregiver Spotlight
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  Here we share stories of resilience, hope, and connection from caregivers just like you. Your voice matters.
                </Typography>
                <Button variant="outlined" color="primary" onClick={() => navigate('/share-your-story')}>
                  Share Your Story
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default ChampionCornerPage;
