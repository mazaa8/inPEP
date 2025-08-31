import { Box, Typography, Container, Button, Grid, Paper, Avatar, List, ListItem, ListItemText, ListItemAvatar } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { People as PeopleIcon, TrendingUp as TrendingUpIcon, Warning as WarningIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';

const HeroBox = styled(Box)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(10, 2),
  textAlign: 'center',
  marginBottom: theme.spacing(6),
}));

const KpiCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '100%',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[3],
}));

const KpiAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  width: theme.spacing(7),
  height: theme.spacing(7),
}));

const mockRiskData = [
  { name: 'Low Risk', count: 1200 },
  { name: 'Medium Risk', count: 650 },
  { name: 'High Risk', count: 250 },
  { name: 'Critical Risk', count: 75 },
];

const mockAlerts = [
  { id: 1, patientId: 'P001', details: 'Critical fall detected', timestamp: '5m ago' },
  { id: 2, patientId: 'P023', details: 'Abnormal heart rate pattern', timestamp: '1h ago' },
  { id: 3, patientId: 'P101', details: 'Medication non-adherence for 3 days', timestamp: '4h ago' },
];

const WelcomeHomeInsurer = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      <HeroBox>
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
            Insurer Intelligence Hub
          </Typography>
          <Typography variant="h5" component="p" sx={{ mb: 4 }}>
            Actionable insights to manage risk, improve outcomes, and reduce costs across your member population.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/dashboard/insurer')}
          >
            Go to Analytics Dashboard
          </Button>
        </Container>
      </HeroBox>

      <Container maxWidth="xl" sx={{ pb: 6 }}>
        <Grid container spacing={4}>
          {/* KPIs */}
          <Grid item xs={12} md={3}>
            <KpiCard>
              <Box>
                <Typography variant="h4" fontWeight="bold">15,480</Typography>
                <Typography color="text.secondary">Total Members</Typography>
              </Box>
              <KpiAvatar><PeopleIcon /></KpiAvatar>
            </KpiCard>
          </Grid>
          <Grid item xs={12} md={3}>
            <KpiCard>
              <Box>
                <Typography variant="h4" fontWeight="bold">325</Typography>
                <Typography color="text.secondary">High/Critical Risk Members</Typography>
              </Box>
              <KpiAvatar><TrendingUpIcon /></KpiAvatar>
            </KpiCard>
          </Grid>
          <Grid item xs={12} md={3}>
            <KpiCard>
              <Box>
                <Typography variant="h4" fontWeight="bold">12</Typography>
                <Typography color="text.secondary">Preventable Readmissions (Last 30d)</Typography>
              </Box>
              <KpiAvatar><WarningIcon sx={{ color: 'orange' }} /></KpiAvatar>
            </KpiCard>
          </Grid>
          <Grid item xs={12} md={3}>
            <KpiCard>
              <Box>
                <Typography variant="h4" fontWeight="bold">$1.2M</Typography>
                <Typography color="text.secondary">Potential Savings Identified</Typography>
              </Box>
              <KpiAvatar sx={{ backgroundColor: 'green' }}><TrendingUpIcon /></KpiAvatar>
            </KpiCard>
          </Grid>

          {/* Population Risk Overview */}
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: 3, height: '400px', borderRadius: 2 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>Population Risk Overview</Typography>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockRiskData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill={theme.palette.primary.main} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Recent High-Risk Alerts */}
          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 3, height: '400px', borderRadius: 2 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>Recent High-Risk Alerts</Typography>
              <List>
                {mockAlerts.map((alert) => (
                  <ListItem key={alert.id} disablePadding>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'error.main' }}>
                        <WarningIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`Patient ${alert.patientId}: ${alert.details}`}
                      secondary={alert.timestamp}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default WelcomeHomeInsurer;
