import { useState } from 'react';
import { Box, Button, Typography, Paper, Alert } from '@mui/material';

const TestLogin = () => {
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  const testDirectFetch = async () => {
    setResult('Testing...');
    setError('');
    
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'patient@test.com',
          password: 'password123',
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult(JSON.stringify(data, null, 2));
      } else {
        setError(JSON.stringify(data, null, 2));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const testHealthCheck = async () => {
    setResult('Testing health...');
    setError('');
    
    try {
      const response = await fetch('http://localhost:3000/api/health');
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          API Connection Test
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button variant="contained" onClick={testHealthCheck}>
            Test Health Check
          </Button>
          <Button variant="contained" color="primary" onClick={testDirectFetch}>
            Test Login API
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="body2" component="pre">
              {error}
            </Typography>
          </Alert>
        )}

        {result && (
          <Alert severity="success">
            <Typography variant="body2" component="pre">
              {result}
            </Typography>
          </Alert>
        )}

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Instructions:
          </Typography>
          <Typography variant="body2">
            1. Click "Test Health Check" - should return server status
            <br />
            2. Click "Test Login API" - should return JWT token and user data
            <br />
            3. Check browser console (F12) for detailed logs
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default TestLogin;
