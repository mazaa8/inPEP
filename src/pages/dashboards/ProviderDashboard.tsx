import { Grid, Paper } from '@mui/material';
import Layout from '../../components/layout/Layout';
import PatientList from '../../components/dashboards/provider/PatientList';
import PatientOverview from '../../components/dashboards/provider/PatientOverview';
import CommunicationHub from '../../components/dashboards/provider/CommunicationHub';
import PatientJourneys from '../../components/dashboards/provider/PatientJourneys';
import WelcomeMessage from '../../components/dashboards/provider/WelcomeMessage';
import QuickActions from '../../components/dashboards/provider/QuickActions';
import EMRIntegration from '../../components/dashboards/provider/EMRIntegration';

const ProviderDashboard = () => {
  return (
    <Layout>
      <Grid container spacing={3}>
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

        {/* Left Column */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <CommunicationHub />
            </Grid>
            <Grid item xs={12}>
              <PatientJourneys />
            </Grid>
            <Grid item xs={12}>
              <EMRIntegration />
            </Grid>
          </Grid>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <PatientList />
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default ProviderDashboard;
