import { Typography, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../components/layout/Layout';

const AppointmentsBillingPage = () => {
  const navigate = useNavigate();

  return (
    <Layout title="Appointments & Billing">
      <Paper sx={{ p: 3 }}>
        <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          Back
        </Button>
        <Typography variant="h5" gutterBottom>
          Appointments & Billing
        </Typography>
        <Typography>
          This is where appointments and billing information will be managed.
        </Typography>
      </Paper>
    </Layout>
  );
};

export default AppointmentsBillingPage;
