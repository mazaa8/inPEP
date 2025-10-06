import { useState, useEffect } from 'react';
import { Typography, Box, Grid, Tabs, Tab, Chip, Button, Avatar, CircularProgress, Card, CardContent, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { CalendarMonth as CalendarIcon, Receipt as BillingIcon, Payment as PaymentIcon, CheckCircle as PaidIcon, Schedule as PendingIcon, Download as DownloadIcon, Merge as MergeIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../components/layout/Layout';
import { appointmentService, type Appointment } from '../../../services/appointmentService';
import { roleColors } from '../../../styles/glassmorphism';
import jsPDF from 'jspdf';

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
  const [selectedInvoices, setSelectedInvoices] = useState<number[]>([]);
  const [consolidateDialogOpen, setConsolidateDialogOpen] = useState(false);

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

  const handleSelectInvoice = (id: number) => {
    setSelectedInvoices(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleDownloadPDF = (invoiceIds: number[]) => {
    const invoices = billingData.filter(b => invoiceIds.includes(b.id));
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(27, 94, 32);
    doc.text('inPEP Healthcare', 105, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text(invoices.length > 1 ? 'Consolidated Invoice' : 'Invoice', 105, 30, { align: 'center' });
    
    // Date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 38, { align: 'center' });
    
    let yPosition = 50;
    
    // Patient Info
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text('Bill To:', 20, yPosition);
    yPosition += 7;
    doc.setFontSize(10);
    doc.text('Nora White (Caregiver)', 20, yPosition);
    yPosition += 5;
    doc.text('Patient: Abdeen White', 20, yPosition);
    yPosition += 15;
    
    // Invoice Details
    doc.setFontSize(12);
    doc.setTextColor(27, 94, 32);
    doc.text('Invoice Details', 20, yPosition);
    yPosition += 10;
    
    // Table Header
    doc.setFillColor(76, 175, 80);
    doc.rect(20, yPosition - 5, 170, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('Date', 25, yPosition);
    doc.text('Service', 55, yPosition);
    doc.text('Provider', 110, yPosition);
    doc.text('Amount', 165, yPosition);
    yPosition += 10;
    
    // Invoice Items
    doc.setTextColor(0);
    let total = 0;
    invoices.forEach((invoice, index) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Alternate row colors
      if (index % 2 === 0) {
        doc.setFillColor(240, 248, 241);
        doc.rect(20, yPosition - 5, 170, 8, 'F');
      }
      
      doc.text(formatDate(invoice.date), 25, yPosition);
      doc.text(invoice.service.substring(0, 25), 55, yPosition);
      doc.text(invoice.provider.substring(0, 20), 110, yPosition);
      doc.text(`$${invoice.amount.toFixed(2)}`, 165, yPosition);
      total += invoice.amount;
      yPosition += 10;
    });
    
    // Total
    yPosition += 5;
    doc.setDrawColor(76, 175, 80);
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 10;
    doc.setFontSize(12);
    doc.setTextColor(27, 94, 32);
    doc.text('Total Amount:', 130, yPosition);
    doc.text(`$${total.toFixed(2)}`, 165, yPosition);
    
    // Footer
    yPosition += 20;
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text('Thank you for using inPEP Healthcare Services', 105, yPosition, { align: 'center' });
    doc.text('For questions, contact: support@inpep.com', 105, yPosition + 5, { align: 'center' });
    
    // Save PDF
    const fileName = invoices.length > 1 
      ? `inPEP_Consolidated_Invoice_${new Date().toISOString().split('T')[0]}.pdf`
      : `inPEP_Invoice_${invoices[0].id}_${new Date().toISOString().split('T')[0]}.pdf`;
    
    doc.save(fileName);
  };

  const handleConsolidateInvoices = () => {
    if (selectedInvoices.length < 2) {
      alert('Please select at least 2 invoices to consolidate');
      return;
    }
    setConsolidateDialogOpen(true);
  };

  const confirmConsolidate = () => {
    handleDownloadPDF(selectedInvoices);
    setConsolidateDialogOpen(false);
    setSelectedInvoices([]);
  };

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
                  <Typography variant="caption" sx={{ color: '#FF0000', fontWeight: 700 }}>
                    PENDING PAYMENT
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#FF0000', mt: 1 }}>
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

          {/* Action Buttons */}
          {selectedInvoices.length > 0 && (
            <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={() => handleDownloadPDF(selectedInvoices)}
                sx={{
                  background: roleColors.CAREGIVER.gradient,
                  color: 'white',
                  fontWeight: 700,
                }}
              >
                Download {selectedInvoices.length} Invoice{selectedInvoices.length > 1 ? 's' : ''}
              </Button>
              {selectedInvoices.length > 1 && (
                <Button
                  variant="outlined"
                  startIcon={<MergeIcon />}
                  onClick={handleConsolidateInvoices}
                  sx={{
                    borderColor: roleColors.CAREGIVER.primary,
                    color: roleColors.CAREGIVER.primary,
                    fontWeight: 700,
                    '&:hover': {
                      borderColor: roleColors.CAREGIVER.primary,
                      bgcolor: 'rgba(76, 175, 80, 0.05)',
                    },
                  }}
                >
                  Consolidate Invoices
                </Button>
              )}
              <Button
                variant="text"
                onClick={() => setSelectedInvoices([])}
                sx={{ color: 'rgba(27, 94, 32, 0.7)' }}
              >
                Clear Selection
              </Button>
            </Box>
          )}

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
                    <Box sx={{ display: 'flex', gap: 2, flex: 1, alignItems: 'flex-start' }}>
                      <Checkbox
                        checked={selectedInvoices.includes(bill.id)}
                        onChange={() => handleSelectInvoice(bill.id)}
                        sx={{
                          color: roleColors.CAREGIVER.primary,
                          '&.Mui-checked': {
                            color: roleColors.CAREGIVER.primary,
                          },
                        }}
                      />
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
                    <Box sx={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#1b5e20' }}>
                        ${bill.amount.toFixed(2)}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <Button 
                          variant="outlined"
                          size="small"
                          startIcon={<DownloadIcon />}
                          onClick={() => handleDownloadPDF([bill.id])}
                          sx={{
                            borderColor: roleColors.CAREGIVER.primary,
                            color: roleColors.CAREGIVER.primary,
                            fontWeight: 600,
                            '&:hover': {
                              borderColor: roleColors.CAREGIVER.primary,
                              bgcolor: 'rgba(76, 175, 80, 0.05)',
                            },
                          }}
                        >
                          PDF
                        </Button>
                        {bill.status === 'pending' && (
                          <Button 
                            variant="contained"
                            size="small"
                            onClick={() => navigate('/caregiver/payment-methods')}
                            sx={{
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
                </Box>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Consolidate Dialog */}
        <Dialog open={consolidateDialogOpen} onClose={() => setConsolidateDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 700, color: '#1b5e20' }}>
            Consolidate Invoices
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
              You are about to consolidate {selectedInvoices.length} invoices into a single PDF document.
            </Typography>
            <Box sx={{ bgcolor: 'rgba(76, 175, 80, 0.1)', p: 2, borderRadius: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: '#1b5e20' }}>
                Selected Invoices:
              </Typography>
              {billingData.filter(b => selectedInvoices.includes(b.id)).map(bill => (
                <Typography key={bill.id} variant="body2" sx={{ color: 'rgba(27, 94, 32, 0.8)', ml: 2 }}>
                  • {bill.service} - ${bill.amount.toFixed(2)} ({formatDate(bill.date)})
                </Typography>
              ))}
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1b5e20', mt: 2 }}>
                Total: ${billingData.filter(b => selectedInvoices.includes(b.id)).reduce((sum, b) => sum + b.amount, 0).toFixed(2)}
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setConsolidateDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={confirmConsolidate}
              sx={{
                background: roleColors.CAREGIVER.gradient,
                color: 'white',
                fontWeight: 700,
              }}
            >
              Download Consolidated PDF
            </Button>
          </DialogActions>
        </Dialog>
      </Layout>
    </Box>
  );
};

export default AppointmentsBillingPage;
