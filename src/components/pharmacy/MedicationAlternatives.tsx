import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Typography,
  Chip,
  Avatar,
  CircularProgress,
} from '@mui/material';
import { Search as SearchIcon, LocalPharmacy as MedIcon, SwapHoriz as AlternativeIcon, Warning as WarningIcon } from '@mui/icons-material';
import { medicationService, type Medication } from '../../services/medicationService';
import { roleColors } from '../../styles/glassmorphism';

const MedicationAlternatives = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    try {
      setLoading(true);
      const data = await medicationService.getMedications();
      setMedications(data);
    } catch (error) {
      console.error('Failed to fetch medications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const data = await medicationService.getMedications(searchTerm);
      setMedications(data);
    } catch (error) {
      console.error('Failed to search medications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        handleSearch();
      } else {
        fetchMedications();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  if (loading && medications.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress sx={{ color: roleColors.CAREGIVER.primary }} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Search Bar */}
      <Box sx={{ 
        mb: 3,
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.8)',
        borderRadius: '16px',
        p: 2,
        boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1)',
      }}>
        <TextField
          fullWidth
          placeholder="Search for a medication..."
          variant="outlined"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: roleColors.CAREGIVER.primary, mr: 1 }} />,
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: 'rgba(255,255,255,0.5)',
              '& fieldset': { borderColor: 'rgba(76, 175, 80, 0.3)' },
              '&:hover fieldset': { borderColor: roleColors.CAREGIVER.primary },
              '&.Mui-focused fieldset': { borderColor: roleColors.CAREGIVER.primary },
            },
          }}
        />
      </Box>

      {/* Medication Cards */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {medications.map((med) => (
          <Box key={med.id} sx={{
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            borderRadius: '20px',
            p: 3,
            boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 32px rgba(76, 175, 80, 0.15)',
            },
          }}>
            {/* Main Medication */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
              <Avatar sx={{ 
                bgcolor: roleColors.CAREGIVER.primary,
                width: 56, 
                height: 56,
              }}>
                <MedIcon sx={{ fontSize: 32, color: 'white' }} />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1b5e20' }}>
                    {med.name}
                  </Typography>
                  <Chip 
                    label={med.dosage} 
                    size="small" 
                    sx={{ 
                      bgcolor: 'rgba(76, 175, 80, 0.15)',
                      color: roleColors.CAREGIVER.primary,
                      fontWeight: 600,
                    }}
                  />
                  <Chip 
                    label={med.form} 
                    size="small" 
                    sx={{ 
                      bgcolor: 'rgba(33, 150, 243, 0.15)',
                      color: '#2196F3',
                      fontWeight: 600,
                    }}
                  />
                </Box>
                <Typography variant="body2" sx={{ color: 'rgba(27, 94, 32, 0.8)', mb: 1 }}>
                  {med.description}
                </Typography>
                {med.alternatives && med.alternatives.length > 0 && (
                  <Chip 
                    label={`${med.alternatives.length} alternatives`}
                    size="small" 
                    sx={{ 
                      bgcolor: 'rgba(139, 195, 74, 0.15)',
                      color: roleColors.CAREGIVER.secondary,
                      fontWeight: 600,
                    }}
                  />
                )}
                {/* Placeholder for interactions - will be populated from API */}
                {false && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <WarningIcon sx={{ fontSize: 18, color: '#f57c00' }} />
                    <Typography variant="caption" sx={{ color: '#f57c00', fontWeight: 600 }}>
                      Has drug interactions - check before combining
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>

            {/* Alternatives */}
            {med.alternatives && med.alternatives.length > 0 && (
              <Box sx={{ 
                mt: 3,
                pt: 3,
                borderTop: '2px dashed rgba(76, 175, 80, 0.2)',
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <AlternativeIcon sx={{ color: roleColors.CAREGIVER.secondary, fontSize: 20 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1b5e20' }}>
                    Approved Alternatives ({med.alternatives.length})
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {med.alternatives.map(altRel => (
                    <Box key={altRel.id} sx={{
                      p: 2,
                      background: 'rgba(76, 175, 80, 0.05)',
                      borderRadius: '12px',
                      border: '1px solid rgba(76, 175, 80, 0.2)',
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#1b5e20' }}>
                          {altRel.alternative.name}
                        </Typography>
                        <Chip 
                          label={altRel.alternative.dosage} 
                          size="small" 
                          sx={{ 
                            bgcolor: 'rgba(76, 175, 80, 0.2)',
                            color: roleColors.CAREGIVER.primary,
                            fontWeight: 600,
                          }}
                        />
                        {altRel.costDifference && (
                          <Chip 
                            label={altRel.costDifference < 0 ? `Save $${Math.abs(altRel.costDifference)}` : `+$${altRel.costDifference}`}
                            size="small" 
                            sx={{ 
                              bgcolor: altRel.costDifference < 0 ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 152, 0, 0.15)',
                              color: altRel.costDifference < 0 ? roleColors.CAREGIVER.primary : '#f57c00',
                              fontWeight: 600,
                            }}
                          />
                        )}
                      </Box>
                      <Typography variant="body2" sx={{ color: 'rgba(27, 94, 32, 0.7)' }}>
                        {altRel.alternative.description}
                      </Typography>
                      {altRel.type && (
                        <Typography variant="caption" sx={{ color: 'rgba(27, 94, 32, 0.6)', display: 'block', mt: 0.5 }}>
                          Type: {altRel.type} • {altRel.effectiveness}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        ))}
      </Box>

      {medications.length === 0 && (
        <Box sx={{ 
          p: 6, 
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px dashed rgba(76, 175, 80, 0.3)',
          borderRadius: '20px',
        }}>
          <SearchIcon sx={{ fontSize: 64, color: 'rgba(76, 175, 80, 0.4)', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#1b5e20', fontWeight: 700 }}>
            No medications found
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(27, 94, 32, 0.7)' }}>
            Try a different search term
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default MedicationAlternatives;
