import { Box } from '@mui/material';
import Layout from '../../../components/layout/Layout';
import MedicationScheduler from '../../../components/scheduling/MedicationScheduler';

const MedicationSchedulePage = () => {
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f1f8f4 0%, #e8f5e9 50%, #dcedc8 100%)',
      p: 0,
    }}>
      <Layout title="" darkMode={false} themeColor="CAREGIVER">
        <MedicationScheduler />
      </Layout>
    </Box>
  );
};

export default MedicationSchedulePage;
