import { Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';

const ProviderSignIn = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSignIn = async () => {
    try {
      const user = await authService.login('Provider');
      login(user.name, user.role);
      navigate('/dashboard/provider');
    } catch (error) {
      console.error('Failed to sign in', error);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Healthcare Provider Sign-In</Typography>
      <Button variant="contained" onClick={handleSignIn}>
        Sign In
      </Button>
    </Box>
  );
};

export default ProviderSignIn;
