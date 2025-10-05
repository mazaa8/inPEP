import { Card, CardContent, Typography, TextField, Box, Button, Chip } from '@mui/material';
import { usePatientSummary } from '../../../context/PatientSummaryContext';

const PatientDailySummary = () => {
  const { summary, updateSummary } = usePatientSummary();

  const moods = [
    { emoji: '😊', label: 'Happy', value: 'happy' },
    { emoji: '😢', label: 'Sad', value: 'sad' },
    { emoji: '😐', label: 'Neutral', value: 'neutral' },
    { emoji: '😠', label: 'Angry', value: 'angry' },
    { emoji: '😣', label: 'Pain', value: 'pain' },
  ];

  const handleMoodSelect = (moodValue: string) => {
    updateSummary({ mood: moodValue });
  };

  const handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;
    const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    
    if (wordCount <= 70) {
      updateSummary({ notes: text });
    }
  };

  const getWordCount = () => {
    if (!summary.notes) return 0;
    return summary.notes.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          How are you feeling today?
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Select your mood:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {moods.map((mood) => (
                <Button
                  key={mood.value}
                  variant={summary.mood === mood.value ? 'contained' : 'outlined'}
                  onClick={() => handleMoodSelect(mood.value)}
                  sx={{
                    fontSize: '2rem',
                    minWidth: '70px',
                    height: '70px',
                    flexDirection: 'column',
                    gap: 0.5,
                  }}
                >
                  <span>{mood.emoji}</span>
                  <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
                    {mood.label}
                  </Typography>
                </Button>
              ))}
            </Box>
          </Box>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Daily Notes:
              </Typography>
              <Chip 
                label={`${getWordCount()}/70 words`} 
                size="small" 
                color={getWordCount() >= 70 ? 'error' : 'default'}
              />
            </Box>
            <TextField
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={summary.notes}
              onChange={handleNotesChange}
              placeholder="Share how you're feeling today..."
              helperText={getWordCount() >= 70 ? 'Maximum word limit reached' : ''}
              error={getWordCount() >= 70}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PatientDailySummary;
