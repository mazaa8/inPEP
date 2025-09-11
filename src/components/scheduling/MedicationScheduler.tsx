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
} from '@mui/material';
import { medications, type Medication } from '../../data/medications';
import {
  generateMedicationSchedule,
  type GeneratedSchedule,
} from '../../utils/medicationScheduler';

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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Medication Schedule Planner
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
            label="Select Medications"
            placeholder="Type to search for medications"
          />
        )}
        sx={{ mb: 4 }}
      />

      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <Button 
          variant="contained" 
          onClick={() => {
            const medIds = selectedMeds.map(med => med.id);
            localStorage.setItem('medicationSchedule', JSON.stringify(medIds));
            alert('Schedule saved!');
          }}
        >
          Save Schedule
        </Button>
        <Button 
          variant="outlined" 
          onClick={handleSetReminders}
          disabled={notificationPermission === 'denied'}
        >
          Set Reminders
        </Button>
      </Box>

      {warnings.length > 0 && (
        <Box sx={{ mb: 4 }}>
          {warnings.map((warning, index) => (
            <Alert severity="warning" key={index} sx={{ mb: 1 }}>
              {warning.message}
            </Alert>
          ))}
        </Box>
      )}

      <Grid container spacing={3}>
        {Object.entries(schedule).map(([timeSlot, meds]) => (
          <Grid item xs={12} sm={6} md={3} key={timeSlot}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  {timeSlot}
                </Typography>
                <List dense>
                  {meds.length > 0 ? (
                    meds.map(({ medication, time }) => (
                      <ListItem key={medication.id}>
                        <ListItemText
                          primary={medication.name}
                          secondary={`${medication.dosage} at ${time}`}
                        />
                      </ListItem>
                    ))
                  ) : (
                    <Typography color="text.secondary" variant="body2">
                      No medications scheduled.
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
