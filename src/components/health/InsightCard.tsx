import {
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

  const getBackgroundColor = () => {
    switch (insight.severity) {
      case 'CRITICAL':
        return 'rgba(244, 67, 54, 0.1)';
      case 'ALERT':
        return 'rgba(255, 152, 0, 0.1)';
      case 'WARNING':
        return 'rgba(255, 193, 7, 0.1)';
      case 'INFO':
        return insight.insightType === 'ACHIEVEMENT' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(33, 150, 243, 0.1)';
      default:
        return 'rgba(255,255,255,0.05)';
    }
  };

  const getIconColor = () => {
    switch (insight.severity) {
      case 'CRITICAL':
        return '#f44336';
      case 'ALERT':
        return '#FF9800';
      case 'WARNING':
        return '#FFC107';
      case 'INFO':
        return insight.insightType === 'ACHIEVEMENT' ? '#4CAF50' : '#2196F3';
      default:
        return '#9E9E9E';
    }
  };

  return (
    <Box
      sx={{
        background: getBackgroundColor(),
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderLeft: `4px solid ${getIconColor()}`,
        borderRadius: '12px',
        border: `1px solid ${getIconColor()}40`,
        p: 2.5,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateX(4px)',
          boxShadow: `0 4px 20px ${getIconColor()}30`,
        },
      }}
    >
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
              <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 700, color: 'white' }}>
                {insight.title}
              </Typography>
              <Chip
                label={insight.insightType}
                size="small"
                sx={{
                  bgcolor: `${getIconColor()}30`,
                  color: getIconColor(),
                  fontWeight: 700,
                  border: 'none',
                }}
              />
            </Box>
            <Typography variant="body2" sx={{ mb: 1.5, color: 'rgba(255,255,255,0.8)' }}>
              {insight.description}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ mb: 0.5, display: 'block', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
                  Confidence: {Math.round(insight.confidence * 100)}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={insight.confidence * 100}
                  sx={{ 
                    height: 6, 
                    borderRadius: 3,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: getIconColor(),
                      borderRadius: 3,
                    },
                  }}
                />
              </Box>
              <Chip
                label={insight.category}
                size="small"
                sx={{ 
                  fontSize: '0.7rem',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.8)',
                  fontWeight: 600,
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              />
            </Box>
          </Box>
        </Box>
        {onDismiss && (
          <IconButton
            size="small"
            onClick={() => onDismiss(insight.id)}
            sx={{ 
              ml: 1,
              color: 'rgba(255,255,255,0.6)',
              '&:hover': {
                color: 'white',
                bgcolor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default InsightCard;
