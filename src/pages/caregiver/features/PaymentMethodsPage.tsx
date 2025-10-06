import { useState } from 'react';
import { Typography, Box, Grid, Button, Avatar, Card, CardContent, IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { CreditCard as CardIcon, Add as AddIcon, Delete as DeleteIcon, Star as StarIcon, AccountBalance as BankIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../components/layout/Layout';
import { roleColors } from '../../../styles/glassmorphism';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank';
  cardNumber?: string;
  cardType?: string;
  expiryDate?: string;
  holderName: string;
  isDefault: boolean;
  bankName?: string;
  accountNumber?: string;
}

const PaymentMethodsPage = () => {
  const navigate = useNavigate();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      cardNumber: '4532 **** **** 1234',
      cardType: 'Visa',
      expiryDate: '12/26',
      holderName: 'Nora White',
      isDefault: true,
    },
    {
      id: '2',
      type: 'card',
      cardNumber: '5425 **** **** 5678',
      cardType: 'Mastercard',
      expiryDate: '08/25',
      holderName: 'Nora White',
      isDefault: false,
    },
    {
      id: '3',
      type: 'bank',
      bankName: 'Chase Bank',
      accountNumber: '****1234',
      holderName: 'Nora White',
      isDefault: false,
    },
  ]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const handleSetDefault = (id: string) => {
    setPaymentMethods(methods =>
      methods.map(m => ({ ...m, isDefault: m.id === id }))
    );
  };

  const handleDelete = (id: string) => {
    setPaymentMethods(methods => methods.filter(m => m.id !== id));
  };

  const getCardIcon = (cardType?: string) => {
    return <CardIcon />;
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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
                <CardIcon sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#1b5e20', mb: 0.5 }}>
                  Payment Methods
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(27, 94, 32, 0.7)' }}>
                  Manage your payment cards and bank accounts
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAddDialogOpen(true)}
              sx={{
                background: roleColors.CAREGIVER.gradient,
                color: 'white',
                fontWeight: 700,
                px: 3,
                py: 1.5,
                borderRadius: '12px',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            >
              Add Payment Method
            </Button>
          </Box>
        </Box>

        {/* Payment Methods Grid */}
        <Grid container spacing={3}>
          {paymentMethods.map((method) => (
            <Grid item xs={12} md={6} key={method.id}>
              <Card sx={{
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: method.isDefault ? `2px solid ${roleColors.CAREGIVER.primary}` : '1px solid rgba(255, 255, 255, 0.8)',
                borderRadius: '20px',
                boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 32px rgba(76, 175, 80, 0.15)',
                },
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Avatar sx={{ 
                        bgcolor: method.isDefault ? roleColors.CAREGIVER.primary : 'rgba(76, 175, 80, 0.2)',
                        width: 56, 
                        height: 56,
                      }}>
                        {method.type === 'card' ? getCardIcon(method.cardType) : <BankIcon sx={{ color: method.isDefault ? 'white' : roleColors.CAREGIVER.primary }} />}
                      </Avatar>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1b5e20' }}>
                            {method.type === 'card' ? method.cardType : method.bankName}
                          </Typography>
                          {method.isDefault && (
                            <Chip 
                              icon={<StarIcon sx={{ fontSize: 14 }} />}
                              label="Default"
                              size="small"
                              sx={{
                                bgcolor: 'rgba(255, 193, 7, 0.2)',
                                color: '#ffc107',
                                fontWeight: 700,
                              }}
                            />
                          )}
                        </Box>
                        <Typography variant="body2" sx={{ color: 'rgba(27, 94, 32, 0.8)', mb: 0.5 }}>
                          {method.type === 'card' ? method.cardNumber : `Account ${method.accountNumber}`}
                        </Typography>
                        {method.expiryDate && (
                          <Typography variant="caption" sx={{ color: 'rgba(27, 94, 32, 0.6)' }}>
                            Expires {method.expiryDate}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    <IconButton 
                      size="small"
                      onClick={() => handleDelete(method.id)}
                      sx={{ color: '#f44336' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'rgba(27, 94, 32, 0.7)', mb: 2 }}>
                    {method.holderName}
                  </Typography>
                  {!method.isDefault && (
                    <Button
                      variant="outlined"
                      size="small"
                      fullWidth
                      onClick={() => handleSetDefault(method.id)}
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
                      Set as Default
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}

          {/* Add New Card Placeholder */}
          <Grid item xs={12} md={6}>
            <Card 
              onClick={() => setAddDialogOpen(true)}
              sx={{
                background: 'rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '2px dashed rgba(76, 175, 80, 0.4)',
                borderRadius: '20px',
                boxShadow: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  borderColor: roleColors.CAREGIVER.primary,
                  background: 'rgba(255, 255, 255, 0.7)',
                },
              }}
            >
              <CardContent sx={{ p: 3, textAlign: 'center', minHeight: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <AddIcon sx={{ fontSize: 48, color: roleColors.CAREGIVER.primary, mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1b5e20' }}>
                  Add Payment Method
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(27, 94, 32, 0.7)' }}>
                  Credit card or bank account
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Add Payment Dialog */}
        <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 700, color: '#1b5e20' }}>
            Add Payment Method
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <TextField
                fullWidth
                label="Card Number"
                placeholder="1234 5678 9012 3456"
                sx={{ mb: 2 }}
              />
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Expiry Date"
                    placeholder="MM/YY"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="CVV"
                    placeholder="123"
                  />
                </Grid>
              </Grid>
              <TextField
                fullWidth
                label="Cardholder Name"
                placeholder="Name on card"
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="contained"
              sx={{
                background: roleColors.CAREGIVER.gradient,
                color: 'white',
                fontWeight: 700,
              }}
            >
              Add Card
            </Button>
          </DialogActions>
        </Dialog>
      </Layout>
    </Box>
  );
};

export default PaymentMethodsPage;
