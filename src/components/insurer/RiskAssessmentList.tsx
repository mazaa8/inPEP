import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Typography,
  Box,
  Grid,
  LinearProgress,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { type RiskAssessment } from '../../services/insurerService';
import { roleColors } from '../../styles/glassmorphism';

interface RiskAssessmentListProps {
  assessments: RiskAssessment[];
  loading: boolean;
}

const RiskAssessmentList = ({ assessments, loading }: RiskAssessmentListProps) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return '#d32f2f';
      case 'HIGH':
        return '#f57c00';
      case 'MEDIUM':
        return '#fbc02d';
      case 'LOW':
        return '#388e3c';
      default:
        return '#757575';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'CRITICAL':
      case 'HIGH':
        return <ErrorIcon />;
      case 'MEDIUM':
        return <WarningIcon />;
      case 'LOW':
        return <CheckIcon />;
      default:
        return <CheckIcon />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress sx={{ color: roleColors.INSURER.primary }} />
      </Box>
    );
  }

  if (assessments.length === 0) {
    return (
      <Box sx={{ 
        p: 4, 
        textAlign: 'center',
        background: 'rgba(156, 39, 176, 0.05)',
        borderRadius: '16px',
        border: '1px dashed rgba(156, 39, 176, 0.3)',
      }}>
        <Typography variant="h6" sx={{ color: '#4a148c', fontWeight: 600 }}>
          No risk assessments found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      background: 'rgba(255, 255, 255, 0.5)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.8)',
    }}>
      <List sx={{ p: 2 }}>
        {assessments.map((assessment, index) => (
          <Box key={assessment.id}>
            <ListItem 
              alignItems="flex-start" 
              sx={{ 
                py: 2,
                '&:hover': {
                  bgcolor: 'rgba(156, 39, 176, 0.05)',
                  borderRadius: '12px',
                },
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ 
                  bgcolor: getRiskColor(assessment.riskLevel),
                  width: 48,
                  height: 48,
                }}>
                  {getRiskIcon(assessment.riskLevel)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#4a148c' }}>
                      {assessment.patientName}
                    </Typography>
                    <Chip
                      label={assessment.riskLevel}
                      size="small"
                      sx={{
                        bgcolor: getRiskColor(assessment.riskLevel),
                        color: 'white',
                        fontWeight: 700,
                      }}
                    />
                  </Box>
                }
                secondary={
                  <Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(74, 20, 140, 0.7)', fontWeight: 600, mb: 1 }}>
                        Risk Score: {assessment.overallRiskScore.toFixed(1)}/100
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={assessment.overallRiskScore}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: 'rgba(156, 39, 176, 0.1)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: getRiskColor(assessment.riskLevel),
                            borderRadius: 4,
                          },
                        }}
                      />
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: 'rgba(74, 20, 140, 0.6)' }}>
                          Hospitalization Risk
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#4a148c' }}>
                          {assessment.hospitalizationRisk.toFixed(0)}%
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: 'rgba(74, 20, 140, 0.6)' }}>
                          Predicted Annual Cost
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#f44336' }}>
                          {formatCurrency(assessment.costPrediction)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: 'rgba(74, 20, 140, 0.6)' }}>
                          Medications
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#4a148c' }}>
                          {assessment.medicationCount} active
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: 'rgba(74, 20, 140, 0.6)' }}>
                          Missed Appointments
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#4a148c' }}>
                          {assessment.missedAppointments}
                        </Typography>
                      </Grid>
                    </Grid>

                    {assessment.interventions && (
                      <Box sx={{ mt: 2, p: 2, background: 'rgba(156, 39, 176, 0.05)', borderRadius: '12px', border: '1px solid rgba(156, 39, 176, 0.15)' }}>
                        <Typography variant="caption" sx={{ color: '#9C27B0', fontWeight: 700 }}>
                          Recommended Interventions:
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          {JSON.parse(assessment.interventions).map((intervention: string, idx: number) => (
                            <Typography key={idx} variant="caption" display="block" sx={{ ml: 1, color: 'rgba(74, 20, 140, 0.8)' }}>
                              • {intervention}
                            </Typography>
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Box>
                }
              />
            </ListItem>
            {index < assessments.length - 1 && <Divider sx={{ bgcolor: 'rgba(156, 39, 176, 0.1)' }} />}
          </Box>
        ))}
      </List>
    </Box>
  );
};

export default RiskAssessmentList;
