import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Avatar,
} from '@mui/material';
import { Phone as PhoneIcon, PhoneDisabled as DeclineIcon } from '@mui/icons-material';

interface IncomingCallNotificationProps {
  open: boolean;
  callerName: string;
  onAccept: () => void;
  onDecline: () => void;
}

const IncomingCallNotification = ({
  open,
  callerName,
  onAccept,
  onDecline,
}: IncomingCallNotificationProps) => {
  return (
    <Dialog
      open={open}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pt: 4 }}>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            margin: '0 auto',
            mb: 2,
            bgcolor: 'white',
            color: '#667eea',
            fontSize: '2rem',
          }}
        >
          {callerName.charAt(0)}
        </Avatar>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          {callerName} is calling
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ textAlign: 'center', pb: 2 }}>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          📹 Video call incoming
        </Typography>
        <Box
          sx={{
            mt: 3,
            animation: 'pulse 1.5s infinite',
            '@keyframes pulse': {
              '0%': { transform: 'scale(1)' },
              '50%': { transform: 'scale(1.1)' },
              '100%': { transform: 'scale(1)' },
            },
          }}
        >
          <PhoneIcon sx={{ fontSize: 48 }} />
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', pb: 4, gap: 2 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<DeclineIcon />}
          onClick={onDecline}
          sx={{
            bgcolor: '#d32f2f',
            color: 'white',
            px: 3,
            '&:hover': { bgcolor: '#b71c1c' },
          }}
        >
          Decline
        </Button>
        <Button
          variant="contained"
          size="large"
          startIcon={<PhoneIcon />}
          onClick={onAccept}
          sx={{
            bgcolor: '#4CAF50',
            color: 'white',
            px: 3,
            '&:hover': { bgcolor: '#45a049' },
          }}
        >
          Accept
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default IncomingCallNotification;
