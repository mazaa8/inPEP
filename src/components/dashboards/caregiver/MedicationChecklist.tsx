import { useState, useEffect } from 'react';
import { Typography, Box, List, ListItem, ListItemIcon, ListItemText, Checkbox, Avatar, Divider, CircularProgress, Chip } from '@mui/material';
import { LocalPharmacy as MedicationIcon, Warning as WarningIcon } from '@mui/icons-material';
import { roleColors } from '../../../styles/glassmorphism';
import { medicationService, type Prescription } from '../../../services/medicationService';

interface MedicationChecklistProps {
  patientId: string;
}

const MedicationChecklist = ({ patientId }: MedicationChecklistProps) => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [takenToday, setTakenToday] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchPrescriptions();
    loadTakenToday();
  }, [patientId]);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const data = await medicationService.getPatientPrescriptions(patientId, 'active');
      setPrescriptions(data);
    } catch (error) {
      console.error('Failed to fetch prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTakenToday = () => {
    const today = new Date().toDateString();
    const saved = localStorage.getItem(`medications_taken_${today}`);
    if (saved) {
      setTakenToday(new Set(JSON.parse(saved)));
    }
  };

  const handleToggle = async (prescriptionId: string) => {
    const newTaken = new Set(takenToday);
    const today = new Date().toDateString();

    if (newTaken.has(prescriptionId)) {
      newTaken.delete(prescriptionId);
    } else {
      newTaken.add(prescriptionId);
      
      // Log dose taken in backend
      const prescription = prescriptions.find(p => p.id === prescriptionId);
      if (prescription) {
        try {
          await medicationService.logDoseTaken(
            patientId,
            prescription.medicationId,
            prescription.dosage,
            'Taken via dashboard checklist'
          );
        } catch (error) {
          console.error('Failed to log dose:', error);
        }
      }
    }

    setTakenToday(newTaken);
    localStorage.setItem(`medications_taken_${today}`, JSON.stringify([...newTaken]));
  };

  const getScheduledTime = (frequency: string) => {
    if (frequency.includes('morning')) return 'Morning';
    if (frequency.includes('evening')) return 'Evening';
    if (frequency.includes('bedtime')) return 'Bedtime';
    if (frequency.includes('twice')) return 'Morning & Evening';
    if (frequency.includes('8 hours')) return 'Every 8 hours';
    return frequency;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress sx={{ color: roleColors.CAREGIVER.primary }} />
      </Box>
    );
  }
  return (
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
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar sx={{ 
          background: roleColors.CAREGIVER.gradient,
          color: '#fff', 
          mr: 2,
          width: 48,
          height: 48,
          boxShadow: `0 4px 16px ${roleColors.CAREGIVER.primary}40`,
        }}>
          <MedicationIcon />
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1b5e20' }}>
          Medication Checklist
        </Typography>
      </Box>
      <List sx={{ p: 0 }}>
        {prescriptions && prescriptions.length > 0 ? prescriptions.map((prescription, index) => {
          const isTaken = takenToday.has(prescription.id);
          const needsRefill = prescription.refillsRemaining === 0;
          
          return (
            <div key={prescription.id}>
              <ListItem sx={{ px: 1 }} button onClick={() => handleToggle(prescription.id)}>
                <ListItemIcon sx={{ minWidth: 'auto', mr: 1.5 }}>
                  <Checkbox 
                    edge="start" 
                    checked={isTaken} 
                    sx={{ 
                      color: roleColors.CAREGIVER.primary,
                      '&.Mui-checked': { color: roleColors.CAREGIVER.primary },
                    }} 
                    tabIndex={-1} 
                    disableRipple 
                  />
                </ListItemIcon>
                <ListItemText 
                  primaryTypographyProps={{ fontWeight: 600, color: '#1b5e20' }}
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>{prescription.medication.name} {prescription.dosage}</span>
                      {needsRefill && (
                        <Chip 
                          icon={<WarningIcon sx={{ fontSize: 14 }} />}
                          label="Refill Needed" 
                          size="small" 
                          sx={{ 
                            bgcolor: 'rgba(255, 152, 0, 0.2)',
                            color: '#f57c00',
                            fontWeight: 700,
                            height: 20,
                          }}
                        />
                      )}
                    </Box>
                  }
                  secondary={`${getScheduledTime(prescription.frequency)} • ${prescription.refillsRemaining} refills left`}
                  secondaryTypographyProps={{ color: 'rgba(27, 94, 32, 0.7)' }}
                />
              </ListItem>
              {index < prescriptions.length - 1 && <Divider variant="inset" component="li" sx={{ ml: '56px', bgcolor: 'rgba(76, 175, 80, 0.1)' }} />}
            </div>
          );
        }) : null}
      </List>
      {(!prescriptions || prescriptions.length === 0) && (
        <Typography variant="body2" sx={{ textAlign: 'center', color: 'rgba(27, 94, 32, 0.6)', py: 3 }}>
          No active prescriptions
        </Typography>
      )}
    </Box>
  );
};

export default MedicationChecklist;
