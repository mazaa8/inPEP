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
import CaregiverInsightCard from './CaregiverInsightCard';
import { roleColors } from '../../styles/glassmorphism';

interface AIInsightsDashboardProps {
  patientId?: string;
  compact?: boolean;
}

const CaregiverAIInsightsDashboard = ({ patientId, compact = false }: AIInsightsDashboardProps) => {
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
        <CircularProgress sx={{ color: roleColors.CAREGIVER.primary }} />
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
              background: roleColors.CAREGIVER.gradient,
              color: 'white',
              fontWeight: 700,
              px: 3,
              py: 1.5,
              borderRadius: '12px',
              boxShadow: `0 4px 16px ${roleColors.CAREGIVER.primary}40`,
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: `0 8px 24px ${roleColors.CAREGIVER.primary}60`,
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
          background: 'rgba(76, 175, 80, 0.08)',
          borderRadius: '12px',
          border: '1px solid rgba(76, 175, 80, 0.2)',
        }}>
          <Typography variant="body2" sx={{ color: '#1b5e20', mb: 1.5, fontWeight: 700 }}>
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
              <Chip label={`${counts.INFO} Info`} sx={{ bgcolor: 'rgba(76, 175, 80, 0.2)', color: roleColors.CAREGIVER.primary, fontWeight: 700 }} size="small" />
            )}
          </Box>
        </Box>
      )}

      {insights.length === 0 ? (
        <Box sx={{ 
          p: 4, 
          textAlign: 'center',
          background: 'rgba(76, 175, 80, 0.05)',
          borderRadius: '16px',
          border: '1px dashed rgba(76, 175, 80, 0.3)',
        }}>
          <AIIcon sx={{ fontSize: 64, color: 'rgba(76, 175, 80, 0.5)', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#1b5e20', mb: 1, fontWeight: 700 }}>
            No Health Insights Yet
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(27, 94, 32, 0.7)', mb: 3 }}>
            Start tracking health metrics to receive personalized AI-powered insights
          </Typography>
          <Button
            variant="contained"
            startIcon={generating ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <RefreshIcon />}
            onClick={handleGenerateInsights}
            disabled={generating}
            sx={{
              background: roleColors.CAREGIVER.gradient,
              color: 'white',
              fontWeight: 700,
              px: 4,
              py: 1.5,
              borderRadius: '12px',
              boxShadow: `0 4px 16px ${roleColors.CAREGIVER.primary}40`,
            }}
          >
            {generating ? 'Analyzing...' : 'Generate Insights'}
          </Button>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {insights.slice(0, compact ? 3 : undefined).map((insight) => (
            <Grid item xs={12} key={insight.id}>
              <CaregiverInsightCard insight={insight} onDismiss={handleDismiss} />
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

export default CaregiverAIInsightsDashboard;
