import { Modal, Box, Typography, IconButton, Button } from '@mui/material';
import type { AppointmentEvent } from './AppointmentsCalendar';
import { Close, Notifications } from '@mui/icons-material';
import { useNotifications } from '../../../hooks/useNotifications';
import moment from 'moment';

interface EventDetailsModalProps {
  open: boolean;
  onClose: () => void;
  event: AppointmentEvent | null;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '16px',
  boxShadow: 24,
  p: 4,
};

const EventDetailsModal = ({ open, onClose, event }: EventDetailsModalProps) => {
  const { requestPermission, scheduleNotification, permission } = useNotifications();

  if (!event) return null;

  const handleSetAlert = async () => {
    let currentPermission: NotificationPermission | undefined = permission;
    if (currentPermission !== 'granted') {
      currentPermission = await requestPermission();
    }

    if (currentPermission === 'granted' && event.start) {
      scheduleNotification(
        `Reminder: ${event.title}`,
        {
          body: `Starts at ${moment(event.start).format('h:mm a')}. Location: ${event.location || 'N/A'}`,
          icon: '/vite.svg',
        },
        event.start
      );
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
        >
          <Close />
        </IconButton>
        <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
          {event.title}
        </Typography>
        <Typography sx={{ mb: 2 }}>
          <strong>When:</strong> {`${moment(event.start).format('MMMM Do YYYY, h:mm a')} - ${moment(event.end).format('h:mm a')}`}
        </Typography>
        {event.location && (
          <Typography sx={{ mb: 2 }}>
            <strong>Where:</strong> {event.location}
          </Typography>
        )}
        {event.specialty && (
          <Typography sx={{ mb: 2 }}>
            <strong>Specialty:</strong> {event.specialty}
          </Typography>
        )}
        {event.description && (
          <Typography variant="body2" sx={{ mb: 3 }}><strong>Notes:</strong> {event.description}</Typography>
        )}
        <Button
          variant="contained"
          startIcon={<Notifications />}
          onClick={handleSetAlert}
          fullWidth
          sx={{
            background: 'linear-gradient(135deg, #78A698 0%, #4A7C6E 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #6A9486 0%, #3F6A5D 100%)',
            },
          }}
        >
          Set Alert (15 min before)
        </Button>
      </Box>
    </Modal>
  );
};

export default EventDetailsModal;
