import { Typography, Box, List, ListItem, ListItemIcon, ListItemText, Checkbox, Avatar, Divider } from '@mui/material';
import { Medication as MedicationIcon } from '@mui/icons-material';
import { roleColors } from '../../../styles/glassmorphism';

export interface Medication {
  id: number;
  name: string;
  dose: string;
  time: string;
  taken: boolean;
}

interface MedicationChecklistProps {
  medications: Medication[];
  onToggle: (id: number) => void;
}

const MedicationChecklist = ({ medications, onToggle }: MedicationChecklistProps) => {
  return (
    <Box sx={{ 
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.8)',
      borderRadius: '20px',
      p: 3,
      boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1)',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 32px rgba(76, 175, 80, 0.15)',
      },
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar sx={{ 
          background: roleColors.CAREGIVER.gradient,
          color: '#fff', 
          mr: 2,
          width: 48,
          height: 48,
          boxShadow: `0 4px 16px ${roleColors.CAREGIVER.primary}40`,
        }}>
          <MedicationIcon />
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1b5e20' }}>
          Medication Checklist
        </Typography>
      </Box>
      <List sx={{ p: 0 }}>
        {medications.map((med, index) => (
          <div key={med.id}>
            <ListItem sx={{ px: 1 }} button onClick={() => onToggle(med.id)}>
              <ListItemIcon sx={{ minWidth: 'auto', mr: 1.5 }}>
                <Checkbox 
                  edge="start" 
                  checked={med.taken} 
                  sx={{ 
                    color: roleColors.CAREGIVER.primary,
                    '&.Mui-checked': { color: roleColors.CAREGIVER.primary },
                  }} 
                  tabIndex={-1} 
                  disableRipple 
                />
              </ListItemIcon>
              <ListItemText 
                primaryTypographyProps={{ fontWeight: 600, color: '#1b5e20' }}
                primary={`${med.name} ${med.dose}`}
                secondary={med.time}
                secondaryTypographyProps={{ color: 'rgba(27, 94, 32, 0.7)' }}
              />
            </ListItem>
            {index < medications.length - 1 && <Divider variant="inset" component="li" sx={{ ml: '56px', bgcolor: 'rgba(76, 175, 80, 0.1)' }} />}
          </div>
        ))}
      </List>
    </Box>
  );
};

export default MedicationChecklist;
