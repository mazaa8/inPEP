import { useState, useEffect } from 'react';
import { Box, Tabs, Tab, Typography, Paper, Grid, Button } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import Layout from '../../components/layout/Layout';
import KeyMetricsOverview from '../../components/insurer/KeyMetricsOverview';
import ClaimsTable from '../../components/insurer/ClaimsTable';
import RiskAssessmentList from '../../components/insurer/RiskAssessmentList';
import { insurerService, type DashboardOverview, type Claim, type RiskAssessment } from '../../services/insurerService';
import { People, MonetizationOn, MedicalServices, Search } from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`insurer-tabpanel-${index}`}
      aria-labelledby={`insurer-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const InsurerDashboard = () => {
  const [value, setValue] = useState(0);
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimsLoading, setClaimsLoading] = useState(false);
  const [riskLoading, setRiskLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const overviewData = await insurerService.getDashboardOverview();
      setOverview(overviewData);
    } catch (error) {
      console.error('Failed to load dashboard overview:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClaims = async (status?: string) => {
    try {
      setClaimsLoading(true);
      const data = await insurerService.getClaims({ status, limit: 20 });
      setClaims(data);
    } catch (error) {
      console.error('Failed to load claims:', error);
    } finally {
      setClaimsLoading(false);
    }
  };

  const fetchRiskAssessments = async () => {
    try {
      setRiskLoading(true);
      const data = await insurerService.getRiskAssessments({ limit: 10 });
      setRiskAssessments(data);
    } catch (error) {
      console.error('Failed to load risk assessments:', error);
    } finally {
      setRiskLoading(false);
    }
  };

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    
    // Load data for the selected tab
    if (newValue === 1 && claims.length === 0) {
      fetchClaims();
    } else if (newValue === 2 && riskAssessments.length === 0) {
      fetchRiskAssessments();
    }
  };

  return (
    <Layout title="Insurer Analytics Dashboard">
      <Box sx={{ width: '100%' }}>
        {/* Key Metrics Overview - Always visible */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4">Dashboard Overview</Typography>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchDashboardData}
            >
              Refresh
            </Button>
          </Box>
          <KeyMetricsOverview data={overview} loading={loading} />
        </Box>

        {/* Tabbed Content */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="insurer dashboard tabs">
            <Tab icon={<People />} label="Overview" />
            <Tab icon={<MonetizationOn />} label="Claims Management" />
            <Tab icon={<MedicalServices />} label="Risk Assessment" />
            <Tab icon={<Search />} label="Analytics" />
          </Tabs>
        </Box>
        
        <TabPanel value={value} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Welcome to inPEP Insurer Portal
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Monitor member health, manage claims, and identify cost-saving opportunities through AI-powered analytics.
                </Typography>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, bgcolor: '#e3f2fd' }}>
                      <Typography variant="h6" color="primary">
                        Real-Time Monitoring
                      </Typography>
                      <Typography variant="body2">
                        Track member health metrics and receive instant alerts for high-risk patients
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, bgcolor: '#f3e5f5' }}>
                      <Typography variant="h6" color="secondary">
                        Predictive Analytics
                      </Typography>
                      <Typography variant="body2">
                        AI-powered risk scoring identifies patients likely to need intervention
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, bgcolor: '#e8f5e9' }}>
                      <Typography variant="h6" sx={{ color: '#388e3c' }}>
                        Cost Optimization
                      </Typography>
                      <Typography variant="body2">
                        Preventive care programs reduce expensive emergency interventions
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
        
        <TabPanel value={value} index={1}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5">Claims Management</Typography>
            <Button variant="outlined" onClick={() => fetchClaims()}>
              Refresh Claims
            </Button>
          </Box>
          <ClaimsTable claims={claims} loading={claimsLoading} />
        </TabPanel>
        
        <TabPanel value={value} index={2}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5">Risk Assessment</Typography>
            <Button variant="outlined" onClick={fetchRiskAssessments}>
              Refresh Assessments
            </Button>
          </Box>
          <RiskAssessmentList assessments={riskAssessments} loading={riskLoading} />
        </TabPanel>
        
        <TabPanel value={value} index={3}>
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              Advanced Analytics
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Detailed analytics and reporting features coming soon
            </Typography>
          </Paper>
        </TabPanel>
      </Box>
    </Layout>
  );
};

export default InsurerDashboard;
