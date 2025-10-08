import { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Grid, TextField, Chip, Fab, CircularProgress, Divider, Button } from '@mui/material';
import { Add as AddIcon, Search as SearchIcon, PictureAsPdf as PdfIcon, Share as ShareIcon } from '@mui/icons-material';
import { Book as BookIcon } from '@mui/icons-material';
import Layout from '../../../components/layout/Layout';
import JournalEntryDialog from '../../../components/caregiver/JournalEntryDialog';
import { journalService, type JournalEntry } from '../../../services/journalService';
import { generateJournalPDF } from '../../../utils/pdfGenerator';
import { roleColors } from '../../../styles/glassmorphism';

const PatientJournalPage = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [tagFilter, setTagFilter] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

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

      return matchesSearch && matchesTags;
    });
  }, [entries, searchTerm, tagFilter]);

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
      const newEntry = await journalService.createJournalEntry({
        ...entryData,
        patientId,
        caregiverId: 'authUserId', // Replace with actual authenticated user ID
      });
      setEntries(prev => [newEntry, ...prev]);
      setSelectedEntry(newEntry);
    } catch (err) {
      console.error('Failed to create journal entry:', err);
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

              {/* Entries List */}
              {loading ? (
                <CircularProgress />
              ) : (
                <Box sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
                  {filteredEntries.map(entry => (
                    <Box 
                      key={entry.id} 
                      onClick={() => setSelectedEntry(entry)}
                      sx={{
                        p: 2,
                        mb: 2,
                        borderRadius: '12px',
                        border: '1px solid',
                        borderColor: selectedEntry?.id === entry.id ? roleColors.CAREGIVER.primary : 'divider',
                        bgcolor: selectedEntry?.id === entry.id ? '#e8f5e9' : 'transparent',
                        cursor: 'pointer',
                        '&:hover': { bgcolor: '#f1f8f4' },
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{entry.title}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(entry.entryDate).toLocaleString()}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {entry.content}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Grid>

            {/* Right Column: Entry Detail/Editor */}
            <Grid item xs={12} md={8}>
              {selectedEntry ? (
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#1b5e20' }}>{selectedEntry.title}</Typography>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                    {new Date(selectedEntry.entryDate).toLocaleString()}
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {selectedEntry.content}
                  </Typography>
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
        </Box>
      </Layout>
    </Box>
  );
};
export default PatientJournalPage;
