import { Box, Typography, Grid, Paper } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const costTrendData = [
  { name: 'Jan', cost: 4000 },
  { name: 'Feb', cost: 3000 },
  { name: 'Mar', cost: 5000 },
  { name: 'Apr', cost: 4500 },
  { name: 'May', cost: 6000 },
  { name: 'Jun', cost: 5500 },
];

const costBreakdownData = [
  { name: 'Inpatient', value: 400000 },
  { name: 'Outpatient', value: 300000 },
  { name: 'Pharmacy', value: 200000 },
  { name: 'Emergency', value: 100000 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const FinancialAnalytics = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>Financial Analytics</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 300 }}>
            <Typography variant="h6">Cost Trend</Typography>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={costTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="cost" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 300 }}>
            <Typography variant="h6">Cost Breakdown by Service</Typography>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={costBreakdownData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                  {costBreakdownData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FinancialAnalytics;
