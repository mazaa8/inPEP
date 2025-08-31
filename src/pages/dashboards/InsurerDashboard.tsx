import { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import Layout from '../../components/layout/Layout';
import PopulationHealth from '../../components/dashboards/insurer/PopulationHealth';
import FinancialAnalytics from '../../components/dashboards/insurer/FinancialAnalytics';
import ProviderPerformance from '../../components/dashboards/insurer/ProviderPerformance';
import PatientSearch from '../../components/dashboards/insurer/PatientSearch';
import { People, MonetizationOn, MedicalServices, Search } from '@mui/icons-material';

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
      id={`insurer-tabpanel-${index}`}
      aria-labelledby={`insurer-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const InsurerDashboard = () => {
  const [value, setValue] = useState(0);

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Layout title="Insurer Analytics Dashboard">
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="insurer dashboard tabs" centered>
            <Tab icon={<People />} label="Population Health" />
            <Tab icon={<MonetizationOn />} label="Financial Analytics" />
            <Tab icon={<MedicalServices />} label="Provider Performance" />
            <Tab icon={<Search />} label="Patient Search" />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <PopulationHealth />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <FinancialAnalytics />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <ProviderPerformance />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <PatientSearch />
        </TabPanel>
      </Box>
    </Layout>
  );
};

export default InsurerDashboard;
