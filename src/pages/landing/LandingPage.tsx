import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Box,
  Paper,
  Avatar,
  Fade,
  Grow
} from '@mui/material';
import {
  Person as PatientIcon,
  FamilyRestroom as CaregiverIcon,
  LocalHospital as HospitalIcon,
  Business as InsurerIcon,
  ArrowForward as ArrowIcon
} from '@mui/icons-material';

const LandingPage = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const roles = [
    {
      id: 'patient',
      title: 'Patient',
      subtitle: 'Access your medical records and health information',
      description: 'View medical history, appointments, prescriptions, and manage your healthcare journey',
      icon: PatientIcon,
      color: '#2196F3', // Blue
      gradient: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
      features: ['Health Records', 'Health Tracking', 'Appointments & Billing', 'Virtual Care']
    },
    {
      id: 'caregiver',
      title: 'Caregiver',
      subtitle: 'Smart patient care management',
      description: 'Monitor patient health, manage care plans, and coordinate with healthcare providers',
      icon: CaregiverIcon,
      color: '#4CAF50', // Green
      gradient: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)',
      features: ['Remote Patient Monitor', 'Care Coordination', 'Caregiver Support']
    },
    {
      id: 'hospital',
      title: 'Healthcare Provider',
      subtitle: 'Healthcare management',
      description: 'Manage patients, staff, resources, and hospital operations efficiently',
      icon: HospitalIcon,
      color: '#FF9800', // Orange
      gradient: 'linear-gradient(135deg, #FF9800 0%, #FFC107 100%)',
      features: ['Patient Management', 'Staff Coordination', 'Resource Planning', 'Analytics']
    },
    {
      id: 'insurer',
      title: 'Health Insurer',
      subtitle: 'Health insurance management',
      description: 'Process claims, manage policies, assess risks, and analyze healthcare costs',
      icon: InsurerIcon,
      color: '#9C27B0', // Purple
      gradient: 'linear-gradient(135deg, #9C27B0 0%, #E91E63 100%)',
      features: ['Claims Processing', 'Policy Management', 'Risk Assessment', 'Analytics']
    }
  ];

  const handleRoleSelect = (roleId: string) => {
    // Store selected role in sessionStorage to pass to login
    sessionStorage.setItem('selectedRole', roleId);
    navigate('/login');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        py: 4
      }}
    >
      <Container maxWidth="lg">
        <Fade in timeout={1000}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                mb: 2,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              InPEP™ Healthcare Dashboard
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: 'rgba(255,255,255,0.9)',
                mb: 4,
                textShadow: '0 1px 2px rgba(0,0,0,0.2)'
              }}
            >
              Choose your profile to access your personalized dashboard
            </Typography>
          </Box>
        </Fade>

                                                                <Grid container sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', m: -2 }}>
          {roles.map((role, index) => (
            <Grid item key={role.id} sx={{ width: { xs: '100%', sm: '50%', md: '50%' }, p: 2 }}>
              <Grow in timeout={1000 + (index * 200)}>
                <Card
                  elevation={hoveredCard === role.id ? 20 : 8}
                  onMouseEnter={() => setHoveredCard(role.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  sx={{
                    height: 400, // Fixed height for all cards
                    minHeight: 400, // Ensure minimum height
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: hoveredCard === role.id ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: role.gradient,
                      transform: hoveredCard === role.id ? 'scaleX(1)' : 'scaleX(0)',
                      transformOrigin: 'left',
                      transition: 'transform 0.3s ease'
                    }
                  }}
                >
                  <CardActionArea
                    onClick={() => handleRoleSelect(role.id)}
                    sx={{ height: '100%', p: 0, flex: 1, display: 'flex', flexDirection: 'column' }}
                  >
                    <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      {/* Icon and Title */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Avatar
                          sx={{
                            width: 64,
                            height: 64,
                            background: role.gradient,
                            mr: 3,
                            transition: 'transform 0.3s ease',
                            transform: hoveredCard === role.id ? 'rotate(5deg) scale(1.1)' : 'rotate(0deg) scale(1)'
                          }}
                        >
                          <role.icon sx={{ fontSize: 32, color: 'white' }} />
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography
                            variant="h4"
                            component="h2"
                            sx={{
                              fontWeight: 'bold',
                              color: 'text.primary',
                              mb: 0.5
                            }}
                          >
                            {role.title}
                          </Typography>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              color: role.color,
                              fontWeight: 'medium'
                            }}
                          >
                            {role.subtitle}
                          </Typography>
                        </Box>
                        <ArrowIcon
                          sx={{
                            color: role.color,
                            transition: 'transform 0.3s ease',
                            transform: hoveredCard === role.id ? 'translateX(8px)' : 'translateX(0px)'
                          }}
                        />
                      </Box>

                      {/* Description */}
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'text.secondary',
                          mb: 3,
                          lineHeight: 1.6
                        }}
                      >
                        {role.description}
                      </Typography>

                      {/* Features */}
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: 'text.primary',
                            fontWeight: 'bold',
                            mb: 2
                          }}
                        >
              
                        </Typography>
                        <Grid container spacing={1}>
                          {role.features.map((feature, idx) => (
                                                                                    <Grid item xs={6} key={idx}>
                              <Paper
                                elevation={0}
                                sx={{
                                  p: 1,
                                  backgroundColor: `${role.color}15`,
                                  border: `1px solid ${role.color}30`,
                                  borderRadius: 2,
                                  transition: 'all 0.3s ease',
                                  transform: hoveredCard === role.id ? 'scale(1.05)' : 'scale(1)'
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: role.color,
                                    fontWeight: 'medium',
                                    display: 'block',
                                    textAlign: 'center'
                                  }}
                                >
                                  {feature}
                                </Typography>
                              </Paper>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>

                      {/* Call to Action */}
                      <Box
                        sx={{
                          mt: 3,
                          p: 2,
                          background: hoveredCard === role.id ? role.gradient : 'transparent',
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          border: `2px solid ${hoveredCard === role.id ? 'transparent' : role.color}30`
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: hoveredCard === role.id ? 'white' : role.color,
                            fontWeight: 'bold',
                            textAlign: 'center',
                            transition: 'color 0.3s ease'
                          }}
                        >
                          Click to Continue as {role.title}
                        </Typography>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>

        {/* Footer */}
        <Fade in timeout={2000}>
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255,255,255,0.7)',
                textShadow: '0 1px 2px rgba(0,0,0,0.2)'
              }}
            >
              © 2025 Indigo International • Comprehensive Healthcare Management • All Rights Reserved
            </Typography>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default LandingPage;
