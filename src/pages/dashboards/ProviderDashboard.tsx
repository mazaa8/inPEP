import { Grid, Alert, Typography, Button, Box } from '@mui/material';
import DashboardCard from '../../components/dashboards/provider/DashboardCard';
import { useEmergencyAlert } from '../../context/EmergencyAlertContext';
import Layout from '../../components/layout/Layout';
import PatientList from '../../components/dashboards/provider/PatientList';
import PatientOverview from '../../components/dashboards/provider/PatientOverview';
import CommunicationHub from '../../components/dashboards/provider/CommunicationHub';
import PatientJourneys from '../../components/dashboards/provider/PatientJourneys';
import WelcomeMessage from '../../components/dashboards/provider/WelcomeMessage';
import QuickActions from '../../components/dashboards/provider/QuickActions';
import PatientDirectory from '../../components/provider/PatientDirectory';
import AIIntelligenceWidget from '../../components/dashboards/provider/AIIntelligenceWidget';

const ProviderDashboard = () => {
  const { isEscalated, patientName, patientId, alertLevel, resetAlert } = useEmergencyAlert();

  const getAlertTitle = (level: number) => {
    if (level === 4) return 'Escalated Patient Alert! (Code Red)';
    if (level === 3) return 'Escalated Patient Alert! (Code Orange)';
    return 'Escalated Patient Alert!';
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f1419 0%, #1a1f2e 30%, #2d1f1a 70%, #3d2a1f 100%)',
      position: 'relative',
    }}>
      <Layout title="" darkMode={true} themeColor="PROVIDER">
        <Grid container spacing={3}>
        {isEscalated && (
          <Grid item xs={12}>
            <Alert
              severity="error"
              action={
                <Button color="inherit" size="small" onClick={resetAlert}>
                  ACKNOWLEDGE & DISMISS
                </Button>
              }
              sx={{ 
                '.MuiAlert-message': { width: '100%' },
                background: 'rgba(211, 47, 47, 0.2)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(244, 67, 54, 0.5)',
                color: '#fff',
                '& .MuiAlert-icon': { color: '#ff5252' },
              }}
            >
              <Typography variant="h6" sx={{ color: '#fff' }}>{getAlertTitle(alertLevel)}</Typography>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>Patient: <strong>{patientName} (ID: {patientId})</strong> requires immediate attention. This alert has been escalated by the caregiver.</Typography>
            </Alert>
          </Grid>
        )}
        {/* Welcome Message */}
        <Grid item xs={12}>
          <WelcomeMessage />
        </Grid>

        {/* AI Intelligence Widget - NEW! */}
        <Grid item xs={12}>
          <AIIntelligenceWidget />
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <QuickActions />
        </Grid>

        {/* Patient Overview Widgets */}
        <Grid item xs={12}>
          <PatientOverview />
        </Grid>

        {/* Main Content Grid */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            {/* Communication Hub */}
            <Grid item xs={12}>
              <DashboardCard title="Communication Hub">
                <CommunicationHub />
              </DashboardCard>
            </Grid>
            {/* Patient Journeys */}
            <Grid item xs={12}>
              <DashboardCard title="Patient & Caregiver Journeys">
                <PatientJourneys />
              </DashboardCard>
            </Grid>
          </Grid>
        </Grid>

        {/* Right Sidebar */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={3}>
            {/* Patient Directory */}
            <Grid item xs={12}>
              <PatientDirectory />
            </Grid>
          </Grid>
        </Grid>
        </Grid>
      </Layout>
    </Box>
  );
};

export default ProviderDashboard;
