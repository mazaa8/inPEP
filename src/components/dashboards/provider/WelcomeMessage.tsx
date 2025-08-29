import { Paper, Typography } from '@mui/material';

const WelcomeMessage = () => {
  return (
    <Paper sx={{ p: 2, mb: 4, backgroundColor: 'primary.main', color: 'white' }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Welcome Back, Dr. Smith!
      </Typography>
      <Typography variant="body1">
        Here's a summary of your key activities and patient updates for today.
      </Typography>
    </Paper>
  );
};

export default WelcomeMessage;
