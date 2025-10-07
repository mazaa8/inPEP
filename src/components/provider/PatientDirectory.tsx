import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  TextField,
  InputAdornment,
  Chip,
  Box,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3000/api';

interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
  active: boolean;
  riskLevel?: string;
}

const mockPatients = [
  { id: 'b805ec90-e553-4de7-9de0-45f2eb73d1ba', name: 'Abdeen White', age: 79, condition: 'Heart Disease, Chronic Pancreatitis', active: true },
  { id: '2', name: 'Jan Graham', age: 65, condition: 'Diabetes', active: false },
  { id: '3', name: 'Steven Cameron', age: 72, condition: 'Hypertension', active: false },
  { id: '4', name: 'Michelle Coleman', age: 58, condition: 'Arthritis', active: false },
  { id: '5', name: 'Victoria Black', age: 81, condition: 'Osteoporosis', active: false },
  { id: '6', name: 'Liam Randall', age: 69, condition: 'COPD', active: false },
  { id: '7', name: 'Joan Gibson', age: 76, condition: 'Alzheimer\'s', active: false },
  { id: '8', name: 'Jan Kerr', age: 63, condition: 'Diabetes Type 2', active: false },
  { id: '9', name: 'Anne Johnston', age: 70, condition: 'Hypertension', active: false },
  { id: '10', name: 'Stewart Ferguson', age: 68, condition: 'Heart Disease', active: false },
  { id: '11', name: 'Dominic Campbell', age: 75, condition: 'Stroke Recovery', active: false },
  { id: '12', name: 'Victoria Blake', age: 82, condition: 'Dementia', active: false },
  { id: '13', name: 'Rebecca Gibson', age: 67, condition: 'Arthritis', active: false },
  { id: '14', name: 'Paul Davidson', age: 71, condition: 'COPD', active: false },
  { id: '15', name: 'Fiona Springer', age: 64, condition: 'Diabetes', active: false },
  { id: '16', name: 'Dorothy Lyman', age: 78, condition: 'Osteoporosis', active: false },
  { id: '17', name: 'Una Morgan', age: 73, condition: 'Hypertension', active: false },
  { id: '18', name: 'Max Grant', age: 66, condition: 'Heart Disease', active: false },
  { id: '19', name: 'Virginia Skinner', age: 80, condition: 'Alzheimer\'s', active: false },
  { id: '20', name: 'Oliver Nash', age: 62, condition: 'Diabetes', active: false },
  { id: '21', name: 'Gavin Lawrence', age: 74, condition: 'COPD', active: false },
  { id: '22', name: 'Benjamin Wright', age: 69, condition: 'Hypertension', active: false },
  { id: '23', name: 'Madeleine Howard', age: 77, condition: 'Arthritis', active: false },
  { id: '24', name: 'Christian Miller', age: 65, condition: 'Diabetes', active: false },
  { id: '25', name: 'Angela Clarkson', age: 83, condition: 'Dementia', active: false },
  { id: '26', name: 'Gavin Bell', age: 70, condition: 'Heart Disease', active: false },
  { id: '27', name: 'Paul Langdon', age: 68, condition: 'COPD', active: false },
  { id: '28', name: 'Owen James', age: 72, condition: 'Hypertension', active: false },
  { id: '29', name: 'Samantha Russell', age: 66, condition: 'Diabetes', active: false },
  { id: '30', name: 'Robert Murray', age: 75, condition: 'Stroke Recovery', active: false },
  { id: '31', name: 'Blake Alsop', age: 61, condition: 'Arthritis', active: false },
  { id: '32', name: 'Julia Burgess', age: 79, condition: 'Osteoporosis', active: false },
  { id: '33', name: 'Olivia Vance', age: 67, condition: 'Hypertension', active: false },
  { id: '34', name: 'James Dyer', age: 73, condition: 'COPD', active: false },
  { id: '35', name: 'Sophie Burgess', age: 64, condition: 'Diabetes', active: false },
  { id: '36', name: 'Piers Abraham', age: 76, condition: 'Heart Disease', active: false },
  { id: '37', name: 'Kimberly Murray', age: 69, condition: 'Alzheimer\'s', active: false },
  { id: '38', name: 'Kimberly Henderson', age: 71, condition: 'Dementia', active: false },
  { id: '39', name: 'Molly Parsons', age: 65, condition: 'Arthritis', active: false },
  { id: '40', name: 'Jan Cornish', age: 78, condition: 'Hypertension', active: false },
  { id: '41', name: 'Sonia Parsons', age: 62, condition: 'Diabetes', active: false },
  { id: '42', name: 'Michael Avery', age: 74, condition: 'COPD', active: false },
  { id: '43', name: 'Dorothy Grant', age: 80, condition: 'Osteoporosis', active: false },
  { id: '44', name: 'Felicity James', age: 66, condition: 'Hypertension', active: false },
  { id: '45', name: 'Kevin Bower', age: 72, condition: 'Heart Disease', active: false },
  { id: '46', name: 'Virginia Rutherford', age: 77, condition: 'Alzheimer\'s', active: false },
  { id: '47', name: 'Sue Hill', age: 63, condition: 'Diabetes', active: false },
  { id: '48', name: 'Joseph Bond', age: 75, condition: 'Stroke Recovery', active: false },
  { id: '49', name: 'Vanessa Russell', age: 68, condition: 'Arthritis', active: false },
  { id: '50', name: 'Jonathan Simpson', age: 70, condition: 'COPD', active: false },
  { id: '51', name: 'Evan Hunter', age: 64, condition: 'Hypertension', active: false },
  { id: '52', name: 'Zoe Morgan', age: 81, condition: 'Dementia', active: false },
  { id: '53', name: 'Connor Nash', age: 67, condition: 'Diabetes', active: false },
  { id: '54', name: 'Claire Jackson', age: 73, condition: 'Heart Disease', active: false },
  { id: '55', name: 'Christian Payne', age: 69, condition: 'COPD', active: false },
  { id: '56', name: 'Elizabeth Skinner', age: 76, condition: 'Osteoporosis', active: false },
  { id: '57', name: 'Irene Morgan', age: 82, condition: 'Alzheimer\'s', active: false },
  { id: '58', name: 'Natalie Marshall', age: 65, condition: 'Arthritis', active: false },
  { id: '59', name: 'Charles Cornish', age: 71, condition: 'Hypertension', active: false },
  { id: '60', name: 'William Abraham', age: 68, condition: 'Diabetes', active: false },
  { id: '61', name: 'Jennifer Hughes', age: 74, condition: 'COPD', active: false },
  { id: '62', name: 'Julian Vaughan', age: 66, condition: 'Heart Disease', active: false },
  { id: '63', name: 'Richard Lyman', age: 79, condition: 'Stroke Recovery', active: false },
  { id: '64', name: 'Liam North', age: 62, condition: 'Diabetes', active: false },
  { id: '65', name: 'Christian Young', age: 75, condition: 'Hypertension', active: false },
  { id: '66', name: 'Rose Campbell', age: 70, condition: 'Arthritis', active: false },
  { id: '67', name: 'Emma Hemmings', age: 77, condition: 'Dementia', active: false },
  { id: '68', name: 'Neil Wilkins', age: 63, condition: 'COPD', active: false },
  { id: '69', name: 'Jack Sharp', age: 72, condition: 'Heart Disease', active: false },
  { id: '70', name: 'Mary Wilkins', age: 80, condition: 'Osteoporosis', active: false },
  { id: '71', name: 'Tracey Clarkson', age: 64, condition: 'Diabetes', active: false },
  { id: '72', name: 'Connor James', age: 76, condition: 'Hypertension', active: false },
  { id: '73', name: 'Blake Slater', age: 68, condition: 'COPD', active: false },
  { id: '74', name: 'Joshua Dickens', age: 73, condition: 'Alzheimer\'s', active: false },
  { id: '75', name: 'Amelia Wallace', age: 67, condition: 'Arthritis', active: false },
  { id: '76', name: 'Carl Henderson', age: 71, condition: 'Diabetes', active: false },
  { id: '77', name: 'Alexandra Campbell', age: 69, condition: 'Heart Disease', active: false },
  { id: '78', name: 'Donna Lambert', age: 78, condition: 'Dementia', active: false },
  { id: '79', name: 'Dylan Grant', age: 65, condition: 'COPD', active: false },
  { id: '80', name: 'Evan Forsyth', age: 74, condition: 'Hypertension', active: false },
  { id: '81', name: 'James McDonald', age: 66, condition: 'Diabetes', active: false },
  { id: '82', name: 'Jonathan Hunter', age: 72, condition: 'Stroke Recovery', active: false },
  { id: '83', name: 'Alison Underwood', age: 70, condition: 'Arthritis', active: false },
  { id: '84', name: 'Kimberly Turner', age: 77, condition: 'Osteoporosis', active: false },
  { id: '85', name: 'Emma Rutherford', age: 63, condition: 'Hypertension', active: false },
  { id: '86', name: 'Lisa Campbell', age: 75, condition: 'Diabetes', active: false },
  { id: '87', name: 'Robert Bower', age: 68, condition: 'COPD', active: false },
  { id: '88', name: 'Tim Young', age: 81, condition: 'Alzheimer\'s', active: false },
  { id: '89', name: 'Jennifer May', age: 64, condition: 'Heart Disease', active: false },
  { id: '90', name: 'Karen Vaughan', age: 73, condition: 'Arthritis', active: false },
  { id: '91', name: 'Natalie Nash', age: 69, condition: 'Diabetes', active: false },
  { id: '92', name: 'Luke Taylor', age: 76, condition: 'COPD', active: false },
  { id: '93', name: 'Brandon Baker', age: 67, condition: 'Hypertension', active: false },
  { id: '94', name: 'Yvonne Blake', age: 79, condition: 'Dementia', active: false },
  { id: '95', name: 'Tim Tucker', age: 62, condition: 'Diabetes', active: false },
  { id: '96', name: 'Julia Ogden', age: 74, condition: 'Heart Disease', active: false },
  { id: '97', name: 'Sophie Rees', age: 70, condition: 'Arthritis', active: false },
  { id: '98', name: 'Brandon Butler', age: 66, condition: 'COPD', active: false },
  { id: '99', name: 'Tracey Graham', age: 78, condition: 'Osteoporosis', active: false },
  { id: '100', name: 'Harry King', age: 71, condition: 'Hypertension', active: false },
  { id: '101', name: 'Jacob Ince', age: 65, condition: 'Diabetes', active: false },
];

