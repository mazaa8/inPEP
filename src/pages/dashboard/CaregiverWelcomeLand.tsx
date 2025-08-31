import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardActionArea, Button, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../context/AuthContext';
import { useEmergencyAlert } from '../../context/EmergencyAlertContext';
import DashboardCustomizeModal from '../../components/dashboard/DashboardCustomizeModal';

const allFeatures = [
  { id: 'champion-corner', title: 'Champion Corner', description: 'Check out the latest caregiver stories.', path: '/champion-corner' },
  { id: 'patient-monitor', title: 'Patient Monitor', description: "View patient's daily progress.", path: '/dashboard/caregiver', roles: ['Caregiver'] },
  { id: 'heredibles', title: 'Heredibles™', description: 'Access personalized meal plans.', path: '/caregiver/heredibles', roles: ['Caregiver'] },
  { id: 'reclaime-champion', title: 'ReclaiMe Champion™', description: 'Explore exclusive resources.', path: '/reclaime', roles: ['Caregiver'] },
  { id: 'grocery-list', title: 'Grocery List', description: 'Manage your grocery shopping list.', path: '/caregiver/grocery-list', roles: ['Caregiver'] },
  { id: 'caregiver-support', title: 'Caregiver Support', description: 'Find resources and support.', path: '/caregiver-support', roles: ['Caregiver'] },
];

const CaregiverWelcomeLand = () => {
  const { isAlertActive, patientName, alertLevel, isEscalated, resetAlert, escalateToProvider } = useEmergencyAlert();
  const [isEscalationPromptOpen, setIsEscalationPromptOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [customizableFeatures, setCustomizableFeatures] = useState<typeof allFeatures>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isAlertActive && alertLevel >= 3 && !isEscalated) {
      setIsEscalationPromptOpen(true);
    }
  }, [isAlertActive, alertLevel, isEscalated]);

  useEffect(() => {
    const savedFeatures = localStorage.getItem('dashboardFeatures');
    if (savedFeatures) {
      const featureIds = JSON.parse(savedFeatures);
      const featuresToShow = allFeatures.filter(f => featureIds.includes(f.id));
      setCustomizableFeatures(featuresToShow);
    } else {
      // Default features for caregivers
      if (user?.role === 'Caregiver') {
        setCustomizableFeatures(allFeatures.filter(f => f.roles?.includes('Caregiver')).slice(0, 3));
      } else {
        setCustomizableFeatures(allFeatures.filter(f => !f.roles).slice(0, 3));
      }
    }
  }, [user]);

  const handleEscalate = () => {
    escalateToProvider();
    setIsEscalationPromptOpen(false);
  };

  const handleClosePrompt = () => {
    setIsEscalationPromptOpen(false);
  };

  const handleSaveCustomization = (selectedIds: string[]) => {
    localStorage.setItem('dashboardFeatures', JSON.stringify(selectedIds));
    const featuresToShow = allFeatures.filter(f => selectedIds.includes(f.id));
    setCustomizableFeatures(featuresToShow);
  };

  return (
    <Layout title="Caregiver Dashboard">
      {isAlertActive && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={resetAlert}>
              DISMISS
            </Button>
          }
          sx={{ mb: 2, '.MuiAlert-message': { width: '100%' } }}
        >
          <Typography variant="h6">Emergency Alert!</Typography>
          <Typography>Patient <strong>{patientName}</strong> requires immediate assistance.</Typography>
        </Alert>
      )}
      <Dialog open={isEscalationPromptOpen} onClose={handleClosePrompt}>
        <DialogTitle sx={{ fontWeight: 'bold' }}>{'Escalate to Provider?'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            If this alert is critical, select 'Yes' to notify the provider.
            <br />
            <Typography variant="caption" color="text.secondary">
              Please note: Unnecessary escalations may result in penalties to prevent dashboard congestion.
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePrompt} color="primary">
            No, Stay Alert
          </Button>
          <Button onClick={handleEscalate} color="error" variant="contained">
            Yes, Notify Provider
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Welcome Back!
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Here's a quick look at your day.
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button startIcon={<SettingsIcon />} onClick={() => setIsModalOpen(true)}>
            Customize Dashboard
          </Button>
        </Box>
        <Grid container spacing={3}>
          {/* Fixed Cards */}
          <Grid item xs={12} md={6} lg={4}>
            <Card sx={{ background: (theme) => theme.palette.primary.main, backgroundImage: 'none', color: 'primary.contrastText' }}>
              <CardActionArea onClick={() => navigate('/dashboard/caregiver')}>
                <CardContent>
                  <Typography variant="h6" color="inherit">Upcoming Appointments</Typography>
                  <Typography color="inherit" sx={{ opacity: 0.8 }}>View your scheduled appointments.</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Card sx={{ background: (theme) => theme.palette.primary.main, backgroundImage: 'none', color: 'primary.contrastText' }}>
              <CardActionArea onClick={() => navigate(user?.role === 'Caregiver' ? '/caregiver/messages' : '/messages')}>
                <CardContent>
                  <Typography variant="h6" color="inherit">New Messages</Typography>
                  <Typography color="inherit" sx={{ opacity: 0.8 }}>Check your latest messages.</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Card sx={{ background: (theme) => theme.palette.primary.main, backgroundImage: 'none', color: 'primary.contrastText' }}>
              <CardActionArea onClick={() => navigate('/care-planning')}>
                <CardContent>
                  <Typography variant="h6" color="inherit">Wellness Plan</Typography>
                  <Typography color="inherit" sx={{ opacity: 0.8 }}>Access the patient's wellness plan.</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          {/* Customizable Cards */}
          {customizableFeatures.map((feature) => {
            if (feature.roles && !feature.roles.includes(user?.role as string)) {
              return null;
            }
            return (
              <Grid item xs={12} md={6} lg={4} key={feature.id}>
                <Card>
                  <CardActionArea onClick={() => navigate(feature.path)}>
                    <CardContent>
                      <Typography variant="h6">{feature.title}</Typography>
                      <Typography color="text.secondary">{feature.description}</Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
      <DashboardCustomizeModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        allFeatures={allFeatures.filter(f => !f.roles || f.roles.includes(user?.role as string))}
        selectedFeatures={customizableFeatures.map(f => f.id)}
        onSave={handleSaveCustomization}
      />
    </Layout>
  );
};

export default CaregiverWelcomeLand;
