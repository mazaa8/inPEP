import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Chip, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Divider } from '@mui/material';
import { CheckCircle, LocalHospital, PersonOff, Psychology, Healing, StickyNote2, Person, CalendarToday, AccessTime } from '@mui/icons-material';
import ProviderPageWrapper from '../../components/layout/ProviderPageWrapper';
import StructuredDetailsView from '../../components/caregiver/StructuredDetailsView';
import { journalService, type JournalEntry } from '../../services/journalService';
import { useAuth } from '../../context/AuthContext';

const EVENT_COLORS: Record<string, string> = {
  'Seizure': '#f44336',
  'Fall': '#ff9800',
  'Behavioral Change': '#9c27b0',
  'Allergic Reaction': '#e91e63',
  'General Note': '#4caf50',
};

const EVENT_ICONS: Record<string, React.ReactNode> = {
  'Seizure': <LocalHospital />,
  'Fall': <PersonOff />,
  'Behavioral Change': <Psychology />,
  'Allergic Reaction': <Healing />,
  'General Note': <StickyNote2 />,
};

const ProviderJournalReview = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [providerNotes, setProviderNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchSharedEntries();
    }
  }, [user]);

  const fetchSharedEntries = async () => {
    try {
      setLoading(true);
      // For demo, using a test provider ID - replace with actual provider profile ID
      const providerId = '550e8400-e29b-41d4-a716-446655440000';
      const data = await journalService.getSharedJournalEntries(providerId);
      setEntries(data);
    } catch (err) {
      console.error('Failed to load shared journal entries:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsReviewed = async () => {
    if (!selectedEntry) return;

    try {
      setSubmitting(true);
      await journalService.markEntryAsReviewed(selectedEntry.id, providerNotes);
      
      // Update local state
      setEntries(prev => prev.map(entry =>
        entry.id === selectedEntry.id
          ? { ...entry, providerReviewedAt: new Date().toISOString(), providerNotes }
          : entry
      ));
      
      setReviewDialogOpen(false);
      setProviderNotes('');
      setSelectedEntry(null);
    } catch (error) {
      console.error('Failed to mark entry as reviewed:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getEventColor = (eventType: string) => EVENT_COLORS[eventType] || '#999';
  const getEventIcon = (eventType: string) => EVENT_ICONS[eventType] || <StickyNote2 />;

  const unreviewedCount = entries.filter(e => !e.providerReviewedAt).length;
  const criticalCount = entries.filter(e => (e.eventType === 'Seizure' || e.eventType === 'Fall') && !e.providerReviewedAt).length;

  if (loading) {
    return (
      <ProviderPageWrapper title="Patient Journal Review" icon={<StickyNote2 />}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress sx={{ color: '#FFA726' }} />
        </Box>
      </ProviderPageWrapper>
    );
  }

  return (
    <ProviderPageWrapper title="Patient Journal Review" icon={<StickyNote2 />}>
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            background: 'rgba(0, 0, 0, 0.3)', 
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 152, 0, 0.3)',
            borderRadius: '16px',
          }}>
            <CardContent>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#FFA726', mb: 1 }}>
                {entries.length}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Total Shared Entries
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            background: 'rgba(0, 0, 0, 0.3)', 
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 193, 7, 0.3)',
            borderRadius: '16px',
          }}>
            <CardContent>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#FFB74D', mb: 1 }}>
                {unreviewedCount}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Pending Review
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            background: 'rgba(0, 0, 0, 0.3)', 
            backdropFilter: 'blur(20px)',
            border: criticalCount > 0 ? '2px solid rgba(244, 67, 54, 0.5)' : '1px solid rgba(76, 175, 80, 0.3)',
            borderRadius: '16px',
          }}>
            <CardContent>
              <Typography variant="h3" sx={{ fontWeight: 700, color: criticalCount > 0 ? '#f44336' : '#4caf50', mb: 1 }}>
                {criticalCount}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Critical Events Unreviewed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Entries List */}
      {entries.length === 0 ? (
        <Box sx={{ 
          textAlign: 'center', 
          p: 6,
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 152, 0, 0.2)',
        }}>
          <StickyNote2 sx={{ fontSize: 64, color: 'rgba(255, 255, 255, 0.3)', mb: 2 }} />
          <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            No shared journal entries yet
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', mt: 1 }}>
            Caregivers can share patient journal entries with you for clinical review
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {entries.map((entry: any) => (
            <Grid item xs={12} key={entry.id}>
              <Card sx={{ 
                background: 'rgba(0, 0, 0, 0.3)', 
                backdropFilter: 'blur(20px)',
                border: `1px solid ${getEventColor(entry.eventType)}40`,
                borderRadius: '16px',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 24px ${getEventColor(entry.eventType)}30`,
                },
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Chip
                          icon={getEventIcon(entry.eventType) as any}
                          label={entry.eventType}
                          sx={{
                            bgcolor: getEventColor(entry.eventType),
                            color: 'white',
                            fontWeight: 700,
                          }}
                        />
                        {entry.providerReviewedAt && (
                          <Chip
                            icon={<CheckCircle />}
                            label="Reviewed"
                            size="small"
                            sx={{
                              bgcolor: '#4caf50',
                              color: 'white',
                            }}
                          />
                        )}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#FFA726', mb: 1 }}>
                        {entry.title}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Person sx={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.5)' }} />
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            {entry.patient?.name || 'Patient'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <CalendarToday sx={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.5)' }} />
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            {new Date(entry.entryDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <AccessTime sx={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.5)' }} />
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            Shared {new Date(entry.sharedAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Button
                      variant={entry.providerReviewedAt ? 'outlined' : 'contained'}
                      size="small"
                      onClick={() => {
                        setSelectedEntry(entry);
                        setProviderNotes(entry.providerNotes || '');
                        setReviewDialogOpen(true);
                      }}
                      sx={entry.providerReviewedAt ? {
                        borderColor: 'rgba(255, 152, 0, 0.5)',
                        color: '#FFA726',
                      } : {
                        background: 'linear-gradient(135deg, #FFA726 0%, #FFB74D 100%)',
                      }}
                    >
                      {entry.providerReviewedAt ? 'View Review' : 'Review'}
                    </Button>
                  </Box>

                  {entry.sharedNote && (
                    <Box sx={{ 
                      p: 2, 
                      mb: 2, 
                      bgcolor: 'rgba(255, 193, 7, 0.1)', 
                      borderRadius: '8px',
                      borderLeft: '3px solid #FFB74D',
                    }}>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', display: 'block', mb: 0.5 }}>
                        Caregiver Note:
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                        {entry.sharedNote}
                      </Typography>
                    </Box>
                  )}

                  <StructuredDetailsView 
                    eventType={entry.eventType}
                    structuredDetails={entry.structuredDetails}
                  />

                  {entry.content && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                        Additional Notes:
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                        {entry.content}
                      </Typography>
                    </Box>
                  )}

                  {entry.providerNotes && (
                    <Box sx={{ 
                      mt: 2, 
                      p: 2, 
                      bgcolor: 'rgba(76, 175, 80, 0.1)', 
                      borderRadius: '8px',
                      borderLeft: '3px solid #4caf50',
                    }}>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', display: 'block', mb: 0.5 }}>
                        Your Review Notes:
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                        {entry.providerNotes}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Review Dialog */}
      <Dialog 
        open={reviewDialogOpen} 
        onClose={() => setReviewDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 152, 0, 0.3)',
          }
        }}
      >
        <DialogTitle sx={{ color: '#FFA726' }}>
          {selectedEntry?.providerReviewedAt ? 'Review Notes' : 'Mark as Reviewed'}
        </DialogTitle>
        <DialogContent>
          <Divider sx={{ mb: 2, borderColor: 'rgba(255, 152, 0, 0.2)' }} />
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
            {selectedEntry?.providerReviewedAt 
              ? 'You reviewed this entry on ' + new Date(selectedEntry.providerReviewedAt).toLocaleString()
              : 'Add your clinical notes and mark this entry as reviewed'}
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Clinical Notes"
            placeholder="Add your assessment, recommendations, or follow-up actions..."
            value={providerNotes}
            onChange={(e) => setProviderNotes(e.target.value)}
            disabled={!!selectedEntry?.providerReviewedAt}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'rgba(255, 255, 255, 0.9)',
                '& fieldset': { borderColor: 'rgba(255, 152, 0, 0.3)' },
              },
              '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.5)' },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setReviewDialogOpen(false)} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Close
          </Button>
          {!selectedEntry?.providerReviewedAt && (
            <Button
              onClick={handleMarkAsReviewed}
              variant="contained"
              disabled={submitting}
              sx={{
                background: 'linear-gradient(135deg, #FFA726 0%, #FFB74D 100%)',
              }}
            >
              {submitting ? 'Saving...' : 'Mark as Reviewed'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </ProviderPageWrapper>
  );
};

export default ProviderJournalReview;
