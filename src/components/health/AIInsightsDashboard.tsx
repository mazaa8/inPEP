import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Alert,
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
        <CircularProgress sx={{ color: '#21CBF3' }} />
      </Box>
    );
  }

  return (
    <Box>
      {!compact && (
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            variant="contained"
            startIcon={generating ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <RefreshIcon />}
            onClick={handleGenerateInsights}
            disabled={generating}
            sx={{
              background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
              color: 'white',
              fontWeight: 700,
              px: 3,
              py: 1.5,
              borderRadius: '12px',
              boxShadow: '0 4px 16px rgba(33, 150, 243, 0.4)',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 8px 24px rgba(33, 150, 243, 0.5)',
              },
              transition: 'all 0.2s ease',
            }}
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
        <Box sx={{ 
          p: 2, 
          mb: 3, 
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1.5, fontWeight: 600 }}>
            Insight Summary
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {counts.CRITICAL > 0 && (
              <Chip label={`${counts.CRITICAL} Critical`} sx={{ bgcolor: 'rgba(244, 67, 54, 0.2)', color: '#f44336', fontWeight: 700 }} size="small" />
            )}
            {counts.ALERT > 0 && (
              <Chip label={`${counts.ALERT} Alerts`} sx={{ bgcolor: 'rgba(255, 152, 0, 0.2)', color: '#FFC107', fontWeight: 700 }} size="small" />
            )}
            {counts.WARNING > 0 && (
              <Chip label={`${counts.WARNING} Warnings`} sx={{ bgcolor: 'rgba(255, 193, 7, 0.2)', color: '#FFD54F', fontWeight: 700 }} size="small" />
            )}
            {counts.INFO > 0 && (
              <Chip label={`${counts.INFO} Info`} sx={{ bgcolor: 'rgba(33, 150, 243, 0.2)', color: '#21CBF3', fontWeight: 700 }} size="small" />
            )}
          </Box>
        </Box>
      )}

      {insights.length === 0 ? (
        <Box sx={{ 
          p: 4, 
          textAlign: 'center',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '16px',
          border: '1px dashed rgba(255,255,255,0.2)',
        }}>
          <AIIcon sx={{ fontSize: 64, color: 'rgba(33, 150, 243, 0.5)', mb: 2 }} />
          <Typography variant="h6" sx={{ color: 'white', mb: 1, fontWeight: 600 }}>
            No Health Insights Yet
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 3 }}>
            Start tracking your health metrics to receive personalized AI-powered insights
          </Typography>
          <Button
            variant="contained"
            startIcon={generating ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <RefreshIcon />}
            onClick={handleGenerateInsights}
            disabled={generating}
            sx={{
              background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
              color: 'white',
              fontWeight: 700,
              px: 4,
              py: 1.5,
              borderRadius: '12px',
              boxShadow: '0 4px 16px rgba(33, 150, 243, 0.4)',
            }}
          >
            {generating ? 'Analyzing...' : 'Generate Insights'}
          </Button>
        </Box>
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
