import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  Avatar,
  Chip,
  IconButton,
} from '@mui/material';
import { Add, Edit, Delete, FamilyRestroom, Restaurant as HerediblesIcon } from '@mui/icons-material';
import Layout from '../../components/layout/Layout';
import { roleColors } from '../../styles/glassmorphism';

interface FamilyMember {
  id: number;
  name: string;
  relation: string;
  conditions: string[];
}

const initialFamilyData: FamilyMember[] = [
  { id: 1, name: 'John Doe', relation: 'Father', conditions: ['Heart Disease', 'Type 2 Diabetes'] },
  { id: 2, name: 'Jane Smith', relation: 'Mother', conditions: ['High Blood Pressure'] },
];

const HerediblesPage = () => {
  const [familyMembers] = useState(initialFamilyData);
  const [isAdding, setIsAdding] = useState(false);

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)', p: 0 }}>
      <Layout title="" darkMode={true} themeColor="PATIENT">
        {/* Hero Header */}
        <Box sx={{ 
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '24px',
          p: 4,
          mb: 4,
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                width: 64,
                height: 64,
                borderRadius: '16px',
                background: roleColors.PATIENT.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 8px 24px ${roleColors.PATIENT.primary}40`,
              }}>
                <HerediblesIcon sx={{ fontSize: 36, color: 'white' }} />
              </Box>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 700, color: 'white', mb: 0.5 }}>
                  Heredibles™
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  My Family Health Profile
                </Typography>
              </Box>
            </Box>
            <Button 
              variant="contained" 
              startIcon={<Add />} 
              onClick={() => setIsAdding(true)}
              sx={{
                background: roleColors.PATIENT.gradient,
                color: 'white',
                fontWeight: 700,
                px: 3,
                py: 1.5,
                borderRadius: '12px',
                boxShadow: '0 4px 16px rgba(33, 150, 243, 0.4)',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 8px 24px rgba(33, 150, 243, 0.5)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              Add Member
            </Button>
          </Box>
        </Box>

        {isAdding && (
          <Box sx={{ 
            p: 4, 
            mb: 4,
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          }}>
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 3 }}>Add New Family Member</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth 
                  label="Full Name" 
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      bgcolor: 'rgba(255,255,255,0.05)',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                      '&:hover fieldset': { borderColor: 'rgba(33, 150, 243, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: '#21CBF3' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#21CBF3' },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth 
                  label="Relation (e.g., Mother, Father, Sibling)" 
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      bgcolor: 'rgba(255,255,255,0.05)',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                      '&:hover fieldset': { borderColor: 'rgba(33, 150, 243, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: '#21CBF3' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#21CBF3' },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  fullWidth 
                  label="Health Conditions (comma-separated)" 
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      bgcolor: 'rgba(255,255,255,0.05)',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                      '&:hover fieldset': { borderColor: 'rgba(33, 150, 243, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: '#21CBF3' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#21CBF3' },
                  }}
                />
              </Grid>
              <Grid item xs={12} sx={{ textAlign: 'right' }}>
                <Button 
                  onClick={() => setIsAdding(false)} 
                  sx={{ 
                    mr: 2,
                    color: 'rgba(255,255,255,0.7)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  variant="contained"
                  sx={{
                    background: roleColors.PATIENT.gradient,
                    color: 'white',
                    fontWeight: 700,
                    px: 3,
                    boxShadow: '0 4px 16px rgba(33, 150, 243, 0.4)',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 8px 24px rgba(33, 150, 243, 0.5)',
                    },
                  }}
                >
                  Save Member
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}

        <Grid container spacing={3}>
          {familyMembers.map((member) => (
            <Grid item xs={12} md={6} key={member.id}>
              <Box sx={{ 
                p: 3,
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 32px rgba(33, 150, 243, 0.2)',
                  border: '1px solid rgba(33, 150, 243, 0.3)',
                },
              }}>
                <Avatar sx={{ 
                  width: 64, 
                  height: 64, 
                  mr: 2.5,
                  background: roleColors.PATIENT.gradient,
                  boxShadow: `0 4px 16px ${roleColors.PATIENT.primary}40`,
                }}>
                  <FamilyRestroom sx={{ fontSize: 32 }} />
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 0.5 }}>
                    {member.name}
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 1.5 }}>
                    {member.relation}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {member.conditions.map((condition, index) => (
                      <Chip 
                        key={index} 
                        label={condition} 
                        size="small" 
                        sx={{ 
                          bgcolor: 'rgba(33, 150, 243, 0.2)',
                          color: '#21CBF3',
                          fontWeight: 600,
                          border: '1px solid rgba(33, 150, 243, 0.3)',
                        }} 
                      />
                    ))}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <IconButton 
                    size="small"
                    sx={{
                      color: '#21CBF3',
                      bgcolor: 'rgba(33, 150, 243, 0.1)',
                      '&:hover': {
                        bgcolor: 'rgba(33, 150, 243, 0.2)',
                        transform: 'scale(1.1)',
                      },
                    }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small"
                    sx={{
                      color: '#f44336',
                      bgcolor: 'rgba(244, 67, 54, 0.1)',
                      '&:hover': {
                        bgcolor: 'rgba(244, 67, 54, 0.2)',
                        transform: 'scale(1.1)',
                      },
                    }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Layout>
    </Box>
  );
};

export default HerediblesPage;
