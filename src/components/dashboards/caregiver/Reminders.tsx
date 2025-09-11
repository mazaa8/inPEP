import { useState } from 'react';
import { Card, CardContent, List, ListItem, ListItemText, Collapse, Box, Typography, Avatar, ListItemIcon } from '@mui/material';
import { Notifications, ExpandLess, ExpandMore, Medication, MonitorHeart } from '@mui/icons-material';

interface RemindersProps {
  tasks: string[];
}

const Reminders = ({ tasks }: RemindersProps) => {
  const [open, setOpen] = useState(true);

  return (
    <Card sx={{ background: 'linear-gradient(135deg, #F4F7F6 0%, #E9EFEE 100%)', color: '#2D4A43', borderRadius: '16px', boxShadow: '0 12px 32px rgba(0,0,0,0.1)' }}>
      <CardContent>
        <Box 
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} 
          onClick={() => setOpen(!open)}
        >
          <Avatar sx={{ background: 'linear-gradient(135deg, #78A698 0%, #4A7C6E 100%)', color: '#fff', mr: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
            <Notifications />
          </Avatar>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', letterSpacing: '0.5px', flexGrow: 1 }}>
            Reminders
          </Typography>
          {open ? <ExpandLess /> : <ExpandMore />}
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
                    <ListItemIcon sx={{ minWidth: 'auto', mr: 1, color: 'error.dark' }}>
                      {icon}
                    </ListItemIcon>
                  )}
                  <ListItemText 
                    primary={task} 
                    primaryTypographyProps={{ 
                      fontWeight: 'bold',
                      color: 'error.dark'
                    }} 
                  />
                </ListItem>
              );
            })}
          </List>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default Reminders;
