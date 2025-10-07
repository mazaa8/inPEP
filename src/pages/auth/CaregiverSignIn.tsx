import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Box,
  Paper,
  Grid,
  Alert,
  MenuItem,
  Avatar,
  FormControlLabel,
  Checkbox,
  Link,
  Chip,
  IconButton
} from '@mui/material';
import { FamilyRestroom as CaregiverIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const CaregiverSignIn = () => {
  const [nationalId, setNationalId] = useState('');
  const [hospital, setHospital] = useState('');
  const [familyCode, setFamilyCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email: nationalId, password });
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f4f0',
      }}
    >
      <IconButton
        onClick={() => navigate('/')}
        sx={{
          position: 'absolute',
          top: 80,
          left: 60,
          color: 'white',
          background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
          },
        }}
      >
        <ArrowBackIcon />
      </IconButton>
      <Box sx={{ width: '100%', height: '100%', p: 4 }}>
        <Paper elevation={3} sx={{ p: { xs: 2, md: 6 }, mt: 1, width: '100%', maxWidth: '1200px', mx: 'auto' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ width: 80, height: 80, mb: 2, background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)', boxShadow: '0 40px 120px rgba(0,0,0,0.2)' }}>
              <CaregiverIcon sx={{ fontSize: 50 }} />
            </Avatar>
            <Chip 
              label="Caregiver Sign-In"
              sx={{
                background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 'bold',
                px: 2,
                py: 2.5,
                letterSpacing: 1
              }}
            />
          </Box>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container direction="column" spacing={3}>
              {error && (
                <Grid item>
                  <Alert severity="error">{error}</Alert>
                </Grid>
              )}
              <Grid item>
                <TextField
                  label="National ID / Passport"
                  fullWidth
                  required
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#2E7D32',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#2E7D32',
                    },
                  }}
                />
              </Grid>
              <Grid item>
                <TextField
                  select
                  label="Hospital / Provider"
                  fullWidth
                  required
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#2E7D32',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#2E7D32',
                    },
                  }}
                >
                  <MenuItem value="King Faisal Specialist Hospital">King Faisal Specialist Hospital</MenuItem>
                  <MenuItem value="Dr. Sulaiman Al Habib Hospital">Dr. Sulaiman Al Habib Hospital</MenuItem>
                  <MenuItem value="Medgulf Health Center">Medgulf Health Center</MenuItem>
                  <MenuItem value="National Guard Hospital">National Guard Hospital</MenuItem>
                  <MenuItem value="Riyadh Care Hospital">Riyadh Care Hospital</MenuItem>
                </TextField>
              </Grid>
              <Grid item>
                <TextField
                  label="Family Code (if applicable)"
                  fullWidth
                  value={familyCode}
                  onChange={(e) => setFamilyCode(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#2E7D32',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#2E7D32',
                    },
                  }}
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#2E7D32',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#2E7D32',
                    },
                  }}
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={<Checkbox value="remember" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} sx={{
                    color: '#2E7D32',
                    '&.Mui-checked': {
                      color: '#2E7D32',
                    },
                  }} />}
                  label="Remember me"
                />
              </Grid>
              <Grid item>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 1,
                    py: 1.5,
                    background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                    '&:hover': {
                      boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                    },
                  }}
                >
                  Sign In
                </Button>
              </Grid>
              <Grid container sx={{ mt: 2 }}>
                <Grid item xs>
                  <Link href="#" variant="body2" sx={{ color: '#2E7D32' }}>
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="#" variant="body2" sx={{ color: '#2E7D32' }}>
                    Login Support
                  </Link>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default CaregiverSignIn;
