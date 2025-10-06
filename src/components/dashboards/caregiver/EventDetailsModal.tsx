import { Modal, Box, Typography, IconButton, Button, Chip, Avatar } from '@mui/material';
import type { AppointmentEvent } from './AppointmentsCalendar';
import { Close, Notifications, Event, LocationOn } from '@mui/icons-material';
import { useNotifications } from '../../../hooks/useNotifications';
import { roleColors } from '../../../styles/glassmorphism';
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
  width: 500,
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(30px)',
  WebkitBackdropFilter: 'blur(30px)',
  border: '1px solid rgba(76, 175, 80, 0.3)',
  borderRadius: '24px',
  boxShadow: '0 12px 48px rgba(76, 175, 80, 0.25)',
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
          sx={{ 
            position: 'absolute', 
            right: 12, 
            top: 12,
            color: 'rgba(27, 94, 32, 0.5)',
            '&:hover': {
              color: '#1b5e20',
              bgcolor: 'rgba(76, 175, 80, 0.1)',
            },
          }}
        >
          <Close />
        </IconButton>
        
        {/* Header with Icon */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar sx={{ 
            background: roleColors.CAREGIVER.gradient,
            width: 56,
            height: 56,
            boxShadow: `0 4px 16px ${roleColors.CAREGIVER.primary}40`,
          }}>
            <Event sx={{ fontSize: 28 }} />
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1b5e20' }}>
              {event.title}
            </Typography>
            {event.specialty && (
              <Chip 
                label={event.specialty} 
                size="small" 
                sx={{ 
                  mt: 0.5,
                  bgcolor: 'rgba(76, 175, 80, 0.15)',
                  color: roleColors.CAREGIVER.primary,
                  fontWeight: 600,
                }}
              />
            )}
          </Box>
        </Box>

        {/* Details */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            gap: 1.5, 
            mb: 2,
            p: 2,
            background: 'rgba(76, 175, 80, 0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(76, 175, 80, 0.15)',
          }}>
            <Event sx={{ color: roleColors.CAREGIVER.primary, mt: 0.3 }} />
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(27, 94, 32, 0.7)', fontWeight: 700, display: 'block', mb: 0.5 }}>
                WHEN
              </Typography>
              <Typography variant="body1" sx={{ color: '#1b5e20', fontWeight: 600 }}>
                {moment(event.start).format('MMMM Do YYYY')}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(27, 94, 32, 0.8)' }}>
                {moment(event.start).format('h:mm a')} - {moment(event.end).format('h:mm a')}
              </Typography>
            </Box>
          </Box>

          {event.location && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: 1.5, 
              mb: 2,
              p: 2,
              background: 'rgba(76, 175, 80, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(76, 175, 80, 0.15)',
            }}>
              <LocationOn sx={{ color: roleColors.CAREGIVER.primary, mt: 0.3 }} />
              <Box>
                <Typography variant="caption" sx={{ color: 'rgba(27, 94, 32, 0.7)', fontWeight: 700, display: 'block', mb: 0.5 }}>
                  WHERE
                </Typography>
                <Typography variant="body1" sx={{ color: '#1b5e20', fontWeight: 600 }}>
                  {event.location}
                </Typography>
              </Box>
            </Box>
          )}

          {event.description && (
            <Box sx={{ 
              p: 2,
              background: 'rgba(76, 175, 80, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(76, 175, 80, 0.15)',
            }}>
              <Typography variant="caption" sx={{ color: 'rgba(27, 94, 32, 0.7)', fontWeight: 700, display: 'block', mb: 1 }}>
                NOTES
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(27, 94, 32, 0.85)' }}>
                {event.description}
              </Typography>
            </Box>
          )}
        </Box>

        <Button
          variant="contained"
          startIcon={<Notifications />}
          onClick={handleSetAlert}
          fullWidth
          size="large"
          sx={{
            background: roleColors.CAREGIVER.gradient,
            color: 'white',
            fontWeight: 700,
            py: 1.5,
            borderRadius: '12px',
            boxShadow: `0 4px 16px ${roleColors.CAREGIVER.primary}40`,
            '&:hover': {
              transform: 'scale(1.02)',
              boxShadow: `0 6px 20px ${roleColors.CAREGIVER.primary}50`,
            },
            transition: 'all 0.2s ease',
          }}
        >
          Set Alert (15 min before)
        </Button>
      </Box>
    </Modal>
  );
};

export default EventDetailsModal;
