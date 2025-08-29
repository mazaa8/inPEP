import { Paper, Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AddCircleOutline, MailOutline, EventAvailable } from '@mui/icons-material';

const QuickActions = () => {
  const navigate = useNavigate();
  return (
    <Paper sx={{ p: 2, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Quick Actions
      </Typography>
      <Stack direction="row" spacing={2}>
        <Button variant="contained" startIcon={<AddCircleOutline />}>
          New Admission
        </Button>
        <Button variant="outlined" startIcon={<MailOutline />} onClick={() => navigate('/provider/messages')}>
          Messages
        </Button>
        <Button variant="outlined" startIcon={<EventAvailable />} onClick={() => navigate('/provider/appointments')}>
          Appointments
        </Button>
      </Stack>
    </Paper>
  );
};

export default QuickActions;
