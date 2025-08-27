import { Typography, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../components/layout/Layout';

const PaymentMethodsPage = () => {
  const navigate = useNavigate();

  return (
    <Layout title="Payment Methods">
      <Paper sx={{ p: 3 }}>
        <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          Back
        </Button>
        <Typography variant="h5" gutterBottom>
          Payment Methods
        </Typography>
        <Typography>
          This is where payment methods will be managed.
        </Typography>
      </Paper>
    </Layout>
  );
};

export default PaymentMethodsPage;
