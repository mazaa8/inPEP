import { useState } from 'react';
import { List, ListItem, ListItemText, Collapse, Box, Typography, Avatar, ListItemIcon } from '@mui/material';
import { Notifications, ExpandLess, ExpandMore, Medication, MonitorHeart } from '@mui/icons-material';
import { roleColors } from '../../../styles/glassmorphism';

interface RemindersProps {
  tasks: string[];
}

const Reminders = ({ tasks }: RemindersProps) => {
  const [open, setOpen] = useState(true);

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
      <Box 
        sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} 
        onClick={() => setOpen(!open)}
      >
        <Avatar sx={{ 
          background: roleColors.CAREGIVER.gradient,
          color: '#fff', 
          mr: 2,
          width: 48,
          height: 48,
          boxShadow: `0 4px 16px ${roleColors.CAREGIVER.primary}40`,
        }}>
          <Notifications />
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1b5e20', flexGrow: 1 }}>
          Reminders
        </Typography>
        {open ? <ExpandLess sx={{ color: '#1b5e20' }} /> : <ExpandMore sx={{ color: '#1b5e20' }} />}
      </Box>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{ pt: 2 }}>
          {tasks.map((task, index) => {
            const isMedicationTask = task.toLowerCase().includes('medication');
            const isBloodPressureTask = task.toLowerCase().includes('blood pressure');

            let icon = null;
            if (isMedicationTask) {
              icon = <Medication fontSize="small" />;
            } else if (isBloodPressureTask) {
              icon = <MonitorHeart fontSize="small" />;
            }

            return (
              <ListItem key={index} sx={{ pl: 4 }}>
                {icon && (
                  <ListItemIcon sx={{ minWidth: 'auto', mr: 1, color: '#f44336' }}>
                    {icon}
                  </ListItemIcon>
                )}
                <ListItemText 
                  primary={task} 
                  primaryTypographyProps={{ 
                    fontWeight: 700,
                    color: '#f44336'
                  }} 
                />
              </ListItem>
            );
          })}
        </List>
      </Collapse>
    </Box>
  );
};

export default Reminders;
