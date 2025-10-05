import { useState, useEffect } from 'react';
import { Grid, Button, Box, Typography, CircularProgress, Alert } from '@mui/material';
import { Warning as WarningIcon, VideoCall as VideoCallIcon } from '@mui/icons-material';
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
import { glassStyles, roleColors, dashboardBackgrounds } from '../../styles/glassmorphism';

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
        
        console.log('Patient Dashboard - Fetched appointments:', data);
        
        // Transform API data to component format
        const transformedAppointments: Appointment[] = data.map((apt) => ({
          id: parseInt(apt.id.substring(0, 8), 16), // Convert UUID to number for component
          doctor: apt.providerName,
          specialty: apt.specialty || 'General',
          date: new Date(apt.startTime).toLocaleDateString('en-US'),
          time: new Date(apt.startTime).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
        }));
        
        console.log('Patient Dashboard - Transformed appointments:', transformedAppointments);
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
    // In a real app, you'd get the patient's name and ID from auth context or props
    triggerAlert('John Doe', 'P001', 4); // Triggering a Level 4 alert (Code Red)
    alert('A high-priority emergency alert has been sent to your caregiver.');
  };

  const handleCallNora = () => {
    // The caregiver will be matched by their logged-in user.id in Socket.io
    // For demo, we use a known identifier that matches when caregiver logs in
    initiateCall(user?.id || 'patient-id', 'Nora');
  };

  return (
    <Box sx={{ minHeight: '100vh', background: dashboardBackgrounds.PATIENT, p: 3 }}>
      <Layout title="My Health Hub">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ 
              ...glassStyles.solidCard('PATIENT'),
              p: 4,
            }}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                Welcome back, {user?.name || 'Patient'}! 👋
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.95 }}>
                Here's your health overview for today
              </Typography>
            </Box>
          </Grid>

        {/* Call Nora Button - Glassmorphism */}
        <Grid item xs={12}>
          <Box sx={{ 
            ...glassStyles.solidCard('CAREGIVER'),
            p: 3,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
                  📹 Call Nora
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.95)' }}>
                  Click to video call Nora anytime
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="large"
                startIcon={<VideoCallIcon />}
                onClick={handleCallNora}
                sx={{
                  ...glassStyles.button,
                  bgcolor: 'white',
                  color: roleColors.CAREGIVER.primary,
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.9)',
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.2s',
                }}
              >
                Call Now
              </Button>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ 
            ...glassStyles.card,
            background: 'linear-gradient(135deg, #f44336 0%, #e91e63 100%)',
            border: '1px solid rgba(244, 67, 54, 0.3)',
            p: 2,
            color: 'white',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                <WarningIcon sx={{ mr: 1 }} />
                Emergency Assistance
              </Typography>
              <Button 
                variant="contained" 
                onClick={handleEmergencyClick}
                sx={{ 
                  ...glassStyles.button,
                  bgcolor: 'white', 
                  color: '#f44336',
                  fontWeight: 'bold',
                  '&:hover': { 
                    bgcolor: 'rgba(255,255,255,0.9)',
                    transform: 'scale(1.05)',
                  },
                }}
              >
                Request Help Now
              </Button>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ 
            ...glassStyles.cardWithTint('PATIENT', 0.15),
            p: 2, 
            display: 'flex', 
            flexDirection: 'column', 
            height: '100%',
          }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress sx={{ color: roleColors.PATIENT.primary }} />
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
            ...glassStyles.cardWithTint('PATIENT', 0.15),
            p: 2, 
            display: 'flex', 
            flexDirection: 'column', 
            height: '100%',
          }}>
            <RecentMessages messages={messagesData} />
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <MyWellnessPlan />
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ 
            ...glassStyles.cardWithTint('PATIENT', 0.15),
            p: 3,
          }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: roleColors.PATIENT.primary }}>
              📊 My Health Summary
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <HealthSummary metrics={healthSummaryData} />
              </Grid>
              <Grid item xs={12} md={6}>
                <HealthDataChart data={healthChartData} />
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ 
            ...glassStyles.cardWithTint('PATIENT', 0.15),
            p: 3,
          }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: roleColors.PATIENT.primary }}>
              🤖 AI Health Insights
            </Typography>
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


