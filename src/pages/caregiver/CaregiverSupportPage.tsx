import { Typography, Box, Button, Grid, Card, CardContent, CardActions } from '@mui/material';
import { Phone as PhoneIcon, VideoCall as VideoCallIcon, Psychology as PsychologyIcon, MenuBook as MenuBookIcon, Forum as ForumIcon, SelfImprovement as SelfImprovementIcon } from '@mui/icons-material';
import Layout from '../../components/layout/Layout';

const CaregiverSupportPage = () => {
  return (
    <Layout title="Caregiver Support">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Caregiver Support
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
        Your well-being matters too. Access dedicated hospital support and mental health services tailored to caregivers. 
        </Typography>

        <Grid container spacing={4}>
          {/* Card 1 */}
          <Grid item xs={12} md={6}>
            <Box sx={{ background: '#4A7C6E', borderRadius: '16px', height: '100%' }}>
              <Card sx={{ background: 'transparent', boxShadow: 'none', height: '100%', display: 'flex', flexDirection: 'column', color: 'white', p: 1 }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="h2" gutterBottom>
                    Contact Hospital Support
                  </Typography>
                  <Typography>
                  Reach out to our caregiver support team anytime, 24/7. Whether you need help navigating resources, have questions, or simply need someone to talk to, we’re here to guide you through every step of the caregiving journey.                </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  <Button startIcon={<PhoneIcon />} variant="contained" size="large" sx={{ backgroundColor: 'white', color: '#2D4A43', '&:hover': { backgroundColor: 'grey.200' } }}>
                    Call Support
                  </Button>
                </CardActions>
              </Card>
            </Box>
          </Grid>

          {/* Card 2 */}
          <Grid item xs={12} md={6}>
            <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                Caregiver Wellness Check-Ins
                </Typography>
                <Typography color="text.secondary">
                You're not alone. Because caregiving can be draining, check-in with our licensed professionals for medical advice, mental health support, and empathic counseling. Use our built-in selfie check-in feature to share special and rare moments anytime!                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button startIcon={<VideoCallIcon />} variant="contained" size="large">
                  Virtual Wellness Check-in
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* Card 3 */}
          <Grid item xs={12} md={6}>
            <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                Mental Health and Emotional Support
                </Typography>
                <Typography color="text.secondary">
                Access dedicated support services, including stress management tools and coping resources to help you stay strong, centered, and cope with the emotional challenges of caregiving.                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button startIcon={<PsychologyIcon />} variant="contained" size="large">
                  Explore Mental Health Support
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* Card 4 */}
          <Grid item xs={12} md={6}>
            <Box sx={{ background: '#4A7C6E', borderRadius: '16px', height: '100%' }}>
              <Card sx={{ background: 'transparent', boxShadow: 'none', height: '100%', display: 'flex', flexDirection: 'column', color: 'white', p: 1 }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="h2" gutterBottom>
                    Educational Materials
                  </Typography>
                  <Typography>
                    Browse our library of articles, guides, and videos on various caregiving topics, from managing medications to understanding specific health conditions.
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  <Button startIcon={<MenuBookIcon />} variant="contained" size="large" sx={{ backgroundColor: 'white', color: '#2D4A43', '&:hover': { backgroundColor: 'grey.200' } }}>
                    Access Learning Center
                  </Button>
                </CardActions>
              </Card>
            </Box>
          </Grid>

          {/* Card 5 */}
          <Grid item xs={12} md={6}>
            <Box sx={{ background: '#4A7C6E', borderRadius: '16px', height: '100%' }}>
              <Card sx={{ background: 'transparent', boxShadow: 'none', height: '100%', display: 'flex', flexDirection: 'column', color: 'white', p: 1 }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="h2" gutterBottom>
                    Caregiver Community Forum
                  </Typography>
                  <Typography>
                    Connect with other caregivers in a safe and supportive online community. Share experiences, ask for advice, and build a network of peers who understand.
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  <Button startIcon={<ForumIcon />} variant="contained" size="large" sx={{ backgroundColor: 'white', color: '#2D4A43', '&:hover': { backgroundColor: 'grey.200' } }}>
                    Join the Forum
                  </Button>
                </CardActions>
              </Card>
            </Box>
          </Grid>

          {/* Card 6 */}
          <Grid item xs={12} md={6}>
            <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  Respite Care Services
                </Typography>
                <Typography color="text.secondary">
                  Find trusted local respite care providers to give you a much-needed break. Taking time for yourself is essential for your well-being.
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button startIcon={<SelfImprovementIcon />} variant="contained" size="large">
                  Find Respite Care
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default CaregiverSupportPage;
