import { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  Grid,
  Paper,
  TextField,
  Avatar,
  Chip,
  IconButton,
} from '@mui/material';
import { Add, Edit, Delete, FamilyRestroom } from '@mui/icons-material';
import Layout from '../../components/layout/Layout';

interface FamilyMember {
  id: number;
  name: string;
  relation: string;
  conditions: string[];
}

const initialFamilyData: FamilyMember[] = [
  { id: 1, name: 'John Doe', relation: 'Father', conditions: ['Heart Disease', 'Type 2 Diabetes'] },
  { id: 2, name: 'Jane Smith', relation: 'Mother', conditions: ['High Blood Pressure'] },
];

const HerediblesPage = () => {
  const [familyMembers, setFamilyMembers] = useState(initialFamilyData);
  const [isAdding, setIsAdding] = useState(false);

  return (
    <Layout title="Heredibles™: My Family Health">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">Family Health Profile</Typography>
          <Button variant="contained" startIcon={<Add />} onClick={() => setIsAdding(true)}>
            Add Member
          </Button>
        </Box>

        {isAdding && (
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>Add New Family Member</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Full Name" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Relation (e.g., Mother, Father, Sibling)" />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Health Conditions (comma-separated)" />
              </Grid>
              <Grid item xs={12} sx={{ textAlign: 'right' }}>
                <Button onClick={() => setIsAdding(false)} sx={{ mr: 1 }}>Cancel</Button>
                <Button variant="contained">Save Member</Button>
              </Grid>
            </Grid>
          </Paper>
        )}

        <Grid container spacing={3}>
          {familyMembers.map((member) => (
            <Grid item xs={12} md={6} key={member.id}>
              <Paper sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ width: 56, height: 56, mr: 2, bgcolor: 'primary.main' }}>
                  <FamilyRestroom />
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6">{member.name}</Typography>
                  <Typography color="text.secondary">{member.relation}</Typography>
                  <Box sx={{ mt: 1 }}>
                    {member.conditions.map((condition, index) => (
                      <Chip key={index} label={condition} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                    ))}
                  </Box>
                </Box>
                <Box>
                  <IconButton size="small"><Edit /></IconButton>
                  <IconButton size="small"><Delete /></IconButton>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Layout>
  );
};

export default HerediblesPage;
