import { useState, useEffect } from 'react';
import {
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Box,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  LocalHospital as HospitalIcon,
} from '@mui/icons-material';
import Layout from '../../components/layout/Layout';
import { providerService, type Provider } from '../../services/providerService';

const ProviderDirectoryPage = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProviders();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = providers.filter(
        (provider) =>
          provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          provider.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
          provider.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProviders(filtered);
    } else {
      setFilteredProviders(providers);
    }
  }, [searchQuery, providers]);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const data = await providerService.getProviders();
      setProviders(data);
      setFilteredProviders(data);
    } catch (err) {
      console.error('Failed to load providers:', err);
      setError('Failed to load provider directory');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      '#1976d2',
      '#388e3c',
      '#d32f2f',
      '#7b1fa2',
      '#f57c00',
      '#0097a7',
      '#c2185b',
      '#5d4037',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (loading) {
    return (
      <Layout title="Provider Directory">
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Provider Directory">
        <Alert severity="error">{error}</Alert>
      </Layout>
    );
  }

  return (
    <Layout title="Provider Directory">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Provider Directory
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Browse all healthcare providers in the inPEP network
        </Typography>

        <TextField
          fullWidth
          placeholder="Search by name, specialty, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mt: 2, maxWidth: 600 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Showing {filteredProviders.length} of {providers.length} providers
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {filteredProviders.map((provider) => (
          <Grid item xs={12} sm={6} md={4} key={provider.id}>
            <Card elevation={2} sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      bgcolor: getAvatarColor(provider.name),
                      mr: 2,
                    }}
                  >
                    {getInitials(provider.name)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontSize: '1rem' }}>
                      {provider.name}
                    </Typography>
                    <Chip
                      label={provider.specialty}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PersonIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {provider.licenseNumber || 'License on file'}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <HospitalIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {provider.department}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EmailIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                  <Typography
                    variant="body2"
                    color="primary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {provider.email}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredProviders.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center', mt: 3 }}>
          <Typography variant="h6" color="text.secondary">
            No providers found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Try adjusting your search query
          </Typography>
        </Paper>
      )}
    </Layout>
  );
};

export default ProviderDirectoryPage;
