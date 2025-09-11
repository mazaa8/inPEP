import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Chip,
  TextField,
  Button
} from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import { medications as initialMedications, type Medication } from '../../data/medications';

const LOW_STOCK_THRESHOLD = 5;

interface MedicationStockInfo {
  stock: number;
  lastUpdated: number;
}

const MedicationStockTracker = () => {
  const [meds, setMeds] = useState<Medication[]>(initialMedications);
  const [restockAmounts, setRestockAmounts] = useState<{ [id: string]: string }>({});

  useEffect(() => {
    const savedStocks = localStorage.getItem('medicationStocks');
    const stocks: { [id: string]: MedicationStockInfo } = savedStocks ? JSON.parse(savedStocks) : {};

    const now = Date.now();
    const updatedMeds = meds.map(med => {
      const medInfo = stocks[med.id];
      if (!medInfo) {
        // If no record, create one
        stocks[med.id] = { stock: med.stock, lastUpdated: now };
        return med;
      }

      const hoursElapsed = (now - medInfo.lastUpdated) / (1000 * 60 * 60);
      let dosesTaken = 0;
      if (med.frequency === 'daily') dosesTaken = Math.floor(hoursElapsed / 24);
      else if (med.frequency === 'twice daily') dosesTaken = Math.floor(hoursElapsed / 12);
      else if (med.frequency === 'every 8 hours') dosesTaken = Math.floor(hoursElapsed / 8);

      const newStock = Math.max(0, medInfo.stock - dosesTaken);
      stocks[med.id] = { stock: newStock, lastUpdated: now };

      return { ...med, stock: newStock };
    });

    setMeds(updatedMeds);
    localStorage.setItem('medicationStocks', JSON.stringify(stocks));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateStock = (medId: string, newStock: number) => {
    const stockValue = Math.max(0, newStock); // Ensure stock doesn't go below 0
    const now = Date.now();

    setMeds(currentMeds =>
      currentMeds.map(med => (med.id === medId ? { ...med, stock: stockValue } : med))
    );

    const savedStocks = localStorage.getItem('medicationStocks');
    const stocks: { [id: string]: MedicationStockInfo } = savedStocks ? JSON.parse(savedStocks) : {};
    
    // Ensure the entry for the med exists before updating
    if (!stocks[medId]) {
      const med = meds.find(m => m.id === medId);
      stocks[medId] = { stock: med?.stock ?? 0, lastUpdated: now };
    }

    stocks[medId].stock = stockValue;
    stocks[medId].lastUpdated = now;
    localStorage.setItem('medicationStocks', JSON.stringify(stocks));
  };

  const handleRestock = (medId: string) => {
    const amount = parseInt(restockAmounts[medId] || '0', 10);
    if (isNaN(amount) || amount <= 0) return;

    const med = meds.find(m => m.id === medId);
    if (med) {
      updateStock(medId, med.stock + amount);
      setRestockAmounts(prev => ({ ...prev, [medId]: '' }));
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Medication Stock Tracker
      </Typography>
      <Paper elevation={3}>
        <List>
          {meds.map(med => (
            <ListItem key={med.id} divider sx={{ flexWrap: 'wrap' }}>
              <ListItemText
                primary={med.name}
                secondary={`Dosage: ${med.dosage}`}
                sx={{ flexBasis: '100%', mb: 2 }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                <Typography variant="body2">Current Stock:</Typography>
                {med.stock <= LOW_STOCK_THRESHOLD && (
                  <Chip label="Low Stock" color="warning" size="small" />
                )}
                <Typography variant="h6" sx={{ minWidth: '40px' }}>{med.stock}</Typography>
                <IconButton onClick={() => updateStock(med.id, med.stock + 1)} size="small">
                  <AddCircleOutline />
                </IconButton>
                <IconButton onClick={() => updateStock(med.id, med.stock - 1)} size="small">
                  <RemoveCircleOutline />
                </IconButton>
                <Box sx={{ flexGrow: 1 }} />
                <TextField
                  label="Add"
                  size="small"
                  variant="outlined"
                  value={restockAmounts[med.id] || ''}
                  onChange={(e) => setRestockAmounts(prev => ({ ...prev, [med.id]: e.target.value }))}
                  sx={{ width: '80px' }}
                />
                <Button variant="contained" onClick={() => handleRestock(med.id)} size="small">Restock</Button>
              </Box>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default MedicationStockTracker;
