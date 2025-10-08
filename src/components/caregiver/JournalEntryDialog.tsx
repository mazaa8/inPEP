import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
} from '@mui/material';
import type { JournalEntry } from '../../services/journalService';

interface JournalEntryDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (entryData: Partial<JournalEntry>) => void;
}

const eventTypes = ['Seizure', 'Fall', 'Allergic Reaction', 'Behavioral Change', 'General Note'];
const moods = ['😊 Happy', '😐 Neutral', '😢 Sad', '😠 Angry', '😟 Anxious'];

const JournalEntryDialog = ({ open, onClose, onSubmit }: JournalEntryDialogProps) => {
  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState('General Note');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');

  const handleAddTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag]);
      setCurrentTag('');
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setTags(tags.filter(tag => tag !== tagToDelete));
  };

  const handleSubmit = () => {
    const entryData: Partial<JournalEntry> = {
      title,
      eventType,
      content,
      mood: mood?.split(' ')[1].toLowerCase() || undefined,
      tags: tags.join(', '),
      entryDate: new Date().toISOString(),
      // caregiverId and patientId will be set on the backend or in the service
    };
    onSubmit(entryData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Log New Patient Event</DialogTitle>
      <DialogContent dividers>
        <TextField
          autoFocus
          margin="dense"
          label="Title / Event Summary"
          type="text"
          fullWidth
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Event Type</InputLabel>
          <Select
            value={eventType}
            label="Event Type"
            onChange={(e) => setEventType(e.target.value)}
          >
            {eventTypes.map(type => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          margin="dense"
          label="Detailed Notes"
          type="text"
          fullWidth
          multiline
          rows={8}
          variant="outlined"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>Patient's Mood</Typography>
          <ToggleButtonGroup
            value={mood}
            exclusive
            onChange={(_, newMood) => setMood(newMood)}
            aria-label="patient mood"
          >
            {moods.map(m => (
              <ToggleButton key={m} value={m} aria-label={m}>{m.split(' ')[0]}</ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>Tags</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <TextField
              size="small"
              variant="outlined"
              label="Add a tag"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
            />
            <Button onClick={handleAddTag} sx={{ ml: 1 }}>Add</Button>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {tags.map(tag => (
              <Chip key={tag} label={tag} onDelete={() => handleDeleteTag(tag)} />
            ))}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Save Entry</Button>
      </DialogActions>
    </Dialog>
  );
};

export default JournalEntryDialog;
