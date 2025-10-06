import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Chip,
  TextField,
  Button,
  LinearProgress,
  Avatar,
  CircularProgress,
} from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline, LocalPharmacy as MedIcon, Warning as WarningIcon } from '@mui/icons-material';
import { medicationService, type MedicationStock } from '../../services/medicationService';
import { roleColors } from '../../styles/glassmorphism';

const LOW_STOCK_THRESHOLD = 5;

const MedicationStockTracker = () => {
  const [stocks, setStocks] = useState<MedicationStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [restockAmounts, setRestockAmounts] = useState<{ [id: string]: string }>({});
  const patientId = 'b805ec90-e553-4de7-9de0-45f2eb73d1ba'; // Abdeen White

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      setLoading(true);
      const data = await medicationService.getPatientStock(patientId);
      setStocks(data);
    } catch (error) {
      console.error('Failed to fetch medication stock:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (stockId: string, change: number) => {
    try {
      await medicationService.updateStock(stockId, change);
      await fetchStocks();
    } catch (error) {
      console.error('Failed to update stock:', error);
    }
  };

  const handleRestock = async (stockId: string) => {
    const amount = parseInt(restockAmounts[stockId] || '0', 10);
    if (isNaN(amount) || amount <= 0) return;

    try {
      await medicationService.updateStock(stockId, amount, 'refilled', `Restocked ${amount} doses`);
      setRestockAmounts(prev => ({ ...prev, [stockId]: '' }));
      await fetchStocks();
    } catch (error) {
      console.error('Failed to restock:', error);
    }
  };

  const getStockColor = (stock: number) => {
    if (stock <= 3) return '#f44336';
    if (stock <= LOW_STOCK_THRESHOLD) return '#ff9800';
    return roleColors.CAREGIVER.primary;
  };

  const getStockPercentage = (stock: number) => {
    const maxStock = 30; // Assume 30 is full stock
    return Math.min((stock / maxStock) * 100, 100);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress sx={{ color: roleColors.CAREGIVER.primary }} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Summary Stats */}
      <Box sx={{ 
        mb: 3,
        display: 'flex',
        gap: 2,
        flexWrap: 'wrap',
      }}>
        <Box sx={{
          flex: 1,
          minWidth: 200,
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          borderRadius: '16px',
          p: 2.5,
          boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1)',
        }}>
          <Typography variant="caption" sx={{ color: 'rgba(27, 94, 32, 0.7)', fontWeight: 700, display: 'block', mb: 1 }}>
            TOTAL MEDICATIONS
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1b5e20' }}>
            {stocks.length}
          </Typography>
        </Box>
        <Box sx={{
          flex: 1,
          minWidth: 200,
          background: 'rgba(255, 152, 0, 0.1)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 152, 0, 0.3)',
          borderRadius: '16px',
          p: 2.5,
          boxShadow: '0 4px 20px rgba(255, 152, 0, 0.1)',
        }}>
          <Typography variant="caption" sx={{ color: '#e65100', fontWeight: 700, display: 'block', mb: 1 }}>
            LOW STOCK ALERTS
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#f57c00' }}>
            {stocks.filter(s => s.currentStock <= s.lowStockThreshold).length}
          </Typography>
        </Box>
      </Box>

      {/* Medication Cards */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {stocks.map(stock => (
          <Box key={stock.id} sx={{
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: stock.currentStock <= stock.lowStockThreshold ? '2px solid #ff9800' : '1px solid rgba(255, 255, 255, 0.8)',
            borderRadius: '20px',
            p: 3,
            boxShadow: stock.currentStock <= stock.lowStockThreshold ? '0 4px 20px rgba(255, 152, 0, 0.2)' : '0 4px 20px rgba(76, 175, 80, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: stock.currentStock <= stock.lowStockThreshold ? '0 8px 32px rgba(255, 152, 0, 0.25)' : '0 8px 32px rgba(76, 175, 80, 0.15)',
            },
          }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
              <Avatar sx={{ 
                bgcolor: getStockColor(stock.currentStock),
                width: 56, 
                height: 56,
                boxShadow: `0 4px 16px ${getStockColor(stock.currentStock)}40`,
              }}>
                <MedIcon sx={{ fontSize: 32, color: 'white' }} />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1b5e20' }}>
                    {stock.medication.name}
                  </Typography>
                  <Chip 
                    label={stock.medication.dosage} 
                    size="small" 
                    sx={{ 
                      bgcolor: 'rgba(76, 175, 80, 0.15)',
                      color: roleColors.CAREGIVER.primary,
                      fontWeight: 600,
                    }}
                  />
                  {stock.currentStock <= stock.lowStockThreshold && (
                    <Chip 
                      icon={<WarningIcon sx={{ fontSize: 16 }} />}
                      label="Low Stock" 
                      size="small" 
                      sx={{ 
                        bgcolor: 'rgba(255, 152, 0, 0.2)',
                        color: '#f57c00',
                        fontWeight: 700,
                      }}
                    />
                  )}
                </Box>
                <Typography variant="caption" sx={{ color: 'rgba(27, 94, 32, 0.7)', fontWeight: 600 }}>
                  Frequency: {stock.prescription?.frequency || 'As needed'}
                </Typography>
              </Box>
            </Box>

            {/* Stock Progress Bar */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#1b5e20' }}>
                  Current Stock
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: getStockColor(stock.currentStock) }}>
                  {stock.currentStock} pills
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={getStockPercentage(stock.currentStock)}
                sx={{ 
                  height: 12, 
                  borderRadius: 6,
                  bgcolor: 'rgba(0, 0, 0, 0.08)',
                  '& .MuiLinearProgress-bar': {
                    background: `linear-gradient(90deg, ${getStockColor(stock.currentStock)} 0%, ${getStockColor(stock.currentStock)}dd 100%)`,
                    borderRadius: 6,
                  },
                }}
              />
              {stock.currentStock <= stock.lowStockThreshold && (
                <Typography variant="caption" sx={{ color: '#f57c00', fontWeight: 600, mt: 0.5, display: 'block' }}>
                  ⚠️ Refill needed soon - only {stock.currentStock} doses remaining
                </Typography>
              )}
            </Box>

            {/* Stock Controls */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              p: 2,
              background: 'rgba(76, 175, 80, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(76, 175, 80, 0.15)',
            }}>
              <IconButton 
                onClick={() => updateStock(stock.id, -1)} 
                size="small"
                sx={{
                  bgcolor: 'rgba(244, 67, 54, 0.1)',
                  color: '#f44336',
                  '&:hover': {
                    bgcolor: 'rgba(244, 67, 54, 0.2)',
                    transform: 'scale(1.1)',
                  },
                }}
              >
                <RemoveCircleOutline />
              </IconButton>
              <IconButton 
                onClick={() => updateStock(stock.id, 1)} 
                size="small"
                sx={{
                  bgcolor: 'rgba(76, 175, 80, 0.15)',
                  color: roleColors.CAREGIVER.primary,
                  '&:hover': {
                    bgcolor: 'rgba(76, 175, 80, 0.25)',
                    transform: 'scale(1.1)',
                  },
                }}
              >
                <AddCircleOutline />
              </IconButton>
              <Box sx={{ flexGrow: 1 }} />
              <TextField
                placeholder="Amount"
                size="small"
                variant="outlined"
                value={restockAmounts[stock.id] || ''}
                onChange={(e) => setRestockAmounts(prev => ({ ...prev, [stock.id]: e.target.value }))}
                sx={{ 
                  width: '100px',
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'rgba(255,255,255,0.8)',
                    '& fieldset': { borderColor: 'rgba(76, 175, 80, 0.3)' },
                    '&:hover fieldset': { borderColor: roleColors.CAREGIVER.primary },
                    '&.Mui-focused fieldset': { borderColor: roleColors.CAREGIVER.primary },
                  },
                }}
              />
              <Button 
                variant="contained" 
                onClick={() => handleRestock(stock.id)} 
                size="medium"
                sx={{
                  background: roleColors.CAREGIVER.gradient,
                  color: 'white',
                  fontWeight: 700,
                  px: 3,
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                Restock
              </Button>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default MedicationStockTracker;
