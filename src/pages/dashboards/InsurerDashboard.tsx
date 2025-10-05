import { useState, useEffect } from 'react';
import { Box, Tabs, Tab, Typography, Grid, Button } from '@mui/material';
import { Refresh as RefreshIcon, Analytics as AnalyticsIcon } from '@mui/icons-material';
import Layout from '../../components/layout/Layout';
import KeyMetricsOverview from '../../components/insurer/KeyMetricsOverview';
import ClaimsTable from '../../components/insurer/ClaimsTable';
import RiskAssessmentList from '../../components/insurer/RiskAssessmentList';
import { insurerService, type DashboardOverview, type Claim, type RiskAssessment } from '../../services/insurerService';
import { People, MonetizationOn, MedicalServices, Search } from '@mui/icons-material';
import { roleColors } from '../../styles/glassmorphism';

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
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #faf8ff 0%, #f0ebff 50%, #e8deff 100%)',
      p: 0,
    }}>
      <Layout title="" darkMode={false} themeColor="INSURER">
        <Box sx={{ width: '100%' }}>
          {/* Hero Header */}
          <Box sx={{ 
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            borderRadius: '24px',
            p: 4,
            mb: 4,
            boxShadow: '0 8px 32px 0 rgba(156, 39, 176, 0.15)',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                  width: 72,
                  height: 72,
                  borderRadius: '18px',
                  background: roleColors.INSURER.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 8px 24px ${roleColors.INSURER.primary}40`,
                }}>
                  <AnalyticsIcon sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: '#4a148c', mb: 0.5 }}>
                    Analytics Dashboard
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(74, 20, 140, 0.7)' }}>
                    Monitor member health and manage claims
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={fetchDashboardData}
                sx={{
                  background: roleColors.INSURER.gradient,
                  color: 'white',
                  fontWeight: 700,
                  px: 3,
                  py: 1.5,
                  borderRadius: '12px',
                  boxShadow: '0 4px 16px rgba(156, 39, 176, 0.4)',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 8px 24px rgba(156, 39, 176, 0.5)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                Refresh
              </Button>
            </Box>
          </Box>

          {/* Key Metrics Overview */}
          <Box sx={{ mb: 4 }}>
            <KeyMetricsOverview data={overview} loading={loading} />
          </Box>

          {/* Tabbed Content */}
          <Box sx={{ 
            background: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(156, 39, 176, 0.1)',
          }}>
            <Box sx={{ borderBottom: '1px solid rgba(156, 39, 176, 0.1)', px: 2 }}>
              <Tabs 
                value={value} 
                onChange={handleChange} 
                aria-label="insurer dashboard tabs"
                sx={{
                  '& .MuiTab-root': {
                    color: 'rgba(74, 20, 140, 0.7)',
                    fontWeight: 600,
                    '&.Mui-selected': {
                      color: roleColors.INSURER.primary,
                    },
                  },
                  '& .MuiTabs-indicator': {
                    background: roleColors.INSURER.gradient,
                    height: 3,
                  },
                }}
              >
                <Tab icon={<People />} label="Overview" />
                <Tab icon={<MonetizationOn />} label="Claims Management" />
                <Tab icon={<MedicalServices />} label="Risk Assessment" />
                <Tab icon={<Search />} label="Analytics" />
              </Tabs>
            </Box>
        
            <TabPanel value={value} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box>
                    <Typography variant="h5" sx={{ color: '#4a148c', fontWeight: 700, mb: 2 }}>
                      Welcome to inPEP Insurer Portal
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(74, 20, 140, 0.8)', mb: 4 }}>
                      Monitor member health, manage claims, and identify cost-saving opportunities through AI-powered analytics.
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ 
                          p: 3,
                          background: 'rgba(33, 150, 243, 0.08)',
                          backdropFilter: 'blur(10px)',
                          WebkitBackdropFilter: 'blur(10px)',
                          border: '1px solid rgba(33, 150, 243, 0.2)',
                          borderRadius: '16px',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 8px 24px rgba(33, 150, 243, 0.2)',
                          },
                        }}>
                          <Typography variant="h6" sx={{ color: '#2196F3', fontWeight: 700, mb: 1 }}>
                            Real-Time Monitoring
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(74, 20, 140, 0.8)' }}>
                            Track member health metrics and receive instant alerts for high-risk patients
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ 
                          p: 3,
                          background: 'rgba(156, 39, 176, 0.08)',
                          backdropFilter: 'blur(10px)',
                          WebkitBackdropFilter: 'blur(10px)',
                          border: '1px solid rgba(156, 39, 176, 0.2)',
                          borderRadius: '16px',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 8px 24px rgba(156, 39, 176, 0.2)',
                          },
                        }}>
                          <Typography variant="h6" sx={{ color: '#9C27B0', fontWeight: 700, mb: 1 }}>
                            Predictive Analytics
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(74, 20, 140, 0.8)' }}>
                            AI-powered risk scoring identifies patients likely to need intervention
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ 
                          p: 3,
                          background: 'rgba(76, 175, 80, 0.08)',
                          backdropFilter: 'blur(10px)',
                          WebkitBackdropFilter: 'blur(10px)',
                          border: '1px solid rgba(76, 175, 80, 0.2)',
                          borderRadius: '16px',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 8px 24px rgba(76, 175, 80, 0.2)',
                          },
                        }}>
                          <Typography variant="h6" sx={{ color: '#4CAF50', fontWeight: 700, mb: 1 }}>
                            Cost Optimization
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(74, 20, 140, 0.8)' }}>
                            Preventive care programs reduce expensive emergency interventions
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </TabPanel>
        
            <TabPanel value={value} index={1}>
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" sx={{ color: '#4a148c', fontWeight: 700 }}>Claims Management</Typography>
                <Button 
                  variant="contained" 
                  onClick={() => fetchClaims()}
                  sx={{
                    background: roleColors.INSURER.gradient,
                    color: 'white',
                    fontWeight: 700,
                    boxShadow: '0 4px 16px rgba(156, 39, 176, 0.3)',
                  }}
                >
                  Refresh Claims
                </Button>
              </Box>
              <ClaimsTable claims={claims} loading={claimsLoading} />
            </TabPanel>
        
            <TabPanel value={value} index={2}>
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" sx={{ color: '#4a148c', fontWeight: 700 }}>Risk Assessment</Typography>
                <Button 
                  variant="contained" 
                  onClick={fetchRiskAssessments}
                  sx={{
                    background: roleColors.INSURER.gradient,
                    color: 'white',
                    fontWeight: 700,
                    boxShadow: '0 4px 16px rgba(156, 39, 176, 0.3)',
                  }}
                >
                  Refresh Assessments
                </Button>
              </Box>
              <RiskAssessmentList assessments={riskAssessments} loading={riskLoading} />
            </TabPanel>
        
            <TabPanel value={value} index={3}>
              <Box sx={{ 
                p: 6, 
                textAlign: 'center',
                background: 'rgba(156, 39, 176, 0.05)',
                borderRadius: '16px',
                border: '1px dashed rgba(156, 39, 176, 0.3)',
              }}>
                <AnalyticsIcon sx={{ fontSize: 80, color: 'rgba(156, 39, 176, 0.4)', mb: 2 }} />
                <Typography variant="h5" sx={{ color: '#4a148c', fontWeight: 700, mb: 1 }}>
                  Advanced Analytics
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(74, 20, 140, 0.7)' }}>
                  Detailed analytics and reporting features coming soon
                </Typography>
              </Box>
            </TabPanel>
          </Box>
        </Box>
      </Layout>
    </Box>
  );
};

export default InsurerDashboard;
