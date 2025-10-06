import { Box, Typography, Chip, Alert, AlertTitle, Collapse } from '@mui/material';
import { Warning as WarningIcon, ExpandMore as ExpandIcon } from '@mui/icons-material';
import { useState } from 'react';
import { type FoodDrugInteraction, FoodDrugInteractionChecker } from '../../utils/foodDrugInteractions';

interface FoodDrugInteractionWarningProps {
  interactions: FoodDrugInteraction[];
}

const FoodDrugInteractionWarning = ({ interactions }: FoodDrugInteractionWarningProps) => {
  const [expanded, setExpanded] = useState(false);

  if (interactions.length === 0) return null;

  const severeInteractions = interactions.filter(i => i.severity === 'severe');
  const moderateInteractions = interactions.filter(i => i.severity === 'moderate');
  const minorInteractions = interactions.filter(i => i.severity === 'minor');

  const highestSeverity = severeInteractions.length > 0 ? 'severe' : 
                          moderateInteractions.length > 0 ? 'moderate' : 'minor';

  const getSeverityLevel = () => {
    if (highestSeverity === 'severe') return 'error';
    if (highestSeverity === 'moderate') return 'warning';
    return 'info';
  };

  return (
    <Alert 
      severity={getSeverityLevel()}
      icon={<WarningIcon />}
      sx={{ 
        mb: 2,
        background: highestSeverity === 'severe' ? 'rgba(244, 67, 54, 0.1)' : 
                    highestSeverity === 'moderate' ? 'rgba(255, 152, 0, 0.1)' : 
                    'rgba(255, 193, 7, 0.1)',
        border: `2px solid ${FoodDrugInteractionChecker.getSeverityColor(highestSeverity)}`,
      }}
    >
      <AlertTitle sx={{ fontWeight: 700 }}>
        ⚠️ Food-Drug Interaction Warning
      </AlertTitle>
      
      <Typography variant="body2" sx={{ mb: 1 }}>
        This recipe contains ingredients that may interact with your medications:
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
        {severeInteractions.length > 0 && (
          <Chip 
            label={`${severeInteractions.length} Severe`}
            size="small"
            sx={{ 
              bgcolor: 'rgba(244, 67, 54, 0.2)',
              color: '#f44336',
              fontWeight: 700,
            }}
          />
        )}
        {moderateInteractions.length > 0 && (
          <Chip 
            label={`${moderateInteractions.length} Moderate`}
            size="small"
            sx={{ 
              bgcolor: 'rgba(255, 152, 0, 0.2)',
              color: '#ff9800',
              fontWeight: 700,
            }}
          />
        )}
        {minorInteractions.length > 0 && (
          <Chip 
            label={`${minorInteractions.length} Minor`}
            size="small"
            sx={{ 
              bgcolor: 'rgba(255, 193, 7, 0.2)',
              color: '#ffc107',
              fontWeight: 700,
            }}
          />
        )}
      </Box>

      <Box 
        onClick={() => setExpanded(!expanded)}
        sx={{ 
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          '&:hover': { opacity: 0.8 },
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: 600 }}>
          {expanded ? 'Hide' : 'Show'} Details
        </Typography>
        <ExpandIcon sx={{ 
          fontSize: 16,
          transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s',
        }} />
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ mt: 2 }}>
          {interactions.map((interaction, index) => (
            <Box 
              key={index}
              sx={{ 
                p: 2,
                mb: 1,
                background: 'rgba(255, 255, 255, 0.5)',
                borderRadius: '8px',
                borderLeft: `4px solid ${FoodDrugInteractionChecker.getSeverityColor(interaction.severity)}`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {interaction.medicationName}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  + {interaction.foodItem}
                </Typography>
                <Chip 
                  label={interaction.severity}
                  size="small"
                  sx={{ 
                    bgcolor: `${FoodDrugInteractionChecker.getSeverityColor(interaction.severity)}20`,
                    color: FoodDrugInteractionChecker.getSeverityColor(interaction.severity),
                    fontWeight: 600,
                    fontSize: '0.65rem',
                  }}
                />
              </Box>
              <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                {interaction.description}
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', fontWeight: 600, color: 'primary.main' }}>
                💡 {interaction.recommendation}
              </Typography>
            </Box>
          ))}
        </Box>
      </Collapse>
    </Alert>
  );
};

export default FoodDrugInteractionWarning;
