import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
} from '@mui/material';
import { Share as ShareIcon, CheckCircle } from '@mui/icons-material';
import type { JournalEntry } from '../../services/journalService';

interface ShareJournalDialogProps {
  open: boolean;
  onClose: () => void;
  selectedEntries: JournalEntry[];
  onShare: (sharedNote: string) => Promise<void>;
}

const ShareJournalDialog = ({ open, onClose, selectedEntries, onShare }: ShareJournalDialogProps) => {
  const [sharedNote, setSharedNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleShare = async () => {
    setLoading(true);
    try {
      await onShare(sharedNote);
      setSharedNote('');
      onClose();
    } catch (error) {
      console.error('Failed to share entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventColor = (eventType: string) => {
    const colors: Record<string, string> = {
      'Seizure': '#f44336',
      'Fall': '#ff9800',
      'Behavioral Change': '#9c27b0',
      'Allergic Reaction': '#e91e63',
      'General Note': '#4caf50',
    };
    return colors[eventType] || '#999';
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShareIcon sx={{ color: '#4caf50' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Share with Provider
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          You are sharing {selectedEntries.length} journal {selectedEntries.length === 1 ? 'entry' : 'entries'} with the patient's provider for clinical review.
        </Typography>

        <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(76, 175, 80, 0.05)', borderRadius: '8px', border: '1px solid rgba(76, 175, 80, 0.2)' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Selected Entries:
          </Typography>
          <List dense>
            {selectedEntries.map((entry, index) => (
              <Box key={entry.id}>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          label={entry.eventType}
                          size="small"
                          sx={{
                            bgcolor: getEventColor(entry.eventType),
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '0.65rem',
                          }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {entry.title}
                        </Typography>
                      </Box>
                    }
                    secondary={new Date(entry.entryDate).toLocaleDateString()}
                  />
                  {entry.sharedWithProvider && (
                    <Chip
                      icon={<CheckCircle />}
                      label="Already Shared"
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                  )}
                </ListItem>
                {index < selectedEntries.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        </Box>

        <TextField
          fullWidth
          multiline
          rows={4}
          label="Note to Provider (Optional)"
          placeholder="Add any context or concerns you'd like to share with the provider..."
          value={sharedNote}
          onChange={(e) => setSharedNote(e.target.value)}
          variant="outlined"
        />
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleShare}
          variant="contained"
          disabled={loading || selectedEntries.length === 0}
          startIcon={<ShareIcon />}
          sx={{
            background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
            '&:hover': { background: 'linear-gradient(135deg, #388e3c 0%, #4caf50 100%)' },
          }}
        >
          {loading ? 'Sharing...' : `Share ${selectedEntries.length} ${selectedEntries.length === 1 ? 'Entry' : 'Entries'}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShareJournalDialog;
