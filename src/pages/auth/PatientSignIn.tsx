import { Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';

const PatientSignIn = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSignIn = async () => {
    try {
      const user = await authService.login('Patient');
      login(user.name, user.role);
      navigate('/dashboard/patient');
    } catch (error) {
      console.error('Failed to sign in', error);
      // Handle error state in UI if necessary
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Patient Sign-In</Typography>
      <Button variant="contained" onClick={handleSignIn}>
        Sign In
      </Button>
    </Box>
  );
};

export default PatientSignIn;
