import { Typography, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../components/layout/Layout';

const WeeklyMenuPage = () => {
  const navigate = useNavigate();

  return (
    <Layout title="Weekly Menu">
      <Paper sx={{ p: 3 }}>
        <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          Back
        </Button>
        <Typography variant="h5" gutterBottom>
          Weekly Menu
        </Typography>
        <Typography>
          This is where the weekly menu planner will be implemented, customized for the patient's culture and medical needs.
        </Typography>
      </Paper>
    </Layout>
  );
};

export default WeeklyMenuPage;
