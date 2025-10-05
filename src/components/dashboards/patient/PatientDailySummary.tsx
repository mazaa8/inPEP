import { Typography, TextField, Box, Button, Chip } from '@mui/material';
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
    <Box>
      <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2, fontWeight: 600 }}>
        How are you feeling today?
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1.5 }}>
            Select your mood:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
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
                  background: summary.mood === mood.value ? 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)' : 'rgba(255,255,255,0.05)',
                  border: summary.mood === mood.value ? 'none' : '1px solid rgba(33, 150, 243, 0.3)',
                  color: 'white',
                  '&:hover': {
                    background: summary.mood === mood.value ? 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)' : 'rgba(33, 150, 243, 0.1)',
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <span>{mood.emoji}</span>
                <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'white' }}>
                  {mood.label}
                </Typography>
              </Button>
            ))}
          </Box>
        </Box>
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Daily Notes:
            </Typography>
            <Chip 
              label={`${getWordCount()}/70 words`} 
              size="small" 
              sx={{
                bgcolor: getWordCount() >= 70 ? 'rgba(244, 67, 54, 0.2)' : 'rgba(33, 150, 243, 0.2)',
                color: getWordCount() >= 70 ? '#f44336' : '#21CBF3',
                fontWeight: 700,
              }}
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
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                bgcolor: 'rgba(255,255,255,0.05)',
                '& fieldset': {
                  borderColor: 'rgba(255,255,255,0.2)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(33, 150, 243, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#21CBF3',
                },
              },
              '& .MuiInputBase-input::placeholder': {
                color: 'rgba(255,255,255,0.5)',
              },
              '& .MuiFormHelperText-root': {
                color: getWordCount() >= 70 ? '#f44336' : 'rgba(255,255,255,0.6)',
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default PatientDailySummary;
