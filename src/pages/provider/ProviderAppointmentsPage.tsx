import { useState, useEffect } from 'react';
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Box,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import {
  Edit as EditIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import Layout from '../../components/layout/Layout';
import { appointmentService, type Appointment } from '../../services/appointmentService';
import { useAuth } from '../../context/AuthContext';
import CreateAppointmentModal from '../../components/appointments/CreateAppointmentModal';

const ProviderAppointmentsPage = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

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
      fetchAppointments(); // Refresh list
    } catch (err) {
      console.error('Failed to confirm appointment:', err);
      alert('Failed to confirm appointment');
    }
  };

  const handleCancel = async (id: string) => {
    const reason = prompt('Please provide a cancellation reason:');
    if (reason) {
      try {
        await appointmentService.cancelAppointment(id, reason);
        fetchAppointments(); // Refresh list
      } catch (err) {
        console.error('Failed to cancel appointment:', err);
        alert('Failed to cancel appointment');
      }
    }
  };

  const getStatusColor = (status: string) => {
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
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Alert severity="error">{error}</Alert>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">My Appointments</Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => setCreateModalOpen(true)}
        >
          Create New Appointment
        </Button>
      </Box>

      <CreateAppointmentModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={fetchAppointments}
        providerId={user?.id || ''}
        providerName={user?.name || ''}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Date & Time</strong></TableCell>
              <TableCell><strong>Patient</strong></TableCell>
              <TableCell><strong>Title</strong></TableCell>
              <TableCell><strong>Specialty</strong></TableCell>
              <TableCell><strong>Location</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell align="right"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                    No appointments found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    {new Date(appointment.startTime).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                    <br />
                    <Typography variant="caption" color="text.secondary">
                      {new Date(appointment.startTime).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Typography>
                  </TableCell>
                  <TableCell>{appointment.patientName}</TableCell>
                  <TableCell>{appointment.title}</TableCell>
                  <TableCell>{appointment.specialty || '-'}</TableCell>
                  <TableCell>
                    {appointment.isVirtual ? (
                      <Chip label="Virtual" size="small" color="primary" />
                    ) : (
                      appointment.location || '-'
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={appointment.status}
                      size="small"
                      color={getStatusColor(appointment.status)}
                    />
                  </TableCell>
                  <TableCell align="right">
                    {appointment.status === 'SCHEDULED' && (
                      <>
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleConfirm(appointment.id)}
                          title="Confirm"
                        >
                          <CheckCircleIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleCancel(appointment.id)}
                          title="Cancel"
                        >
                          <CancelIcon />
                        </IconButton>
                      </>
                    )}
                    {appointment.status === 'CONFIRMED' && (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleCancel(appointment.id)}
                        title="Cancel"
                      >
                        <CancelIcon />
                      </IconButton>
                    )}
                    <IconButton size="small" color="primary" title="Edit">
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Layout>
  );
};

export default ProviderAppointmentsPage;
