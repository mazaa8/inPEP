import { useState, useMemo } from 'react';
import {
  Box,
  TextField,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { medications } from '../../data/medications';

const MedicationAlternatives = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMedications = useMemo(() => {
    if (!searchTerm) {
      return medications;
    }
    return medications.filter(med =>
      med.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Medication Alternatives
      </Typography>
      <TextField
        fullWidth
        label="Search for a medication"
        variant="outlined"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
      />
      <Paper elevation={3}>
        <List>
          {filteredMedications.map((med, index) => (
            <Box key={med.id}>
              <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <ListItemText
                  primary={`${med.name} (${med.dosage})`}
                  secondary={med.description}
                />
                {med.alternatives.length > 0 && (
                  <Box sx={{ width: '100%', mt: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Approved Alternatives:
                    </Typography>
                    <List disablePadding>
                      {med.alternatives.map(alt => (
                        <ListItem key={alt.id} sx={{ pl: 4 }}>
                          <ListItemText
                            primary={`${alt.name} (${alt.dosage})`}
                            secondary={alt.description}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </ListItem>
              {index < filteredMedications.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
        {filteredMedications.length === 0 && (
            <Typography sx={{ p: 2, textAlign: 'center' }}>
                No medications found.
            </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default MedicationAlternatives;
