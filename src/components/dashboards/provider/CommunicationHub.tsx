import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  Stack,
  Divider,
} from '@mui/material';

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
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface Message {
  id: number;
  sender: string;
  text: string;
  timestamp: string;
}

const initialMessages: Message[] = [
  {
    id: 1,
    sender: 'Jane Smith (Caregiver)',
    text: "Just wanted to confirm John Doe's appointment is at 2 PM tomorrow.",
    timestamp: '10:30 AM',
  },
  {
    id: 2,
    sender: 'Dr. Smith',
    text: 'Yes, that is correct. Please ensure he brings his latest test results.',
    timestamp: '10:32 AM',
  },
  {
    id: 3,
    sender: 'Insurer Rep',
    text: 'Pre-authorization for the upcoming procedure has been approved.',
    timestamp: '11:00 AM',
  },
];

const CommunicationHub = () => {
  const [value, setValue] = useState(0);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const message: Message = {
      id: messages.length + 1,
      sender: 'Dr. Smith',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Communication Hub</Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="communication tabs">
          <Tab label="All" />
          <Tab label="Patients" />
          <Tab label="Caregivers" />
          <Tab label="Insurers" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <List sx={{ maxHeight: 300, overflow: 'auto', mb: 2 }}>
          {messages.map((msg) => (
            <ListItem key={msg.id}>
              <ListItemText primary={msg.text} secondary={`${msg.sender} - ${msg.timestamp}`} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Type a message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <Button variant="contained" onClick={handleSendMessage}>Send</Button>
        </Stack>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Typography>Messages from patients will appear here.</Typography>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Typography>Messages from caregivers will appear here.</Typography>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Typography>Messages from insurers will appear here.</Typography>
      </TabPanel>
    </Paper>
  );
};

export default CommunicationHub;
