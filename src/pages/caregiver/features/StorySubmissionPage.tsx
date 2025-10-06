import { Box, TextField, Button } from '@mui/material';
import { Create as WriteIcon } from '@mui/icons-material';
import CaregiverPageWrapper from '../../../components/layout/CaregiverPageWrapper';
import { roleColors } from '../../../styles/glassmorphism';

const StorySubmissionPage = () => {
  return (
    <CaregiverPageWrapper
      title="Share Your Story"
      subtitle="Your story can inspire and support others in the caregiver community"
      icon={<WriteIcon />}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ 
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          borderRadius: '20px',
          p: 4, 
          maxWidth: '800px', 
          width: '100%',
          boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1)',
        }}>
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
            <Button 
              variant="contained" 
              size="large"
              sx={{
                background: roleColors.CAREGIVER.gradient,
                color: 'white',
                fontWeight: 700,
                px: 4,
                py: 1.5,
                borderRadius: '12px',
              }}
            >
              Submit Your Story
            </Button>
          </Box>
        </Box>
      </Box>
    </CaregiverPageWrapper>
  );
};

export default StorySubmissionPage;
