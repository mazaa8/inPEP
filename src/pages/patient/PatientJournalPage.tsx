import { useState, useEffect } from 'react';
import { Box, Typography, Grid, TextField, Chip, CircularProgress, Avatar, Card, CardContent, Tabs, Tab } from '@mui/material';
import { Search as SearchIcon, Book as BookIcon, SentimentVerySatisfied, SentimentNeutral, SentimentDissatisfied, LocalHospital, PersonOff, Healing, Visibility } from '@mui/icons-material';
import Layout from '../../components/layout/Layout';
import MediaGallery from '../../components/caregiver/MediaGallery';
import StructuredDetailsView from '../../components/caregiver/StructuredDetailsView';
import MoodAnalytics from '../../components/caregiver/MoodAnalytics';
import { journalService, type JournalEntry, type MediaAttachment } from '../../services/journalService';
import { roleColors } from '../../styles/glassmorphism';
import { useAuth } from '../../context/AuthContext';

const MOOD_COLORS: Record<string, string> = {
  happy: '#4caf50',
  neutral: '#2196f3',
  sad: '#ff9800',
  angry: '#f44336',
  anxious: '#9c27b0',
};

const EVENT_COLORS: Record<string, string> = {
  'Seizure': '#f44336',
  'Fall': '#ff9800',
  'Behavioral Change': '#9c27b0',
  'Allergic Reaction': '#e91e63',
  'General Note': '#4caf50',
};

