import {
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Box,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp as TrendIcon,
  Warning as WarningIcon,
  Lightbulb as RecommendationIcon,
  EmojiEvents as AchievementIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { type HealthInsight } from '../../services/healthService';

interface InsightCardProps {
  insight: HealthInsight;
  onDismiss?: (id: string) => void;
}

const InsightCard = ({ insight, onDismiss }: InsightCardProps) => {
  const getIcon = () => {
    switch (insight.insightType) {
      case 'TREND':
        return <TrendIcon />;
      case 'RISK':
        return <WarningIcon />;
      case 'RECOMMENDATION':
        return <RecommendationIcon />;
      case 'ACHIEVEMENT':
        return <AchievementIcon />;
      default:
        return <TrendIcon />;
    }
  };

  const getSeverityColor = () => {
    switch (insight.severity) {
      case 'CRITICAL':
        return 'error';
      case 'ALERT':
        return 'error';
      case 'WARNING':
        return 'warning';
      case 'INFO':
        return 'info';
      default:
        return 'default';
    }
  };

  const getBackgroundColor = () => {
    switch (insight.severity) {
      case 'CRITICAL':
        return '#ffebee';
      case 'ALERT':
        return '#fff3e0';
      case 'WARNING':
        return '#fff9c4';
      case 'INFO':
        return insight.insightType === 'ACHIEVEMENT' ? '#e8f5e9' : '#e3f2fd';
      default:
        return '#f5f5f5';
    }
  };

  const getIconColor = () => {
    switch (insight.severity) {
      case 'CRITICAL':
        return '#d32f2f';
      case 'ALERT':
        return '#f57c00';
      case 'WARNING':
        return '#fbc02d';
      case 'INFO':
        return insight.insightType === 'ACHIEVEMENT' ? '#388e3c' : '#1976d2';
      default:
        return '#757575';
    }
  };

  return (
    <Card
      elevation={2}
      sx={{
        bgcolor: getBackgroundColor(),
        borderLeft: `4px solid ${getIconColor()}`,
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
            <Box
              sx={{
                color: getIconColor(),
                mr: 2,
                mt: 0.5,
              }}
            >
              {getIcon()}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
                  {insight.title}
                </Typography>
                <Chip
                  label={insight.insightType}
                  size="small"
                  color={getSeverityColor() as any}
                  variant="outlined"
                />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {insight.description}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                    Confidence: {Math.round(insight.confidence * 100)}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={insight.confidence * 100}
                    sx={{ height: 6, borderRadius: 3 }}
                    color={getSeverityColor() as any}
                  />
                </Box>
                <Chip
                  label={insight.category}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem' }}
                />
              </Box>
            </Box>
          </Box>
          {onDismiss && (
            <IconButton
              size="small"
              onClick={() => onDismiss(insight.id)}
              sx={{ ml: 1 }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default InsightCard;
