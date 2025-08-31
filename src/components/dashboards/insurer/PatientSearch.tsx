import { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Grid, CircularProgress } from '@mui/material';

const mockPatientData = {
  'P12345': { riskScore: 85, carePlanAdherence: '95%', lastCheckIn: '2023-10-27', conditions: ['Diabetes', 'Hypertension'] },
  'P67890': { riskScore: 45, carePlanAdherence: '88%', lastCheckIn: '2023-10-26', conditions: ['Asthma'] },
  'P54321': { riskScore: 92, carePlanAdherence: '98%', lastCheckIn: '2023-10-28', conditions: ['Heart Failure'] },
  'P09876': { riskScore: 30, carePlanAdherence: '90%', lastCheckIn: '2023-10-25', conditions: ['None'] },
};

const PatientSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    setLoading(true);
    setSearchResult(null);
    setTimeout(() => {
      const result = mockPatientData[searchQuery.toUpperCase() as keyof typeof mockPatientData];
      setSearchResult(result || 'not_found');
      setLoading(false);
    }, 1000);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Patient-Level Drill-Down</Typography>
      <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', mb: 3 }}>
        <TextField
          fullWidth
          label="Search by Anonymized Patient ID (e.g., P12345)"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button variant="contained" onClick={handleSearch} sx={{ ml: 2, py: '15px' }} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Search'}
        </Button>
      </Paper>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {searchResult && (
        <Paper sx={{ p: 3 }}>
          {searchResult === 'not_found' ? (
            <Typography>No patient found with ID: {searchQuery}</Typography>
          ) : (
            <Box>
              <Typography variant="h5" gutterBottom>Patient ID: {searchQuery.toUpperCase()}</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}><Typography><strong>Risk Score:</strong> {searchResult.riskScore}</Typography></Grid>
                <Grid item xs={12} sm={6}><Typography><strong>Care Plan Adherence:</strong> {searchResult.carePlanAdherence}</Typography></Grid>
                <Grid item xs={12} sm={6}><Typography><strong>Last Check-In:</strong> {searchResult.lastCheckIn}</Typography></Grid>
                <Grid item xs={12} sm={6}><Typography><strong>Conditions:</strong> {searchResult.conditions.join(', ')}</Typography></Grid>
              </Grid>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default PatientSearch;
