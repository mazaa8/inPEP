import { Grid, Paper } from '@mui/material';
import Layout from '../../components/layout/Layout';
import ClaimRequests from '../../components/dashboards/insurer/ClaimRequests';

const InsurerDashboard = () => {
  return (
    <Layout title="Insurer Dashboard">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <ClaimRequests />
          </Paper>
        </Grid>
        {/* Additional insurer components can be added here */}
      </Grid>
    </Layout>
  );
};

export default InsurerDashboard;