const PatientJournalPage = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  // Mock patient ID - replace with actual patient ID from auth
  const patientId = user?.id || 'patient-123';

  useEffect(() => {
    fetchEntries();
  }, [patientId]);

  useEffect(() => {
    filterEntries();
  }, [entries, searchQuery]);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const data = await journalService.getJournalEntries(patientId);
      // Filter to only show entries visible to patient
      const visibleEntries = data.filter((entry: JournalEntry) => entry.isVisibleToPatient !== false);
      setEntries(visibleEntries);
      if (visibleEntries.length > 0) {
        setSelectedEntry(visibleEntries[0]);
      }
    } catch (error) {
      console.error('Failed to load journal entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEntries = () => {
    if (!searchQuery.trim()) {
      setFilteredEntries(entries);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = entries.filter(entry =>
      entry.title.toLowerCase().includes(query) ||
      entry.content.toLowerCase().includes(query) ||
      entry.eventType.toLowerCase().includes(query) ||
      entry.tags?.toLowerCase().includes(query)
    );
    setFilteredEntries(filtered);
  };

  const getMoodIcon = (mood: string) => {
    const icons: Record<string, React.ReactNode> = {
      happy: <SentimentVerySatisfied />,
      neutral: <SentimentNeutral />,
      sad: <SentimentDissatisfied />,
      angry: <SentimentDissatisfied />,
      anxious: <SentimentDissatisfied />,
    };
    return icons[mood] || <SentimentNeutral />;
  };

  const getMoodColor = (mood: string) => MOOD_COLORS[mood] || '#999';

  const getEventColor = (eventType: string) => EVENT_COLORS[eventType] || '#4caf50';

  const getEventIcon = (eventType: string) => {
    const icons: Record<string, React.ReactNode> = {
      'Seizure': <LocalHospital />,
      'Fall': <PersonOff />,
      'Behavioral Change': <Healing />,
      'Allergic Reaction': <LocalHospital />,
      'General Note': <BookIcon />,
    };
    return icons[eventType] || <BookIcon />;
  };

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <CircularProgress sx={{ color: roleColors.PATIENT.primary }} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)',
      p: 0,
    }}>
      <Layout title="" darkMode={false} themeColor="PATIENT">
        {/* Hero Header */}
        <Box sx={{ 
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          borderRadius: '24px',
          p: 4,
          mb: 4,
          boxShadow: '0 8px 32px 0 rgba(33, 150, 243, 0.15)',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box sx={{
              width: 72,
              height: 72,
              borderRadius: '18px',
              background: roleColors.PATIENT.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 8px 24px ${roleColors.PATIENT.primary}40`,
            }}>
              <BookIcon sx={{ fontSize: 40, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#0d47a1', mb: 0.5 }}>
                My Health Journal
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(13, 71, 161, 0.7)' }}>
                View your health journey documented by your care team
              </Typography>
            </Box>
          </Box>

          {/* Search Bar */}
          <TextField
            fullWidth
            placeholder="Search journal entries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'rgba(13, 71, 161, 0.5)' }} />,
            }}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '12px',
              '& .MuiOutlinedInput-root': {
                '& fieldset': { border: 'none' },
              },
            }}
          />
        </Box>

        {/* Summary Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              borderRadius: '20px',
              boxShadow: '0 4px 20px rgba(33, 150, 243, 0.1)',
            }}>
              <CardContent>
                <Typography variant="h3" sx={{ fontWeight: 700, color: roleColors.PATIENT.primary, mb: 1 }}>
                  {entries.length}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(13, 71, 161, 0.7)' }}>
                  Total Entries
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              borderRadius: '20px',
              boxShadow: '0 4px 20px rgba(33, 150, 243, 0.1)',
            }}>
              <CardContent>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#4caf50', mb: 1 }}>
                  {entries.filter(e => e.mood === 'happy').length}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(13, 71, 161, 0.7)' }}>
                  Positive Days
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              borderRadius: '20px',
              boxShadow: '0 4px 20px rgba(33, 150, 243, 0.1)',
            }}>
              <CardContent>
                <Typography variant="h3" sx={{ fontWeight: 700, color: roleColors.PATIENT.primary, mb: 1 }}>
                  {entries.filter(e => e.sharedWithProvider).length}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(13, 71, 161, 0.7)' }}>
                  Shared with Provider
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Box sx={{ 
          mb: 3,
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(33, 150, 243, 0.1)',
        }}>
          <Tabs 
            value={activeTab} 
            onChange={(_, newValue) => setActiveTab(newValue)}
            sx={{
              '& .MuiTab-root': {
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
              },
              '& .Mui-selected': {
                color: roleColors.PATIENT.primary,
              },
            }}
          >
            <Tab label="Journal Entries" />
            <Tab label="Mood Analytics" />
          </Tabs>
        </Box>

        {/* Content Area */}
        <Box sx={{ 
          p: 4, 
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          borderRadius: '20px',
          boxShadow: '0 4px 20px rgba(33, 150, 243, 0.1)',
          minHeight: '500px',
        }}>
          {activeTab === 0 ? (
          <Grid container spacing={3}>
            {/* Left Column: Entry List */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#0d47a1', mb: 2 }}>
                Recent Entries ({filteredEntries.length})
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: '600px', overflowY: 'auto', pr: 1 }}>
                {filteredEntries.length === 0 ? (
                  <Box sx={{ textAlign: 'center', p: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      {searchQuery ? 'No entries match your search' : 'No journal entries yet'}
                    </Typography>
                  </Box>
                ) : (
                  filteredEntries.map((entry) => (
                    <Card
                      key={entry.id}
                      onClick={() => setSelectedEntry(entry)}
                      sx={{
                        cursor: 'pointer',
                        border: selectedEntry?.id === entry.id ? `2px solid ${roleColors.PATIENT.primary}` : '1px solid rgba(255, 255, 255, 0.8)',
                        bgcolor: selectedEntry?.id === entry.id ? 'rgba(33, 150, 243, 0.05)' : 'transparent',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateX(4px)',
                          boxShadow: '0 4px 12px rgba(33, 150, 243, 0.15)',
                        },
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                          {entry.mood && (
                            <Avatar sx={{ bgcolor: getMoodColor(entry.mood), width: 40, height: 40 }}>
                              {getMoodIcon(entry.mood)}
                            </Avatar>
                          )}
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0d47a1', mb: 0.5 }}>
                              {entry.title}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(13, 71, 161, 0.6)', display: 'block', mb: 0.5 }}>
                              {new Date(entry.entryDate).toLocaleDateString()}
                            </Typography>
                            <Chip
                              label={entry.eventType}
                              size="small"
                              sx={{
                                bgcolor: getEventColor(entry.eventType),
                                color: 'white',
                                fontWeight: 600,
                                fontSize: '0.7rem',
                              }}
                            />
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ))
                )}
              </Box>
            </Grid>

            {/* Right Column: Entry Detail */}
            <Grid item xs={12} md={8}>
              {selectedEntry ? (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Chip
                        icon={getEventIcon(selectedEntry.eventType) as any}
                        label={selectedEntry.eventType}
                        sx={{
                          bgcolor: getEventColor(selectedEntry.eventType),
                          color: 'white',
                          fontWeight: 700,
                          mb: 1,
                          '& .MuiChip-icon': { color: 'white' },
                        }}
                      />
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#0d47a1' }}>{selectedEntry.title}</Typography>
                      <Typography variant="subtitle2" color="text.secondary">
                        {new Date(selectedEntry.entryDate).toLocaleString()}
                      </Typography>
                      {/* Privacy Indicator */}
                      <Chip
                        icon={<Visibility />}
                        label="Visible to You"
                        size="small"
                        sx={{
                          mt: 1,
                          bgcolor: 'rgba(76, 175, 80, 0.1)',
                          color: '#4caf50',
                          border: '1px solid #4caf50',
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                    {selectedEntry.mood && (
                      <Box sx={{ textAlign: 'center' }}>
                        <Avatar
                          sx={{
                            width: 56,
                            height: 56,
                            bgcolor: getMoodColor(selectedEntry.mood),
                            fontSize: '2rem',
                            mb: 1,
                          }}
                        >
                          {getMoodIcon(selectedEntry.mood)}
                        </Avatar>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: getMoodColor(selectedEntry.mood), textTransform: 'capitalize' }}>
                          {selectedEntry.mood}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ p: 3, bgcolor: 'rgba(33, 150, 243, 0.03)', borderRadius: '12px', mb: 3 }}>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#0d47a1' }}>
                      {selectedEntry.content}
                    </Typography>
                  </Box>

                  {/* Tags */}
                  {selectedEntry.tags && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0d47a1', mb: 1 }}>
                        Tags
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {selectedEntry.tags.split(',').map((tag, index) => (
                          <Chip key={index} label={tag.trim()} size="small" sx={{ bgcolor: 'rgba(33, 150, 243, 0.1)', color: roleColors.PATIENT.primary }} />
                        ))}
                      </Box>
                    </Box>
                  )}

                  {/* Structured Details */}
                  {selectedEntry.structuredDetails && (
                    <Box sx={{ mb: 3 }}>
                      <StructuredDetailsView
                        eventType={selectedEntry.eventType}
                        structuredDetails={JSON.parse(selectedEntry.structuredDetails)}
                      />
                    </Box>
                  )}

                  {/* Media Gallery */}
                  {selectedEntry.attachments && (
                    <MediaGallery 
                      attachments={JSON.parse(selectedEntry.attachments) as MediaAttachment[]}
                    />
                  )}

                  {/* Shared Status */}
                  {selectedEntry.sharedWithProvider && (
                    <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(76, 175, 80, 0.05)', borderRadius: '12px', border: '1px solid rgba(76, 175, 80, 0.2)' }}>
                      <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600 }}>
                        ✓ This entry has been shared with your healthcare provider
                      </Typography>
                      {selectedEntry.sharedAt && (
                        <Typography variant="caption" color="text.secondary">
                          Shared on {new Date(selectedEntry.sharedAt).toLocaleString()}
                        </Typography>
                      )}
                    </Box>
                  )}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', p: 4, border: '2px dashed', borderColor: 'divider', borderRadius: '16px' }}>
                  <Typography variant="h6" color="text.secondary">
                    Select an entry to view details
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
          ) : (
            <MoodAnalytics entries={entries} />
          )}
        </Box>
      </Layout>
    </Box>
  );
};

export default PatientJournalPage;
