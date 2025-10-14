import { useState } from 'react';
import {
  Typography,
  Box,
  Avatar,
  Chip,
  Stack,
  Grid,
  Card,
  TextField,
  CardContent,
  IconButton,
  Divider,
} from '@mui/material';
import {
  WorkspacePremium,
  Edit,
  Save,
  Person,
  Phone,
  Email,
  Spa,
  Book,
  Group,
  LocationOn,
  Cake,
  Badge,
} from '@mui/icons-material';
import CaregiverPageWrapper from '../../components/layout/CaregiverPageWrapper';
import { roleColors } from '../../styles/glassmorphism';

// Mock data for the profile page
const initialProfileData = {
  name: 'Nora White',
  role: 'Caregiver',
  dateOfBirth: 'March 15, 1985',
  location: 'Boston, MA',
  memberSince: 'January 2023',
  bio: 'Dedicated and compassionate caregiver with over 5 years of experience in providing personalized care. Passionate about creating a positive and supportive environment for patients.',
  contact: {
    phone: '(555) 123-4567',
    email: 'nora.white@example.com',
  },
  certifications: ['CPR Certified', 'First Aid Trained', 'Certified Nursing Assistant (CNA)', 'Dementia Care Specialist'],
  supportNetwork: [
    { name: 'Shaza Zeinelabdin', relation: 'Sister', phone: '(555) 987-6543' },
    { name: 'Haysam Zeinelabdin', relation: 'Brother', phone: '(555) 555-5555' },
  ],
  selfCarePlan: 'Morning meditation for 10 minutes\nWeekly yoga class on Wednesdays\nRead for 30 minutes before bed\nWeekly coffee with friends',
  journalEntry: 'Today was a challenging but rewarding day. We managed to go for a short walk in the park, and the fresh air seemed to lift both of our spirits. It\'s the small moments like these that make it all worthwhile.',
};

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(initialProfileData);
  const [isEditing, setIsEditing] = useState(false);
  const handleInputChange = (field: string, value: string) => {
    // A real implementation would handle nested fields more robustly
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <CaregiverPageWrapper
      title="My Profile"
      subtitle="Manage your personal information and preferences"
      icon={<Person />}
    >
      {/* Profile Header Card */}
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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Avatar sx={{
                width: 100,
                height: 100,
                background: roleColors.CAREGIVER.gradient,
                fontSize: '2.5rem',
                fontWeight: 700,
                boxShadow: '0 8px 24px rgba(76, 175, 80, 0.3)',
              }}>
                {profileData.name.split(' ').map(n => n[0]).join('')}
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: roleColors.CAREGIVER.primary, mb: 0.5 }}>
                  {profileData.name}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <Chip
                    icon={<WorkspacePremium />}
                    label="ReclaiMe Champion™"
                    sx={{
                      background: roleColors.CAREGIVER.gradient,
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                  <Chip
                    label={profileData.role}
                    sx={{
                      bgcolor: '#e8f5e9',
                      color: roleColors.CAREGIVER.primary,
                      fontWeight: 600,
                    }}
                  />
                </Stack>
                <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Cake sx={{ fontSize: 18, color: roleColors.CAREGIVER.primary }} />
                    <Typography variant="body2" color="text.secondary">{profileData.dateOfBirth}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LocationOn sx={{ fontSize: 18, color: roleColors.CAREGIVER.primary }} />
                    <Typography variant="body2" color="text.secondary">{profileData.location}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Badge sx={{ fontSize: 18, color: roleColors.CAREGIVER.primary }} />
                    <Typography variant="body2" color="text.secondary">Member since {profileData.memberSince}</Typography>
                  </Box>
                </Stack>
              </Box>
            </Box>
            <IconButton 
              onClick={() => setIsEditing(!isEditing)}
              sx={{
                bgcolor: isEditing ? '#4caf50' : 'rgba(76, 175, 80, 0.1)',
                color: isEditing ? 'white' : roleColors.CAREGIVER.primary,
                '&:hover': {
                  bgcolor: isEditing ? '#43a047' : 'rgba(76, 175, 80, 0.2)',
                },
              }}
            >
              {isEditing ? <Save /> : <Edit />}
            </IconButton>
          </Box>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} md={6}>
          {/* About Me Card */}
          <Card sx={{
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            borderRadius: '20px',
            boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1)',
            mb: 3,
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Person sx={{ color: roleColors.CAREGIVER.primary }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: roleColors.CAREGIVER.primary }}>
                  About Me
                </Typography>
              </Box>
              <TextField
                label="Bio"
                multiline
                rows={4}
                fullWidth
                value={profileData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                disabled={!isEditing}
                variant="outlined"
                sx={{ mb: 3 }}
              />

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: roleColors.CAREGIVER.primary, mb: 2 }}>
                Contact Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Phone sx={{ color: roleColors.CAREGIVER.primary }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Phone</Typography>
                    <Typography variant="body1">{profileData.contact.phone}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Email sx={{ color: roleColors.CAREGIVER.primary }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Email</Typography>
                    <Typography variant="body1">{profileData.contact.email}</Typography>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: roleColors.CAREGIVER.primary, mb: 2 }}>
                Skills & Certifications
              </Typography>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                {profileData.certifications.map((cert, index) => (
                  <Chip 
                    key={index} 
                    label={cert} 
                    sx={{
                      bgcolor: '#e8f5e9',
                      color: roleColors.CAREGIVER.primary,
                      fontWeight: 600,
                      border: '1px solid #c8e6c9',
                    }}
                  />
                ))}
              </Stack>
            </CardContent>
          </Card>

          {/* Journal Card */}
          <Card sx={{
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            borderRadius: '20px',
            boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1)',
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Book sx={{ color: roleColors.CAREGIVER.primary }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: roleColors.CAREGIVER.primary }}>
                  My Caregiving Journal
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Private space for your thoughts and reflections
              </Typography>
              <TextField
                label="Today's Entry"
                multiline
                rows={6}
                fullWidth
                value={profileData.journalEntry}
                onChange={(e) => handleInputChange('journalEntry', e.target.value)}
                disabled={!isEditing}
                variant="outlined"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={6}>
          {/* Support Network Card */}
          <Card sx={{
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            borderRadius: '20px',
            boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1)',
            mb: 3,
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Group sx={{ color: roleColors.CAREGIVER.primary }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: roleColors.CAREGIVER.primary }}>
                  My Support Network
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {profileData.supportNetwork.map((person, index) => (
                  <Box 
                    key={index}
                    sx={{
                      p: 2,
                      borderRadius: '12px',
                      bgcolor: '#e8f5e9',
                      border: '1px solid #c8e6c9',
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: roleColors.CAREGIVER.primary }}>
                      {person.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {person.relation}
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                      <Phone sx={{ fontSize: 16 }} />
                      {person.phone}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Self-Care Plan Card */}
          <Card sx={{
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            borderRadius: '20px',
            boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1)',
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Spa sx={{ color: roleColors.CAREGIVER.primary }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: roleColors.CAREGIVER.primary }}>
                  Self-Care Plan
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Your personal wellness routine
              </Typography>
              <TextField
                label="My Plan for Wellness"
                multiline
                rows={6}
                fullWidth
                value={profileData.selfCarePlan}
                onChange={(e) => handleInputChange('selfCarePlan', e.target.value)}
                disabled={!isEditing}
                variant="outlined"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </CaregiverPageWrapper>
  );
};

export default ProfilePage;
