import { Typography, Box, Button, Grid, Avatar } from '@mui/material';
import { Phone as PhoneIcon, VideoCall as VideoCallIcon, Psychology as PsychologyIcon, MenuBook as MenuBookIcon, Forum as ForumIcon, SelfImprovement as SelfImprovementIcon } from '@mui/icons-material';
import Layout from '../../components/layout/Layout';
import { roleColors } from '../../styles/glassmorphism';

const CaregiverSupportPage = () => {
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f1f8f4 0%, #e8f5e9 50%, #dcedc8 100%)',
      p: 0,
    }}>
      <Layout title="" darkMode={false} themeColor="CAREGIVER">
        {/* Hero Header */}
        <Box sx={{ 
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          borderRadius: '24px',
          p: 4,
          mb: 4,
          boxShadow: '0 8px 32px 0 rgba(76, 175, 80, 0.15)',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              width: 72,
              height: 72,
              borderRadius: '18px',
              background: roleColors.CAREGIVER.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 8px 24px ${roleColors.CAREGIVER.primary}40`,
            }}>
              <PsychologyIcon sx={{ fontSize: 40, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#1b5e20', mb: 0.5 }}>
                Caregiver Support
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(27, 94, 32, 0.7)' }}>
                Your well-being matters too. Access dedicated support and mental health services.
              </Typography>
            </Box>
          </Box>
        </Box>

        <Grid container spacing={4}>
          {/* Card 1 */}
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              background: roleColors.CAREGIVER.gradient,
              borderRadius: '20px',
              height: '100%',
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: `0 8px 32px ${roleColors.CAREGIVER.primary}30`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 12px 40px ${roleColors.CAREGIVER.primary}40`,
              },
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <PhoneIcon sx={{ fontSize: 32, color: 'white' }} />
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                  Contact Hospital Support
                </Typography>
              </Box>
              <Typography sx={{ color: 'rgba(255,255,255,0.95)', mb: 3, flexGrow: 1 }}>
                Reach out to our caregiver support team anytime, 24/7. Whether you need help navigating resources, have questions, or simply need someone to talk to, we're here to guide you through every step of the caregiving journey.
              </Typography>
              <Button 
                startIcon={<PhoneIcon />} 
                variant="contained" 
                size="large" 
                sx={{ 
                  backgroundColor: 'white', 
                  color: roleColors.CAREGIVER.primary,
                  fontWeight: 700,
                  '&:hover': { 
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                Call Support
              </Button>
            </Box>
          </Grid>

          {/* Card 2 */}
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              borderRadius: '20px',
              height: '100%',
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 32px rgba(76, 175, 80, 0.15)',
              },
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(76, 175, 80, 0.15)', width: 56, height: 56 }}>
                  <VideoCallIcon sx={{ fontSize: 32, color: roleColors.CAREGIVER.primary }} />
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1b5e20' }}>
                  Caregiver Wellness Check-Ins
                </Typography>
              </Box>
              <Typography sx={{ color: 'rgba(27, 94, 32, 0.8)', mb: 3, flexGrow: 1 }}>
                You're not alone. Because caregiving can be draining, check-in with our licensed professionals for medical advice, mental health support, and empathic counseling. Use our built-in selfie check-in feature to share special and rare moments anytime!
              </Typography>
              <Button 
                startIcon={<VideoCallIcon />} 
                variant="contained" 
                size="large"
                sx={{
                  background: roleColors.CAREGIVER.gradient,
                  color: 'white',
                  fontWeight: 700,
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                Virtual Wellness Check-in
              </Button>
            </Box>
          </Grid>

          {/* Card 3 */}
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              borderRadius: '20px',
              height: '100%',
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 32px rgba(76, 175, 80, 0.15)',
              },
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(76, 175, 80, 0.15)', width: 56, height: 56 }}>
                  <PsychologyIcon sx={{ fontSize: 32, color: roleColors.CAREGIVER.primary }} />
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1b5e20' }}>
                  Mental Health Support
                </Typography>
              </Box>
              <Typography sx={{ color: 'rgba(27, 94, 32, 0.8)', mb: 3, flexGrow: 1 }}>
                Access dedicated support services, including stress management tools and coping resources to help you stay strong, centered, and cope with the emotional challenges of caregiving.
              </Typography>
              <Button 
                startIcon={<PsychologyIcon />} 
                variant="contained" 
                size="large"
                sx={{
                  background: roleColors.CAREGIVER.gradient,
                  color: 'white',
                  fontWeight: 700,
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                Explore Mental Health Support
              </Button>
            </Box>
          </Grid>

          {/* Card 4 */}
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              background: roleColors.CAREGIVER.gradient,
              borderRadius: '20px',
              height: '100%',
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: `0 8px 32px ${roleColors.CAREGIVER.primary}30`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 12px 40px ${roleColors.CAREGIVER.primary}40`,
              },
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <MenuBookIcon sx={{ fontSize: 32, color: 'white' }} />
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                  Educational Materials
                </Typography>
              </Box>
              <Typography sx={{ color: 'rgba(255,255,255,0.95)', mb: 3, flexGrow: 1 }}>
                Browse our library of articles, guides, and videos on various caregiving topics, from managing medications to understanding specific health conditions.
              </Typography>
              <Button 
                startIcon={<MenuBookIcon />} 
                variant="contained" 
                size="large" 
                sx={{ 
                  backgroundColor: 'white', 
                  color: roleColors.CAREGIVER.primary,
                  fontWeight: 700,
                  '&:hover': { 
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                Access Learning Center
              </Button>
            </Box>
          </Grid>

          {/* Card 5 */}
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              background: roleColors.CAREGIVER.gradient,
              borderRadius: '20px',
              height: '100%',
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: `0 8px 32px ${roleColors.CAREGIVER.primary}30`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 12px 40px ${roleColors.CAREGIVER.primary}40`,
              },
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <ForumIcon sx={{ fontSize: 32, color: 'white' }} />
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                  Caregiver Community Forum
                </Typography>
              </Box>
              <Typography sx={{ color: 'rgba(255,255,255,0.95)', mb: 3, flexGrow: 1 }}>
                Connect with other caregivers in a safe and supportive online community. Share experiences, ask for advice, and build a network of peers who understand.
              </Typography>
              <Button 
                startIcon={<ForumIcon />} 
                variant="contained" 
                size="large" 
                sx={{ 
                  backgroundColor: 'white', 
                  color: roleColors.CAREGIVER.primary,
                  fontWeight: 700,
                  '&:hover': { 
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                Join the Forum
              </Button>
            </Box>
          </Grid>

          {/* Card 6 */}
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              borderRadius: '20px',
              height: '100%',
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 32px rgba(76, 175, 80, 0.15)',
              },
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(76, 175, 80, 0.15)', width: 56, height: 56 }}>
                  <SelfImprovementIcon sx={{ fontSize: 32, color: roleColors.CAREGIVER.primary }} />
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1b5e20' }}>
                  Respite Care Services
                </Typography>
              </Box>
              <Typography sx={{ color: 'rgba(27, 94, 32, 0.8)', mb: 3, flexGrow: 1 }}>
                Find trusted local respite care providers to give you a much-needed break. Taking time for yourself is essential for your well-being.
              </Typography>
              <Button 
                startIcon={<SelfImprovementIcon />} 
                variant="contained" 
                size="large"
                sx={{
                  background: roleColors.CAREGIVER.gradient,
                  color: 'white',
                  fontWeight: 700,
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                Find Respite Care
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Layout>
    </Box>
  );
};

export default CaregiverSupportPage;
