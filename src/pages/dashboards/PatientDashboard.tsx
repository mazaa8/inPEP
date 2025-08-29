import { Grid, Paper } from '@mui/material';
import Layout from '../../components/layout/Layout';
import UpcomingAppointments, { type Appointment } from '../../components/dashboards/patient/UpcomingAppointments';
import RecentMessages, { type Message } from '../../components/dashboards/patient/RecentMessages';
import HealthSummary, { type HealthMetric } from '../../components/dashboards/patient/HealthSummary';
import HealthDataChart, { type HealthData } from '../../components/dashboards/patient/HealthDataChart';

const appointmentsData: Appointment[] = [
  { id: 1, doctor: 'Dr. Smith', specialty: 'Cardiology', date: '2025-09-15', time: '10:00 AM' },
  { id: 2, doctor: 'Dr. Jones', specialty: 'Dermatology', date: '2025-09-22', time: '02:30 PM' },
];

const messagesData: Message[] = [
  { id: 1, from: 'Dr. Smith', subject: 'Re: Your recent lab results', snippet: 'Everything looks good...', avatar: 'DS' },
  { id: 2, from: 'Clinic Admin', subject: 'Appointment Reminder', snippet: 'Your appointment is confirmed for...', avatar: 'CA' },
];

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

const PatientDashboard = () => {
  return (
    <Layout title="Patient Dashboard">
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <UpcomingAppointments appointments={appointmentsData} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <RecentMessages messages={messagesData} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <HealthSummary metrics={healthSummaryData} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mt: 3 }}>
            <HealthDataChart data={healthChartData} />
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default PatientDashboard;


