import { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Chip, Alert, CircularProgress, IconButton, Collapse } from '@mui/material';
import { Psychology, Warning, TrendingUp, Lightbulb, ExpandMore, ExpandLess, CheckCircle } from '@mui/icons-material';
import { apiRequest } from '../../config/api';

interface JournalInsight {
  type: 'pattern' | 'risk' | 'recommendation' | 'trend';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  data: any;
  actionable: boolean;
  recommendation?: string;
}

interface AIInsightsPanelProps {
  patientId: string;
}

const AIInsightsPanel = ({ patientId }: AIInsightsPanelProps) => {
  const [insights, setInsights] = useState<JournalInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedInsights, setExpandedInsights] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchInsights();
  }, [patientId]);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const data = await apiRequest<JournalInsight[]>(`/journal/insights/${patientId}`);
      setInsights(data);
    } catch (error) {
      console.error('Failed to fetch insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (index: number) => {
    const newExpanded = new Set(expandedInsights);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedInsights(newExpanded);
  };

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      low: '#4caf50',
      medium: '#ff9800',
      high: '#f44336',
      critical: '#d32f2f',
    };
    return colors[severity] || '#999';
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      pattern: <TrendingUp />,
      risk: <Warning />,
      recommendation: <Lightbulb />,
      trend: <TrendingUp />,
    };
    return icons[type] || <Psychology />;
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      pattern: 'Pattern Detected',
      risk: 'Risk Alert',
      recommendation: 'Recommendation',
      trend: 'Trend Analysis',
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress sx={{ color: '#4caf50' }} />
      </Box>
    );
  }

  if (insights.length === 0) {
    return (
      <Box sx={{ 
        p: 3, 
        textAlign: 'center',
        bgcolor: 'rgba(76, 175, 80, 0.05)',
        borderRadius: '12px',
        border: '1px solid rgba(76, 175, 80, 0.2)',
      }}>
        <CheckCircle sx={{ fontSize: 48, color: '#4caf50', mb: 1 }} />
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1b5e20', mb: 1 }}>
          No Concerns Detected
        </Typography>
        <Typography variant="body2" color="text.secondary">
          AI analysis shows no significant patterns or risks at this time. Continue monitoring.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Psychology sx={{ color: '#4caf50', fontSize: 28 }} />
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1b5e20' }}>
          AI Insights & Recommendations
        </Typography>
        <Chip 
          label={`${insights.length} ${insights.length === 1 ? 'Insight' : 'Insights'}`} 
          size="small"
          sx={{ bgcolor: '#4caf50', color: 'white', fontWeight: 600 }}
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {insights.map((insight, index) => (
          <Card
            key={index}
            sx={{
              borderLeft: `4px solid ${getSeverityColor(insight.severity)}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'all 0.3s',
              '&:hover': {
                boxShadow: `0 4px 16px ${getSeverityColor(insight.severity)}40`,
                transform: 'translateY(-2px)',
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                  <Box sx={{ color: getSeverityColor(insight.severity) }}>
                    {getTypeIcon(insight.type)}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Chip
                        label={getTypeLabel(insight.type)}
                        size="small"
                        sx={{
                          bgcolor: `${getSeverityColor(insight.severity)}20`,
                          color: getSeverityColor(insight.severity),
                          fontWeight: 600,
                          fontSize: '0.7rem',
                        }}
                      />
                      <Chip
                        label={insight.severity.toUpperCase()}
                        size="small"
                        sx={{
                          bgcolor: getSeverityColor(insight.severity),
                          color: 'white',
                          fontWeight: 700,
                          fontSize: '0.65rem',
                        }}
                      />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#333', fontSize: '1rem' }}>
                      {insight.title}
                    </Typography>
                  </Box>
                </Box>
                {insight.recommendation && (
                  <IconButton
                    size="small"
                    onClick={() => toggleExpand(index)}
                    sx={{ color: getSeverityColor(insight.severity) }}
                  >
                    {expandedInsights.has(index) ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                )}
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {insight.description}
              </Typography>

              <Collapse in={expandedInsights.has(index)} timeout="auto" unmountOnExit>
                {insight.recommendation && (
                  <Alert
                    severity={insight.severity === 'critical' || insight.severity === 'high' ? 'error' : 'warning'}
                    icon={<Lightbulb />}
                    sx={{ mt: 2 }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                      Recommended Action:
                    </Typography>
                    <Typography variant="body2">
                      {insight.recommendation}
                    </Typography>
                  </Alert>
                )}
              </Collapse>

              {!expandedInsights.has(index) && insight.recommendation && (
                <Typography
                  variant="caption"
                  sx={{
                    color: getSeverityColor(insight.severity),
                    fontWeight: 600,
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                  onClick={() => toggleExpand(index)}
                >
                  View Recommendation →
                </Typography>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(76, 175, 80, 0.05)', borderRadius: '8px' }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Psychology sx={{ fontSize: 16 }} />
          AI insights are generated by analyzing patterns in journal entries over the last 30 days. Always consult healthcare professionals for medical decisions.
        </Typography>
      </Box>
    </Box>
  );
};

export default AIInsightsPanel;
