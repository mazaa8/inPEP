import { Box, Typography, Switch, Stack, FormControlLabel } from '@mui/material';
import { useState } from 'react';

interface NotificationRowProps {
  label: string;
  defaultEmail?: boolean;
  defaultPush?: boolean;
}

const NotificationRow = ({ label, defaultEmail = false, defaultPush = false }: NotificationRowProps) => {
  const [emailEnabled, setEmailEnabled] = useState(defaultEmail);
  const [pushEnabled, setPushEnabled] = useState(defaultPush);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
      <Typography>{label}</Typography>
      <Stack direction="row" spacing={1}>
        <FormControlLabel
          value="email"
          control={<Switch checked={emailEnabled} onChange={() => setEmailEnabled(!emailEnabled)} />}
          label="Email"
          labelPlacement="top"
        />
        <FormControlLabel
          value="push"
          control={<Switch checked={pushEnabled} onChange={() => setPushEnabled(!pushEnabled)} />}
          label="Push"
          labelPlacement="top"
        />
      </Stack>
    </Box>
  );
};

export default NotificationRow;
