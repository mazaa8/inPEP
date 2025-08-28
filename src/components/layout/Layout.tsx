import { Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Button, Collapse, IconButton } from '@mui/material';
import {
  DashboardOutlined as Dashboard,
  PersonOutlined as Person,
  MailOutlined as Mail,
  SettingsOutlined as SettingsIcon,
  MonitorHeartOutlined as MonitorHeart,
  MeetingRoomOutlined as MeetingRoom,
  EventNoteOutlined as EventNote,
  ShoppingCartOutlined as ShoppingCart,
  RestaurantMenuOutlined as RestaurantMenu,
  SupportAgentOutlined as SupportAgent,
  WorkspacePremiumOutlined as WorkspacePremium,
  VolunteerActivismOutlined as VolunteerActivism,
  AllInclusiveOutlined as AllInclusive,
  ApartmentOutlined as Apartment,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import React, { useState } from 'react';
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
  const [dashboardOpen, setDashboardOpen] = useState(true);
  const [carePlanningOpen, setCarePlanningOpen] = useState(false);
  const [reclaiMeOpen, setReclaiMeOpen] = useState(false);

  const handleDashboardClick = () => {
    setDashboardOpen(!dashboardOpen);
  };

  const handleCarePlanningClick = () => {
    setCarePlanningOpen(!carePlanningOpen);
  };

  const handleReclaiMeClick = () => {
    setReclaiMeOpen(!reclaiMeOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Button color="inherit" onClick={() => navigate('/dashboard')} sx={{ textTransform: 'none', p: 1 }}>
            <Apartment sx={{ mr: 1 }} />
            <Typography variant="h6" noWrap component="div">
              InPEP™
            </Typography>
          </Button>
          <Typography variant="h6" noWrap component="div" sx={{ ml: 2 }}>
            | {user?.hospitalName || '[Hospital Name]'} | {title}
          </Typography>
          {user && (
            <Typography sx={{ ml: 2 }}>
            </Typography>
          )}
          <Box sx={{ flexGrow: 1 }} />
          {user && (
            <>
              <IconButton color="inherit" onClick={() => navigate('/caregiver/messages')}>
                <Mail />
              </IconButton>
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
            {(user?.role === 'Caregiver' || user?.role === 'Patient') && (
              <>
                <ListItem disablePadding>
                  <ListItemButton onClick={handleReclaiMeClick}>
                    <ListItemIcon sx={{ color: 'primary.main' }}>
                      <VolunteerActivism />
                    </ListItemIcon>
                    <ListItemText primary="ReclaiMe™" />
                    {reclaiMeOpen ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </ListItem>
                <Collapse in={reclaiMeOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/profile')}>
                      <ListItemIcon sx={{ color: 'primary.main' }}>
                        <Person />
                      </ListItemIcon>
                      <ListItemText primary="Profile" />
                    </ListItemButton>
                    {user?.role === 'Caregiver' && (
                      <>
                        <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/champion-corner')}>
                          <ListItemIcon sx={{ color: 'primary.main' }}>
                            <MeetingRoom />
                          </ListItemIcon>
                          <ListItemText primary="Champion Corner" />
                        </ListItemButton>
                        <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/reclaime')}>
                          <ListItemIcon sx={{ color: 'primary.main' }}>
                            <WorkspacePremium />
                          </ListItemIcon>
                          <ListItemText primary="ReclaiMe Champion™" />
                        </ListItemButton>
                        <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/caregiver-support')}>
                          <ListItemIcon sx={{ color: 'primary.main' }}>
                            <SupportAgent />
                          </ListItemIcon>
                          <ListItemText primary="Caregiver Support" />
                        </ListItemButton>
                      </>
                    )}
                  </List>
                </Collapse>
              </>
            )}

            <ListItem disablePadding>
              <ListItemButton onClick={handleDashboardClick}>
                <ListItemIcon sx={{ color: 'primary.main' }}>
                  <Dashboard />
                </ListItemIcon>
                <ListItemText primary="Patient Hub" />
                {dashboardOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={dashboardOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 4 }} onClick={() => navigate(`/dashboard/${user?.role?.toLowerCase()}`)}>
                  <ListItemIcon sx={{ color: 'primary.main' }}>
                    <MonitorHeart />
                  </ListItemIcon>
                  <ListItemText primary="Patient Monitor" />
                </ListItemButton>
                {user?.role === 'Caregiver' && (
                  <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/patient-support')}>
                    <ListItemIcon sx={{ color: 'primary.main' }}>
                      <SupportAgent />
                    </ListItemIcon>
                    <ListItemText primary="Patient Support" />
                  </ListItemButton>
                )}
              </List>
            </Collapse>

            {user?.role === 'Caregiver' && (
              <>
                <ListItem disablePadding>
                  <ListItemButton onClick={handleCarePlanningClick}>
                    <ListItemIcon sx={{ color: 'primary.main' }}>
                      <EventNote />
                    </ListItemIcon>
                    <ListItemText primary="Care Planning" />
                    {carePlanningOpen ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </ListItem>
                <Collapse in={carePlanningOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/care-planning')}>
                      <ListItemIcon sx={{ color: 'primary.main' }}>
                        <AllInclusive />
                      </ListItemIcon>
                      <ListItemText primary="Wellness Plan" />
                    </ListItemButton>
                    <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/caregiver/heredibles')}>
                      <ListItemIcon sx={{ color: 'primary.main' }}>
                        <RestaurantMenu />
                      </ListItemIcon>
                      <ListItemText primary="Heredibles™" />
                    </ListItemButton>
                    <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/caregiver/grocery-list')}>
                      <ListItemIcon sx={{ color: 'primary.main' }}>
                        <ShoppingCart />
                      </ListItemIcon>
                      <ListItemText primary="Grocery List" />
                    </ListItemButton>
                  </List>
                </Collapse>
              </>
            )}

            {[
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
