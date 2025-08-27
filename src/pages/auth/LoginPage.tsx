import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Container } from '@mui/material';
import PatientSignIn from './PatientSignIn';
import CaregiverSignIn from './CaregiverSignIn';
import ProviderSignIn from './ProviderSignIn';
import InsurerSignIn from './InsurerSignIn';

const LoginPage = () => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const selectedRole = sessionStorage.getItem('selectedRole');
    // Map 'hospital' from landing page to 'Provider' role used in auth
    if (selectedRole === 'hospital') {
      setRole('Provider');
    } else {
      setRole(selectedRole);
    }
  }, []);

  const renderSignInComponent = () => {
    switch (role) {
      case 'patient':
        return <PatientSignIn />;
      case 'caregiver':
        return <CaregiverSignIn />;
      case 'Provider': // Matches the role used in authService
        return <ProviderSignIn />;
      case 'insurer':
        return <InsurerSignIn />;
      default:
        return <Typography>Please select a role from the landing page.</Typography>;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Container maxWidth="xs">
        <Paper elevation={12} sx={{ p: 4, borderRadius: 4 }}>
          {renderSignInComponent()}
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
