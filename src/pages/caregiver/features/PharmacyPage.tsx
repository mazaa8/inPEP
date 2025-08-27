import { Typography, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../components/layout/Layout';

const PharmacyPage = () => {
  const navigate = useNavigate();

  return (
    <Layout title="Pharmacy & Medications">
      <Paper sx={{ p: 3 }}>
        <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          Back
        </Button>
        <Typography variant="h5" gutterBottom>
          Pharmacy & Medications
        </Typography>
        <Typography>
          This is where pharmacy contacts and medication order sheets will be managed.
        </Typography>
      </Paper>
    </Layout>
  );
};

export default PharmacyPage;
