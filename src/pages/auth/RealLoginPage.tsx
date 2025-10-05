import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Box,
  Paper,
  Alert,
  Avatar,
  Typography,
  Tab,
  Tabs,
  CircularProgress,
} from '@mui/material';
import { LockOutlined as LockIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const RealLoginPage = () => {
  // Get pre-selected role from landing page if available
  const getInitialRole = (): 'PATIENT' | 'CAREGIVER' | 'PROVIDER' | 'INSURER' => {
    const selectedRole = sessionStorage.getItem('selectedRole');
    const roleMap: Record<string, 'PATIENT' | 'CAREGIVER' | 'PROVIDER' | 'INSURER'> = {
      'patient': 'PATIENT',
      'caregiver': 'CAREGIVER',
      'hospital': 'PROVIDER',
      'insurer': 'INSURER',
    };
    return roleMap[selectedRole || ''] || 'PATIENT';
  };

  const [tabValue, setTabValue] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'PATIENT' | 'CAREGIVER' | 'PROVIDER' | 'INSURER'>(getInitialRole());
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('Login attempt:', { email, password: '***' });

    try {
      const response = await authService.login({ email, password });
      
      console.log('Login successful, user:', response.user);
      
      // Navigate to appropriate dashboard based on user role
      const dashboardRoutes: Record<string, string> = {
        PATIENT: '/dashboard/patient',
        CAREGIVER: '/dashboard/caregiver',
        PROVIDER: '/dashboard/provider',
        INSURER: '/dashboard/insurer',
      };
      
      const destination = dashboardRoutes[response.user.role] || '/dashboard/patient';
      console.log('Navigating to:', destination);
      
      // Also update the auth context
      await login({ email, password });
      
      navigate(destination);
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register({ email, password, name, role });
      
      // Navigate to appropriate dashboard
      const dashboardRoutes = {
        PATIENT: '/dashboard/patient',
        CAREGIVER: '/dashboard/caregiver',
        PROVIDER: '/dashboard/provider',
        INSURER: '/dashboard/insurer',
      };
      
      navigate(dashboardRoutes[role]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 2,
      }}
    >
      <Paper elevation={6} sx={{ maxWidth: 500, width: '100%', p: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56 }}>
            <LockIcon />
          </Avatar>
          <Typography component="h1" variant="h5" fontWeight="bold">
            My Health Hub
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Healthcare Management Platform
          </Typography>
        </Box>

        <Tabs value={tabValue} onChange={handleTabChange} centered sx={{ mb: 2 }}>
          <Tab label="Sign In" />
          <Tab label="Sign Up" />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Login Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box component="form" onSubmit={handleLogin}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              type="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
          </Box>
        </TabPanel>

        {/* Register Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box component="form" onSubmit={handleRegister}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Full Name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              helperText="Minimum 6 characters"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              select
              label="Role"
              value={role}
              onChange={(e) => setRole(e.target.value as typeof role)}
              disabled={loading}
              SelectProps={{ native: true }}
            >
              <option value="PATIENT">Patient</option>
              <option value="CAREGIVER">Caregiver</option>
              <option value="PROVIDER">Healthcare Provider</option>
              <option value="INSURER">Insurance Company</option>
            </TextField>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign Up'}
            </Button>
          </Box>
        </TabPanel>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Demo Credentials: role@test.com / password123
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default RealLoginPage;
