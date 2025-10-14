import { Typography, Grid, Card, CardContent, Button, Box, Avatar, LinearProgress, Chip, Divider } from '@mui/material';
import { 
  WorkspacePremium as ChampionIcon,
  SelfImprovement as SelfCareIcon,
  Psychology as MentalHealthIcon,
  Favorite as HeartIcon,
  EmojiEvents as TrophyIcon,
  LocalFireDepartment as StreakIcon,
  Star as StarIcon,
  VideoLibrary as VideoIcon,
  Article as ArticleIcon,
  Group as CommunityIcon,
  TrendingUp as ProgressIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import CaregiverPageWrapper from '../../components/layout/CaregiverPageWrapper';
import { roleColors } from '../../styles/glassmorphism';

const ReclaimePage = () => {
  // Mock data - in production, this would come from API
  const caregiverProfile = {
    name: 'Nora White',
    level: 'Champion Level 3',
    points: 2450,
    nextLevelPoints: 3000,
    streak: 12,
    completedModules: 8,
    totalModules: 15,
    badges: ['Self-Care Master', 'Stress Warrior', 'Wellness Champion'],
  };

  return (
    <CaregiverPageWrapper
      title="I'm a ReclaiMe™ Champion"
      subtitle="Your personal wellness journey and caregiver development hub"
      icon={<ChampionIcon />}
    >
      {/* Profile Stats Card */}
      <Card sx={{
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.8)',
        borderRadius: '20px',
        boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1)',
        mb: 4,
      }}>
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={3} alignItems="center">
            {/* Avatar and Name */}
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    background: roleColors.CAREGIVER.gradient,
                    fontSize: '3rem',
                    fontWeight: 700,
                    boxShadow: '0 8px 24px rgba(76, 175, 80, 0.3)',
                  }}
                >
                  NW
                </Avatar>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: roleColors.CAREGIVER.primary }}>
                    {caregiverProfile.name}
                  </Typography>
                  <Chip 
                    icon={<TrophyIcon />}
                    label={caregiverProfile.level}
                    sx={{
                      mt: 1,
                      background: roleColors.CAREGIVER.gradient,
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                </Box>
              </Box>
            </Grid>

            {/* Stats Grid */}
            <Grid item xs={12} md={9}>
              <Grid container spacing={2}>
                {/* Points Progress */}
                <Grid item xs={12}>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                        Champion Points
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                        {caregiverProfile.points} / {caregiverProfile.nextLevelPoints}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={(caregiverProfile.points / caregiverProfile.nextLevelPoints) * 100}
                      sx={{
                        height: 12,
                        borderRadius: 6,
                        bgcolor: '#e8f5e9',
                        '& .MuiLinearProgress-bar': {
                          background: roleColors.CAREGIVER.gradient,
                          borderRadius: 6,
                        },
                      }}
                    />
                  </Box>
                </Grid>

                {/* Stat Cards */}
                <Grid item xs={6} sm={3}>
                  <Box sx={{
                    p: 2,
                    borderRadius: '12px',
                    bgcolor: '#fff8e1',
                    border: '2px solid #ffecb3',
                    textAlign: 'center',
                  }}>
                    <StreakIcon sx={{ fontSize: 32, color: '#f57c00', mb: 1 }} />
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#f57c00' }}>
                      {caregiverProfile.streak}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#e65100', fontWeight: 600 }}>
                      Day Streak
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <Box sx={{
                    p: 2,
                    borderRadius: '12px',
                    bgcolor: '#e8f5e9',
                    border: '2px solid #c8e6c9',
                    textAlign: 'center',
                  }}>
                    <ProgressIcon sx={{ fontSize: 32, color: roleColors.CAREGIVER.primary, mb: 1 }} />
                    <Typography variant="h4" sx={{ fontWeight: 700, color: roleColors.CAREGIVER.primary }}>
                      {caregiverProfile.completedModules}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#2e7d32', fontWeight: 600 }}>
                      Modules Done
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <Box sx={{
                    p: 2,
                    borderRadius: '12px',
                    bgcolor: '#fce4ec',
                    border: '2px solid #f8bbd0',
                    textAlign: 'center',
                  }}>
                    <HeartIcon sx={{ fontSize: 32, color: '#c2185b', mb: 1 }} />
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#c2185b' }}>
                      {caregiverProfile.badges.length}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#880e4f', fontWeight: 600 }}>
                      Badges Earned
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <Box sx={{
                    p: 2,
                    borderRadius: '12px',
                    bgcolor: '#e3f2fd',
                    border: '2px solid #bbdefb',
                    textAlign: 'center',
                  }}>
                    <StarIcon sx={{ fontSize: 32, color: '#1976d2', mb: 1 }} />
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2' }}>
                      {Math.round((caregiverProfile.completedModules / caregiverProfile.totalModules) * 100)}%
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#0d47a1', fontWeight: 600 }}>
                      Completion
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* Badges Section */}
          <Divider sx={{ my: 3 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: roleColors.CAREGIVER.primary, mb: 2 }}>
              🏆 Earned Badges
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {caregiverProfile.badges.map((badge, index) => (
                <Chip
                  key={index}
                  label={badge}
                  icon={<TrophyIcon />}
                  sx={{
                    bgcolor: '#fff3e0',
                    color: '#e65100',
                    fontWeight: 600,
                    border: '2px solid #ffcc80',
                  }}
                />
              ))}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Resources Grid */}
      <Grid container spacing={3}>
        {/* Self-Care Modules */}
        <Grid item xs={12} md={4}>
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
              <Box sx={{
                width: 64,
                height: 64,
                borderRadius: '16px',
                background: roleColors.CAREGIVER.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                boxShadow: `0 8px 24px ${roleColors.CAREGIVER.primary}40`,
              }}>
                <SelfCareIcon sx={{ fontSize: 36, color: 'white' }} />
              </Box>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
                Self-Care Modules
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Guided lessons on preventing burnout, managing stress, and maintaining your wellbeing.
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <TimeIcon sx={{ fontSize: 18, color: roleColors.CAREGIVER.primary }} />
                <Typography variant="caption" sx={{ color: roleColors.CAREGIVER.primary, fontWeight: 600 }}>
                  15 interactive modules
                </Typography>
              </Box>
              <Button 
                variant="contained"
                fullWidth
                sx={{
                  background: roleColors.CAREGIVER.gradient,
                  color: 'white',
                  fontWeight: 700,
                  py: 1.5,
                  '&:hover': {
                    background: roleColors.CAREGIVER.gradient,
                    opacity: 0.9,
                  },
                }}
              >
                Continue Learning
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Mental Health Resources */}
        <Grid item xs={12} md={4}>
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
              <Box sx={{
                width: 64,
                height: 64,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #9c27b0 0%, #e91e63 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                boxShadow: '0 8px 24px rgba(156, 39, 176, 0.4)',
              }}>
                <MentalHealthIcon sx={{ fontSize: 36, color: 'white' }} />
              </Box>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
                Mental Health Hub
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Access professional counseling resources, meditation guides, and emotional support tools.
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <ArticleIcon sx={{ fontSize: 18, color: '#9c27b0' }} />
                <Typography variant="caption" sx={{ color: '#9c27b0', fontWeight: 600 }}>
                  24/7 support available
                </Typography>
              </Box>
              <Button 
                variant="outlined"
                fullWidth
                sx={{
                  borderColor: '#9c27b0',
                  color: '#9c27b0',
                  fontWeight: 700,
                  py: 1.5,
                  '&:hover': {
                    borderColor: '#9c27b0',
                    bgcolor: 'rgba(156, 39, 176, 0.05)',
                  },
                }}
              >
                Explore Resources
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Expert Q&A Sessions */}
        <Grid item xs={12} md={4}>
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
              <Box sx={{
                width: 64,
                height: 64,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                boxShadow: '0 8px 24px rgba(33, 150, 243, 0.4)',
              }}>
                <VideoIcon sx={{ fontSize: 36, color: 'white' }} />
              </Box>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
                Expert Q&A Library
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Watch recordings of live sessions with healthcare professionals and caregiving experts.
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <VideoIcon sx={{ fontSize: 18, color: '#2196f3' }} />
                <Typography variant="caption" sx={{ color: '#2196f3', fontWeight: 600 }}>
                  50+ video sessions
                </Typography>
              </Box>
              <Button 
                variant="outlined"
                fullWidth
                sx={{
                  borderColor: '#2196f3',
                  color: '#2196f3',
                  fontWeight: 700,
                  py: 1.5,
                  '&:hover': {
                    borderColor: '#2196f3',
                    bgcolor: 'rgba(33, 150, 243, 0.05)',
                  },
                }}
              >
                Watch Sessions
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Community Support */}
        <Grid item xs={12} md={6}>
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
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #ff9800 0%, #ffc107 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(255, 152, 0, 0.4)',
                }}>
                  <CommunityIcon sx={{ fontSize: 32, color: 'white' }} />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Caregiver Community
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Connect with fellow caregivers
                  </Typography>
                </Box>
              </Box>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Join our supportive community to share experiences, ask questions, and find encouragement from caregivers who understand your journey.
              </Typography>
              <Button 
                variant="contained"
                fullWidth
                sx={{
                  background: 'linear-gradient(135deg, #ff9800 0%, #ffc107 100%)',
                  color: 'white',
                  fontWeight: 700,
                  py: 1.5,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #ff9800 0%, #ffc107 100%)',
                    opacity: 0.9,
                  },
                }}
              >
                Join Community
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Wellness Tracker */}
        <Grid item xs={12} md={6}>
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
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #e91e63 0%, #f06292 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(233, 30, 99, 0.4)',
                }}>
                  <HeartIcon sx={{ fontSize: 32, color: 'white' }} />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Personal Wellness Tracker
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Monitor your self-care journey
                  </Typography>
                </Box>
              </Box>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Track your mood, stress levels, sleep quality, and self-care activities to maintain your own health while caring for others.
              </Typography>
              <Button 
                variant="outlined"
                fullWidth
                sx={{
                  borderColor: '#e91e63',
                  color: '#e91e63',
                  fontWeight: 700,
                  py: 1.5,
                  '&:hover': {
                    borderColor: '#e91e63',
                    bgcolor: 'rgba(233, 30, 99, 0.05)',
                  },
                }}
              >
                Track Wellness
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </CaregiverPageWrapper>
  );
};

export default ReclaimePage;
