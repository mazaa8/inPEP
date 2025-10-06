import { useState } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import { LocalPharmacy as PharmacyIcon } from '@mui/icons-material';
import Layout from '../../../components/layout/Layout';
import MedicationAlternatives from '../../../components/pharmacy/MedicationAlternatives';
import MedicationStockTracker from '../../../components/pharmacy/MedicationStockTracker';
import { roleColors } from '../../../styles/glassmorphism';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`pharmacy-tabpanel-${index}`}
      aria-labelledby={`pharmacy-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const PharmacyPage = () => {
  const [value, setValue] = useState(0);

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f1f8f4 0%, #e8f5e9 50%, #dcedc8 100%)',
      p: 0,
    }}>
      <Layout title="" darkMode={false} themeColor="CAREGIVER">
        {/* Hero Header */}
        <Box sx={{ 
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          borderRadius: '24px',
          p: 4,
          mb: 4,
          boxShadow: '0 8px 32px 0 rgba(76, 175, 80, 0.15)',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              width: 72,
              height: 72,
              borderRadius: '18px',
              background: roleColors.CAREGIVER.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 8px 24px ${roleColors.CAREGIVER.primary}40`,
            }}>
              <PharmacyIcon sx={{ fontSize: 40, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#1b5e20', mb: 0.5 }}>
                Pharmacy & Medications
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(27, 94, 32, 0.7)' }}>
                Manage prescriptions, track stock, and find medication alternatives
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Tabs */}
        <Box sx={{ 
          mb: 4,
          background: 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1)',
        }}>
          <Tabs 
            value={value} 
            onChange={handleChange} 
            aria-label="pharmacy tabs"
            sx={{
              '& .MuiTab-root': {
                color: 'rgba(27, 94, 32, 0.7)',
                fontWeight: 600,
                '&.Mui-selected': {
                  color: roleColors.CAREGIVER.primary,
                },
              },
              '& .MuiTabs-indicator': {
                background: roleColors.CAREGIVER.gradient,
                height: 3,
              },
            }}
          >
            <Tab label="Medication Alternatives" id="pharmacy-tab-0" />
            <Tab label="Stock Tracker" id="pharmacy-tab-1" />
          </Tabs>
        </Box>

        <TabPanel value={value} index={0}>
          <MedicationAlternatives />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <MedicationStockTracker />
        </TabPanel>
      </Layout>
    </Box>
  );
};

export default PharmacyPage;
