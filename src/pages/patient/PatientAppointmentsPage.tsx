import { useState, useEffect } from 'react';
import {
  Typography,
  Paper,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  VideoCall as VideoIcon,
} from '@mui/icons-material';
import Layout from '../../components/layout/Layout';
import { appointmentService, type Appointment } from '../../services/appointmentService';

const PatientAppointmentsPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Layout title="My Appointments">
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="My Appointments">
        <Alert severity="error">{error}</Alert>
      </Layout>
    );
  }

  if (appointments.length === 0) {
    return (
      <Layout title="My Appointments">
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No appointments scheduled
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Your upcoming appointments will appear here
          </Typography>
        </Paper>
      </Layout>
    );
  }

  return (
    <Layout title="My Appointments">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          My Appointments
        </Typography>
        <Typography variant="body2" color="text.secondary">
          View and manage your upcoming appointments
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {appointments.map((appointment) => (
          <Grid item xs={12} key={appointment.id}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {appointment.title}
                    </Typography>
                    <Chip
                      label={appointment.status}
                      size="small"
                      color={getStatusColor(appointment.status)}
                      sx={{ mr: 1 }}
                    />
                    {appointment.specialty && (
                      <Chip
                        label={appointment.specialty}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2">
                        {formatDate(appointment.startTime)}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <TimeIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2">
                        {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2">
                        Dr. {appointment.providerName}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {appointment.isVirtual ? (
                        <>
                          <VideoIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="body2">Virtual Appointment</Typography>
                        </>
                      ) : (
                        <>
                          <LocationIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="body2">
                            {appointment.location || 'Location TBD'}
                          </Typography>
                        </>
                      )}
                    </Box>
                  </Grid>
                </Grid>

                {appointment.description && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Details:</strong> {appointment.description}
                    </Typography>
                  </Box>
                )}

                {appointment.notes && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Notes:</strong> {appointment.notes}
                    </Typography>
                  </Box>
                )}

                {appointment.isVirtual && appointment.meetingLink && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      <strong>Meeting Link:</strong>{' '}
                      <a href={appointment.meetingLink} target="_blank" rel="noopener noreferrer">
                        Join Virtual Appointment
                      </a>
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Layout>
  );
};

export default PatientAppointmentsPage;
