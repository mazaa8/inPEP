import { useState } from 'react';
import { Grid, Box, Typography, Card, CardContent, Chip, LinearProgress, Avatar, Tab, Tabs } from '@mui/material';
import { 
  TrendingUp, 
  TrendingDown, 
  Warning, 
  CheckCircle, 
  Psychology,
  Timeline,
  Insights,
  MonitorHeart
} from '@mui/icons-material';
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';
import Layout from '../../components/layout/Layout';
import { roleColors } from '../../styles/glassmorphism';

// AI-Generated Mock Data (would come from patient/caregiver dashboards)
const adherenceData = [
  { date: 'Mon', medication: 95, mealPlan: 88, vitals: 92, mood: 85, overall: 90 },
  { date: 'Tue', medication: 92, mealPlan: 90, vitals: 95, mood: 82, overall: 89 },
  { date: 'Wed', medication: 88, mealPlan: 85, vitals: 90, mood: 78, overall: 85 },
  { date: 'Thu', medication: 90, mealPlan: 92, vitals: 88, mood: 88, overall: 89 },
  { date: 'Fri', medication: 85, mealPlan: 80, vitals: 85, mood: 75, overall: 81 },
  { date: 'Sat', medication: 95, mealPlan: 95, vitals: 98, mood: 92, overall: 95 },
  { date: 'Sun', medication: 93, mealPlan: 90, vitals: 95, mood: 90, overall: 92 },
];

const patientRiskScores = [
  { id: 'P001', name: 'Abdeen White', score: 85, risk: 'low', trend: 'up', adherence: 92 },
  { id: 'P002', name: 'Sarah Johnson', score: 65, risk: 'medium', trend: 'down', adherence: 78 },
  { id: 'P003', name: 'Michael Chen', score: 45, risk: 'high', trend: 'down', adherence: 62 },
  { id: 'P004', name: 'Emma Davis', score: 90, risk: 'low', trend: 'stable', adherence: 95 },
  { id: 'P005', name: 'James Wilson', score: 55, risk: 'high', trend: 'down', adherence: 68 },
];

const behaviorPatterns = [
  { behavior: 'Medication', score: 90, fullMark: 100 },
  { behavior: 'Meal Plan', score: 85, fullMark: 100 },
  { behavior: 'Exercise', score: 75, fullMark: 100 },
  { behavior: 'Sleep', score: 80, fullMark: 100 },
  { behavior: 'Mood', score: 82, fullMark: 100 },
  { behavior: 'Vitals', score: 92, fullMark: 100 },
];

const predictiveInsights = [
  {
    patient: 'Sarah Johnson',
    prediction: 'High risk of medication non-adherence in next 48 hours',
    confidence: 87,
    factors: ['Declining mood scores', 'Missed 2 doses this week', 'Caregiver reported stress'],
    recommendation: 'Schedule check-in call, consider medication reminder adjustment',
  },
  {
    patient: 'Michael Chen',
    prediction: 'Potential hospital readmission risk within 7 days',
    confidence: 76,
    factors: ['Vitals trending downward', 'Low meal plan adherence', 'Increased pain reports'],
    recommendation: 'Urgent: Schedule in-person visit, review care plan',
  },
  {
    patient: 'James Wilson',
    prediction: 'Caregiver burnout indicators detected',
    confidence: 82,
    factors: ['Delayed wellness plan updates', 'Reduced engagement', 'Stress markers in notes'],
    recommendation: 'Reach out to caregiver, offer support resources',
  },
];

