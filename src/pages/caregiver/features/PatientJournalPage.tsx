import { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Grid, TextField, Chip, Fab, CircularProgress, Divider, Button, Tabs, Tab, Avatar, Snackbar, Alert } from '@mui/material';
import { Add as AddIcon, Search as SearchIcon, PictureAsPdf as PdfIcon, Share as ShareIcon, LocalHospital, PersonOff, Psychology, Healing, StickyNote2, TrendingUp, TrendingDown, CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';
import { Book as BookIcon, SentimentVerySatisfied, SentimentNeutral, SentimentDissatisfied, Warning } from '@mui/icons-material';
import Layout from '../../../components/layout/Layout';
import JournalEntryDialog from '../../../components/caregiver/JournalEntryDialog';
import MoodAnalytics from '../../../components/caregiver/MoodAnalytics';
import StructuredDetailsView from '../../../components/caregiver/StructuredDetailsView';
import ShareJournalDialog from '../../../components/caregiver/ShareJournalDialog';
import MediaGallery from '../../../components/caregiver/MediaGallery';
import AIInsightsPanel from '../../../components/caregiver/AIInsightsPanel';
import { journalService, type JournalEntry, type MediaAttachment } from '../../../services/journalService';
import { generateJournalPDF } from '../../../utils/pdfGenerator';
import { roleColors } from '../../../styles/glassmorphism';
import { useAuth } from '../../../context/AuthContext';

const MOOD_COLORS: Record<string, string> = {
  happy: '#4caf50',
  neutral: '#2196f3',
  sad: '#ff9800',
  angry: '#f44336',
  anxious: '#9c27b0',
};

const MOOD_ICONS: Record<string, React.ReactNode> = {
  happy: <SentimentVerySatisfied />,
  neutral: <SentimentNeutral />,
  sad: <SentimentDissatisfied />,
  angry: <Warning />,
  anxious: <Warning />,
};

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

const PatientJournalPage = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [tagFilter, setTagFilter] = useState<string[]>([]);
  const [eventTypeFilter, setEventTypeFilter] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [selectedForSharing, setSelectedForSharing] = useState<string[]>([]);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const patientId = 'b805ec90-e553-4de7-9de0-45f2eb73d1ba'; // Abdeen White

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const data = await journalService.getJournalEntries(patientId);
      setEntries(data);
    } catch (err) {
      console.error('Failed to load journal entries:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const matchesSearch = searchTerm === '' || 
        entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchTerm.toLowerCase());
      
      const entryTags = entry.tags?.split(',').map(t => t.trim()) || [];
      const matchesTags = tagFilter.length === 0 || tagFilter.every(filterTag => entryTags.includes(filterTag));
      
      const matchesEventType = eventTypeFilter.length === 0 || eventTypeFilter.includes(entry.eventType);

      return matchesSearch && matchesTags && matchesEventType;
    });
  }, [entries, searchTerm, tagFilter, eventTypeFilter]);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    entries.forEach(entry => {
      entry.tags?.split(',').forEach(tag => {
        if (tag.trim()) tagSet.add(tag.trim());
      });
    });
    return Array.from(tagSet);
  }, [entries]);

  const handleTagClick = (tag: string) => {
    setTagFilter(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleCreateEntry = async (entryData: Partial<JournalEntry>) => {
    try {
      if (!user?.id) {
        console.error('User not authenticated');
        return;
      }

      const newEntry = await journalService.createJournalEntry({
        ...entryData,
        patientId,
        caregiverId: user.id,
        isVisibleToPatient: true,
      });
      
      // Add the new entry to the top of the list
      setEntries(prev => [newEntry, ...prev]);
      
      // Automatically select and display the new entry
      setSelectedEntry(newEntry);
      
      // Switch to Journal Entries tab if on Mood Analytics
      setActiveTab(0);
      
      // Show success message
      setSnackbarMessage('✅ Journal entry saved successfully!');
      setSnackbarOpen(true);
      
      console.log('✅ Journal entry created successfully:', newEntry);
    } catch (err) {
      console.error('❌ Failed to create journal entry:', err);
      setSnackbarMessage('❌ Failed to save journal entry. Please try again.');
      setSnackbarOpen(true);
    }
  };

  const getMoodIcon = (mood?: string) => {
    if (!mood) return null;
    const moodLower = mood.toLowerCase();
    return MOOD_ICONS[moodLower] || null;
  };

  const getMoodColor = (mood?: string) => {
    if (!mood) return 'transparent';
    const moodLower = mood.toLowerCase();
    return MOOD_COLORS[moodLower] || '#999';
  };

  const getEventColor = (eventType: string) => {
    return EVENT_COLORS[eventType] || '#999';
  };

  const getEventIcon = (eventType: string) => {
    return EVENT_ICONS[eventType] || <StickyNote2 />;
  };

  // Calculate event statistics
  const eventStats = useMemo(() => {
    const stats: Record<string, { count: number; thisMonth: number; lastMonth: number }> = {};
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    entries.forEach(entry => {
      const eventType = entry.eventType;
      const entryDate = new Date(entry.entryDate);
      
      if (!stats[eventType]) {
        stats[eventType] = { count: 0, thisMonth: 0, lastMonth: 0 };
      }
      
      stats[eventType].count++;
      
      if (entryDate >= thisMonthStart) {
        stats[eventType].thisMonth++;
      } else if (entryDate >= lastMonthStart && entryDate <= lastMonthEnd) {
        stats[eventType].lastMonth++;
      }
    });

    return stats;
  }, [entries]);

  const criticalEvents = useMemo(() => {
    return entries
      .filter(entry => entry.eventType === 'Seizure' || entry.eventType === 'Fall')
      .sort((a, b) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime())
      .slice(0, 5);
  }, [entries]);

  const handleEventTypeToggle = (eventType: string) => {
    setEventTypeFilter(prev => 
      prev.includes(eventType) ? prev.filter(t => t !== eventType) : [...prev, eventType]
    );
  };

  const handleToggleSelection = (entryId: string) => {
    setSelectedForSharing(prev =>
      prev.includes(entryId) ? prev.filter(id => id !== entryId) : [...prev, entryId]
    );
  };

  const handleSelectAll = () => {
    if (selectedForSharing.length === filteredEntries.length) {
      setSelectedForSharing([]);
    } else {
      setSelectedForSharing(filteredEntries.map(e => e.id));
    }
  };

  const handleShareEntries = async (sharedNote: string) => {
    try {
      const result = await journalService.shareJournalEntries(selectedForSharing, sharedNote);
      
      // Update the entries to reflect shared status
      setEntries(prev => prev.map(entry =>
        selectedForSharing.includes(entry.id)
          ? { ...entry, sharedWithProvider: true, sharedAt: new Date().toISOString(), sharedNote }
          : entry
      ));
      
      setSelectedForSharing([]);
      setSnackbarMessage(`✅ Successfully shared ${result.count} ${result.count === 1 ? 'entry' : 'entries'} with provider!`);
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Failed to share entries:', error);
      setSnackbarMessage('❌ Failed to share entries. Please try again.');
      setSnackbarOpen(true);
    }
  };
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f1f8f4 0%, #e8f5e9 50%, #dcedc8 100%)',
      p: 0,
    }}>
      <Layout title="" darkMode={false} themeColor="CAREGIVER">
        {/* Header */}
        <Box sx={{ 
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          borderRadius: '24px',
          p: 4,
          mb: 4,
          boxShadow: '0 8px 32px 0 rgba(76, 175, 80, 0.15)',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
              <BookIcon sx={{ fontSize: 36, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#1b5e20', mb: 0.5 }}>
                Patient Journal
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(27, 94, 32, 0.7)' }}>
                View and manage the patient's journal entries.
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Critical Events Alert */}
        {criticalEvents.length > 0 && (
          <Box sx={{ 
            mb: 3,
            p: 3,
            background: 'rgba(244, 67, 54, 0.1)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '2px solid rgba(244, 67, 54, 0.3)',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(244, 67, 54, 0.2)',
          }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#d32f2f', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Warning /> Critical Events Alert
            </Typography>
            <Typography variant="body2" sx={{ color: '#d32f2f', mb: 2 }}>
              {criticalEvents.length} recent seizure(s) or fall(s) recorded. Review immediately.
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {criticalEvents.map(event => (
                <Chip
                  key={event.id}
                  label={`${event.eventType} - ${new Date(event.entryDate).toLocaleDateString()}`}
                  icon={getEventIcon(event.eventType) as any}
                  onClick={() => setSelectedEntry(event)}
                  sx={{
                    bgcolor: 'rgba(244, 67, 54, 0.2)',
                    color: '#d32f2f',
                    fontWeight: 600,
                    border: '1px solid rgba(244, 67, 54, 0.4)',
                    '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.3)' },
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Event Statistics */}
        <Box sx={{ 
          mb: 3,
          p: 3,
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1)',
        }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1b5e20', mb: 2 }}>
            Event Statistics
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(eventStats).map(([eventType, stats]) => {
              const trend = stats.thisMonth - stats.lastMonth;
              const trendPercent = stats.lastMonth > 0 ? ((trend / stats.lastMonth) * 100).toFixed(0) : '0';
              return (
                <Grid item xs={12} sm={6} md={4} lg={2.4} key={eventType}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: '12px',
                      background: `${getEventColor(eventType)}15`,
                      border: `2px solid ${getEventColor(eventType)}40`,
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: `0 8px 16px ${getEventColor(eventType)}30`,
                      },
                    }}
                    onClick={() => handleEventTypeToggle(eventType)}
                  >
                    <Box sx={{ color: getEventColor(eventType), mb: 1 }}>
                      {getEventIcon(eventType)}
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: getEventColor(eventType) }}>
                      {stats.count}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#666', display: 'block', mb: 1 }}>
                      {eventType}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                      {trend > 0 ? (
                        <>
                          <TrendingUp sx={{ fontSize: 16, color: '#f44336' }} />
                          <Typography variant="caption" sx={{ color: '#f44336', fontWeight: 600 }}>
                            +{trendPercent}%
                          </Typography>
                        </>
                      ) : trend < 0 ? (
                        <>
                          <TrendingDown sx={{ fontSize: 16, color: '#4caf50' }} />
                          <Typography variant="caption" sx={{ color: '#4caf50', fontWeight: 600 }}>
                            {trendPercent}%
                          </Typography>
                        </>
                      ) : (
                        <Typography variant="caption" sx={{ color: '#999', fontWeight: 600 }}>
                          No change
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        {/* Event Type Filters */}
        <Box sx={{ 
          mb: 3,
          p: 2,
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1)',
        }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1b5e20', mb: 1 }}>
            Filter by Event Type:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {Object.keys(EVENT_COLORS).map(eventType => (
              <Chip
                key={eventType}
                label={eventType}
                icon={getEventIcon(eventType) as any}
                onClick={() => handleEventTypeToggle(eventType)}
                sx={eventTypeFilter.includes(eventType) ? {
                  bgcolor: getEventColor(eventType),
                  color: 'white',
                  fontWeight: 600,
                  '&:hover': { bgcolor: getEventColor(eventType), opacity: 0.9 },
                } : {
                  bgcolor: 'transparent',
                  color: getEventColor(eventType),
                  border: `2px solid ${getEventColor(eventType)}`,
                  fontWeight: 600,
                  '&:hover': { bgcolor: `${getEventColor(eventType)}20` },
                }}
              />
            ))}
            {eventTypeFilter.length > 0 && (
              <Chip
                label="Clear Filters"
                onClick={() => setEventTypeFilter([])}
                sx={{
                  bgcolor: '#999',
                  color: 'white',
                  fontWeight: 600,
                  '&:hover': { bgcolor: '#777' },
                }}
              />
            )}
          </Box>
        </Box>

        {/* Tabs */}
        <Box sx={{ 
          mb: 3,
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1)',
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
                color: roleColors.CAREGIVER.primary,
              },
            }}
          >
            <Tab label="Journal Entries" />
            <Tab label="Mood Analytics" />
            <Tab label="AI Insights" icon={<Psychology />} iconPosition="start" />
          </Tabs>
        </Box>

        {/* Content Area */}
        <Box sx={{ 
          p: 4, 
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          borderRadius: '20px',
          boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1)',
        }}>
          {activeTab === 0 ? (
          <Grid container spacing={4}>
            {/* Left Column: Timeline & Filters */}
            <Grid item xs={12} md={4}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1b5e20', mb: 2 }}>
                Event Timeline
              </Typography>

              {/* Search & Filter */}
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search journal..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                  sx={{ mb: 2 }}
                />
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {allTags.map(tag => (
                    <Chip
                      key={tag}
                      label={tag}
                      onClick={() => handleTagClick(tag)}
                      color={tagFilter.includes(tag) ? 'primary' : 'default'}
                      variant={tagFilter.includes(tag) ? 'filled' : 'outlined'}
                      sx={tagFilter.includes(tag) ? { 
                        bgcolor: roleColors.CAREGIVER.primary, 
                        color: 'white', 
                        '&:hover': { bgcolor: roleColors.CAREGIVER.secondary } 
                      } : {}}
                    />
                  ))}
                </Box>
              </Box>

              {/* Selection Toolbar */}
              {selectedForSharing.length > 0 && (
                <Box sx={{ 
                  mb: 2, 
                  p: 2, 
                  bgcolor: 'rgba(76, 175, 80, 0.1)', 
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {selectedForSharing.length} {selectedForSharing.length === 1 ? 'entry' : 'entries'} selected
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      onClick={handleSelectAll}
                      sx={{ textTransform: 'none' }}
                    >
                      {selectedForSharing.length === filteredEntries.length ? 'Deselect All' : 'Select All'}
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<ShareIcon />}
                      onClick={() => setShareDialogOpen(true)}
                      sx={{
                        background: roleColors.CAREGIVER.gradient,
                        textTransform: 'none',
                      }}
                    >
                      Share with Provider
                    </Button>
                  </Box>
                </Box>
              )}

              {/* Entries List */}
              {loading ? (
                <CircularProgress />
              ) : (
                <Box sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
                  {filteredEntries.map(entry => (
                    <Box 
                      key={entry.id}
                      sx={{
                        p: 2,
                        mb: 2,
                        borderRadius: '12px',
                        border: '1px solid',
                        borderColor: selectedEntry?.id === entry.id ? roleColors.CAREGIVER.primary : 'divider',
                        bgcolor: selectedEntry?.id === entry.id ? '#e8f5e9' : 'transparent',
                        cursor: 'pointer',
                        '&:hover': { bgcolor: '#f1f8f4' },
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1,
                      }}
                    >
                      {/* Checkbox for selection */}
                      <Box
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleSelection(entry.id);
                        }}
                        sx={{
                          mt: 0.5,
                          cursor: 'pointer',
                          color: selectedForSharing.includes(entry.id) ? roleColors.CAREGIVER.primary : 'text.secondary',
                        }}
                      >
                        {selectedForSharing.includes(entry.id) ? <CheckBox /> : <CheckBoxOutlineBlank />}
                      </Box>

                      {/* Entry content */}
                      <Box sx={{ flex: 1 }} onClick={() => setSelectedEntry(entry)}>
                      {/* Mood Indicator */}
                      {entry.mood && (
                        <Avatar
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            width: 32,
                            height: 32,
                            bgcolor: getMoodColor(entry.mood),
                            fontSize: '1.2rem',
                          }}
                        >
                          {getMoodIcon(entry.mood)}
                        </Avatar>
                      )}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Chip
                          icon={getEventIcon(entry.eventType) as any}
                          label={entry.eventType}
                          size="small"
                          sx={{
                            bgcolor: getEventColor(entry.eventType),
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '0.65rem',
                            height: '20px',
                            '& .MuiChip-icon': { color: 'white', fontSize: '0.9rem' },
                          }}
                        />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, pr: entry.mood ? 5 : 0 }}>{entry.title}</Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(entry.entryDate).toLocaleString()}
                      </Typography>
                      {entry.mood && (
                        <Chip 
                          label={entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}
                          size="small"
                          sx={{ 
                            mt: 0.5,
                            mr: 0.5,
                            bgcolor: getMoodColor(entry.mood) + '20',
                            color: getMoodColor(entry.mood),
                            fontWeight: 600,
                            fontSize: '0.7rem',
                          }}
                        />
                      )}
                      <Typography variant="body2" sx={{ mt: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {entry.content}
                      </Typography>
                      {entry.sharedWithProvider && (
                        <Chip
                          label="Shared with Provider"
                          size="small"
                          color="success"
                          sx={{ mt: 1 }}
                        />
                      )}
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </Grid>

            {/* Right Column: Entry Detail/Editor */}
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
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#1b5e20' }}>{selectedEntry.title}</Typography>
                      <Typography variant="subtitle2" color="text.secondary">
                        {new Date(selectedEntry.entryDate).toLocaleString()}
                      </Typography>
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
                        <Typography variant="caption" sx={{ fontWeight: 600, color: getMoodColor(selectedEntry.mood) }}>
                          {selectedEntry.mood.charAt(0).toUpperCase() + selectedEntry.mood.slice(1)}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  
                  {/* Structured Details */}
                  <StructuredDetailsView 
                    eventType={selectedEntry.eventType}
                    structuredDetails={selectedEntry.structuredDetails}
                  />
                  
                  {/* Additional Notes */}
                  {selectedEntry.content && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#1b5e20' }}>
                        Additional Notes
                      </Typography>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', p: 2, bgcolor: 'rgba(76, 175, 80, 0.05)', borderRadius: '8px' }}>
                        {selectedEntry.content}
                      </Typography>
                    </Box>
                  )}

                  {/* Media Gallery */}
                  {selectedEntry.attachments && (
                    <MediaGallery 
                      attachments={JSON.parse(selectedEntry.attachments) as MediaAttachment[]}
                    />
                  )}
                  
                  <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button 
                      variant="outlined" 
                      startIcon={<PdfIcon />} 
                      onClick={() => generateJournalPDF(selectedEntry)}
                    >
                      Download as PDF
                    </Button>
                    <Button 
                      variant="contained" 
                      startIcon={<ShareIcon />} 
                      onClick={() => { /* Implement sharing logic */ }}
                    >
                      Share with Provider
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', p: 4, border: '2px dashed', borderColor: 'divider', borderRadius: '16px' }}>
                  <Typography variant="h6" color="text.secondary">
                    Select an entry to read or create a new one.
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
          ) : activeTab === 1 ? (
            <MoodAnalytics entries={entries} />
          ) : (
            <AIInsightsPanel patientId={patientId} />
          )}

          <Fab 
            color="primary" 
            aria-label="add"
            sx={{ 
              position: 'absolute',
              bottom: 40,
              right: 40,
              background: roleColors.CAREGIVER.gradient,
            }}
            onClick={() => setDialogOpen(true)}
          >
            <AddIcon />
          </Fab>

          <JournalEntryDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            onSubmit={handleCreateEntry}
          />

          <ShareJournalDialog
            open={shareDialogOpen}
            onClose={() => setShareDialogOpen(false)}
            selectedEntries={entries.filter(e => selectedForSharing.includes(e.id))}
            onShare={handleShareEntries}
          />
        </Box>
      </Layout>

      {/* Success/Error Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarMessage.includes('❌') ? 'error' : 'success'}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};
export default PatientJournalPage;
