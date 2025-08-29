import { Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Button, Collapse, IconButton, InputBase, Badge, Menu, MenuItem } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import {
  DashboardOutlined as Dashboard,
  AnalyticsOutlined as AnalyticsIcon,
  PersonOutlined as Person,
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
  Search as SearchIcon,
  NotificationsOutlined as NotificationsIcon,
  AccountCircle,
} from '@mui/icons-material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Footer from './Footer';

const drawerWidth = 240;

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout = ({ children, title }: LayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dashboardOpen, setDashboardOpen] = useState(true);
  const [carePlanningOpen, setCarePlanningOpen] = useState(false);
  const [reclaiMeOpen, setReclaiMeOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDashboardClick = () => {
    setDashboardOpen(!dashboardOpen);
  };

  const handleCarePlanningClick = () => {
    setCarePlanningOpen(!carePlanningOpen);
  };

  const handleReclaiMeClick = () => {
    setReclaiMeOpen(!reclaiMeOpen);
  };

      const handleLogoClick = () => {
    if (user?.role === 'Caregiver') {
      navigate('/dashboard');
    } else if (user?.role === 'Provider') {
      navigate('/dashboard/provider');
    } else {
      navigate('/');
    }
  };

    const handleNotificationClick = () => {
    if (user?.role === 'Provider') {
      navigate('/provider/messages');
    } else if (user?.role === 'Caregiver') {
      navigate('/caregiver/messages');
    }
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/');
  };

  const renderProfileMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>Profile</MenuItem>
      <MenuItem onClick={() => { handleMenuClose(); navigate('/settings'); }}>Settings</MenuItem>
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Button color="inherit" onClick={handleLogoClick} sx={{ textTransform: 'none', p: 1 }}>
            <Apartment sx={{ mr: 1 }} />
            <Typography variant="h6" noWrap component="div">
              InPEP™
            </Typography>
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search Patients…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton size="large" aria-label="show 17 new notifications" color="inherit" onClick={handleNotificationClick}>
                <Badge badgeContent={17} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      {renderProfileMenu}
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
            {user?.role === 'Provider' && (
              <>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => navigate('/dashboard/provider')}>
                    <ListItemIcon>
                      <Dashboard />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => navigate('/dashboard/analytics')}>
                    <ListItemIcon>
                      <AnalyticsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Analytics" />
                  </ListItemButton>
                </ListItem>
              </>
            )}
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
          </List>
        </Box>
      </Drawer>
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: '100vh' }}>
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: '64px' }}>
          {title && <Typography variant="h4" gutterBottom>{title}</Typography>}
          {children}
        </Box>
        <Footer />
      </Box>
    </Box>
  );
};

export default Layout;
