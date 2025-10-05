import {
  Paper,
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
        <CircularProgress />
      </Box>
    );
  }

  if (assessments.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No risk assessments found
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper>
      <List>
        {assessments.map((assessment, index) => (
          <Box key={assessment.id}>
            <ListItem alignItems="flex-start" sx={{ py: 2 }}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: getRiskColor(assessment.riskLevel) }}>
                  {getRiskIcon(assessment.riskLevel)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="h6" sx={{ fontSize: '1rem' }}>
                      {assessment.patientName}
                    </Typography>
                    <Chip
                      label={assessment.riskLevel}
                      size="small"
                      sx={{
                        bgcolor: getRiskColor(assessment.riskLevel),
                        color: 'white',
                        fontWeight: 'bold',
                      }}
                    />
                  </Box>
                }
                secondary={
                  <Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Risk Score: {assessment.overallRiskScore.toFixed(1)}/100
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={assessment.overallRiskScore}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: getRiskColor(assessment.riskLevel),
                          },
                        }}
                      />
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Hospitalization Risk
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {assessment.hospitalizationRisk.toFixed(0)}%
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Predicted Annual Cost
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
                          {formatCurrency(assessment.costPrediction)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Medications
                        </Typography>
                        <Typography variant="body2">
                          {assessment.medicationCount} active
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Missed Appointments
                        </Typography>
                        <Typography variant="body2">
                          {assessment.missedAppointments}
                        </Typography>
                      </Grid>
                    </Grid>

                    {assessment.interventions && (
                      <Box sx={{ mt: 2, p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                          Recommended Interventions:
                        </Typography>
                        <Box sx={{ mt: 0.5 }}>
                          {JSON.parse(assessment.interventions).map((intervention: string, idx: number) => (
                            <Typography key={idx} variant="caption" display="block" sx={{ ml: 1 }}>
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
            {index < assessments.length - 1 && <Divider />}
          </Box>
        ))}
      </List>
    </Paper>
  );
};

export default RiskAssessmentList;
