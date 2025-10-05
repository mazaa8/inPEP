import { useState, useEffect } from 'react';
import { Grid, Button, Box, Typography, CircularProgress, Alert, Avatar, Chip } from '@mui/material';
import { 
  Warning as WarningIcon, 
  VideoCall as VideoCallIcon,
  CalendarToday as CalendarIcon,
  Message as MessageIcon,
  FavoriteBorder as HeartIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';
import { useEmergencyAlert } from '../../context/EmergencyAlertContext';
import { useAuth } from '../../context/AuthContext';
import { useVideoCall } from '../../context/VideoCallContext';
import Layout from '../../components/layout/Layout';
import VideoCall from '../../components/video/VideoCall';
import UpcomingAppointments, { type Appointment } from '../../components/dashboards/patient/UpcomingAppointments';
import RecentMessages, { type Message } from '../../components/dashboards/patient/RecentMessages';
import MyWellnessPlan from '../../components/dashboards/patient/MyWellnessPlan';
import HealthSummary, { type HealthMetric } from '../../components/dashboards/patient/HealthSummary';
import HealthDataChart, { type HealthData } from '../../components/dashboards/patient/HealthDataChart';
import AIInsightsDashboard from '../../components/health/AIInsightsDashboard';
import { appointmentService } from '../../services/appointmentService';
import { roleColors } from '../../styles/glassmorphism';

const healthSummaryData: HealthMetric[] = [
  { id: 1, name: 'Blood Pressure', value: '120/80', status: 'Normal', progress: 80 },
  { id: 2, name: 'Blood Glucose', value: '95 mg/dL', status: 'Good', progress: 70 },
  { id: 3, name: 'Cholesterol', value: '180 mg/dL', status: 'Excellent', progress: 90 },
];

const healthChartData: HealthData[] = [
  { name: 'Jan', weight: 65 },
  { name: 'Feb', weight: 66 },
  { name: 'Mar', weight: 67 },
  { name: 'Apr', weight: 66 },
  { name: 'May', weight: 68 },
  { name: 'Jun', weight: 70 },
];

const messagesData: Message[] = [
  { id: 1, from: 'Dr. Smith', subject: 'Re: Your recent lab results', snippet: 'Everything looks good...', avatar: 'DS' },
  { id: 2, from: 'Clinic Admin', subject: 'Appointment Reminder', snippet: 'Your appointment is confirmed for...', avatar: 'CA' },
];

const PatientDashboard = () => {
  const { triggerAlert } = useEmergencyAlert();
  const { user } = useAuth();
  const { 
    callState, 
    initiateCall, 
    endCall,
    sendOffer,
    sendAnswer,
    sendIceCandidate,
    remoteOffer,
    remoteAnswer,
    remoteIceCandidate,
  } = useVideoCall();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const data = await appointmentService.getAppointments();
        
        const transformedAppointments: Appointment[] = data.map((apt) => ({
          id: parseInt(apt.id.substring(0, 8), 16),
          doctor: apt.providerName,
          specialty: apt.specialty || 'General',
          date: new Date(apt.startTime).toLocaleDateString('en-US'),
          time: new Date(apt.startTime).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
        }));
        
        setAppointments(transformedAppointments);
      } catch (err) {
        console.error('Failed to load appointments:', err);
        setError('Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleEmergencyClick = () => {
    triggerAlert('John Doe', 'P001', 4);
    alert('A high-priority emergency alert has been sent to your caregiver.');
  };

  const handleCallNora = () => {
    initiateCall(user?.id || 'patient-id', 'Nora');
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
      p: 0,
    }}>
      <Layout title="" darkMode={true} themeColor="PATIENT">
        <Grid container spacing={3}>
          {/* Hero Header - Dark Modern */}
          <Grid item xs={12}>
            <Box sx={{ 
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              p: 4,
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ 
                    width: 72, 
                    height: 72, 
                    background: roleColors.PATIENT.gradient,
                    fontSize: '2rem',
                    mr: 3,
                    boxShadow: `0 8px 24px ${roleColors.PATIENT.primary}40`,
                  }}>
                    {user?.name?.charAt(0) || 'A'}
                  </Avatar>
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: 'white', mb: 0.5 }}>
                      Welcome, {user?.name || 'Patient'}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </Typography>
                  </Box>
                </Box>
                <Chip 
                  label="Premium Member" 
                  sx={{ 
                    background: roleColors.PATIENT.gradient,
                    color: 'white',
                    fontWeight: 700,
                    px: 2,
                    fontSize: '0.9rem',
                  }} 
                />
              </Box>
            </Box>
          </Grid>

          {/* Call Nora - Dark Glass Card */}
          <Grid item xs={12}>
            <Box sx={{ 
              background: 'rgba(76, 175, 80, 0.1)',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
              border: '1px solid rgba(76, 175, 80, 0.3)',
              borderRadius: '24px',
              p: 4,
              boxShadow: '0 8px 32px 0 rgba(76, 175, 80, 0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 16px 48px 0 rgba(76, 175, 80, 0.3)',
                border: '1px solid rgba(76, 175, 80, 0.5)',
              },
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Box sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(76, 175, 80, 0.4)',
                  }}>
                    <VideoCallIcon sx={{ fontSize: 40, color: 'white' }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'white', mb: 0.5 }}>
                      Call Nora
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Video call your caregiver anytime
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleCallNora}
                  sx={{
                    background: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '1.2rem',
                    px: 6,
                    py: 2,
                    borderRadius: '16px',
                    boxShadow: '0 8px 24px rgba(76, 175, 80, 0.4)',
                    border: 'none',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 12px 32px rgba(76, 175, 80, 0.5)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Call Now
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Emergency Button - Dark Glass */}
          <Grid item xs={12}>
            <Box sx={{ 
              background: 'rgba(244, 67, 54, 0.1)',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
              border: '1px solid rgba(244, 67, 54, 0.3)',
              borderRadius: '20px',
              p: 3,
              boxShadow: '0 8px 32px 0 rgba(244, 67, 54, 0.2)',
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #f44336 0%, #e91e63 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 16px rgba(244, 67, 54, 0.4)',
                  }}>
                    <WarningIcon sx={{ fontSize: 32, color: 'white' }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
                      Emergency Assistance
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Get immediate help from your care team
                    </Typography>
                  </Box>
                </Box>
                <Button 
                  variant="contained" 
                  onClick={handleEmergencyClick}
                  sx={{ 
                    background: 'linear-gradient(135deg, #f44336 0%, #e91e63 100%)',
                    color: 'white',
                    fontWeight: 700,
                    px: 4,
                    py: 1.5,
                    borderRadius: '12px',
                    boxShadow: '0 4px 16px rgba(244, 67, 54, 0.4)',
                    '&:hover': { 
                      transform: 'scale(1.05)',
                      boxShadow: '0 8px 24px rgba(244, 67, 54, 0.5)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  Request Help
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Quick Stats Row - Dark Glass */}
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ 
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(33, 150, 243, 0.3)',
                  borderRadius: '20px',
                  p: 3,
                  textAlign: 'center',
                  boxShadow: '0 4px 20px rgba(33, 150, 243, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 32px rgba(33, 150, 243, 0.2)',
                  },
                }}>
                  <CalendarIcon sx={{ fontSize: 48, color: roleColors.PATIENT.secondary, mb: 1 }} />
                  <Typography variant="h3" sx={{ fontWeight: 700, color: 'white', mb: 0.5 }}>
                    {appointments.length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Upcoming Appointments
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ 
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(33, 150, 243, 0.3)',
                  borderRadius: '20px',
                  p: 3,
                  textAlign: 'center',
                  boxShadow: '0 4px 20px rgba(33, 150, 243, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 32px rgba(33, 150, 243, 0.2)',
                  },
                }}>
                  <MessageIcon sx={{ fontSize: 48, color: roleColors.PATIENT.secondary, mb: 1 }} />
                  <Typography variant="h3" sx={{ fontWeight: 700, color: 'white', mb: 0.5 }}>
                    {messagesData.length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    New Messages
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ 
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(76, 175, 80, 0.3)',
                  borderRadius: '20px',
                  p: 3,
                  textAlign: 'center',
                  boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 32px rgba(76, 175, 80, 0.2)',
                  },
                }}>
                  <HeartIcon sx={{ fontSize: 48, color: roleColors.CAREGIVER.secondary, mb: 1 }} />
                  <Typography variant="h3" sx={{ fontWeight: 700, color: 'white', mb: 0.5 }}>
                    Good
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Overall Health Status
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          {/* Main Content Cards - Dark Glass */}
          <Grid item xs={12} md={4}>
            <Box sx={{ 
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              p: 3, 
              height: '100%',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 32px rgba(33, 150, 243, 0.2)',
              },
            }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress sx={{ color: roleColors.PATIENT.secondary }} />
                </Box>
              ) : error ? (
                <Alert severity="error">{error}</Alert>
              ) : (
                <UpcomingAppointments appointments={appointments} />
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ 
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              p: 3, 
              height: '100%',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 32px rgba(33, 150, 243, 0.2)',
              },
            }}>
              <RecentMessages messages={messagesData} />
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ 
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              height: '100%',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 32px rgba(33, 150, 243, 0.2)',
              },
            }}>
              <MyWellnessPlan />
            </Box>
          </Grid>

          {/* Health Summary Section - Dark Glass */}
          <Grid item xs={12}>
            <Box sx={{ 
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              p: 4,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '12px',
                  background: roleColors.PATIENT.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                  boxShadow: `0 4px 16px ${roleColors.PATIENT.primary}40`,
                }}>
                  <TrendingIcon sx={{ fontSize: 28, color: 'white' }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                  My Health Summary
                </Typography>
              </Box>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <HealthSummary metrics={healthSummaryData} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <HealthDataChart data={healthChartData} />
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* AI Insights Section - Dark Glass */}
          <Grid item xs={12}>
            <Box sx={{ 
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              p: 4,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{ 
                  width: 56,
                  height: 56,
                  borderRadius: '14px',
                  background: roleColors.PATIENT.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                  boxShadow: `0 4px 16px ${roleColors.PATIENT.primary}40`,
                }}>
                  <Typography sx={{ fontSize: '1.8rem' }}>✨</Typography>
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                    AI Health Insights
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Personalized recommendations powered by AI
                  </Typography>
                </Box>
              </Box>
              <AIInsightsDashboard />
            </Box>
          </Grid>
        </Grid>

        {/* Video Call Dialog */}
        {callState.isInCall && (
          <VideoCall
            open={callState.isInCall}
            isInitiator={callState.isInitiator}
            remoteName={callState.remoteName || 'Nora'}
            onEndCall={endCall}
            onOffer={sendOffer}
            onAnswer={sendAnswer}
            onIceCandidate={sendIceCandidate}
            remoteOffer={remoteOffer}
            remoteAnswer={remoteAnswer}
            remoteIceCandidate={remoteIceCandidate}
          />
        )}
      </Layout>
    </Box>
  );
};

export default PatientDashboard;
