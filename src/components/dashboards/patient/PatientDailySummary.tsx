import { Card, CardContent, Typography, TextField, Box } from '@mui/material';
import { usePatientSummary } from '../../../context/PatientSummaryContext';

const PatientDailySummary = () => {
  const { summary, updateSummary } = usePatientSummary();

  const handleMoodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateSummary({ mood: event.target.value });
  };

  const handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateSummary({ notes: event.target.value });
  };

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          How are you feeling today?
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Today's Mood"
            variant="outlined"
            fullWidth
            value={summary.mood}
            onChange={handleMoodChange}
          />
          <TextField
            label="Daily Notes"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={summary.notes}
            onChange={handleNotesChange}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default PatientDailySummary;
