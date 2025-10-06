import { useState, useEffect } from 'react';
import { Typography, Box, Grid, Tabs, Tab, Chip, Button, Avatar, CircularProgress, Card, CardContent } from '@mui/material';
import { CalendarMonth as CalendarIcon, Receipt as BillingIcon, Payment as PaymentIcon, CheckCircle as PaidIcon, Schedule as PendingIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../components/layout/Layout';
import { appointmentService, type Appointment } from '../../../services/appointmentService';
import { roleColors } from '../../../styles/glassmorphism';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const AppointmentsBillingPage = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const patientId = 'b805ec90-e553-4de7-9de0-45f2eb73d1ba'; // Abdeen White

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getAppointments();
      setAppointments(data);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  // Mock billing data (will be replaced with real API)
  const billingData = [
    { id: 1, date: '2024-12-20', provider: 'Dr. Sarah Johnson', service: 'Cardiology Consultation', amount: 250, status: 'paid' },
    { id: 2, date: '2024-12-15', provider: 'Dr. Michael Chen', service: 'Blood Work', amount: 120, status: 'paid' },
    { id: 3, date: '2024-12-10', provider: 'Dr. Sarah Johnson', service: 'Follow-up Visit', amount: 180, status: 'pending' },
    { id: 4, date: '2024-11-28', provider: 'Dr. Emily Rodriguez', service: 'Physical Therapy', amount: 95, status: 'paid' },
  ];

  const totalPending = billingData.filter(b => b.status === 'pending').reduce((sum, b) => sum + b.amount, 0);
  const totalPaid = billingData.filter(b => b.status === 'paid').reduce((sum, b) => sum + b.amount, 0);

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f1f8f4 0%, #e8f5e9 50%, #dcedc8 100%)',
      p: 0,
    }}>
      <Layout title="" darkMode={false} themeColor="CAREGIVER">
        {/* Hero Header */}
        <Box sx={{ 
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          borderRadius: '24px',
          p: 4,
          mb: 4,
          boxShadow: '0 8px 32px 0 rgba(76, 175, 80, 0.15)',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              width: 72,
              height: 72,
              borderRadius: '18px',
              background: roleColors.CAREGIVER.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 8px 24px ${roleColors.CAREGIVER.primary}40`,
            }}>
              <CalendarIcon sx={{ fontSize: 40, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#1b5e20', mb: 0.5 }}>
                Appointments & Billing
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(27, 94, 32, 0.7)' }}>
                Manage healthcare appointments and track medical expenses
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Tabs */}
        <Box sx={{ 
          mb: 4,
          background: 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1)',
        }}>
          <Tabs 
            value={tabValue} 
            onChange={(_, newValue) => setTabValue(newValue)}
            sx={{
              '& .MuiTab-root': {
                color: 'rgba(27, 94, 32, 0.7)',
                fontWeight: 600,
                '&.Mui-selected': {
                  color: roleColors.CAREGIVER.primary,
                },
              },
              '& .MuiTabs-indicator': {
                background: roleColors.CAREGIVER.gradient,
                height: 3,
              },
            }}
          >
            <Tab label="Upcoming Appointments" />
            <Tab label="Billing & Invoices" />
          </Tabs>
        </Box>

        {/* Tab 1: Appointments */}
        <TabPanel value={tabValue} index={0}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress sx={{ color: roleColors.CAREGIVER.primary }} />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {appointments.length > 0 ? (
                appointments.map((apt) => (
                  <Grid item xs={12} key={apt.id}>
                    <Box sx={{
                      background: 'rgba(255, 255, 255, 0.7)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.8)',
                      borderRadius: '20px',
                      p: 3,
                      boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 32px rgba(76, 175, 80, 0.15)',
                      },
                    }}>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Avatar sx={{ 
                          bgcolor: roleColors.CAREGIVER.primary,
                          width: 56, 
                          height: 56,
                        }}>
                          <CalendarIcon sx={{ color: 'white' }} />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1b5e20' }}>
                              {apt.title}
                            </Typography>
                            <Chip 
                              label={apt.status}
                              size="small"
                              sx={{
                                bgcolor: apt.status === 'CONFIRMED' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 152, 0, 0.2)',
                                color: apt.status === 'CONFIRMED' ? roleColors.CAREGIVER.primary : '#f57c00',
                                fontWeight: 700,
                              }}
                            />
                          </Box>
                          <Typography variant="body2" sx={{ color: 'rgba(27, 94, 32, 0.8)', mb: 1 }}>
                            {apt.specialty && `${apt.specialty} • `}{apt.description}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
                            <Box>
                              <Typography variant="caption" sx={{ color: 'rgba(27, 94, 32, 0.6)', display: 'block' }}>
                                Date
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1b5e20' }}>
                                {formatDate(apt.startTime)}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" sx={{ color: 'rgba(27, 94, 32, 0.6)', display: 'block' }}>
                                Time
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1b5e20' }}>
                                {formatTime(apt.startTime)}
                              </Typography>
                            </Box>
                            {apt.location && (
                              <Box>
                                <Typography variant="caption" sx={{ color: 'rgba(27, 94, 32, 0.6)', display: 'block' }}>
                                  Location
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1b5e20' }}>
                                  {apt.location}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Box sx={{ 
                    p: 6, 
                    textAlign: 'center',
                    background: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px dashed rgba(76, 175, 80, 0.3)',
                    borderRadius: '20px',
                  }}>
                    <CalendarIcon sx={{ fontSize: 64, color: 'rgba(76, 175, 80, 0.4)', mb: 2 }} />
                    <Typography variant="h6" sx={{ color: '#1b5e20', fontWeight: 700 }}>
                      No Upcoming Appointments
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(27, 94, 32, 0.7)' }}>
                      Schedule a new appointment to get started
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          )}
        </TabPanel>

        {/* Tab 2: Billing */}
        <TabPanel value={tabValue} index={1}>
          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Card sx={{
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.8)',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1)',
              }}>
                <CardContent>
                  <Typography variant="caption" sx={{ color: 'rgba(27, 94, 32, 0.7)', fontWeight: 700 }}>
                    TOTAL PAID
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: roleColors.CAREGIVER.primary, mt: 1 }}>
                    ${totalPaid.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{
                background: 'rgba(255, 152, 0, 0.1)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 152, 0, 0.3)',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(255, 152, 0, 0.1)',
              }}>
                <CardContent>
                  <Typography variant="caption" sx={{ color: '#e65100', fontWeight: 700 }}>
                    PENDING PAYMENT
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#f57c00', mt: 1 }}>
                    ${totalPending.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.8)',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1)',
              }}>
                <CardContent>
                  <Typography variant="caption" sx={{ color: 'rgba(27, 94, 32, 0.7)', fontWeight: 700 }}>
                    TOTAL INVOICES
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#1b5e20', mt: 1 }}>
                    {billingData.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Billing Items */}
          <Grid container spacing={3}>
            {billingData.map((bill) => (
              <Grid item xs={12} key={bill.id}>
                <Box sx={{
                  background: 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  borderRadius: '20px',
                  p: 3,
                  boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 32px rgba(76, 175, 80, 0.15)',
                  },
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
                      <Avatar sx={{ 
                        bgcolor: bill.status === 'paid' ? roleColors.CAREGIVER.primary : '#ff9800',
                        width: 56, 
                        height: 56,
                      }}>
                        {bill.status === 'paid' ? <PaidIcon sx={{ color: 'white' }} /> : <PendingIcon sx={{ color: 'white' }} />}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1b5e20' }}>
                            {bill.service}
                          </Typography>
                          <Chip 
                            label={bill.status === 'paid' ? 'Paid' : 'Pending'}
                            size="small"
                            icon={bill.status === 'paid' ? <PaidIcon sx={{ fontSize: 16 }} /> : <PendingIcon sx={{ fontSize: 16 }} />}
                            sx={{
                              bgcolor: bill.status === 'paid' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 152, 0, 0.2)',
                              color: bill.status === 'paid' ? roleColors.CAREGIVER.primary : '#f57c00',
                              fontWeight: 700,
                            }}
                          />
                        </Box>
                        <Typography variant="body2" sx={{ color: 'rgba(27, 94, 32, 0.8)', mb: 1 }}>
                          {bill.provider}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(27, 94, 32, 0.6)' }}>
                          {formatDate(bill.date)}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#1b5e20' }}>
                        ${bill.amount.toFixed(2)}
                      </Typography>
                      {bill.status === 'pending' && (
                        <Button 
                          variant="contained"
                          size="small"
                          sx={{
                            mt: 1,
                            background: roleColors.CAREGIVER.gradient,
                            color: 'white',
                            fontWeight: 700,
                          }}
                        >
                          Pay Now
                        </Button>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
      </Layout>
    </Box>
  );
};

export default AppointmentsBillingPage;