const AIAdherenceTracking = () => {
  const [tabValue, setTabValue] = useState(0);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#9e9e9e';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp sx={{ color: '#4caf50' }} />;
      case 'down': return <TrendingDown sx={{ color: '#f44336' }} />;
      default: return <TrendingUp sx={{ color: '#9e9e9e' }} />;
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f1419 0%, #1a1f2e 30%, #2d1f1a 70%, #3d2a1f 100%)',
    }}>
      <Layout title="" darkMode={true} themeColor="PROVIDER">
        {/* Hero Header */}
        <Box sx={{ 
          background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.15) 0%, rgba(255, 193, 7, 0.1) 100%)',
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 152, 0, 0.4)',
          borderRadius: '24px',
          p: 4,
          mb: 4,
          boxShadow: '0 8px 32px rgba(255, 152, 0, 0.25)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #FF9800 0%, #FFC107 100%)',
          },
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box sx={{
              width: 80,
              height: 80,
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #FF9800 0%, #FFC107 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(255, 152, 0, 0.5)',
            }}>
              <Psychology sx={{ fontSize: 48, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h3" sx={{ 
                fontWeight: 700, 
                background: 'linear-gradient(135deg, #FFB74D 0%, #FFC107 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
              }}>
                AI Adherence Intelligence
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem' }}>
                Real-time patient behavior analysis powered by machine learning
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Tabs */}
        <Box sx={{ mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={(_, newValue) => setTabValue(newValue)}
            sx={{
              '& .MuiTab-root': {
                color: 'rgba(255, 255, 255, 0.6)',
                fontWeight: 600,
                '&.Mui-selected': {
                  color: '#FFB74D',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#FFB74D',
                height: 3,
              },
            }}
          >
            <Tab label="Overview" />
            <Tab label="Predictive Analytics" />
            <Tab label="Patient Risk Scores" />
            <Tab label="Behavior Patterns" />
          </Tabs>
        </Box>

        <Grid container spacing={3}>
          {/* Overview Tab */}
          {tabValue === 0 && (
            <>
              {/* Key Metrics */}
              <Grid item xs={12} md={3}>
                <Card sx={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(76, 175, 80, 0.3)',
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px rgba(76, 175, 80, 0.15)',
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Overall Adherence
                      </Typography>
                      <CheckCircle sx={{ color: '#4caf50' }} />
                    </Box>
                    <Typography variant="h3" sx={{ color: '#4caf50', fontWeight: 700, mb: 1 }}>
                      89%
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TrendingUp sx={{ color: '#4caf50', fontSize: 20 }} />
                      <Typography variant="body2" sx={{ color: '#4caf50' }}>
                        +5% from last week
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={3}>
                <Card sx={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 152, 0, 0.3)',
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px rgba(255, 152, 0, 0.15)',
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        High Risk Patients
                      </Typography>
                      <Warning sx={{ color: '#ff9800' }} />
                    </Box>
                    <Typography variant="h3" sx={{ color: '#ff9800', fontWeight: 700, mb: 1 }}>
                      3
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      Require immediate attention
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={3}>
                <Card sx={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(33, 150, 243, 0.3)',
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px rgba(33, 150, 243, 0.15)',
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        AI Predictions
                      </Typography>
                      <Insights sx={{ color: '#2196f3' }} />
                    </Box>
                    <Typography variant="h3" sx={{ color: '#2196f3', fontWeight: 700, mb: 1 }}>
                      12
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      Active interventions suggested
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={3}>
                <Card sx={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(156, 39, 176, 0.3)',
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px rgba(156, 39, 176, 0.15)',
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Data Points Analyzed
                      </Typography>
                      <Timeline sx={{ color: '#9c27b0' }} />
                    </Box>
                    <Typography variant="h3" sx={{ color: '#9c27b0', fontWeight: 700, mb: 1 }}>
                      2.4K
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      Last 7 days
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Adherence Trends Chart */}
              <Grid item xs={12} lg={8}>
                <Card sx={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 152, 0, 0.3)',
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px rgba(255, 152, 0, 0.15)',
                  p: 3,
                }}>
                  <Typography variant="h6" sx={{ color: '#FFB74D', fontWeight: 700, mb: 3 }}>
                    Weekly Adherence Trends
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={adherenceData}>
                      <defs>
                        <linearGradient id="colorOverall" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FF9800" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#FF9800" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorMedication" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4caf50" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#4caf50" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                      <XAxis dataKey="date" stroke="rgba(255, 255, 255, 0.6)" />
                      <YAxis stroke="rgba(255, 255, 255, 0.6)" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                          border: '1px solid rgba(255, 152, 0, 0.3)',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                      <Area type="monotone" dataKey="overall" stroke="#FF9800" fillOpacity={1} fill="url(#colorOverall)" />
                      <Area type="monotone" dataKey="medication" stroke="#4caf50" fillOpacity={1} fill="url(#colorMedication)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>
              </Grid>

              {/* Behavior Radar */}
              <Grid item xs={12} lg={4}>
                <Card sx={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 152, 0, 0.3)',
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px rgba(255, 152, 0, 0.15)',
                  p: 3,
                }}>
                  <Typography variant="h6" sx={{ color: '#FFB74D', fontWeight: 700, mb: 3 }}>
                    Behavior Analysis
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={behaviorPatterns}>
                      <PolarGrid stroke="rgba(255, 255, 255, 0.2)" />
                      <PolarAngleAxis dataKey="behavior" stroke="rgba(255, 255, 255, 0.6)" />
                      <PolarRadiusAxis stroke="rgba(255, 255, 255, 0.4)" />
                      <Radar name="Score" dataKey="score" stroke="#FF9800" fill="#FF9800" fillOpacity={0.6} />
                    </RadarChart>
                  </ResponsiveContainer>
                </Card>
              </Grid>
            </>
          )}

          {/* Predictive Analytics Tab */}
          {tabValue === 1 && (
            <Grid item xs={12}>
              <Typography variant="h5" sx={{ color: '#FFB74D', fontWeight: 700, mb: 3 }}>
                AI-Powered Predictive Insights
              </Typography>
              {predictiveInsights.map((insight, index) => (
                <Card key={index} sx={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 152, 0, 0.3)',
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px rgba(255, 152, 0, 0.15)',
                  p: 3,
                  mb: 3,
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ color: '#FFB74D', fontWeight: 700, mb: 1 }}>
                        {insight.patient}
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 2 }}>
                        {insight.prediction}
                      </Typography>
                    </Box>
                    <Chip 
                      label={`${insight.confidence}% Confidence`}
                      sx={{
                        background: 'linear-gradient(135deg, #FF9800 0%, #FFC107 100%)',
                        color: 'white',
                        fontWeight: 700,
                      }}
                    />
                  </Box>
                  <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                    Contributing Factors:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {insight.factors.map((factor, i) => (
                      <Chip 
                        key={i}
                        label={factor}
                        size="small"
                        sx={{
                          background: 'rgba(255, 152, 0, 0.2)',
                          color: 'rgba(255, 255, 255, 0.8)',
                          border: '1px solid rgba(255, 152, 0, 0.3)',
                        }}
                      />
                    ))}
                  </Box>
                  <Box sx={{
                    background: 'rgba(76, 175, 80, 0.1)',
                    border: '1px solid rgba(76, 175, 80, 0.3)',
                    borderRadius: '12px',
                    p: 2,
                  }}>
                    <Typography variant="subtitle2" sx={{ color: '#4caf50', fontWeight: 700, mb: 0.5 }}>
                      Recommended Action:
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      {insight.recommendation}
                    </Typography>
                  </Box>
                </Card>
              ))}
            </Grid>
          )}

          {/* Patient Risk Scores Tab */}
          {tabValue === 2 && (
            <Grid item xs={12}>
              <Typography variant="h5" sx={{ color: '#FFB74D', fontWeight: 700, mb: 3 }}>
                Patient Risk Assessment
              </Typography>
              {patientRiskScores.map((patient) => (
                <Card key={patient.id} sx={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${getRiskColor(patient.risk)}40`,
                  borderRadius: '20px',
                  boxShadow: `0 8px 32px ${getRiskColor(patient.risk)}20`,
                  p: 3,
                  mb: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 12px 40px ${getRiskColor(patient.risk)}30`,
                  },
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ 
                        width: 56, 
                        height: 56,
                        background: `linear-gradient(135deg, ${getRiskColor(patient.risk)} 0%, ${getRiskColor(patient.risk)}CC 100%)`,
                      }}>
                        <MonitorHeart />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ color: '#FFB74D', fontWeight: 700 }}>
                          {patient.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                          Patient ID: {patient.id}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                          Health Score
                        </Typography>
                        <Typography variant="h4" sx={{ color: getRiskColor(patient.risk), fontWeight: 700 }}>
                          {patient.score}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                          Adherence
                        </Typography>
                        <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 700 }}>
                          {patient.adherence}%
                        </Typography>
                      </Box>
                      <Box>
                        {getTrendIcon(patient.trend)}
                      </Box>
                      <Chip 
                        label={patient.risk.toUpperCase()}
                        sx={{
                          background: getRiskColor(patient.risk),
                          color: 'white',
                          fontWeight: 700,
                        }}
                      />
                    </Box>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 0.5, display: 'block' }}>
                      Adherence Progress
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={patient.adherence} 
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(90deg, #4caf50 0%, #8bc34a 100%)',
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>
                </Card>
              ))}
            </Grid>
          )}
        </Grid>
      </Layout>
    </Box>
  );
};

export default AIAdherenceTracking;
