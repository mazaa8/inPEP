import { Box, Typography, Divider } from '@mui/material';
import NotificationRow from './NotificationRow';

const NotificationSettings = () => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>Notifications</Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Choose how you want to be notified about activities on the platform.
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" gutterBottom>Appointments & Care Planning</Typography>
      <NotificationRow label="Appointment Reminders" defaultEmail={true} />
      <NotificationRow label="Care Plan Updates" defaultEmail={true} defaultPush={true} />
      <NotificationRow label="Task Reminders" defaultPush={true} />

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" gutterBottom>Community & Engagement</Typography>
      <NotificationRow label="New Forum Activity" defaultPush={true} />
      <NotificationRow label="Story Submission Confirmation" defaultEmail={true} />
      <NotificationRow label="New Caregiver Spotlights" />

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" gutterBottom>ReclaiMe Champion™ Program</Typography>
      <NotificationRow label="New Exclusive Content" defaultEmail={true} />
      <NotificationRow label="Expert Q&A Session Alerts" defaultPush={true} />

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" gutterBottom>Account & General</Typography>
      <NotificationRow label="Platform Announcements" defaultEmail={true} />
      <NotificationRow label="Weekly Digest" />
    </Box>
  );
};

export default NotificationSettings;

