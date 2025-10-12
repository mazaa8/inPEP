import { useState } from 'react';
import { Typography, Box, Grid, Button, Card, CardContent, TextField, MenuItem, Stepper, Step, StepLabel, Alert, Divider, Chip, Avatar, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Payment as PaymentIcon, CreditCard as CardIcon, CheckCircle as SuccessIcon, Receipt as ReceiptIcon, AccountBalance as BankIcon, AccountBalanceWallet as WalletIcon, HealthAndSafety as InsuranceIcon, ArrowBack as BackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../components/layout/Layout';
import { roleColors } from '../../../styles/glassmorphism';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'wallet' | 'insurance';
  name: string;
  details: string;
  isDefault: boolean;
}

const MakePaymentPage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  const steps = ['Payment Details', 'Select Payment Method', 'Confirm & Pay'];

  const serviceTypes = [
    { value: 'medication', label: 'Medication Purchase', icon: '💊' },
    { value: 'appointment', label: 'Medical Appointment', icon: '🏥' },
    { value: 'homecare', label: 'Home Care Services', icon: '🏠' },
    { value: 'equipment', label: 'Medical Equipment', icon: '🩺' },
    { value: 'therapy', label: 'Therapy Session', icon: '🧘' },
    { value: 'transportation', label: 'Medical Transportation', icon: '🚑' },
    { value: 'other', label: 'Other Services', icon: '📋' },
  ];

  const paymentMethods: PaymentMethod[] = [
    {
      id: '1',
      type: 'card',
      name: 'Visa ending in 1234',
      details: 'Expires 12/26',
      isDefault: true,
    },
    {
      id: '2',
      type: 'card',
      name: 'Mastercard ending in 5678',
      details: 'Expires 08/25',
      isDefault: false,
    },
    {
      id: '3',
      type: 'bank',
      name: 'Chase Bank',
      details: 'Account ****1234',
      isDefault: false,
    },
    {
      id: '4',
      type: 'wallet',
      name: 'PayPal',
      details: 'nora.white@email.com',
      isDefault: false,
    },
    {
      id: '5',
      type: 'insurance',
      name: 'Blue Cross Blue Shield',
      details: 'Policy BCBS-****5678',
      isDefault: false,
    },
  ];

  const handleNext = () => {
    if (activeStep === 0 && (!paymentAmount || !serviceType)) {
      return;
    }
    if (activeStep === 1 && !selectedPaymentMethod) {
      return;
    }
    if (activeStep === 2) {
      setConfirmDialogOpen(true);
      return;
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleConfirmPayment = () => {
    // Simulate payment processing
    const txId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    setTransactionId(txId);
    setPaymentComplete(true);
    setConfirmDialogOpen(false);
  };

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'card': return <CardIcon />;
      case 'bank': return <BankIcon />;
      case 'wallet': return <WalletIcon />;
      case 'insurance': return <InsuranceIcon />;
      default: return <CardIcon />;
    }
  };

  const selectedMethod = paymentMethods.find(m => m.id === selectedPaymentMethod);
  const selectedService = serviceTypes.find(s => s.value === serviceType);

  if (paymentComplete) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f1f8f4 0%, #e8f5e9 50%, #dcedc8 100%)',
        p: 0,
      }}>
        <Layout title="" darkMode={false} themeColor="CAREGIVER">
          <Box sx={{ 
            maxWidth: 600, 
            mx: 'auto', 
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            borderRadius: '24px',
            p: 6,
            boxShadow: '0 8px 32px 0 rgba(76, 175, 80, 0.15)',
          }}>
            <Box sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              boxShadow: '0 8px 24px rgba(76, 175, 80, 0.3)',
            }}>
              <SuccessIcon sx={{ fontSize: 64, color: 'white' }} />
            </Box>
            
            <Typography variant="h3" sx={{ fontWeight: 700, color: '#1b5e20', mb: 2 }}>
              Payment Successful!
            </Typography>
            
            <Typography variant="body1" sx={{ color: 'rgba(27, 94, 32, 0.7)', mb: 4 }}>
              Your payment has been processed successfully
            </Typography>

            <Card sx={{ 
              mb: 4, 
              bgcolor: 'rgba(76, 175, 80, 0.05)', 
              border: '1px solid rgba(76, 175, 80, 0.2)',
              boxShadow: 'none',
            }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Transaction ID</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                      {transactionId}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Amount Paid</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: roleColors.CAREGIVER.primary }}>
                      ${paymentAmount}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Service</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {selectedService?.label}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Payment Method</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {selectedMethod?.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">Date & Time</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {new Date().toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                startIcon={<ReceiptIcon />}
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
                Download Receipt
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/caregiver/payment-methods')}
                sx={{
                  background: roleColors.CAREGIVER.gradient,
                  color: 'white',
                  fontWeight: 600,
                }}
              >
                Back to Payment Methods
              </Button>
            </Box>
          </Box>
        </Layout>
      </Box>
    );
  }

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
            <Button
              startIcon={<BackIcon />}
              onClick={() => navigate('/caregiver/payment-methods')}
              sx={{
                color: roleColors.CAREGIVER.primary,
                fontWeight: 600,
              }}
            >
              Back
            </Button>
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
              <PaymentIcon sx={{ fontSize: 40, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#1b5e20', mb: 0.5 }}>
                Make Payment
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(27, 94, 32, 0.7)' }}>
                Complete your payment securely
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Stepper */}
        <Box sx={{ 
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          borderRadius: '20px',
          p: 4,
          mb: 4,
          boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1)',
        }}>
          <Stepper activeStep={activeStep}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Step Content */}
        <Box sx={{ 
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          borderRadius: '20px',
          p: 4,
          mb: 4,
          boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1)',
        }}>
          {/* Step 1: Payment Details */}
          {activeStep === 0 && (
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1b5e20', mb: 3 }}>
                Payment Details
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Payment Amount"
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="0.00"
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>$</Typography>,
                    }}
                    sx={{ mb: 3 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    label="Service Type"
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    sx={{ mb: 3 }}
                  >
                    {serviceTypes.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <span>{option.icon}</span>
                          <span>{option.label}</span>
                        </Box>
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Description (Optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add any additional details about this payment..."
                  />
                </Grid>
              </Grid>

              {paymentAmount && serviceType && (
                <Alert severity="info" sx={{ mt: 3 }}>
                  <Typography variant="body2">
                    <strong>Payment Summary:</strong> ${paymentAmount} for {serviceTypes.find(s => s.value === serviceType)?.label}
                  </Typography>
                </Alert>
              )}
            </Box>
          )}

          {/* Step 2: Select Payment Method */}
          {activeStep === 1 && (
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1b5e20', mb: 3 }}>
                Select Payment Method
              </Typography>
              
              <Grid container spacing={2}>
                {paymentMethods.map((method) => (
                  <Grid item xs={12} key={method.id}>
                    <Card
                      onClick={() => setSelectedPaymentMethod(method.id)}
                      sx={{
                        cursor: 'pointer',
                        border: selectedPaymentMethod === method.id 
                          ? `2px solid ${roleColors.CAREGIVER.primary}` 
                          : '2px solid transparent',
                        bgcolor: selectedPaymentMethod === method.id 
                          ? 'rgba(76, 175, 80, 0.05)' 
                          : 'transparent',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: roleColors.CAREGIVER.primary,
                          bgcolor: 'rgba(76, 175, 80, 0.05)',
                        },
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ 
                            bgcolor: selectedPaymentMethod === method.id 
                              ? roleColors.CAREGIVER.primary 
                              : 'rgba(76, 175, 80, 0.2)',
                            width: 48, 
                            height: 48,
                          }}>
                            {getPaymentMethodIcon(method.type)}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1b5e20' }}>
                                {method.name}
                              </Typography>
                              {method.isDefault && (
                                <Chip label="Default" size="small" color="success" />
                              )}
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {method.details}
                            </Typography>
                          </Box>
                          {selectedPaymentMethod === method.id && (
                            <SuccessIcon sx={{ color: roleColors.CAREGIVER.primary }} />
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/caregiver/payment-methods')}
                sx={{
                  mt: 3,
                  borderColor: roleColors.CAREGIVER.primary,
                  color: roleColors.CAREGIVER.primary,
                  fontWeight: 600,
                }}
              >
                + Add New Payment Method
              </Button>
            </Box>
          )}

          {/* Step 3: Confirm & Pay */}
          {activeStep === 2 && (
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1b5e20', mb: 3 }}>
                Review & Confirm
              </Typography>
              
              <Card sx={{ mb: 3, bgcolor: 'rgba(76, 175, 80, 0.05)', border: '1px solid rgba(76, 175, 80, 0.2)' }}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Payment Amount
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: roleColors.CAREGIVER.primary, mb: 2 }}>
                    ${paymentAmount}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">Service</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {selectedService?.icon} {selectedService?.label}
                      </Typography>
                    </Grid>
                    {description && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                        <Typography variant="body2">{description}</Typography>
                      </Grid>
                    )}
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">Payment Method</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: roleColors.CAREGIVER.primary }}>
                          {selectedMethod && getPaymentMethodIcon(selectedMethod.type)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {selectedMethod?.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {selectedMethod?.details}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Alert severity="warning" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  Please review all details carefully before confirming. This payment will be processed immediately.
                </Typography>
              </Alert>
            </Box>
          )}

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ fontWeight: 600 }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={
                (activeStep === 0 && (!paymentAmount || !serviceType)) ||
                (activeStep === 1 && !selectedPaymentMethod)
              }
              sx={{
                background: roleColors.CAREGIVER.gradient,
                color: 'white',
                fontWeight: 600,
                px: 4,
              }}
            >
              {activeStep === steps.length - 1 ? 'Confirm Payment' : 'Next'}
            </Button>
          </Box>
        </Box>

        {/* Confirmation Dialog */}
        <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 700, color: '#1b5e20' }}>
            Confirm Payment
          </DialogTitle>
          <DialogContent>
            <Alert severity="info" sx={{ mb: 2 }}>
              You are about to pay <strong>${paymentAmount}</strong> using <strong>{selectedMethod?.name}</strong>
            </Alert>
            <Typography variant="body2" color="text.secondary">
              This action cannot be undone. Please confirm that all details are correct.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="contained"
              onClick={handleConfirmPayment}
              sx={{
                background: roleColors.CAREGIVER.gradient,
                color: 'white',
                fontWeight: 600,
              }}
            >
              Confirm & Pay
            </Button>
          </DialogActions>
        </Dialog>
      </Layout>
    </Box>
  );
};

export default MakePaymentPage;
