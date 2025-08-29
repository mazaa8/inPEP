import { Grid } from '@mui/material';
import Layout from '../../components/layout/Layout';
import AIPoweredInsights from '../../components/dashboards/provider/analytics/AIPoweredInsights';
import RiskAlertsFeed from '../../components/dashboards/provider/analytics/RiskAlertsFeed';

const AnalyticsPage = () => {
  return (
    <Layout>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <AIPoweredInsights />
        </Grid>
        <Grid item xs={12}>
          <RiskAlertsFeed />
        </Grid>
      </Grid>
    </Layout>
  );
};

export default AnalyticsPage;
