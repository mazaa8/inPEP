import { Typography, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../components/layout/Layout';

const CaregivingTipsPage = () => {
  const navigate = useNavigate();

  return (
    <Layout title="Caregiving Tips">
      <Paper sx={{ p: 3 }}>
        <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          Back
        </Button>
        <Typography variant="h5" gutterBottom>
          Caregiving Tips
        </Typography>
        <Typography>
          This is where tips on care will be provided.
        </Typography>
      </Paper>
    </Layout>
  );
};

export default CaregivingTipsPage;
