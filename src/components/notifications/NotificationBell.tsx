import { useState, useEffect } from 'react';
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  Button,
  Chip,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  CheckCircle,
  Delete,
  DoneAll,
  Circle,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { notificationService, getRelativeTime, getSeverityColor, getNotificationIcon, type Notification } from '../../services/notificationService';
import { useAuth } from '../../context/AuthContext';

const NotificationBell = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const open = Boolean(anchorEl);

  useEffect(() => {
    if (user?.id) {
      loadNotifications();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadNotifications = async () => {
    if (!user?.id) return;
    
    try {
      const [allNotifications, count] = await Promise.all([
        notificationService.getNotifications(user.id),
        notificationService.getUnreadCount(user.id),
      ]);
      console.log('Loaded notifications:', allNotifications.length, 'Unread:', count);
      setNotifications(allNotifications);
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read
    if (!notification.isRead) {
      await notificationService.markAsRead(notification.id);
      await loadNotifications();
    }

    // Navigate to related page
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }

    handleClose();
  };

  const handleMarkAllRead = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      await notificationService.markAllAsRead(user.id);
      await loadNotifications();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNotification = async (notificationId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    try {
      await notificationService.deleteNotification(notificationId);
      await loadNotifications();
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          color: 'white',
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 400,
            maxHeight: 600,
            bgcolor: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 152, 0, 0.3)',
            mt: 1,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* Header */}
        <Box sx={{ p: 2, pb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ color: '#FFA726', fontWeight: 700 }}>
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Button
                size="small"
                startIcon={<DoneAll />}
                onClick={handleMarkAllRead}
                disabled={loading}
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.75rem',
                  '&:hover': {
                    bgcolor: 'rgba(255, 152, 0, 0.1)',
                  },
                }}
              >
                Mark all read
              </Button>
            )}
          </Box>
          {unreadCount > 0 && (
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
            </Typography>
          )}
        </Box>

        <Divider sx={{ borderColor: 'rgba(255, 152, 0, 0.2)' }} />

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <NotificationsIcon sx={{ fontSize: 48, color: 'rgba(255, 255, 255, 0.3)', mb: 1 }} />
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              No notifications yet
            </Typography>
          </Box>
        ) : (
          <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
            {notifications.map((notification) => (
              <MenuItem
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                sx={{
                  p: 2,
                  bgcolor: notification.isRead ? 'transparent' : 'rgba(255, 152, 0, 0.05)',
                  borderLeft: `3px solid ${getSeverityColor(notification.severity)}`,
                  '&:hover': {
                    bgcolor: 'rgba(255, 152, 0, 0.1)',
                  },
                  display: 'block',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                    <Typography sx={{ fontSize: '1.2rem' }}>
                      {getNotificationIcon(notification.type)}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: notification.isRead ? 'rgba(255, 255, 255, 0.7)' : 'white',
                        fontWeight: notification.isRead ? 400 : 700,
                      }}
                    >
                      {notification.title}
                    </Typography>
                    {!notification.isRead && (
                      <Circle sx={{ fontSize: 8, color: '#FFA726' }} />
                    )}
                  </Box>
                  <IconButton
                    size="small"
                    onClick={(e) => handleDeleteNotification(notification.id, e)}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.3)',
                      '&:hover': {
                        color: '#f44336',
                        bgcolor: 'rgba(244, 67, 54, 0.1)',
                      },
                    }}
                  >
                    <Delete sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    mb: 0.5,
                    ml: 4,
                  }}
                >
                  {notification.message}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 4 }}>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                    {getRelativeTime(notification.createdAt)}
                  </Typography>
                  <Chip
                    label={notification.severity}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: '0.65rem',
                      bgcolor: `${getSeverityColor(notification.severity)}20`,
                      color: getSeverityColor(notification.severity),
                      border: `1px solid ${getSeverityColor(notification.severity)}40`,
                    }}
                  />
                </Box>
              </MenuItem>
            ))}
          </Box>
        )}

        {notifications.length > 0 && (
          <>
            <Divider sx={{ borderColor: 'rgba(255, 152, 0, 0.2)' }} />
            <Box sx={{ p: 1.5, textAlign: 'center' }}>
              <Button
                fullWidth
                size="small"
                sx={{
                  color: '#FFA726',
                  '&:hover': {
                    bgcolor: 'rgba(255, 152, 0, 0.1)',
                  },
                }}
              >
                View All Notifications
              </Button>
            </Box>
          </>
        )}
      </Menu>
    </>
  );
};

export default NotificationBell;
