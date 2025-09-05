import { List, ListItem, ListItemText, Avatar, ListItemAvatar, ListItemButton } from '@mui/material';

const patients = [
  { id: 1, name: 'John Doe', condition: 'Hypertension', avatar: 'JD' },
  { id: 2, name: 'Jane Smith', condition: 'Diabetes Type 2', avatar: 'JS' },
  { id: 3, name: 'Peter Jones', condition: 'Asthma', avatar: 'PJ' },
];

const PatientList = () => {
  return (
      <List sx={{ p: 0 }}>
        {patients.map((patient) => (
          <ListItem key={patient.id} disablePadding>
            <ListItemButton>
            <ListItemAvatar>
              <Avatar>{patient.avatar}</Avatar>
            </ListItemAvatar>
            <ListItemText primary={patient.name} secondary={patient.condition} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
  );
};

export default PatientList;
