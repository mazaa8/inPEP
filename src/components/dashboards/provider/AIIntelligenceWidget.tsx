import { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Chip, Grid, Button } from '@mui/material';
import { Psychology, Warning, TrendingUp, Insights, CheckCircle, Timeline, TrendingDown } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface DashboardMetrics {
  overallScore: number;
  highRiskCount: number;
  activePredictionsCount: number;
  dataPointsCount: number;
  trend: string;
  weeklyChange: number;
}

interface PatientRisk {
  id: string;
  name: string;
  score: number;
  risk: string;
  trend: string;
  adherence: number;
}

const AIIntelligenceWidget = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [patientRiskScores, setPatientRiskScores] = useState<PatientRisk[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Generate all 101 patients (same as AI Adherence Tracking page)
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

  // Calculate dashboard metrics from patient population (same as Tab 0)
  useEffect(() => {
    if (patientRiskScores.length > 0) {
      // Calculate overall adherence score (average of all patients)
      const avgAdherence = Math.round(
        patientRiskScores.reduce((sum, p) => sum + p.adherence, 0) / patientRiskScores.length
      );
      
      // Count high-risk patients (critical + high)
      const highRiskCount = patientRiskScores.filter(
        p => p.risk === 'critical' || p.risk === 'high'
      ).length;
      
      // Active predictions = total number of patients (one prediction per patient)
      const activePredictionsCount = patientRiskScores.length;
      
      // Simulate data points: ~24 data points per patient per week (medication, meals, vitals, mood)
      const dataPointsCount = patientRiskScores.length * 24;
      
      // Calculate trend based on patient trends
      const trendingUp = patientRiskScores.filter(p => p.trend === 'up').length;
      const trendingDown = patientRiskScores.filter(p => p.trend === 'down').length;
      const trend = trendingUp > trendingDown ? 'up' : 'down';
      
      // Weekly change: simulate 3-7% improvement
      const weeklyChange = trend === 'up' ? Math.floor(Math.random() * 5) + 3 : -(Math.floor(Math.random() * 3) + 2);
      
      setMetrics({
        overallScore: avgAdherence,
        highRiskCount,
        activePredictionsCount,
        dataPointsCount,
        trend,
        weeklyChange,
      });
    }
  }, [patientRiskScores]);

  if (loading) {
    return (
      <Card sx={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 152, 0, 0.3)',
        borderRadius: '20px',
        p: 3,
      }}>
        <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>Loading AI Intelligence...</Typography>
      </Card>
    );
  }

  return (
    <Card sx={{
      background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.15) 0%, rgba(255, 193, 7, 0.08) 100%)',
      backdropFilter: 'blur(30px)',
      border: '1px solid rgba(255, 152, 0, 0.4)',
      borderRadius: '24px',
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
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #FF9800 0%, #FFC107 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(255, 152, 0, 0.4)',
            }}>
              <Psychology sx={{ fontSize: 28, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ color: '#FFB74D', fontWeight: 700 }}>
                AI Adherence Intelligence
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Real-time patient monitoring
              </Typography>
            </Box>
          </Box>
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate('/provider/ai-adherence')}
            sx={{
              borderColor: 'rgba(255, 152, 0, 0.5)',
              color: '#FFB74D',
              '&:hover': {
                borderColor: '#FFB74D',
                background: 'rgba(255, 152, 0, 0.1)',
              },
            }}
          >
            View Full Dashboard
          </Button>
        </Box>

        {/* Key Metrics - Matching Tab 0 */}
        <Grid container spacing={2}>
          {/* Overall Adherence */}
          <Grid item xs={12} sm={6} md={3}>
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
                  {metrics?.overallScore || 0}%
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {metrics?.trend === 'up' ? (
                    <TrendingUp sx={{ color: '#4caf50', fontSize: 20 }} />
                  ) : (
                    <TrendingDown sx={{ color: '#f44336', fontSize: 20 }} />
                  )}
                  <Typography variant="body2" sx={{ color: metrics?.trend === 'up' ? '#4caf50' : '#f44336' }}>
                    {(metrics?.weeklyChange ?? 0) > 0 ? '+' : ''}{metrics?.weeklyChange ?? 0}% from last week
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* High Risk Patients */}
          <Grid item xs={12} sm={6} md={3}>
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
                  {metrics?.highRiskCount || 0}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                  Require immediate attention
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* AI Predictions */}
          <Grid item xs={12} sm={6} md={3}>
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
                  {metrics?.activePredictionsCount || 0}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                  Active interventions suggested
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Data Points */}
          <Grid item xs={12} sm={6} md={3}>
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
                  {metrics?.dataPointsCount ? (metrics.dataPointsCount / 1000).toFixed(1) + 'K' : '0'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                  Last 7 days
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* System Status */}
        <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(255, 152, 0, 0.2)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#4caf50',
                boxShadow: '0 0 8px #4caf50',
              }} />
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                AI System Active • Monitoring 101 patients
              </Typography>
            </Box>
            <Chip
              label="Live"
              size="small"
              sx={{
                background: 'rgba(76, 175, 80, 0.2)',
                color: '#4caf50',
                fontWeight: 700,
                fontSize: '0.7rem',
              }}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AIIntelligenceWidget;
