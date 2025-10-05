import { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Avatar,
  Button,
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  VideoCall as VideoIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import Layout from '../../components/layout/Layout';
import { appointmentService, type Appointment } from '../../services/appointmentService';
import { roleColors } from '../../styles/glassmorphism';

const PatientAppointmentsPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getAppointments();
      setAppointments(data);
    } catch (err) {
      console.error('Failed to load appointments:', err);
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)', p: 0 }}>
        <Layout title="" darkMode={true} themeColor="PATIENT">
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress sx={{ color: '#21CBF3' }} />
          </Box>
        </Layout>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)', p: 0 }}>
        <Layout title="" darkMode={true} themeColor="PATIENT">
          <Alert severity="error">{error}</Alert>
        </Layout>
      </Box>
    );
  }

  if (appointments.length === 0) {
    return (
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)', p: 0 }}>
        <Layout title="" darkMode={true} themeColor="PATIENT">
          <Box sx={{ 
            p: 6, 
            textAlign: 'center',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '20px',
            border: '1px dashed rgba(255,255,255,0.2)',
          }}>
            <CalendarIcon sx={{ fontSize: 80, color: 'rgba(33, 150, 243, 0.5)', mb: 2 }} />
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
              No Appointments Scheduled
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Your upcoming appointments will appear here
            </Typography>
          </Box>
        </Layout>
      </Box>
    );
  }

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
              <CalendarIcon sx={{ fontSize: 36, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: 'white', mb: 0.5 }}>
                My Appointments
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                View and manage your upcoming appointments
              </Typography>
            </Box>
          </Box>
        </Box>

        <Grid container spacing={3}>
        {appointments.map((appointment) => (
          <Grid item xs={12} key={appointment.id}>
            <Box sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              p: 3,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 32px rgba(33, 150, 243, 0.2)',
                border: '1px solid rgba(33, 150, 243, 0.3)',
              },
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
                  <Avatar sx={{
                    width: 56,
                    height: 56,
                    background: roleColors.PATIENT.gradient,
                    fontSize: '1.5rem',
                    fontWeight: 700,
                  }}>
                    {appointment.providerName?.charAt(0) || 'D'}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>
                      {appointment.title}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip
                        label={appointment.status}
                        size="small"
                        sx={{
                          bgcolor: appointment.status === 'CONFIRMED' ? 'rgba(76, 175, 80, 0.2)' : 
                                   appointment.status === 'SCHEDULED' ? 'rgba(255, 193, 7, 0.2)' : 
                                   appointment.status === 'CANCELLED' ? 'rgba(244, 67, 54, 0.2)' : 'rgba(33, 150, 243, 0.2)',
                          color: appointment.status === 'CONFIRMED' ? '#8BC34A' : 
                                 appointment.status === 'SCHEDULED' ? '#FFD54F' : 
                                 appointment.status === 'CANCELLED' ? '#f44336' : '#21CBF3',
                          fontWeight: 700,
                          border: 'none',
                        }}
                      />
                      {appointment.specialty && (
                        <Chip
                          label={appointment.specialty}
                          size="small"
                          sx={{
                            bgcolor: 'rgba(33, 150, 243, 0.15)',
                            color: '#21CBF3',
                            fontWeight: 600,
                            border: '1px solid rgba(33, 150, 243, 0.3)',
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '10px',
                      background: 'rgba(33, 150, 243, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <CalendarIcon sx={{ color: '#21CBF3', fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block' }}>
                        Date
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                        {formatDate(appointment.startTime)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '10px',
                      background: 'rgba(33, 150, 243, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <TimeIcon sx={{ color: '#21CBF3', fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block' }}>
                        Time
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                        {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '10px',
                      background: 'rgba(33, 150, 243, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <PersonIcon sx={{ color: '#21CBF3', fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block' }}>
                        Provider
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                        Dr. {appointment.providerName}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    {appointment.isVirtual ? (
                      <>
                        <Box sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '10px',
                          background: 'rgba(76, 175, 80, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <VideoIcon sx={{ color: '#8BC34A', fontSize: 20 }} />
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block' }}>
                            Type
                          </Typography>
                          <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                            Virtual Appointment
                          </Typography>
                        </Box>
                      </>
                    ) : (
                      <>
                        <Box sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '10px',
                          background: 'rgba(33, 150, 243, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <LocationIcon sx={{ color: '#21CBF3', fontSize: 20 }} />
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block' }}>
                            Location
                          </Typography>
                          <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                            {appointment.location || 'Location TBD'}
                          </Typography>
                        </Box>
                      </>
                    )}
                  </Box>
                </Grid>
              </Grid>

              {appointment.description && (
                <Box sx={{ mt: 3, p: 2, background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    <strong style={{ color: '#21CBF3' }}>Details:</strong> {appointment.description}
                  </Typography>
                </Box>
              )}

              {appointment.notes && (
                <Box sx={{ mt: 2, p: 2, background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    <strong style={{ color: '#21CBF3' }}>Notes:</strong> {appointment.notes}
                  </Typography>
                </Box>
              )}

              {appointment.isVirtual && appointment.meetingLink && (
                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    endIcon={<ArrowIcon />}
                    href={appointment.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      background: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)',
                      color: 'white',
                      fontWeight: 700,
                      py: 1.5,
                      borderRadius: '12px',
                      boxShadow: '0 4px 16px rgba(76, 175, 80, 0.4)',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        boxShadow: '0 8px 24px rgba(76, 175, 80, 0.5)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    Join Virtual Appointment
                  </Button>
                </Box>
              )}
            </Box>
          </Grid>
        ))}
        </Grid>
      </Layout>
    </Box>
  );
};

export default PatientAppointmentsPage;
