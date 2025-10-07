import { Typography, Grid, Box } from '@mui/material';
import DashboardCard from './DashboardCard';
import { PieChart, Pie, Cell, ResponsiveContainer, RadialBarChart, RadialBar, Legend } from 'recharts';

// Placeholder data
const activePatients = 125;

const riskAlertsData = {
  high: 15,
  medium: 40,
  low: 70,
};

const readmissionRiskData = [
  { name: 'High Risk', value: 25, fill: '#ff4d4d' },
];

const caregiverEngagementData = [
  { name: 'Highly Engaged', value: 400 },
  { name: 'Moderately Engaged', value: 300 },
  { name: 'Low Engagement', value: 300 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];


const PatientOverview = () => {
  return (
    <Grid container spacing={3}>
      {/* Active Patients Widget */}
      <Grid item xs={12} sm={6} md={3}>
        <DashboardCard title="Active Patients">
          <Typography variant="h3" component="div" sx={{ 
            flexGrow: 1, 
            textAlign: 'center', 
            alignSelf: 'center',
            color: '#FFA726',
            fontWeight: 700,
            mt: 2,
          }}>
            {activePatients}
          </Typography>
          <Typography variant="body2" sx={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.6)', mt: 1 }}>
            Under Your Care
          </Typography>
        </DashboardCard>
      </Grid>

      {/* Risk Alerts Widget */}
      <Grid item xs={12} sm={6} md={3}>
        <DashboardCard title="Risk Alerts">
          <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: '100%' }}>
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#ff4d4d', mb: 1 }} />
              <Typography variant="h6">{riskAlertsData.high}</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#FFBB28', mb: 1 }} />
              <Typography variant="h6">{riskAlertsData.medium}</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#00C49F', mb: 1 }} />
              <Typography variant="h6">{riskAlertsData.low}</Typography>
            </Box>
          </Box>
        </DashboardCard>
      </Grid>

      {/* Readmission Risk Widget */}
      <Grid item xs={12} sm={6} md={3}>
        <DashboardCard title="Readmission Risk">
          <ResponsiveContainer width="100%" height={150}>
            <RadialBarChart 
              innerRadius="70%" 
              outerRadius="100%" 
              data={readmissionRiskData} 
              startAngle={180} 
              endAngle={0}
              barSize={20}
            >
              <RadialBar background dataKey='value' />
              <Legend iconSize={10} layout='vertical' verticalAlign='middle' align="center" />
            </RadialBarChart>
          </ResponsiveContainer>
        </DashboardCard>
      </Grid>

      {/* Caregiver Engagement Widget */}
      <Grid item xs={12} sm={6} md={3}>
        <DashboardCard title="Caregiver Engagement">
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie
                data={caregiverEngagementData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={60}
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

