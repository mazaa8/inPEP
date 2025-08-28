import { Box, Typography } from '@mui/material';

const WelcomeHomePage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <Typography variant="h3" component="h1" gutterBottom>
        Welcome Home
      </Typography>
      <Typography variant="h6">
        It's good to have you here. Ye and planning.
      </Typography>
    </Box>
  );
};

export default WelcomeHomePage;
