import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Autocomplete,
  TextField,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Alert,
  Button,
  Chip,
  Avatar,
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  Notifications as NotificationsIcon,
  Save as SaveIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import FlareOutlinedIcon from '@mui/icons-material/FlareOutlined';
import Brightness4OutlinedIcon from '@mui/icons-material/Brightness4Outlined';
import BedIcon from '@mui/icons-material/Bed';
import { medications, type Medication } from '../../data/medications';
import {
  generateMedicationSchedule,
  type GeneratedSchedule,
} from '../../utils/medicationScheduler';
import { roleColors } from '../../styles/glassmorphism';

const MedicationScheduler = () => {
  const [selectedMeds, setSelectedMeds] = useState<Medication[]>(() => {
    const savedMeds = localStorage.getItem('medicationSchedule');
    if (savedMeds) {
      const savedMedIds = JSON.parse(savedMeds) as string[];
      return medications.filter(med => savedMedIds.includes(med.id));
    }
    return [];
  });

  const [notificationPermission, setNotificationPermission] = useState(Notification.permission);

  const { schedule, warnings } = useMemo<GeneratedSchedule>(() => {
    return generateMedicationSchedule(selectedMeds);
  }, [selectedMeds]);

  const handleSetReminders = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notification');
      return;
    }

    let permission = notificationPermission;
    if (permission !== 'granted') {
      permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    }

    if (permission === 'granted') {
      Object.entries(schedule).forEach(([timeSlot, meds]) => {
        if (meds.length > 0) {
          const medNames = meds.map(m => m.medication.name).join(', ');
          new Notification(`Medication Reminder: ${timeSlot}`,
            {
              body: `Time to take: ${medNames}`,
              icon: '/vite.svg',
            }
          );
        }
      });
      alert('Reminders have been set for the current schedule!');
    } else {
      alert('Notification permission was denied. Please enable it in your browser settings.');
    }
  };

  // Time slot icons for visual schedule
  const timeSlotIcons: { [key: string]: React.ReactElement | null } = {
    'Morning': <WbSunnyOutlinedIcon sx={{ color: 'white' }} />,
    'Afternoon': <FlareOutlinedIcon sx={{ color: 'white' }} />,
    'Evening': <Brightness4OutlinedIcon sx={{ color: 'white' }} />,
    'Night': <BedIcon sx={{ color: 'white' }} />,
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ 
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(30px)',
        border: '1px solid rgba(255, 255, 255, 0.8)',
        borderRadius: '24px',
        p: 4,
        mb: 4,
        boxShadow: '0 8px 32px 0 rgba(76, 175, 80, 0.15)',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box sx={{
            width: 64,
            height: 64,
            borderRadius: '16px',
            background: roleColors.CAREGIVER.gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 8px 24px ${roleColors.CAREGIVER.primary}40`,
          }}>
            <ScheduleIcon sx={{ fontSize: 36, color: 'white' }} />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1b5e20' }}>
              Medication Scheduler
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(27, 94, 32, 0.7)' }}>
              Smart scheduling with conflict detection
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Medication Selection */}
      <Box sx={{
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.8)',
        borderRadius: '20px',
        p: 3,
        mb: 4,
      }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1b5e20', mb: 2 }}>
          Select Medications
        </Typography>
        <Autocomplete
          multiple
          options={medications}
          getOptionLabel={(option) => option.name}
          value={selectedMeds}
          onChange={(_, newValue) => {
            setSelectedMeds(newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Search medications"
              placeholder="Type to search..."
            />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                label={option.name}
                sx={{
                  bgcolor: 'rgba(76, 175, 80, 0.1)',
                  color: roleColors.CAREGIVER.primary,
                  fontWeight: 600,
                }}
              />
            ))
          }
        />
        {selectedMeds.length > 0 && (
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckIcon sx={{ color: roleColors.CAREGIVER.primary, fontSize: 20 }} />
            <Typography variant="body2" sx={{ color: 'rgba(27, 94, 32, 0.8)' }}>
              {selectedMeds.length} medication{selectedMeds.length > 1 ? 's' : ''} selected
            </Typography>
          </Box>
        )}
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <Button 
          variant="outlined"
          startIcon={<SaveIcon />}
          onClick={() => {
            const medIds = selectedMeds.map(med => med.id);
            localStorage.setItem('medicationSchedule', JSON.stringify(medIds));
            alert('Schedule saved successfully!');
          }}
          disabled={selectedMeds.length === 0}
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
          Save Schedule
        </Button>
        <Button 
          variant="contained"
          startIcon={<NotificationsIcon />}
          onClick={handleSetReminders}
          disabled={notificationPermission === 'denied' || selectedMeds.length === 0}
          sx={{
            background: roleColors.CAREGIVER.gradient,
            color: 'white',
            fontWeight: 700,
          }}
        >
          Enable Reminders
        </Button>
      </Box>

      {/* Warnings */}
      {warnings.length > 0 && (
        <Box sx={{ mb: 4 }}>
          {warnings.map((warning, index) => (
            <Alert 
              severity="warning" 
              key={index} 
              icon={<WarningIcon />}
              sx={{ 
                mb: 1,
                background: 'rgba(255, 152, 0, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 152, 0, 0.3)',
                borderRadius: '16px',
              }}
            >
              {warning.message}
            </Alert>
          ))}
        </Box>
      )}

      {/* Schedule Grid */}
      <Grid container spacing={3}>
        {Object.entries(schedule).map(([timeSlot, meds]) => (
          <Grid item xs={12} sm={6} md={3} key={timeSlot}>
            <Card sx={{
              height: '100%',
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: meds.length > 0 ? `2px solid ${roleColors.CAREGIVER.primary}` : '1px solid rgba(255, 255, 255, 0.8)',
              borderRadius: '20px',
              boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 32px rgba(76, 175, 80, 0.15)',
              },
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Avatar sx={{ 
                    bgcolor: meds.length > 0 ? roleColors.CAREGIVER.primary : 'rgba(76, 175, 80, 0.2)',
                    width: 48,
                    height: 48,
                  }}>
                    {timeSlotIcons[timeSlot]}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1b5e20' }}>
                      {timeSlot}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(27, 94, 32, 0.6)' }}>
                      {meds.length} medication{meds.length !== 1 ? 's' : ''}
                    </Typography>
                  </Box>
                </Box>
                <List dense>
                  {meds.length > 0 ? (
                    meds.map(({ medication, time }) => (
                      <ListItem 
                        key={medication.id}
                        sx={{
                          bgcolor: 'rgba(76, 175, 80, 0.05)',
                          borderRadius: '12px',
                          mb: 1,
                          border: '1px solid rgba(76, 175, 80, 0.1)',
                        }}
                      >
                        <ListItemText
                          primary={medication.name}
                          secondary={`${medication.dosage} at ${time}`}
                          primaryTypographyProps={{
                            fontWeight: 600,
                            color: '#1b5e20',
                          }}
                          secondaryTypographyProps={{
                            color: 'rgba(27, 94, 32, 0.7)',
                          }}
                        />
                      </ListItem>
                    ))
                  ) : (
                    <Typography color="text.secondary" variant="body2" sx={{ textAlign: 'center', py: 2 }}>
                      No medications
                    </Typography>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MedicationScheduler;
