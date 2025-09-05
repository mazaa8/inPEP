import { Grid, Alert, Typography, Button } from '@mui/material';
import DashboardCard from '../../components/dashboards/provider/DashboardCard';
import { useEmergencyAlert } from '../../context/EmergencyAlertContext';
import Layout from '../../components/layout/Layout';
import PatientList from '../../components/dashboards/provider/PatientList';
import PatientOverview from '../../components/dashboards/provider/PatientOverview';
import CommunicationHub from '../../components/dashboards/provider/CommunicationHub';
import PatientJourneys from '../../components/dashboards/provider/PatientJourneys';
import WelcomeMessage from '../../components/dashboards/provider/WelcomeMessage';
import QuickActions from '../../components/dashboards/provider/QuickActions';
import EMRIntegration from '../../components/dashboards/provider/EMRIntegration';

const ProviderDashboard = () => {
  const { isEscalated, patientName, patientId, alertLevel, resetAlert } = useEmergencyAlert();

  const getAlertTitle = (level: number) => {
    if (level === 4) return 'Escalated Patient Alert! (Code Red)';
    if (level === 3) return 'Escalated Patient Alert! (Code Orange)';
    return 'Escalated Patient Alert!';
  };

  return (
    <Layout title="Provider Dashboard">
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
              sx={{ '.MuiAlert-message': { width: '100%' } }}
            >
              <Typography variant="h6">{getAlertTitle(alertLevel)}</Typography>
              <Typography>Patient: <strong>{patientName} (ID: {patientId})</strong> requires immediate attention. This alert has been escalated by the caregiver.</Typography>
            </Alert>
          </Grid>
        )}
        {/* Welcome Message */}
        <Grid item xs={12}>
          <WelcomeMessage />
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
            {/* Patient List */}
            <Grid item xs={12}>
              <DashboardCard title="Patient List">
                <PatientList />
              </DashboardCard>
            </Grid>
            {/* EMR Integration */}
            <Grid item xs={12}>
              <DashboardCard title="Seamless EMR Integration">
                <EMRIntegration />
              </DashboardCard>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default ProviderDashboard;
