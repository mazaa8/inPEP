import { useState, useEffect } from 'react';
import { Grid, Paper, Button, Box, Typography, CircularProgress, Alert } from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';
import { useEmergencyAlert } from '../../context/EmergencyAlertContext';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/layout/Layout';
import UpcomingAppointments, { type Appointment } from '../../components/dashboards/patient/UpcomingAppointments';
import RecentMessages, { type Message } from '../../components/dashboards/patient/RecentMessages';
import { Link } from 'react-router-dom';
import MyWellnessPlan from '../../components/dashboards/patient/MyWellnessPlan';
import HealthSummary, { type HealthMetric } from '../../components/dashboards/patient/HealthSummary';
import HealthDataChart, { type HealthData } from '../../components/dashboards/patient/HealthDataChart';
import AIInsightsDashboard from '../../components/health/AIInsightsDashboard';
import { appointmentService } from '../../services/appointmentService';

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

  return (
    <Layout title="My Health Hub">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <Typography variant="h4" gutterBottom>
              Welcome back, {user?.name || 'Patient'}!
            </Typography>
            <Typography variant="body1">
              Here's your health overview for today
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, backgroundColor: 'error.main', color: 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                <WarningIcon sx={{ mr: 1 }} />
                Emergency Assistance
              </Typography>
              <Button variant="contained" color="error" sx={{ backgroundColor: 'white', color: 'error.main', '&:hover': { backgroundColor: '#fce4e4' } }} onClick={handleEmergencyClick}>
                Request Help Now
              </Button>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error">{error}</Alert>
            ) : (
              <UpcomingAppointments appointments={appointments} />
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <RecentMessages messages={messagesData} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <MyWellnessPlan />
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
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
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
              🤖 AI Health Insights
            </Typography>
            <AIInsightsDashboard />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" component="div">
              Weekly Meal Plan
            </Typography>
            <Button component={Link} to="/patient/meal-plan" variant="contained">
              View Plan
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default PatientDashboard;


