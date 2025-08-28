import { Box, TextField, Button, Typography } from '@mui/material';

const ProfileSettings = () => {
  return (
    <Box component="form" noValidate autoComplete="off">
      <Typography variant="h6" gutterBottom>Edit Profile</Typography>
      <TextField label="Full Name" variant="outlined" fullWidth margin="normal" defaultValue="John Doe" />
      <TextField label="Email Address" variant="outlined" fullWidth margin="normal" defaultValue="john.doe@example.com" />
      <TextField label="Phone Number" variant="outlined" fullWidth margin="normal" defaultValue="+1 (123) 456-7890" />
      <Button variant="contained" sx={{ mt: 2 }}>Save Changes</Button>
    </Box>
  );
};

export default ProfileSettings;
