import { Box, Typography, TextField, Button, Paper } from '@mui/material';
import Layout from '../../../components/layout/Layout';

const StorySubmissionPage = () => {
  return (
    <Layout title="Share Your Story">
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <Paper sx={{ p: 4, maxWidth: '800px', width: '100%' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Share Your Story
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Your story can inspire and support others. By sharing your experience, you help build a stronger community of caregivers.
          </Typography>
          <Box component="form" noValidate autoComplete="off">
            <TextField
              fullWidth
              label="Story Title"
              variant="outlined"
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              label="Your Story"
              variant="outlined"
              multiline
              rows={10}
              sx={{ mb: 3 }}
            />
            <Button variant="contained" color="primary" size="large">
              Submit Your Story
            </Button>
          </Box>
        </Paper>
      </Box>
    </Layout>
  );
};

export default StorySubmissionPage;
