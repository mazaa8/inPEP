import { Box } from '@mui/material';
import Layout from '../../components/layout/Layout';
import MealPlan from '../../components/dashboards/patient/MealPlan';

const MealPlanPage = () => {
  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)', p: 0 }}>
      <Layout title="" darkMode={true} themeColor="PATIENT">
        <MealPlan />
      </Layout>
    </Box>
  );
};

export default MealPlanPage;
