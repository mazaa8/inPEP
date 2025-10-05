import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Paper,
  Chip,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Psychology as AIIcon,
} from '@mui/icons-material';
import { healthService, type HealthInsight } from '../../services/healthService';
import InsightCard from './InsightCard';

interface AIInsightsDashboardProps {
  patientId?: string;
  compact?: boolean;
}

const AIInsightsDashboard = ({ patientId, compact = false }: AIInsightsDashboardProps) => {
  const [insights, setInsights] = useState<HealthInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInsights();
  }, [patientId]);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await healthService.getInsights(patientId);
      setInsights(data);
    } catch (err) {
      console.error('Failed to load insights:', err);
      setError('Failed to load health insights');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateInsights = async () => {
    try {
      setGenerating(true);
      setError(null);
      await healthService.generateInsights(patientId);
      await fetchInsights();
    } catch (err) {
      console.error('Failed to generate insights:', err);
      setError('Failed to generate insights. Make sure you have health metrics recorded.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDismiss = async (id: string) => {
    try {
      await healthService.dismissInsight(id);
      setInsights(insights.filter((i) => i.id !== id));
    } catch (err) {
      console.error('Failed to dismiss insight:', err);
    }
  };

  const getCategoryCounts = () => {
    const counts = {
      CRITICAL: insights.filter((i) => i.severity === 'CRITICAL').length,
      ALERT: insights.filter((i) => i.severity === 'ALERT').length,
      WARNING: insights.filter((i) => i.severity === 'WARNING').length,
      INFO: insights.filter((i) => i.severity === 'INFO').length,
    };
    return counts;
  };

  const counts = getCategoryCounts();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {!compact && (
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <AIIcon color="primary" />
              <Typography variant="h5">AI Health Insights</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Personalized health analysis powered by AI
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={generating ? <CircularProgress size={20} /> : <RefreshIcon />}
            onClick={handleGenerateInsights}
            disabled={generating}
          >
            {generating ? 'Analyzing...' : 'Analyze Health Data'}
          </Button>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!compact && insights.length > 0 && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: '#f5f5f5' }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Insight Summary
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {counts.CRITICAL > 0 && (
              <Chip label={`${counts.CRITICAL} Critical`} color="error" size="small" />
            )}
            {counts.ALERT > 0 && (
              <Chip label={`${counts.ALERT} Alerts`} color="error" size="small" variant="outlined" />
            )}
            {counts.WARNING > 0 && (
              <Chip label={`${counts.WARNING} Warnings`} color="warning" size="small" />
            )}
            {counts.INFO > 0 && (
              <Chip label={`${counts.INFO} Info`} color="info" size="small" />
            )}
          </Box>
        </Paper>
      )}

      {insights.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <AIIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Health Insights Yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Start tracking your health metrics to receive personalized AI-powered insights
          </Typography>
          <Button
            variant="contained"
            startIcon={generating ? <CircularProgress size={20} /> : <RefreshIcon />}
            onClick={handleGenerateInsights}
            disabled={generating}
          >
            {generating ? 'Analyzing...' : 'Generate Insights'}
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {insights.slice(0, compact ? 3 : undefined).map((insight) => (
            <Grid item xs={12} key={insight.id}>
              <InsightCard insight={insight} onDismiss={handleDismiss} />
            </Grid>
          ))}
        </Grid>
      )}

      {compact && insights.length > 3 && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            +{insights.length - 3} more insights
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default AIInsightsDashboard;
