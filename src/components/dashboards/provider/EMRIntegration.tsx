import { Typography, List, ListItem, ListItemButton, ListItemText, Divider, Box } from '@mui/material';
import { CheckCircle, Error } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

// Placeholder data
const emrSyncStatus = {
  isSynced: true,
  lastSync: '2 minutes ago',
};

const patients = [
  { id: 1, name: 'John Doe', emrLink: '/patients/1/emr' },
  { id: 2, name: 'Jane Smith', emrLink: '/patients/2/emr' },
  { id: 3, name: 'Robert Johnson', emrLink: '/patients/3/emr' },
  { id: 4, name: 'Emily White', emrLink: '/patients/4/emr' },
];

const EMRIntegration = () => {
  return (
    <Box sx={{ p: 2, mt: 4 }}>
      
      {/* Live Data Sync Status */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {emrSyncStatus.isSynced ? (
          <CheckCircle color="success" sx={{ mr: 1 }} />
        ) : (
          <Error color="error" sx={{ mr: 1 }} />
        )}
        <Typography variant="subtitle1">
          Live Data Sync Status: {emrSyncStatus.isSynced ? 'Active' : 'Inactive'}
        </Typography>
        <Typography variant="body2" sx={{ ml: 2, color: 'text.secondary' }}>
          (Last sync: {emrSyncStatus.lastSync})
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Patient EMR Data */}
      <Typography variant="subtitle1" gutterBottom>Patient EMR Data</Typography>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {patients.map((patient, index) => (
          <div key={patient.id}>
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to={patient.emrLink}>
                <ListItemText primary={patient.name} />
              </ListItemButton>
            </ListItem>
            {index < patients.length - 1 && <Divider />}
          </div>
        ))}
      </List>
    </Box>
  );
};

export default EMRIntegration;
