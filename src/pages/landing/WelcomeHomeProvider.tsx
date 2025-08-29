import { Box, Typography, Container, Grid, Paper, Button, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import ForumIcon from '@mui/icons-material/Forum';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import TimelineIcon from '@mui/icons-material/Timeline';
import { useNavigate } from 'react-router-dom';
import { Diversity2, Healing, MonitorHeart } from '@mui/icons-material';

const HeroBox = styled(Box)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(10, 2),
  textAlign: 'center',
  marginBottom: theme.spacing(6),
}));

const FeaturePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: theme.shape.borderRadius * 2,
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  boxShadow: theme.shadows[3],
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[12],
  },
}));

const FeatureAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  width: theme.spacing(7),
  height: theme.spacing(7),
  marginBottom: theme.spacing(2),
}));

const WelcomeHomeProvider = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      <HeroBox>
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
            The Future of Patient Engagement is Here
          </Typography>
          <Typography variant="h5" component="p" sx={{ mb: 4 }}>
          Empowering hospitals with intelligent AI-driven tools and real-time insights to deliver seamless personalized care that unites patients, caregivers, providers, and insurers across the entire healthcare ecosystem.          </Typography>
          <Button variant="contained" color="secondary" size="large" onClick={() => navigate('/dashboard/provider')}>
            Go to Your Dashboard
          </Button>
        </Container>
      </HeroBox>

      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom>
            Built for Well-connected Healthcare Teams
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
          A unified platform designed to foster trust, drive results, and integrate effortlessly into your existing workflows.          </Typography>
        </Box>

                <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={6}>
                        <FeaturePaper>
              <FeatureAvatar>
                <Diversity2 fontSize="large" />
              </FeatureAvatar>
              <Typography variant="h6" component="h3" fontWeight="bold" gutterBottom>
              Unified Communication & Care Coordination
              </Typography>
              <Typography variant="body1" color="text.secondary">
              Engage patients, caregivers, and insurers effortlessly through a secure, unified channel that streamlines care plan management, supports adherence monitoring, and fosters real-time collaboration to reduce readmissions and achieve superior post-discharge outcomes.              </Typography>
            </FeaturePaper>
          </Grid>
          <Grid item xs={12} md={6}>
                        <FeaturePaper>
              <FeatureAvatar>
                <IntegrationInstructionsIcon fontSize="large" />
              </FeatureAvatar>
              <Typography variant="h6" component="h3" fontWeight="bold" gutterBottom>
              Seamless EMR Integration
              </Typography>
              <Typography variant="body1" color="text.secondary">
              Our platform syncs seamlessly with your existing EMR systems, ensuring consistent data flow and enabling all teams to work efficiently without disruption.              </Typography>
            </FeaturePaper>
          </Grid>
          <Grid item xs={12} md={6}>
                        <FeaturePaper>
              <FeatureAvatar>
                <Healing fontSize="large" />
              </FeatureAvatar>
              <Typography variant="h6" component="h3" fontWeight="bold" gutterBottom>
              Personalized Patient & Caregiver Journeys
              </Typography>
              <Typography variant="body1" color="text.secondary">
              Guide each patient’s full post-discharge recovery with personalized care pathways, culturally tailored healthy meal plans, and dedicated tools that support caregivers, both in their personal well-being and caregiving responsibilities.              </Typography>
            </FeaturePaper>
          </Grid>
          <Grid item xs={12} md={6}>
                        <FeaturePaper>
              <FeatureAvatar>
                <TimelineIcon fontSize="large" />
              </FeatureAvatar>
              <Typography variant="h6" component="h3" fontWeight="bold" gutterBottom>
              AI-Powered Advanced Analytics & Reporting
                            </Typography>
              <Typography variant="body1" color="text.secondary">
              Deliver favorable outcomes for all stakeholders by harnessing AI-driven insights to personalize post-discharge care plans, monitor patient progress, trigger real-time risk alerts, and facilitate collaboration with caregivers and insurers to reduce readmissions and improve long-term health outcomes.              </Typography>
            </FeaturePaper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default WelcomeHomeProvider;
