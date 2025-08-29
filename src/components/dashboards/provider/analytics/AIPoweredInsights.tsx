import { Paper, Typography, Grid } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

// Placeholder data
const recoveryData = [
  { name: 'Week 1', progress: 65 },
  { name: 'Week 2', progress: 70 },
  { name: 'Week 3', progress: 78 },
  { name: 'Week 4', progress: 85 },
];

const readmissionData = [
  { month: 'Jan', rate: 5.2 },
  { month: 'Feb', rate: 4.8 },
  { month: 'Mar', rate: 4.9 },
  { month: 'Apr', rate: 4.5 },
  { month: 'May', rate: 4.2 },
  { month: 'Jun', rate: 3.9 },
];

const satisfactionData = [
    { subject: 'Communication', A: 85, fullMark: 100 },
    { subject: 'Care Quality', A: 90, fullMark: 100 },
    { subject: 'Education', A: 75, fullMark: 100 },
    { subject: 'Responsiveness', A: 80, fullMark: 100 },
    { subject: 'Overall', A: 88, fullMark: 100 },
];

const caregiverEffectivenessData = [
    { name: 'Adherence', score: 92 },
    { name: 'Engagement', score: 88 },
    { name: 'Reported Stress', score: 75 },
    { name: 'Task Completion', score: 95 },
];


const AIPoweredInsights = () => {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>AI-Powered Insights</Typography>
      <Grid container spacing={4}>
        {/* Data Visualizations */}
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>Post-Discharge Recovery Metrics</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={recoveryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="progress" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>Readmission Trends</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={readmissionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="rate" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>Patient Satisfaction</Typography>
           <ResponsiveContainer width="100%" height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={satisfactionData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis />
              <Radar name="Satisfaction" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>Caregiver Effectiveness</Typography>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart layout="vertical" data={caregiverEffectivenessData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={120} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="score" fill="#ffc658" />
                </BarChart>
            </ResponsiveContainer>
        </Grid>

        {/* Predictive Analytics */}
        <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Predictive Analytics</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2, backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
                <Typography variant="subtitle1" gutterBottom>Predictive Readmission Risk</Typography>
                <Typography variant="body1">
                    Based on current trends, the aggregate readmission risk for the patient cohort is projected to decrease by <strong>5%</strong> over the next quarter.
                </Typography>
            </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2, backgroundColor: 'secondary.light', color: 'secondary.contrastText' }}>
                <Typography variant="subtitle1" gutterBottom>Health Outcomes Forecast</Typography>
                <Typography variant="body1">
                    Patients adhering to their care plans are <strong>20%</strong> more likely to report improved health outcomes within 30 days post-discharge.
                </Typography>
            </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AIPoweredInsights;
