import { useState, useEffect } from 'react';
import { Typography, Grid, Box, CircularProgress } from '@mui/material';
import DashboardCard from './DashboardCard';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { providerService, type PatientOverviewMetrics } from '../../../services/providerService';
import { useAuth } from '../../../context/AuthContext';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const PatientOverview = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<PatientOverviewMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const data = await providerService.getPatientOverviewMetrics(user.id);
        setMetrics(data);
      } catch (error) {
        console.error('Failed to fetch patient overview metrics:', error);
        // Fallback to mock data
        setMetrics({
          activePatients: 101,
          riskAlerts: { high: 12, medium: 35, low: 54 },
          readmissionRisk: { highRisk: 18, total: 101 },
          caregiverEngagement: { highlyEngaged: 65, moderatelyEngaged: 28, lowEngagement: 8 },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [user?.id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress sx={{ color: '#FFA726' }} />
      </Box>
    );
  }

  if (!metrics) return null;

  const caregiverEngagementData = [
    { name: 'Highly Engaged', value: metrics.caregiverEngagement.highlyEngaged },
    { name: 'Moderately Engaged', value: metrics.caregiverEngagement.moderatelyEngaged },
    { name: 'Low Engagement', value: metrics.caregiverEngagement.lowEngagement },
  ];

  return (
    <Grid container spacing={3}>
      {/* Discharged Patients Widget */}
      <Grid item xs={12} sm={6}>
        <DashboardCard title="Discharged Patients">
          <Typography variant="h3" component="div" sx={{ 
            flexGrow: 1, 
            textAlign: 'center', 
            alignSelf: 'center',
            color: '#FFA726',
            fontWeight: 700,
            mt: 2,
          }}>
            {metrics.activePatients}
          </Typography>
          <Typography variant="body2" sx={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.6)', mt: 1 }}>
            Under Your Care
          </Typography>
        </DashboardCard>
      </Grid>

      {/* Caregiver Engagement Widget */}
      <Grid item xs={12} sm={6}>
        <DashboardCard title="Caregiver Engagement">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={caregiverEngagementData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {caregiverEngagementData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </DashboardCard>
      </Grid>
    </Grid>
  );
};

export default PatientOverview;

