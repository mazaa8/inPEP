import { useState, useEffect } from 'react';
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Box,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  Avatar,
} from '@mui/material';
import {
  Edit as EditIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  CalendarMonth as CalendarIcon,
  VideoCall as VideoCallIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import Layout from '../../components/layout/Layout';
import { appointmentService, type Appointment } from '../../services/appointmentService';
import { useAuth } from '../../context/AuthContext';
import { roleColors } from '../../styles/glassmorphism';
import CreateAppointmentModal from '../../components/appointments/CreateAppointmentModal';

const ProviderAppointmentsPage = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getAppointments();
      setAppointments(data);
    } catch (err) {
      console.error('Failed to load appointments:', err);
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (id: string) => {
    try {
      await appointmentService.updateAppointment(id, { status: 'CONFIRMED' });
      fetchAppointments();
    } catch (err) {
      console.error('Failed to confirm appointment:', err);
      alert('Failed to confirm appointment');
    }
  };

  const handleCancelClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedAppointment || !cancelReason.trim()) return;

    try {
      await appointmentService.cancelAppointment(selectedAppointment.id, cancelReason);
      setCancelDialogOpen(false);
      setCancelReason('');
      setSelectedAppointment(null);
      fetchAppointments();
    } catch (err) {
      console.error('Failed to cancel appointment:', err);
      alert('Failed to cancel appointment');
    }
  };

  const getStatusColor = (status: string): 'default' | 'warning' | 'success' | 'error' | 'info' => {
    switch (status) {
      case 'SCHEDULED':
        return 'warning';
      case 'CONFIRMED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      case 'COMPLETED':
        return 'info';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f1419 0%, #1a1f2e 30%, #2d1f1a 70%, #3d2a1f 100%)', p: 0 }}>
        <Layout title="" darkMode={true} themeColor="PROVIDER">
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress sx={{ color: '#FFA726' }} />
          </Box>
        </Layout>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f1419 0%, #1a1f2e 30%, #2d1f1a 70%, #3d2a1f 100%)', p: 0 }}>
        <Layout title="" darkMode={true} themeColor="PROVIDER">
          <Alert severity="error">{error}</Alert>
        </Layout>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f1419 0%, #1a1f2e 30%, #2d1f1a 70%, #3d2a1f 100%)', p: 0 }}>
      <Layout title="" darkMode={true} themeColor="PROVIDER">
        {/* Hero Header */}
        <Box sx={{ 
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 152, 0, 0.3)',
          borderRadius: '24px',
          p: 4,
          mb: 4,
          boxShadow: '0 8px 32px 0 rgba(255, 152, 0, 0.2)',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                width: 64,
                height: 64,
                borderRadius: '16px',
                background: roleColors.PROVIDER.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 8px 24px ${roleColors.PROVIDER.primary}40`,
              }}>
                <CalendarIcon sx={{ fontSize: 36, color: 'white' }} />
              </Box>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 700, color: 'white', mb: 0.5 }}>
                  Appointments
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Manage your patient appointments and schedule
                </Typography>
              </Box>
            </Box>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => setCreateModalOpen(true)}
              sx={{
                background: roleColors.PROVIDER.gradient,
                color: 'white',
                fontWeight: 600,
                px: 3,
                py: 1.5,
                borderRadius: '12px',
                boxShadow: '0 4px 16px rgba(255, 152, 0, 0.4)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 24px rgba(255, 152, 0, 0.5)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              New Appointment
            </Button>
          </Box>
        </Box>

        {/* Create Appointment Modal */}
        <CreateAppointmentModal
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSuccess={fetchAppointments}
          providerId={user?.id || ''}
          providerName={user?.name || ''}
        />

        {/* Cancel Dialog */}
        <Dialog
          open={cancelDialogOpen}
          onClose={() => setCancelDialogOpen(false)}
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
          <DialogTitle sx={{ color: '#FFB74D', fontWeight: 700, borderBottom: '1px solid rgba(255, 152, 0, 0.2)' }}>
            Cancel Appointment
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
              Please provide a reason for cancelling this appointment:
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Enter cancellation reason..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  bgcolor: 'rgba(255,255,255,0.05)',
                  '& fieldset': { borderColor: 'rgba(255, 152, 0, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 152, 0, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#FFA726' },
                },
              }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255, 152, 0, 0.2)' }}>
            <Button onClick={() => setCancelDialogOpen(false)} sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Cancel
            </Button>
            <Button 
              onClick={handleCancelConfirm}
              disabled={!cancelReason.trim()}
              sx={{
                background: roleColors.PROVIDER.gradient,
                color: 'white',
                '&:disabled': { background: 'rgba(255,255,255,0.1)' },
              }}
            >
              Confirm Cancellation
            </Button>
          </DialogActions>
        </Dialog>

        {/* Appointments Grid */}
        {appointments.length === 0 ? (
          <Box sx={{ 
            p: 6, 
            textAlign: 'center',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '20px',
            border: '1px dashed rgba(255,255,255,0.2)',
          }}>
            <CalendarIcon sx={{ fontSize: 80, color: 'rgba(255, 152, 0, 0.5)', mb: 2 }} />
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
              No Appointments Yet
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Create your first appointment to get started
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {appointments.map((appointment) => (
              <Grid item xs={12} md={6} lg={4} key={appointment.id}>
                <Card sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 152, 0, 0.2)',
                  borderRadius: '20px',
                  boxShadow: '0 4px 20px rgba(255, 152, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 32px rgba(255, 152, 0, 0.2)',
                    border: '1px solid rgba(255, 152, 0, 0.4)',
                  },
                }}>
                  <CardContent sx={{ p: 3 }}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Avatar sx={{ background: roleColors.PROVIDER.gradient, width: 48, height: 48 }}>
                        <PersonIcon />
                      </Avatar>
                      <Chip
                        label={appointment.status}
                        size="small"
                        color={getStatusColor(appointment.status)}
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>

                    {/* Patient Name */}
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                      {appointment.patientName}
                    </Typography>

                    {/* Title */}
                    <Typography variant="body2" sx={{ color: '#FFB74D', mb: 2 }}>
                      {appointment.title}
                    </Typography>

                    <Divider sx={{ bgcolor: 'rgba(255, 152, 0, 0.2)', mb: 2 }} />

                    {/* Date & Time */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <TimeIcon sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }} />
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        {new Date(appointment.startTime).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })} at {new Date(appointment.startTime).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Typography>
                    </Box>

                    {/* Location */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      {appointment.isVirtual ? (
                        <>
                          <VideoCallIcon sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }} />
                          <Chip label="Virtual" size="small" sx={{ bgcolor: 'rgba(33, 150, 243, 0.2)', color: '#2196F3' }} />
                        </>
                      ) : (
                        <>
                          <LocationIcon sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }} />
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            {appointment.location || 'Location TBD'}
                          </Typography>
                        </>
                      )}
                    </Box>

                    {/* Actions */}
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      {appointment.status === 'SCHEDULED' && (
                        <IconButton
                          size="small"
                          onClick={() => handleConfirm(appointment.id)}
                          sx={{
                            color: '#4caf50',
                            '&:hover': { bgcolor: 'rgba(76, 175, 80, 0.1)' },
                          }}
                          title="Confirm"
                        >
                          <CheckCircleIcon />
                        </IconButton>
                      )}
                      {(appointment.status === 'SCHEDULED' || appointment.status === 'CONFIRMED') && (
                        <IconButton
                          size="small"
                          onClick={() => handleCancelClick(appointment)}
                          sx={{
                            color: '#f44336',
                            '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.1)' },
                          }}
                          title="Cancel"
                        >
                          <CancelIcon />
                        </IconButton>
                      )}
                      <IconButton
                        size="small"
                        sx={{
                          color: '#FFA726',
                          '&:hover': { bgcolor: 'rgba(255, 152, 0, 0.1)' },
                        }}
                        title="Edit"
                      >
                        <EditIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Layout>
    </Box>
  );
};

export default ProviderAppointmentsPage;
