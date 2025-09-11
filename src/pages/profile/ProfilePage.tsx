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
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
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
  EmojiEvents,
  ExpandMore,
} from '@mui/icons-material';
import Layout from '../../components/layout/Layout';

// Mock data for the profile page
const initialProfileData = {
  name: 'Mourouge Zeinelabdin',
  role: 'Caregiver',
  bio: 'Dedicated and compassionate caregiver with over 5 years of experience in providing personalized care. Passionate about creating a positive and supportive environment for patients.',
  contact: {
    phone: '555-123-4567',
    email: 'mourouge@example.com',
  },
  certifications: ['CPR Certified', 'First Aid Trained', 'Certified Nursing Assistant (CNA)'],
  supportNetwork: [
    { name: 'Shaza Zeinelabdin', relation: 'Sister', phone: '555-987-6543' },
    { name: 'Haysam Zeinelabdin', relation: 'Brother', phone: '555-555-5555' },
  ],
  selfCarePlan: '- Morning meditation for 10 minutes.\n- Weekly yoga class on Wednesdays.\n- Read for 30 minutes before bed.',
  journalEntry: 'Today was a challenging but rewarding day. We managed to go for a short walk in the park, and the fresh air seemed to lift both of our spirits. It’s the small moments like these that make it all worthwhile.',
};

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(initialProfileData);
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    // A real implementation would handle nested fields more robustly
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Layout title="My ReclaiMe™ Profile">
      <Box sx={{ p: 3 }}>
        {/* Header Section */}
        <Card sx={{ mb: 3, p: 2, display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ width: 80, height: 80, mr: 3 }}>{profileData.name.charAt(0)}</Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" component="h1">{profileData.name}</Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h6" color="text.secondary">{profileData.role}</Typography>
              <Chip
                icon={<WorkspacePremium />}
                label="ReclaiMe Champion™"
                color="primary"
                variant="outlined"
                size="small"
              />
            </Stack>
          </Box>
          <IconButton onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? <Save /> : <Edit />}
          </IconButton>
        </Card>

        <Grid container spacing={3}>
          {/* Column 1 */}
          <Grid item xs={12} md={6}>
            {/* Personal & Professional Details */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Person sx={{ mr: 1 }} />
                <Typography variant="h6">Personal & Professional Details</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  label="About Me"
                  multiline
                  rows={4}
                  fullWidth
                  value={profileData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  disabled={!isEditing}
                  variant="filled"
                  sx={{
                    mb: 2,
                    '& .MuiFilledInput-root': {
                      backgroundColor: '#4A7C6E',
                      '&.Mui-disabled': {
                        backgroundColor: '#4A7C6E',
                      },
                    },
                    '& .MuiFilledInput-input': {
                      color: 'white',
                      '&.Mui-disabled': {
                        color: 'white',
                        WebkitTextFillColor: 'rgba(255, 255, 255, 1)', // Override browser default
                      },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                    '& .MuiInputLabel-root.Mui-disabled': { color: 'rgba(255, 255, 255, 0.7)' },
                    '& .MuiInputLabel-root.Mui-focused': { color: 'white' },
                  }}
                />
                <Typography variant="subtitle1" gutterBottom>Contact Information</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><Phone /></ListItemIcon>
                    <ListItemText primary="Phone" secondary={profileData.contact.phone} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Email /></ListItemIcon>
                    <ListItemText primary="Email" secondary={profileData.contact.email} />
                  </ListItem>
                </List>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>Skills & Certifications</Typography>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  {profileData.certifications.map((cert, index) => (
                    <Chip key={index} label={cert} color="success" variant="outlined" />
                  ))}
                </Stack>
              </AccordionDetails>
            </Accordion>

            {/* Community & Journey */}
            <Accordion sx={{ mt: 2 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Book sx={{ mr: 1 }} />
                <Typography variant="h6">Community & Journey</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="subtitle1" gutterBottom>My Caregiving Story (Private Journal)</Typography>
                <TextField
                  label="Today's Entry"
                  multiline
                  rows={6}
                  fullWidth
                  value={profileData.journalEntry}
                  onChange={(e) => handleInputChange('journalEntry', e.target.value)}
                  disabled={!isEditing}
                  variant="filled"
                  sx={{
                    '& .MuiFilledInput-root': {
                      backgroundColor: '#4A7C6E',
                      '&.Mui-disabled': {
                        backgroundColor: '#4A7C6E',
                      },
                    },
                    '& .MuiFilledInput-input': {
                      color: 'white',
                      '&.Mui-disabled': {
                        color: 'white',
                        WebkitTextFillColor: 'rgba(255, 255, 255, 1)', // Override browser default
                      },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                    '& .MuiInputLabel-root.Mui-disabled': { color: 'rgba(255, 255, 255, 0.7)' },
                    '& .MuiInputLabel-root.Mui-focused': { color: 'white' },
                  }}
                />
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* Column 2 */}
          <Grid item xs={12} md={6}>
            {/* Caregiver Wellness & Support */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Spa sx={{ mr: 1 }} />
                <Typography variant="h6">Caregiver Wellness & Support</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="subtitle1" gutterBottom>My Support Network</Typography>
                <List>
                  {profileData.supportNetwork.map((person, index) => (
                    <ListItem key={index}>
                      <ListItemIcon><Group /></ListItemIcon>
                      <ListItemText primary={person.name} secondary={`${person.relation} - ${person.phone}`} />
                    </ListItem>
                  ))}
                </List>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>Self-Care Plan</Typography>
                <TextField
                  label="My Plan for Wellness"
                  multiline
                  rows={4}
                  fullWidth
                  value={profileData.selfCarePlan}
                  onChange={(e) => handleInputChange('selfCarePlan', e.target.value)}
                  disabled={!isEditing}
                  variant="filled"
                  sx={{
                    '& .MuiFilledInput-root': {
                      backgroundColor: '#4A7C6E',
                      '&.Mui-disabled': {
                        backgroundColor: '#4A7C6E',
                      },
                    },
                    '& .MuiFilledInput-input': {
                      color: 'white',
                      '&.Mui-disabled': {
                        color: 'white',
                        WebkitTextFillColor: 'rgba(255, 255, 255, 1)', // Override browser default
                      },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                    '& .MuiInputLabel-root.Mui-disabled': { color: 'rgba(255, 255, 255, 0.7)' },
                    '& .MuiInputLabel-root.Mui-focused': { color: 'white' },
                  }}
                />
                 <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>Wellness Resources</Typography>
                 <Button variant="text" startIcon={<EmojiEvents />}>Managing Stress</Button>
                 <Button variant="text" startIcon={<EmojiEvents />}>Avoiding Burnout</Button>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default ProfilePage;
