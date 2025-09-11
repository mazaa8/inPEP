import { useState } from 'react';
import { Box, Tabs, Tab, Paper } from '@mui/material';
import Layout from '../../../components/layout/Layout';
import MedicationAlternatives from '../../../components/pharmacy/MedicationAlternatives';
import MedicationStockTracker from '../../../components/pharmacy/MedicationStockTracker';

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
    <Layout title="Pharmacy & Medications">
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="pharmacy tabs">
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
      </Paper>
    </Layout>
  );
};

export default PharmacyPage;
