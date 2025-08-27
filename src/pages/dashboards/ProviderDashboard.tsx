import { Grid, Paper } from '@mui/material';
import Layout from '../../components/layout/Layout';
import PatientList from '../../components/dashboards/provider/PatientList';

const ProviderDashboard = () => {
  return (
    <Layout title="Provider Dashboard">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <PatientList />
          </Paper>
        </Grid>
        {/* Additional provider components can be added here */}
      </Grid>
    </Layout>
  );
};

export default ProviderDashboard;
