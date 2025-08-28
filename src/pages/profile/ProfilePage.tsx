import { Typography, Box, Avatar, Chip, Stack } from '@mui/material';
import { WorkspacePremium } from '@mui/icons-material';
import Layout from '../../components/layout/Layout';

const ProfilePage = () => {
  return (
    <Layout title="Profile">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
        <Avatar sx={{ width: 80, height: 80, mb: 2 }}>U</Avatar>
        <Typography variant="h4" component="h1">User Name</Typography>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h6" color="text.secondary">Caregiver</Typography>
          <Chip 
            icon={<WorkspacePremium />}
            label="ReclaiMe Champion™"
            color="primary"
            variant="outlined"
            size="small"
          />
        </Stack>
        <Typography>This is where the rest of the user's profile information will be displayed.</Typography>
      </Box>
    </Layout>
  );
};

export default ProfilePage;
