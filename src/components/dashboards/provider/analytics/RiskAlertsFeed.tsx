import { Paper, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Warning, Error, Info } from '@mui/icons-material';

const alerts = [
  {
    id: 1,
    severity: 'High',
    message: 'John Doe shows a 30% increased risk of readmission. Vitals are unstable.',
    timestamp: '2 mins ago',
  },
  {
    id: 2,
    severity: 'Medium',
    message: 'Jane Smith missed her medication dosage this morning.',
    timestamp: '15 mins ago',
  },
  {
    id: 3,
    severity: 'Low',
    message: 'Robert Johnson reported low mood for two consecutive days.',
    timestamp: '1 hour ago',
  },
  {
    id: 4,
    severity: 'High',
    message: 'Emily White\'s blood pressure has spiked unexpectedly.',
    timestamp: '3 hours ago',
  },
];

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'High':
      return <Error color="error" />;
    case 'Medium':
      return <Warning color="warning" />;
    case 'Low':
      return <Info color="info" />;
    default:
      return null;
  }
};

const RiskAlertsFeed = () => {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Risk Alerts & Real-Time Actionables</Typography>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {alerts.map((alert, index) => (
          <div key={alert.id}>
            <ListItem disablePadding>
              <ListItemButton onClick={() => window.alert(`Navigate to patient profile for alert ${alert.id}`)}>
                <ListItemIcon>
                  {getSeverityIcon(alert.severity)}
                </ListItemIcon>
                <ListItemText 
                  primary={alert.message}
                  secondary={alert.timestamp} 
                />
              </ListItemButton>
            </ListItem>
            {index < alerts.length - 1 && <Divider />}
          </div>
        ))}
      </List>
    </Paper>
  );
};

export default RiskAlertsFeed;
