import { Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Button } from '@mui/material';
import {
  DashboardOutlined as Dashboard,
  PersonOutlined as Person,
  MailOutlined as Mail,
  SettingsOutlined as SettingsIcon,
  MonitorHeartOutlined as MonitorHeart,
  EventNoteOutlined as EventNote,
  ShoppingCartOutlined as ShoppingCart,
  SupportAgentOutlined as SupportAgent,
  WorkspacePremiumOutlined as WorkspacePremium,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 240;

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout = ({ children, title }: LayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          {user && (
            <>
              <Typography sx={{ mr: 2 }}>
                Welcome, {user.name}
              </Typography>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {[
              { text: 'Dashboard', icon: <Dashboard />, path: `/dashboard/${user?.role?.toLowerCase()}` },
            ].map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton onClick={() => navigate(item.path)}>
                  <ListItemIcon sx={{ color: 'primary.main' }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
            {user?.role === 'Caregiver' &&
              [
                { text: 'Patient Monitor', icon: <MonitorHeart />, path: '/patient-monitor' },
                { text: 'Care Planning', icon: <EventNote />, path: '/care-planning' },
                { text: 'Caregiver Support', icon: <SupportAgent />, path: '/caregiver-support' },
                { text: 'ReclaiMe™', icon: <WorkspacePremium />, path: '/reclaime' },
                { text: 'Grocery List', icon: <ShoppingCart />, path: '/caregiver/grocery-list' },
              ].map((item) => (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton onClick={() => navigate(item.path)}>
                    <ListItemIcon sx={{ color: 'primary.main' }}>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            {[
              { text: 'Profile', icon: <Person />, path: '/profile' },
              { text: 'Messages', icon: <Mail />, path: '/messages' },
              { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
            ].map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton onClick={() => navigate(item.path)}>
                  <ListItemIcon sx={{ color: 'primary.main' }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, overflowY: 'auto' }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
