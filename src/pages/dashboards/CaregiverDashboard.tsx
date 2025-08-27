import { Grid } from '@mui/material';
import Layout from '../../components/layout/Layout';
import TodaysSummary from '../../components/dashboards/caregiver/TodaysSummary';
import MedicationChecklist from '../../components/dashboards/caregiver/MedicationChecklist';
import SharedCalendar from '../../components/dashboards/caregiver/SharedCalendar';
import VitalsLog from '../../components/dashboards/caregiver/VitalsLog';

const CaregiverDashboard = () => {
  return (
    <Layout title="Caregiver Dashboard">
      <Grid container spacing={3}>
        {/* Main column for smaller components */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TodaysSummary />
            </Grid>
            <Grid item xs={12}>
              <MedicationChecklist />
            </Grid>
            <Grid item xs={12}>
              <VitalsLog />
            </Grid>
          </Grid>
        </Grid>
        {/* Larger column for the calendar */}
        <Grid item xs={12} lg={8}>
          <SharedCalendar />
        </Grid>
      </Grid>
    </Layout>
  );
};

export default CaregiverDashboard;
