import { Box, Typography, Chip, Grid, Divider } from '@mui/material';
import { LocalHospital, PersonOff, Healing, Psychology } from '@mui/icons-material';

interface StructuredDetailsViewProps {
  eventType: string;
  structuredDetails?: string;
}

const StructuredDetailsView = ({ eventType, structuredDetails }: StructuredDetailsViewProps) => {
  if (!structuredDetails) return null;

  let details: any;
  try {
    details = JSON.parse(structuredDetails);
  } catch {
    return null;
  }

  const getEventColor = (type: string) => {
    const colors: Record<string, string> = {
      'Seizure': '#f44336',
      'Fall': '#ff9800',
      'Allergic Reaction': '#e91e63',
      'Behavioral Change': '#9c27b0',
    };
    return colors[type] || '#999';
  };

  const getEventIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      'Seizure': <LocalHospital />,
      'Fall': <PersonOff />,
      'Allergic Reaction': <Healing />,
      'Behavioral Change': <Psychology />,
    };
    return icons[type];
  };

  return (
    <Box sx={{ mt: 3, p: 3, bgcolor: `${getEventColor(eventType)}10`, borderRadius: '16px', border: `2px solid ${getEventColor(eventType)}40` }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Box sx={{ color: getEventColor(eventType) }}>
          {getEventIcon(eventType)}
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700, color: getEventColor(eventType) }}>
          Structured {eventType} Details
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />

      {/* Seizure Details */}
      {eventType === 'Seizure' && (
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Typography variant="caption" color="text.secondary">Duration</Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>{details.duration}s</Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="caption" color="text.secondary">Severity</Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>{details.severity}/10</Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="caption" color="text.secondary">Recovery Time</Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>{details.recoveryTime}m</Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="caption" color="text.secondary">Witnessed</Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>{details.witnessed ? 'Yes' : 'No'}</Typography>
          </Grid>
          {details.location && (
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary">Location</Typography>
              <Typography variant="body1">{details.location}</Typography>
            </Grid>
          )}
          {details.triggers && details.triggers.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>Triggers</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {details.triggers.map((trigger: string, idx: number) => (
                  <Chip key={idx} label={trigger} size="small" sx={{ bgcolor: `${getEventColor(eventType)}20`, color: getEventColor(eventType) }} />
                ))}
              </Box>
            </Grid>
          )}
        </Grid>
      )}

      {/* Fall Details */}
      {eventType === 'Fall' && (
        <Grid container spacing={2}>
          {details.location && (
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary">Location</Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>{details.location}</Typography>
            </Grid>
          )}
          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">Assistance Needed</Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>{details.assistanceNeeded ? 'Yes' : 'No'}</Typography>
          </Grid>
          {details.injuries && details.injuries.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>Injuries</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {details.injuries.map((injury: string, idx: number) => (
                  <Chip key={idx} label={injury} size="small" sx={{ bgcolor: `${getEventColor(eventType)}20`, color: getEventColor(eventType) }} />
                ))}
              </Box>
            </Grid>
          )}
          {details.environmentalFactors && details.environmentalFactors.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>Environmental Factors</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {details.environmentalFactors.map((factor: string, idx: number) => (
                  <Chip key={idx} label={factor} size="small" sx={{ bgcolor: `${getEventColor(eventType)}20`, color: getEventColor(eventType) }} />
                ))}
              </Box>
            </Grid>
          )}
          {details.preventionMeasures && details.preventionMeasures.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>Prevention Measures Taken</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {details.preventionMeasures.map((measure: string, idx: number) => (
                  <Chip key={idx} label={measure} size="small" sx={{ bgcolor: '#4caf50', color: 'white' }} />
                ))}
              </Box>
            </Grid>
          )}
        </Grid>
      )}

      {/* Allergic Reaction Details */}
      {eventType === 'Allergic Reaction' && (
        <Grid container spacing={2}>
          {details.allergen && (
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary">Allergen</Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>{details.allergen}</Typography>
            </Grid>
          )}
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Severity</Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>{details.severity}/10</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Response Time</Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>{details.responseTime}m</Typography>
          </Grid>
          {details.symptoms && details.symptoms.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>Symptoms</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {details.symptoms.map((symptom: string, idx: number) => (
                  <Chip key={idx} label={symptom} size="small" sx={{ bgcolor: `${getEventColor(eventType)}20`, color: getEventColor(eventType) }} />
                ))}
              </Box>
            </Grid>
          )}
          {details.treatmentGiven && (
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary">Treatment Given</Typography>
              <Typography variant="body1">{details.treatmentGiven}</Typography>
            </Grid>
          )}
        </Grid>
      )}

      {/* Behavioral Change Details */}
      {eventType === 'Behavioral Change' && (
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Duration</Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>{details.duration}m</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Intervention Effectiveness</Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>{details.effectiveness}/10</Typography>
          </Grid>
          {details.behaviors && details.behaviors.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>Observed Behaviors</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {details.behaviors.map((behavior: string, idx: number) => (
                  <Chip key={idx} label={behavior} size="small" sx={{ bgcolor: `${getEventColor(eventType)}20`, color: getEventColor(eventType) }} />
                ))}
              </Box>
            </Grid>
          )}
          {details.triggers && details.triggers.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>Triggers</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {details.triggers.map((trigger: string, idx: number) => (
                  <Chip key={idx} label={trigger} size="small" sx={{ bgcolor: `${getEventColor(eventType)}20`, color: getEventColor(eventType) }} />
                ))}
              </Box>
            </Grid>
          )}
          {details.interventions && details.interventions.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>Interventions Used</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {details.interventions.map((intervention: string, idx: number) => (
                  <Chip key={idx} label={intervention} size="small" sx={{ bgcolor: '#4caf50', color: 'white' }} />
                ))}
              </Box>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default StructuredDetailsView;
