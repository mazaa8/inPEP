import { Paper, Typography, Button, Stack } from '@mui/material';
import { AddCircleOutline, MailOutline, EventAvailable } from '@mui/icons-material';

const QuickActions = () => {
  return (
    <Paper sx={{ p: 2, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Quick Actions
      </Typography>
      <Stack direction="row" spacing={2}>
        <Button variant="contained" startIcon={<AddCircleOutline />}>
          New Admission
        </Button>
        <Button variant="outlined" startIcon={<MailOutline />}>
          Messages
        </Button>
        <Button variant="outlined" startIcon={<EventAvailable />}>
          Appointments
        </Button>
      </Stack>
    </Paper>
  );
};

export default QuickActions;
