import { Card, CardContent, Typography, Box, List, ListItem, ListItemIcon, ListItemText, Checkbox, Avatar, Divider } from '@mui/material';
import { Medication } from '@mui/icons-material';

const medications = [
  { id: 1, name: 'Lisinopril', dose: '10mg', time: '8:00 AM', taken: true },
  { id: 2, name: 'Metformin', dose: '500mg', time: '8:00 AM', taken: true },
  { id: 3, name: 'Atorvastatin', dose: '20mg', time: '8:00 PM', taken: false },
  { id: 4, name: 'Aspirin', dose: '81mg', time: '8:00 PM', taken: false },
];

const MedicationChecklist = () => {
  return (
    <Card sx={{ background: 'linear-gradient(135deg, #F4F7F6 0%, #E9EFEE 100%)', color: '#2D4A43', borderRadius: '16px', boxShadow: '0 12px 32px rgba(0,0,0,0.1)' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ background: 'linear-gradient(135deg, #78A698 0%, #4A7C6E 100%)', color: '#fff', mr: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
            <Medication />
          </Avatar>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', letterSpacing: '0.5px' }}>
            Medication Checklist
          </Typography>
        </Box>
        <List sx={{ p: 0 }}>
          {medications.map((med, index) => (
            <div key={med.id}>
              <ListItem sx={{ px: 1 }}>
                <ListItemIcon sx={{ minWidth: 'auto', mr: 1.5 }}>
                  <Checkbox edge="start" checked={med.taken} sx={{ color: '#4A7C6E', '&.Mui-checked': { color: '#4A7C6E' } }} />
                </ListItemIcon>
                <ListItemText 
                  primaryTypographyProps={{ fontWeight: '500' }}
                  primary={`${med.name} ${med.dose}`}
                  secondary={med.time} 
                />
              </ListItem>
              {index < medications.length - 1 && <Divider variant="inset" component="li" sx={{ ml: '56px' }} />}
            </div>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default MedicationChecklist;
