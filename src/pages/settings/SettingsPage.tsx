import { Box, Tabs, Tab } from '@mui/material';
import { useState } from 'react';
import Layout from '../../components/layout/Layout';
import ProfileSettings from '../../components/settings/ProfileSettings';
import AccountSettings from '../../components/settings/AccountSettings';
import NotificationSettings from '../../components/settings/NotificationSettings';

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
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
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

function a11yProps(index: number) {
  return {
    id: `settings-tab-${index}`,
    'aria-controls': `settings-tabpanel-${index}`,
  };
}

const SettingsPage = () => {
  const [value, setValue] = useState(0);

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Layout title="Settings">
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="settings tabs">
            <Tab label="Profile" {...a11yProps(0)} />
            <Tab label="Account" {...a11yProps(1)} />
            <Tab label="Notifications" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <ProfileSettings />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <AccountSettings />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <NotificationSettings />
        </TabPanel>
      </Box>
    </Layout>
  );
};

export default SettingsPage;
