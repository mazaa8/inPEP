import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Box,
  Alert,
  Avatar,
  Typography,
  Tab,
  Tabs,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { 
  Person as PatientIcon,
  Business as InsurerIcon,
  LocalHospital as ProviderIcon,
  FavoriteBorder as CaregiverIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { roleColors } from '../../styles/glassmorphism';

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

  const getRoleTheme = () => {
    switch (role) {
      case 'PATIENT':
        return {
          background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
          cardBg: 'rgba(255, 255, 255, 0.05)',
          textColor: 'white',
          icon: <PatientIcon />,
          gradient: roleColors.PATIENT.gradient,
          primary: roleColors.PATIENT.primary,
        };
      case 'INSURER':
        return {
          background: 'linear-gradient(135deg, #faf8ff 0%, #f0ebff 50%, #e8deff 100%)',
          cardBg: 'rgba(255, 255, 255, 0.7)',
          textColor: '#4a148c',
          icon: <InsurerIcon />,
          gradient: roleColors.INSURER.gradient,
          primary: roleColors.INSURER.primary,
        };
      case 'PROVIDER':
        return {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          cardBg: 'rgba(255, 255, 255, 0.9)',
          textColor: '#333',
          icon: <ProviderIcon />,
          gradient: roleColors.PROVIDER.gradient,
          primary: roleColors.PROVIDER.primary,
        };
      case 'CAREGIVER':
        return {
          background: 'linear-gradient(135deg, #f1f8f4 0%, #e8f5e9 50%, #dcedc8 100%)',
          cardBg: 'rgba(255, 255, 255, 0.7)',
          textColor: '#1b5e20',
          icon: <CaregiverIcon />,
          gradient: roleColors.CAREGIVER.gradient,
          primary: roleColors.CAREGIVER.primary,
        };
    }
  };

  const theme = getRoleTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme.background,
        p: 2,
        transition: 'background 0.5s ease',
      }}
    >
      <Box sx={{ 
        maxWidth: 500, 
        width: '100%', 
        p: 4,
        background: theme.cardBg,
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        border: role === 'PATIENT' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.8)',
        borderRadius: '24px',
        boxShadow: role === 'PATIENT' ? '0 8px 32px rgba(0, 0, 0, 0.4)' : 
                   role === 'INSURER' ? '0 8px 32px rgba(156, 39, 176, 0.2)' :
                   role === 'CAREGIVER' ? '0 8px 32px rgba(76, 175, 80, 0.2)' : '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <Avatar sx={{ 
            m: 1, 
            background: theme.gradient,
            width: 72, 
            height: 72,
            boxShadow: `0 8px 24px ${theme.primary}40`,
          }}>
            {theme.icon}
          </Avatar>
          <Typography component="h1" variant="h4" sx={{ fontWeight: 700, color: theme.textColor, mt: 2 }}>
            inPEP™
          </Typography>
          <Typography variant="body1" sx={{ 
            color: role === 'PATIENT' ? 'rgba(255,255,255,0.7)' : 
                   role === 'INSURER' ? 'rgba(74, 20, 140, 0.7)' :
                   role === 'CAREGIVER' ? 'rgba(27, 94, 32, 0.7)' : 'rgba(0,0,0,0.7)',
            mt: 0.5 
          }}>
            {role === 'PATIENT' ? 'Patient Portal' : 
             role === 'INSURER' ? 'Insurer Analytics' : 
             role === 'CAREGIVER' ? 'Caregiver Portal' : 'Healthcare Platform'}
          </Typography>
        </Box>

        {/* Role Selector */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ color: theme.textColor, mb: 1.5, fontWeight: 600, textAlign: 'center' }}>
            Select Your Role
          </Typography>
          <ToggleButtonGroup
            value={role}
            exclusive
            onChange={(_, newRole) => newRole && setRole(newRole)}
            fullWidth
            sx={{
              '& .MuiToggleButton-root': {
                color: role === 'PATIENT' ? 'rgba(255,255,255,0.7)' : 
                       role === 'INSURER' ? 'rgba(74, 20, 140, 0.7)' :
                       role === 'CAREGIVER' ? 'rgba(27, 94, 32, 0.7)' : 'rgba(0,0,0,0.7)',
                borderColor: role === 'PATIENT' ? 'rgba(255,255,255,0.2)' : 
                             role === 'INSURER' ? 'rgba(156, 39, 176, 0.3)' :
                             role === 'CAREGIVER' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(0,0,0,0.2)',
                '&.Mui-selected': {
                  background: theme.gradient,
                  color: 'white',
                  fontWeight: 700,
                  '&:hover': {
                    background: theme.gradient,
                  },
                },
              },
            }}
          >
            <ToggleButton value="PATIENT">Patient</ToggleButton>
            <ToggleButton value="CAREGIVER">Caregiver</ToggleButton>
            <ToggleButton value="PROVIDER">Provider</ToggleButton>
            <ToggleButton value="INSURER">Insurer</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          centered 
          sx={{ 
            mb: 3,
            '& .MuiTab-root': {
              color: role === 'PATIENT' ? 'rgba(255,255,255,0.7)' : 
                     role === 'INSURER' ? 'rgba(74, 20, 140, 0.7)' :
                     role === 'CAREGIVER' ? 'rgba(27, 94, 32, 0.7)' : 'rgba(0,0,0,0.7)',
              fontWeight: 600,
              '&.Mui-selected': {
                color: role === 'PATIENT' ? 'white' : theme.primary,
              },
            },
            '& .MuiTabs-indicator': {
              background: theme.gradient,
              height: 3,
            },
          }}
        >
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: theme.textColor,
                  bgcolor: role === 'PATIENT' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.5)',
                  '& fieldset': { 
                    borderColor: role === 'PATIENT' ? 'rgba(255,255,255,0.2)' : 
                                 role === 'INSURER' ? 'rgba(156, 39, 176, 0.3)' :
                                 role === 'CAREGIVER' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(0,0,0,0.2)'
                  },
                  '&:hover fieldset': { borderColor: theme.primary },
                  '&.Mui-focused fieldset': { borderColor: theme.primary },
                },
                '& .MuiInputLabel-root': { 
                  color: role === 'PATIENT' ? 'rgba(255,255,255,0.7)' : 
                         role === 'INSURER' ? 'rgba(74, 20, 140, 0.7)' :
                         role === 'CAREGIVER' ? 'rgba(27, 94, 32, 0.7)' : 'rgba(0,0,0,0.7)'
                },
                '& .MuiInputLabel-root.Mui-focused': { color: theme.primary },
              }}
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: theme.textColor,
                  bgcolor: role === 'PATIENT' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.5)',
                  '& fieldset': { 
                    borderColor: role === 'PATIENT' ? 'rgba(255,255,255,0.2)' : 
                                 role === 'INSURER' ? 'rgba(156, 39, 176, 0.3)' :
                                 role === 'CAREGIVER' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(0,0,0,0.2)'
                  },
                  '&:hover fieldset': { borderColor: theme.primary },
                  '&.Mui-focused fieldset': { borderColor: theme.primary },
                },
                '& .MuiInputLabel-root': { 
                  color: role === 'PATIENT' ? 'rgba(255,255,255,0.7)' : 
                         role === 'INSURER' ? 'rgba(74, 20, 140, 0.7)' :
                         role === 'CAREGIVER' ? 'rgba(27, 94, 32, 0.7)' : 'rgba(0,0,0,0.7)'
                },
                '& .MuiInputLabel-root.Mui-focused': { color: theme.primary },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                mb: 2, 
                py: 1.5,
                background: theme.gradient,
                color: 'white',
                fontWeight: 700,
                fontSize: '1rem',
                borderRadius: '12px',
                boxShadow: `0 4px 16px ${theme.primary}40`,
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: `0 8px 24px ${theme.primary}50`,
                },
                transition: 'all 0.2s ease',
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Sign In'}
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: theme.textColor,
                  bgcolor: role === 'PATIENT' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.5)',
                  '& fieldset': { 
                    borderColor: role === 'PATIENT' ? 'rgba(255,255,255,0.2)' : 
                                 role === 'INSURER' ? 'rgba(156, 39, 176, 0.3)' :
                                 role === 'CAREGIVER' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(0,0,0,0.2)'
                  },
                  '&:hover fieldset': { borderColor: theme.primary },
                  '&.Mui-focused fieldset': { borderColor: theme.primary },
                },
                '& .MuiInputLabel-root': { 
                  color: role === 'PATIENT' ? 'rgba(255,255,255,0.7)' : 
                         role === 'INSURER' ? 'rgba(74, 20, 140, 0.7)' :
                         role === 'CAREGIVER' ? 'rgba(27, 94, 32, 0.7)' : 'rgba(0,0,0,0.7)'
                },
                '& .MuiInputLabel-root.Mui-focused': { color: theme.primary },
              }}
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: theme.textColor,
                  bgcolor: role === 'PATIENT' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.5)',
                  '& fieldset': { 
                    borderColor: role === 'PATIENT' ? 'rgba(255,255,255,0.2)' : 
                                 role === 'INSURER' ? 'rgba(156, 39, 176, 0.3)' :
                                 role === 'CAREGIVER' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(0,0,0,0.2)'
                  },
                  '&:hover fieldset': { borderColor: theme.primary },
                  '&.Mui-focused fieldset': { borderColor: theme.primary },
                },
                '& .MuiInputLabel-root': { 
                  color: role === 'PATIENT' ? 'rgba(255,255,255,0.7)' : 
                         role === 'INSURER' ? 'rgba(74, 20, 140, 0.7)' :
                         role === 'CAREGIVER' ? 'rgba(27, 94, 32, 0.7)' : 'rgba(0,0,0,0.7)'
                },
                '& .MuiInputLabel-root.Mui-focused': { color: theme.primary },
              }}
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: theme.textColor,
                  bgcolor: role === 'PATIENT' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.5)',
                  '& fieldset': { 
                    borderColor: role === 'PATIENT' ? 'rgba(255,255,255,0.2)' : 
                                 role === 'INSURER' ? 'rgba(156, 39, 176, 0.3)' :
                                 role === 'CAREGIVER' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(0,0,0,0.2)'
                  },
                  '&:hover fieldset': { borderColor: theme.primary },
                  '&.Mui-focused fieldset': { borderColor: theme.primary },
                },
                '& .MuiInputLabel-root': { 
                  color: role === 'PATIENT' ? 'rgba(255,255,255,0.7)' : 
                         role === 'INSURER' ? 'rgba(74, 20, 140, 0.7)' :
                         role === 'CAREGIVER' ? 'rgba(27, 94, 32, 0.7)' : 'rgba(0,0,0,0.7)'
                },
                '& .MuiInputLabel-root.Mui-focused': { color: theme.primary },
                '& .MuiFormHelperText-root': { 
                  color: role === 'PATIENT' ? 'rgba(255,255,255,0.6)' : 
                         role === 'INSURER' ? 'rgba(74, 20, 140, 0.6)' :
                         role === 'CAREGIVER' ? 'rgba(27, 94, 32, 0.6)' : 'rgba(0,0,0,0.6)'
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                mb: 2, 
                py: 1.5,
                background: theme.gradient,
                color: 'white',
                fontWeight: 700,
                fontSize: '1rem',
                borderRadius: '12px',
                boxShadow: `0 4px 16px ${theme.primary}40`,
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: `0 8px 24px ${theme.primary}50`,
                },
                transition: 'all 0.2s ease',
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Sign Up'}
            </Button>
          </Box>
        </TabPanel>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ 
            color: role === 'PATIENT' ? 'rgba(255,255,255,0.6)' : 
                   role === 'INSURER' ? 'rgba(74, 20, 140, 0.6)' :
                   role === 'CAREGIVER' ? 'rgba(27, 94, 32, 0.6)' : 'rgba(0,0,0,0.6)',
            mb: 2 
          }}>
            Quick Login (Demo):
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => {
                setEmail('patient@test.com');
                setPassword('password123');
                setRole('PATIENT');
              }}
              sx={{
                color: role === 'PATIENT' ? 'rgba(255,255,255,0.7)' : 
                       role === 'INSURER' ? 'rgba(74, 20, 140, 0.7)' :
                       role === 'CAREGIVER' ? 'rgba(27, 94, 32, 0.7)' : 'rgba(0,0,0,0.7)',
                borderColor: role === 'PATIENT' ? 'rgba(255,255,255,0.3)' : 
                             role === 'INSURER' ? 'rgba(156, 39, 176, 0.3)' :
                             role === 'CAREGIVER' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(0,0,0,0.3)',
                '&:hover': {
                  borderColor: roleColors.PATIENT.primary,
                  bgcolor: `${roleColors.PATIENT.primary}10`,
                },
              }}
            >
              Patient
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => {
                setEmail('caregiver@test.com');
                setPassword('password123');
                setRole('CAREGIVER');
              }}
              sx={{
                color: role === 'PATIENT' ? 'rgba(255,255,255,0.7)' : 'rgba(74, 20, 140, 0.7)',
                borderColor: role === 'PATIENT' ? 'rgba(255,255,255,0.3)' : 'rgba(156, 39, 176, 0.3)',
                '&:hover': {
                  borderColor: roleColors.CAREGIVER.primary,
                  bgcolor: `${roleColors.CAREGIVER.primary}10`,
                },
              }}
            >
              Caregiver
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => {
                setEmail('provider@test.com');
                setPassword('password123');
                setRole('PROVIDER');
              }}
              sx={{
                color: role === 'PATIENT' ? 'rgba(255,255,255,0.7)' : 'rgba(74, 20, 140, 0.7)',
                borderColor: role === 'PATIENT' ? 'rgba(255,255,255,0.3)' : 'rgba(156, 39, 176, 0.3)',
                '&:hover': {
                  borderColor: roleColors.PROVIDER.primary,
                  bgcolor: `${roleColors.PROVIDER.primary}10`,
                },
              }}
            >
              Provider
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => {
                setEmail('insurer@test.com');
                setPassword('password123');
                setRole('INSURER');
              }}
              sx={{
                color: role === 'PATIENT' ? 'rgba(255,255,255,0.7)' : 'rgba(74, 20, 140, 0.7)',
                borderColor: role === 'PATIENT' ? 'rgba(255,255,255,0.3)' : 'rgba(156, 39, 176, 0.3)',
                '&:hover': {
                  borderColor: roleColors.INSURER.primary,
                  bgcolor: `${roleColors.INSURER.primary}10`,
                },
              }}
            >
              Insurer
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default RealLoginPage;
