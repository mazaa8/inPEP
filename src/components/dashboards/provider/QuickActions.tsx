import { useState } from 'react';
import { Paper, Typography, Button, Stack, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemButton, ListItemText, ListItemAvatar, Avatar, Box as MuiBox } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AddCircleOutline, MailOutline, EventAvailable, VideoCall, Person } from '@mui/icons-material';
import { roleColors } from '../../../styles/glassmorphism';
import NewAdmissionDialog from '../../provider/NewAdmissionDialog';
import { useVideoCall } from '../../../context/VideoCallContext';

const QuickActions = () => {
  const navigate = useNavigate();
  const { initiateCall } = useVideoCall();
  const [admissionDialogOpen, setAdmissionDialogOpen] = useState(false);
  const [patientSelectOpen, setPatientSelectOpen] = useState(false);

  // Mock patients for telehealth (in real app, fetch from API)
  const patients = [
    { id: 'P001', name: 'Abdeen White', status: 'online' },
    { id: 'P002', name: 'Jan Graham', status: 'online' },
    { id: 'P003', name: 'Steven Cameron', status: 'offline' },
  ];

  const handleAdmissionSuccess = () => {
    // Refresh the page or show success notification
    window.location.reload();
  };

  const handleStartTelehealth = () => {
    setPatientSelectOpen(true);
  };

  const handleSelectPatient = (patientId: string, patientName: string) => {
    initiateCall(patientId, patientName);
    setPatientSelectOpen(false);
    // Video call will open via VideoCallContext
    // The VideoCall modal is managed by the context and will appear automatically
  };

  return (
    <>
      <NewAdmissionDialog
        open={admissionDialogOpen}
        onClose={() => setAdmissionDialogOpen(false)}
        onSuccess={handleAdmissionSuccess}
      />

      {/* Patient Selection Dialog for Telehealth */}
      <Dialog
        open={patientSelectOpen}
        onClose={() => setPatientSelectOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.98) 0%, rgba(45, 36, 22, 0.98) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 152, 0, 0.3)',
            borderRadius: '20px',
          },
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid rgba(255, 152, 0, 0.2)',
          color: '#FFB74D',
          fontWeight: 700,
        }}>
          Select Patient for Telehealth
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <List>
            {patients.map((patient) => (
              <ListItem key={patient.id} disablePadding>
                <ListItemButton
                  onClick={() => handleSelectPatient(patient.id, patient.name)}
                  disabled={patient.status === 'offline'}
                  sx={{
                    borderRadius: '12px',
                    mb: 1,
                    '&:hover': {
                      background: 'rgba(255, 152, 0, 0.1)',
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ 
                      background: patient.status === 'online' 
                        ? 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)'
                        : 'rgba(255, 255, 255, 0.2)',
                    }}>
                      <Person />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={patient.name}
                    secondary={patient.status === 'online' ? 'Available' : 'Offline'}
                    primaryTypographyProps={{ sx: { color: 'white', fontWeight: 600 } }}
                    secondaryTypographyProps={{ 
                      sx: { 
                        color: patient.status === 'online' ? '#4caf50' : 'rgba(255, 255, 255, 0.5)',
                      } 
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255, 152, 0, 0.2)' }}>
          <Button 
            onClick={() => setPatientSelectOpen(false)}
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': { background: 'rgba(255, 255, 255, 0.05)' },
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

    <Paper sx={{ 
      p: 3,
      background: 'rgba(255, 255, 255, 0.06)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 152, 0, 0.25)',
      borderRadius: '20px',
      boxShadow: '0 4px 20px rgba(255, 152, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
    }}>
      <Typography variant="h6" gutterBottom sx={{ color: '#FFA726', fontWeight: 700, mb: 2 }}>
        Quick Actions
      </Typography>
      <Stack direction="row" spacing={2} flexWrap="wrap" gap={2}>
        <Button 
          variant="contained" 
          startIcon={<AddCircleOutline />}
          onClick={() => setAdmissionDialogOpen(true)}
          sx={{
            background: roleColors.PROVIDER.gradient,
            color: 'white',
            fontWeight: 600,
            px: 3,
            py: 1.5,
            borderRadius: '12px',
            boxShadow: `0 4px 16px ${roleColors.PROVIDER.primary}40`,
            '&:hover': {
              background: roleColors.PROVIDER.gradient,
              transform: 'translateY(-2px)',
              boxShadow: `0 6px 20px ${roleColors.PROVIDER.primary}60`,
            },
            transition: 'all 0.3s ease',
          }}
        >
          New Admission
        </Button>
        <Button 
          variant="outlined" 
          startIcon={<VideoCall />}
          onClick={handleStartTelehealth}
          sx={{
            borderColor: 'rgba(255, 152, 0, 0.5)',
            color: '#FFA726',
            fontWeight: 600,
            px: 3,
            py: 1.5,
            borderRadius: '12px',
            '&:hover': {
              borderColor: '#FFA726',
              background: 'rgba(255, 152, 0, 0.1)',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Start Telehealth
        </Button>
        <Button 
          variant="outlined" 
          startIcon={<MailOutline />} 
          onClick={() => navigate('/provider/messages')}
          sx={{
            borderColor: 'rgba(255, 152, 0, 0.5)',
            color: '#FFA726',
            fontWeight: 600,
            px: 3,
            py: 1.5,
            borderRadius: '12px',
            '&:hover': {
              borderColor: '#FFA726',
              background: 'rgba(255, 152, 0, 0.1)',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Messages
        </Button>
        <Button 
          variant="outlined" 
          startIcon={<EventAvailable />} 
          onClick={() => navigate('/provider/appointments')}
          sx={{
            borderColor: 'rgba(255, 152, 0, 0.5)',
            color: '#FFA726',
            fontWeight: 600,
            px: 3,
            py: 1.5,
            borderRadius: '12px',
            '&:hover': {
              borderColor: '#FFA726',
              background: 'rgba(255, 152, 0, 0.1)',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Appointments
        </Button>
      </Stack>
    </Paper>
    </>
  );
};

export default QuickActions;
