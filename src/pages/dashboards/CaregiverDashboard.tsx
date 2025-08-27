import { Grid, Paper } from '@mui/material';
import Layout from '../../components/layout/Layout';
import PatientSchedule from '../../components/dashboards/caregiver/PatientSchedule';

const CaregiverDashboard = () => {
  return (
    <Layout title="Caregiver Dashboard">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <PatientSchedule />
          </Paper>
        </Grid>
        {/* Additional caregiver components can be added here */}
      </Grid>
    </Layout>
  );
};

export default CaregiverDashboard;
