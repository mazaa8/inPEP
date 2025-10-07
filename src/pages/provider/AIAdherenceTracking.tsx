import { useState, useEffect } from 'react';
import { Grid, Box, Typography, Card, CardContent, Chip, LinearProgress, Avatar, Tab, Tabs, CircularProgress, Button, ButtonGroup, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
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
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
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
} from 'recharts';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../context/AuthContext';

const API_BASE_URL = 'http://localhost:3000/api';

interface DashboardMetrics {
  overallScore: number;
  highRiskCount: number;
  activePredictionsCount: number;
  dataPointsCount: number;
  trend: string;
  weeklyChange: number;
}

interface AdherenceTrend {
  date: string;
  medication: number;
  mealPlan: number;
  vitals: number;
  mood: number;
  overall: number;
}

interface PatientRisk {
  id: string;
  name: string;
  score: number;
  risk: string;
  trend: string;
  adherence: number;
}

interface PredictiveInsight {
  patient: string;
  prediction: string;
  confidence: number;
  factors: string[];
  recommendation: string;
  priority?: string;
}

interface BehaviorPattern {
  behavior: string;
  score: number;
  fullMark: number;
}

const AIAdherenceTracking = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics | null>(null);
  const [adherenceTrends, setAdherenceTrends] = useState<AdherenceTrend[]>([]);
  const [patientRiskScores, setPatientRiskScores] = useState<PatientRisk[]>([]);
  const [predictiveInsights, setPredictiveInsights] = useState<PredictiveInsight[]>([]);
  const [behaviorPatterns, setBehaviorPatterns] = useState<BehaviorPattern[]>([]);
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [behaviorViewMode, setBehaviorViewMode] = useState<'individual' | 'population'>('individual');
  const [populationBehaviors, setPopulationBehaviors] = useState<BehaviorPattern[]>([]);
  const [predictionFilter, setPredictionFilter] = useState<string>('all');
  const { user } = useAuth();

  // Fetch dashboard metrics
  useEffect(() => {
    const fetchDashboardMetrics = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/adherence/dashboard?providerId=${user?.id}`);
        const data = await response.json();
        setDashboardMetrics(data);
      } catch (error) {
        console.error('Error fetching dashboard metrics:', error);
        // Fallback to mock data
        setDashboardMetrics({
          overallScore: 89,
          highRiskCount: 3,
          activePredictionsCount: 12,
          dataPointsCount: 2400,
          trend: 'up',
          weeklyChange: 5,
        });
      }
    };

    fetchDashboardMetrics();
  }, [user?.id]);

  // Fetch adherence trends
  useEffect(() => {
    const fetchAdherenceTrends = async () => {
      try {
        // For now, fetch for first patient (would iterate through all patients)
        const response = await fetch(`${API_BASE_URL}/adherence/trends/weekly?patientId=sample-patient-id`);
        const data = await response.json();
        setAdherenceTrends(data);
      } catch (error) {
        console.error('Error fetching adherence trends:', error);
        // Fallback to mock data
        setAdherenceTrends([
          { date: 'Mon', medication: 95, mealPlan: 88, vitals: 92, mood: 85, overall: 90 },
          { date: 'Tue', medication: 92, mealPlan: 90, vitals: 95, mood: 82, overall: 89 },
          { date: 'Wed', medication: 88, mealPlan: 85, vitals: 90, mood: 78, overall: 85 },
          { date: 'Thu', medication: 90, mealPlan: 92, vitals: 88, mood: 88, overall: 89 },
          { date: 'Fri', medication: 85, mealPlan: 80, vitals: 85, mood: 75, overall: 81 },
          { date: 'Sat', medication: 95, mealPlan: 95, vitals: 98, mood: 92, overall: 95 },
          { date: 'Sun', medication: 93, mealPlan: 90, vitals: 95, mood: 90, overall: 92 },
        ]);
      }
    };

    fetchAdherenceTrends();
  }, []);

  // For demo: Generate all 101 patients with realistic risk scores
  useEffect(() => {
    const patientNames = [
      'Abdeen White', 'Jan Graham', 'Steven Cameron', 'Michelle Coleman', 'Victoria Black',
      'Liam Randall', 'Joan Gibson', 'Jan Kerr', 'Anne Johnston', 'Stewart Ferguson',
      'Dominic Campbell', 'Victoria Blake', 'Rebecca Gibson', 'Paul Davidson', 'Fiona Springer',
      'Dorothy Lyman', 'Una Morgan', 'Max Grant', 'Virginia Skinner', 'Oliver Nash',
      'Gavin Lawrence', 'Benjamin Wright', 'Madeleine Howard', 'Christian Miller', 'Angela Clarkson',
      'Gavin Bell', 'Paul Langdon', 'Owen James', 'Samantha Russell', 'Robert Murray',
      'Blake Alsop', 'Julia Burgess', 'Olivia Vance', 'James Dyer', 'Sophie Burgess',
      'Piers Abraham', 'Kimberly Murray', 'Kimberly Henderson', 'Molly Parsons', 'Jan Cornish',
      'Sonia Parsons', 'Michael Avery', 'Dorothy Grant', 'Felicity James', 'Kevin Bower',
      'Virginia Rutherford', 'Sue Hill', 'Joseph Bond', 'Vanessa Russell', 'Jonathan Simpson',
      'Evan Hunter', 'Zoe Morgan', 'Connor Nash', 'Claire Jackson', 'Christian Payne',
      'Elizabeth Skinner', 'Irene Morgan', 'Natalie Marshall', 'Charles Cornish', 'William Abraham',
      'Jennifer Hughes', 'Julian Vaughan', 'Richard Lyman', 'Liam North', 'Christian Young',
      'Rose Campbell', 'Emma Hemmings', 'Neil Wilkins', 'Jack Sharp', 'Mary Wilkins',
      'Tracey Clarkson', 'Connor James', 'Blake Slater', 'Joshua Dickens', 'Amelia Wallace',
      'Carl Henderson', 'Alexandra Campbell', 'Donna Lambert', 'Dylan Grant', 'Evan Forsyth',
      'James McDonald', 'Jonathan Hunter', 'Alison Underwood', 'Kimberly Turner', 'Emma Rutherford',
      'Lisa Campbell', 'Robert Bower', 'Tim Young', 'Jennifer May', 'Karen Vaughan',
      'Natalie Nash', 'Luke Taylor', 'Brandon Baker', 'Yvonne Blake', 'Tim Tucker',
      'Julia Ogden', 'Sophie Rees', 'Brandon Butler', 'Tracey Graham', 'Harry King', 'Jacob Ince'
    ];

    const riskLevels = ['critical', 'high', 'high', 'medium', 'medium', 'medium', 'low', 'low', 'low', 'low'];
    const trends = ['up', 'down', 'stable'];
    
    const all101Patients = patientNames.map((name, index) => {
      const riskLevel = riskLevels[index % riskLevels.length];
      let score = 50;
      
      // Assign scores based on risk level
      if (riskLevel === 'critical') score = 35 + Math.floor(Math.random() * 15);
      else if (riskLevel === 'high') score = 50 + Math.floor(Math.random() * 15);
      else if (riskLevel === 'medium') score = 65 + Math.floor(Math.random() * 15);
      else score = 80 + Math.floor(Math.random() * 20);
      
      const adherence = score + Math.floor(Math.random() * 10);
      
      return {
        id: `P${String(index + 1).padStart(3, '0')}`,
        name,
        score,
        risk: riskLevel,
        trend: trends[index % trends.length],
        adherence: Math.min(adherence, 100),
      };
    });
    
    setPatientRiskScores(all101Patients);
    setLoading(false);
  }, []);

  // Fetch predictive insights
  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/adherence/insights/predictive?providerId=${user?.id}`);
        const data = await response.json();
        setPredictiveInsights(data);
      } catch (error) {
        console.error('Error fetching predictive insights:', error);
        // Fallback to mock data
        setPredictiveInsights([
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
        ]);
      }
    };

    fetchInsights();
  }, [user?.id]);

  // Generate behavior patterns based on patient risk scores (Tab 2 data)
  useEffect(() => {
    if (patientRiskScores.length > 0) {
      // Set default selected patient to first one
      if (!selectedPatientId) {
        setSelectedPatientId(patientRiskScores[0].id);
      }
      
      // Function to generate 6 behaviors from overall score
      const generateBehaviorScores = (overallScore: number) => {
        const variation = 15;
        return [
          { 
            behavior: 'Medication', 
            score: Math.min(100, Math.max(0, Math.round(overallScore + (Math.random() * variation * 2 - variation)))),
            fullMark: 100
          },
          { 
            behavior: 'Meal Plan', 
            score: Math.min(100, Math.max(0, Math.round(overallScore + (Math.random() * variation * 2 - variation)))),
            fullMark: 100
          },
          { 
            behavior: 'Exercise', 
            score: Math.min(100, Math.max(0, Math.round(overallScore - 10 + (Math.random() * variation)))),
            fullMark: 100
          },
          { 
            behavior: 'Sleep', 
            score: Math.min(100, Math.max(0, Math.round(overallScore + (Math.random() * variation * 2 - variation)))),
            fullMark: 100
          },
          { 
            behavior: 'Mood', 
            score: Math.min(100, Math.max(0, Math.round(overallScore - 5 + (Math.random() * variation)))),
            fullMark: 100
          },
          { 
            behavior: 'Vitals', 
            score: Math.min(100, Math.max(0, Math.round(overallScore + 5 + (Math.random() * variation)))),
            fullMark: 100
          },
        ];
      };
      
      // Generate individual patient behaviors
      const currentPatient = patientRiskScores.find(p => p.id === selectedPatientId) || patientRiskScores[0];
      setBehaviorPatterns(generateBehaviorScores(currentPatient.score));
      
      // Calculate population average behaviors across all 101 patients
      const avgScore = patientRiskScores.reduce((sum, p) => sum + p.score, 0) / patientRiskScores.length;
      const populationAvg = [
        { behavior: 'Medication', score: Math.round(avgScore + 5), fullMark: 100 },
        { behavior: 'Meal Plan', score: Math.round(avgScore), fullMark: 100 },
        { behavior: 'Exercise', score: Math.round(avgScore - 12), fullMark: 100 },
        { behavior: 'Sleep', score: Math.round(avgScore - 3), fullMark: 100 },
        { behavior: 'Mood', score: Math.round(avgScore - 8), fullMark: 100 },
        { behavior: 'Vitals', score: Math.round(avgScore + 8), fullMark: 100 },
      ];
      setPopulationBehaviors(populationAvg);
    }
  }, [patientRiskScores, selectedPatientId]);

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #0f1419 0%, #1a1f2e 30%, #2d1f1a 70%, #3d2a1f 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <CircularProgress sx={{ color: '#FFA726' }} size={60} />
      </Box>
    );
  }

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
            <Tab label="Population Analytics" />
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
                      {dashboardMetrics?.overallScore || 0}%
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {dashboardMetrics?.trend === 'up' ? (
                        <TrendingUp sx={{ color: '#4caf50', fontSize: 20 }} />
                      ) : (
                        <TrendingDown sx={{ color: '#f44336', fontSize: 20 }} />
                      )}
                      <Typography variant="body2" sx={{ color: dashboardMetrics?.trend === 'up' ? '#4caf50' : '#f44336' }}>
                        {dashboardMetrics?.weeklyChange > 0 ? '+' : ''}{dashboardMetrics?.weeklyChange || 0}% from last week
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
                      {dashboardMetrics?.highRiskCount || 0}
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
                      {dashboardMetrics?.activePredictionsCount || 0}
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
                      {dashboardMetrics?.dataPointsCount ? (dashboardMetrics.dataPointsCount / 1000).toFixed(1) + 'K' : '0'}
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
                    <AreaChart data={adherenceTrends}>
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
            <>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" sx={{ color: '#FFB74D', fontWeight: 700 }}>
                    Patient Risk Assessment - Triage Dashboard
                  </Typography>
                  <ButtonGroup variant="contained" sx={{ boxShadow: '0 4px 16px rgba(255, 152, 0, 0.3)' }}>
                    <Button
                      onClick={() => setRiskFilter('all')}
                      sx={{
                        background: riskFilter === 'all' ? 'linear-gradient(135deg, #FF9800 0%, #FFC107 100%)' : 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        fontWeight: 700,
                        '&:hover': {
                          background: riskFilter === 'all' ? 'linear-gradient(135deg, #FF9800 0%, #FFC107 100%)' : 'rgba(255, 255, 255, 0.15)',
                        },
                      }}
                    >
                      All ({patientRiskScores.length})
                    </Button>
                    <Button
                      onClick={() => setRiskFilter('critical')}
                      sx={{
                        background: riskFilter === 'critical' ? '#f44336' : 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        fontWeight: 700,
                        '&:hover': {
                          background: riskFilter === 'critical' ? '#f44336' : 'rgba(244, 67, 54, 0.3)',
                        },
                      }}
                    >
                      Critical ({patientRiskScores.filter(p => p.risk === 'critical').length})
                    </Button>
                    <Button
                      onClick={() => setRiskFilter('high')}
                      sx={{
                        background: riskFilter === 'high' ? '#ff9800' : 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        fontWeight: 700,
                        '&:hover': {
                          background: riskFilter === 'high' ? '#ff9800' : 'rgba(255, 152, 0, 0.3)',
                        },
                      }}
                    >
                      High ({patientRiskScores.filter(p => p.risk === 'high').length})
                    </Button>
                    <Button
                      onClick={() => setRiskFilter('medium')}
                      sx={{
                        background: riskFilter === 'medium' ? '#ffc107' : 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        fontWeight: 700,
                        '&:hover': {
                          background: riskFilter === 'medium' ? '#ffc107' : 'rgba(255, 193, 7, 0.3)',
                        },
                      }}
                    >
                      Medium ({patientRiskScores.filter(p => p.risk === 'medium').length})
                    </Button>
                    <Button
                      onClick={() => setRiskFilter('low')}
                      sx={{
                        background: riskFilter === 'low' ? '#4caf50' : 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        fontWeight: 700,
                        '&:hover': {
                          background: riskFilter === 'low' ? '#4caf50' : 'rgba(76, 175, 80, 0.3)',
                        },
                      }}
                    >
                      Low ({patientRiskScores.filter(p => p.risk === 'low').length})
                    </Button>
                  </ButtonGroup>
                </Box>
              </Grid>
              
              {patientRiskScores
                .filter(patient => riskFilter === 'all' || patient.risk === riskFilter)
                .map((patient) => (
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
            </>
          )}

          {/* Behavior Patterns Tab */}
          {tabValue === 3 && (
            <>
              {/* Controls Header */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" sx={{ color: '#FFB74D', fontWeight: 700 }}>
                    Behavior Pattern Analysis
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    {/* View Mode Toggle */}
                    <ButtonGroup variant="contained">
                      <Button
                        onClick={() => setBehaviorViewMode('individual')}
                        sx={{
                          background: behaviorViewMode === 'individual' ? 'linear-gradient(135deg, #FF9800 0%, #FFC107 100%)' : 'rgba(255, 255, 255, 0.1)',
                          color: 'white',
                          fontWeight: 700,
                          '&:hover': {
                            background: behaviorViewMode === 'individual' ? 'linear-gradient(135deg, #FF9800 0%, #FFC107 100%)' : 'rgba(255, 255, 255, 0.15)',
                          },
                        }}
                      >
                        Individual
                      </Button>
                      <Button
                        onClick={() => setBehaviorViewMode('population')}
                        sx={{
                          background: behaviorViewMode === 'population' ? 'linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)' : 'rgba(255, 255, 255, 0.1)',
                          color: 'white',
                          fontWeight: 700,
                          '&:hover': {
                            background: behaviorViewMode === 'population' ? 'linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)' : 'rgba(255, 255, 255, 0.15)',
                          },
                        }}
                      >
                        Population Average
                      </Button>
                    </ButtonGroup>

                    {/* Patient Selector (only show in individual mode) */}
                    {behaviorViewMode === 'individual' && (
                      <FormControl sx={{ minWidth: 250 }}>
                        <Select
                          value={selectedPatientId}
                          onChange={(e) => setSelectedPatientId(e.target.value)}
                          sx={{
                            color: 'white',
                            background: 'rgba(255, 255, 255, 0.1)',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(255, 152, 0, 0.5)',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#FFB74D',
                            },
                            '& .MuiSvgIcon-root': {
                              color: '#FFB74D',
                            },
                          }}
                        >
                          {patientRiskScores.map((patient) => (
                            <MenuItem key={patient.id} value={patient.id}>
                              {patient.name} - Score: {patient.score}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  </Box>
                </Box>
              </Grid>

              {/* Radar Chart */}
              <Grid item xs={12}>
                <Card sx={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${behaviorViewMode === 'individual' ? 'rgba(255, 152, 0, 0.3)' : 'rgba(33, 150, 243, 0.3)'}`,
                  borderRadius: '20px',
                  boxShadow: `0 8px 32px ${behaviorViewMode === 'individual' ? 'rgba(255, 152, 0, 0.15)' : 'rgba(33, 150, 243, 0.15)'}`,
                  p: 3,
                }}>
                  <Typography variant="h6" sx={{ color: behaviorViewMode === 'individual' ? '#FFB74D' : '#64b5f6', fontWeight: 700, mb: 3 }}>
                    {behaviorViewMode === 'individual' 
                      ? `6-Dimensional Analysis - ${patientRiskScores.find(p => p.id === selectedPatientId)?.name || 'Patient'}`
                      : '6-Dimensional Population Average (101 Patients)'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
                    {behaviorViewMode === 'individual'
                      ? 'Individual patient adherence across all key health behaviors'
                      : 'Average behavior scores across all 101 patients in the system'}
                  </Typography>
                  <ResponsiveContainer width="100%" height={400}>
                    <RadarChart data={behaviorViewMode === 'individual' ? behaviorPatterns : populationBehaviors}>
                      <PolarGrid stroke="rgba(255, 255, 255, 0.2)" />
                      <PolarAngleAxis dataKey="behavior" stroke="rgba(255, 255, 255, 0.6)" />
                      <PolarRadiusAxis stroke="rgba(255, 255, 255, 0.4)" />
                      <Radar 
                        name="Score" 
                        dataKey="score" 
                        stroke={behaviorViewMode === 'individual' ? '#FF9800' : '#2196f3'} 
                        fill={behaviorViewMode === 'individual' ? '#FF9800' : '#2196f3'} 
                        fillOpacity={0.6} 
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </Card>
              </Grid>

              {/* Behavior Breakdown Cards */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ color: behaviorViewMode === 'individual' ? '#FFB74D' : '#64b5f6', fontWeight: 700, mb: 2, mt: 2 }}>
                  {behaviorViewMode === 'individual' ? 'Individual Behavior Breakdown' : 'Population Behavior Breakdown'}
                </Typography>
              </Grid>

              {(behaviorViewMode === 'individual' ? behaviorPatterns : populationBehaviors).map((pattern, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card sx={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 152, 0, 0.3)',
                    borderRadius: '20px',
                    boxShadow: '0 8px 32px rgba(255, 152, 0, 0.15)',
                    p: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 40px rgba(255, 152, 0, 0.25)',
                    },
                  }}>
                    <Typography variant="h6" sx={{ color: '#FFB74D', fontWeight: 700, mb: 2 }}>
                      {pattern.behavior}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 2 }}>
                      <Typography variant="h3" sx={{ color: pattern.score >= 80 ? '#4caf50' : pattern.score >= 60 ? '#ff9800' : '#f44336', fontWeight: 700 }}>
                        {pattern.score}
                      </Typography>
                      <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                        / 100
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={pattern.score} 
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          background: pattern.score >= 80 
                            ? 'linear-gradient(90deg, #4caf50 0%, #8bc34a 100%)'
                            : pattern.score >= 60
                            ? 'linear-gradient(90deg, #ff9800 0%, #ffc107 100%)'
                            : 'linear-gradient(90deg, #f44336 0%, #ff5252 100%)',
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Card>
                </Grid>
              ))}
            </>
          )}

          {/* Population Analytics Tab */}
          {tabValue === 4 && (
            <>
              <Grid item xs={12}>
                <Typography variant="h5" sx={{ color: '#FFB74D', fontWeight: 700, mb: 3 }}>
                  Population-Level Analytics & Outcomes
                </Typography>
              </Grid>

              {/* Post-Discharge Recovery Metrics */}
              <Grid item xs={12} md={6}>
                <Card sx={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 152, 0, 0.3)',
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px rgba(255, 152, 0, 0.15)',
                  p: 3,
                }}>
                  <Typography variant="h6" sx={{ color: '#FFB74D', fontWeight: 700, mb: 3 }}>
                    Post-Discharge Recovery Metrics
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { name: 'Week 1', progress: 65 },
                      { name: 'Week 2', progress: 70 },
                      { name: 'Week 3', progress: 78 },
                      { name: 'Week 4', progress: 85 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                      <XAxis dataKey="name" stroke="rgba(255, 255, 255, 0.6)" />
                      <YAxis stroke="rgba(255, 255, 255, 0.6)" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                          border: '1px solid rgba(255, 152, 0, 0.3)',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                      <Bar dataKey="progress" fill="#FF9800" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Grid>

              {/* Readmission Trends */}
              <Grid item xs={12} md={6}>
                <Card sx={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 152, 0, 0.3)',
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px rgba(255, 152, 0, 0.15)',
                  p: 3,
                }}>
                  <Typography variant="h6" sx={{ color: '#FFB74D', fontWeight: 700, mb: 3 }}>
                    Readmission Trends
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={[
                      { month: 'Jan', rate: 5.2 },
                      { month: 'Feb', rate: 4.8 },
                      { month: 'Mar', rate: 4.9 },
                      { month: 'Apr', rate: 4.5 },
                      { month: 'May', rate: 4.2 },
                      { month: 'Jun', rate: 3.9 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                      <XAxis dataKey="month" stroke="rgba(255, 255, 255, 0.6)" />
                      <YAxis stroke="rgba(255, 255, 255, 0.6)" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                          border: '1px solid rgba(255, 152, 0, 0.3)',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="rate" stroke="#4caf50" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </Grid>

              {/* Patient Satisfaction */}
              <Grid item xs={12} md={6}>
                <Card sx={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 152, 0, 0.3)',
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px rgba(255, 152, 0, 0.15)',
                  p: 3,
                }}>
                  <Typography variant="h6" sx={{ color: '#FFB74D', fontWeight: 700, mb: 3 }}>
                    Patient Satisfaction
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={[
                      { subject: 'Communication', A: 85, fullMark: 100 },
                      { subject: 'Care Quality', A: 90, fullMark: 100 },
                      { subject: 'Education', A: 75, fullMark: 100 },
                      { subject: 'Responsiveness', A: 80, fullMark: 100 },
                      { subject: 'Overall', A: 88, fullMark: 100 },
                    ]}>
                      <PolarGrid stroke="rgba(255, 255, 255, 0.2)" />
                      <PolarAngleAxis dataKey="subject" stroke="rgba(255, 255, 255, 0.6)" />
                      <PolarRadiusAxis stroke="rgba(255, 255, 255, 0.4)" />
                      <Radar name="Satisfaction" dataKey="A" stroke="#2196f3" fill="#2196f3" fillOpacity={0.6} />
                    </RadarChart>
                  </ResponsiveContainer>
                </Card>
              </Grid>

              {/* Caregiver Effectiveness */}
              <Grid item xs={12} md={6}>
                <Card sx={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 152, 0, 0.3)',
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px rgba(255, 152, 0, 0.15)',
                  p: 3,
                }}>
                  <Typography variant="h6" sx={{ color: '#FFB74D', fontWeight: 700, mb: 3 }}>
                    Caregiver Effectiveness
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart layout="vertical" data={[
                      { name: 'Adherence', score: 92 },
                      { name: 'Engagement', score: 88 },
                      { name: 'Reported Stress', score: 75 },
                      { name: 'Task Completion', score: 95 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                      <XAxis type="number" stroke="rgba(255, 255, 255, 0.6)" />
                      <YAxis dataKey="name" type="category" width={120} stroke="rgba(255, 255, 255, 0.6)" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                          border: '1px solid rgba(255, 152, 0, 0.3)',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                      <Bar dataKey="score" fill="#FFC107" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Grid>

              {/* Predictive Forecasts */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ color: '#FFB74D', fontWeight: 700, mb: 2, mt: 2 }}>
                  Predictive Forecasts
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{
                  background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.15) 0%, rgba(33, 150, 243, 0.05) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(33, 150, 243, 0.4)',
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px rgba(33, 150, 243, 0.2)',
                  p: 3,
                }}>
                  <Typography variant="h6" sx={{ color: '#2196f3', fontWeight: 700, mb: 2 }}>
                    Predictive Readmission Risk
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.8 }}>
                    Based on current trends, the aggregate readmission risk for the patient cohort is projected to decrease by <strong style={{ color: '#4caf50' }}>5%</strong> over the next quarter.
                  </Typography>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{
                  background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(76, 175, 80, 0.05) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(76, 175, 80, 0.4)',
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px rgba(76, 175, 80, 0.2)',
                  p: 3,
                }}>
                  <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 700, mb: 2 }}>
                    Health Outcomes Forecast
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.8 }}>
                    Patients adhering to their care plans are <strong style={{ color: '#4caf50' }}>20%</strong> more likely to report improved health outcomes within 30 days post-discharge.
                  </Typography>
                </Card>
              </Grid>
            </>
          )}
        </Grid>
      </Layout>
    </Box>
  );
};

export default AIAdherenceTracking;
