import { Grid, Paper } from '@mui/material';
import Layout from '../../components/layout/Layout';
import UpcomingAppointments from '../../components/dashboards/patient/UpcomingAppointments';
import RecentMessages from '../../components/dashboards/patient/RecentMessages';
import HealthSummary from '../../components/dashboards/patient/HealthSummary';
import HealthDataChart from '../../components/dashboards/patient/HealthDataChart';

const PatientDashboard = () => {
  return (
    <Layout title="Patient Dashboard">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <UpcomingAppointments />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <RecentMessages />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <HealthSummary />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 2, mt: 3 }}>
            <HealthDataChart />
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default PatientDashboard;