const PatientDirectory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Activate all 101 patients with realistic data
  const patients: Patient[] = mockPatients.map(p => ({
    ...p,
    active: true,
    riskLevel: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
  }));

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const getRiskColor = (risk?: string) => {
    switch (risk) {
      case 'critical': return '#f44336';
      case 'high': return '#ff9800';
      case 'medium': return '#ffc107';
      case 'low': return '#4caf50';
      default: return 'primary.main';
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Patient Directory
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {patients.length} patients registered • All Active
      </Typography>

      <TextField
        fullWidth
        placeholder="Search patients..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <List sx={{ maxHeight: 600, overflow: 'auto' }}>
        {filteredPatients.map((patient, index) => (
          <React.Fragment key={patient.id}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate('/provider/ai-adherence')}
                sx={{
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: getRiskColor(patient.riskLevel) }}>
                    {getInitials(patient.name)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body1">{patient.name}</Typography>
                      <Chip 
                        label="Active" 
                        size="small" 
                        icon={<CheckCircleIcon />}
                        color="success" 
                      />
                      {patient.riskLevel && (
                        <Chip 
                          label={patient.riskLevel.toUpperCase()} 
                          size="small"
                          sx={{
                            bgcolor: getRiskColor(patient.riskLevel),
                            color: 'white',
                            fontWeight: 700,
                          }}
                        />
                      )}
                    </Box>
                  }
                  secondary={`Age: ${patient.age} • ${patient.condition}`}
                />
              </ListItemButton>
            </ListItem>
            {index < filteredPatients.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>

      {filteredPatients.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <PersonIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="body2" color="text.secondary">
            No patients found
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default PatientDirectory;
