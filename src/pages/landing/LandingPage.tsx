import { useState } from 'react';
import { Box } from '@mui/material';
import VerticalTabs from '../../components/common/VerticalTabs';
import TabPanel from '../../components/common/TabPanel';
import PatientSignIn from '../auth/PatientSignIn';
import CaregiverSignIn from '../auth/CaregiverSignIn';
import ProviderSignIn from '../auth/ProviderSignIn';
import InsurerSignIn from '../auth/InsurerSignIn';

const LandingPage = () => {
  const [value, setValue] = useState(0);

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: '100vh' }}
    >
      <VerticalTabs value={value} onChange={handleChange} />
      <TabPanel value={value} index={0}>
        <PatientSignIn />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <CaregiverSignIn />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ProviderSignIn />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <InsurerSignIn />
      </TabPanel>
    </Box>
  );
};

export default LandingPage;

