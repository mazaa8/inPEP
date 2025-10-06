import { useState } from 'react';
import { Box, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Paper, TextField, Button, Divider, Grid } from '@mui/material';
import { Send as SendIcon, Message as MessageIcon } from '@mui/icons-material';
import CaregiverPageWrapper from '../../components/layout/CaregiverPageWrapper';

const mockConversations = [
  {
    id: 1,
    name: 'Dr. Emily Carter',
    role: 'Cardiologist',
    avatar: '/path/to/avatar1.jpg', // Replace with actual path
    messages: [
      { id: 1, text: 'The latest test results for John are in. Everything looks stable.', sender: 'Dr. Emily Carter', timestamp: '9:30 AM' },
      { id: 2, text: 'Thank you, Doctor. That is a relief.', sender: 'You', timestamp: '9:35 AM' },
    ],
  },
  {
    id: 2,
    name: 'Nurse Michael Chen',
    role: 'RN, Oncology',
    avatar: '/path/to/avatar2.jpg', // Replace with actual path
    messages: [
      { id: 1, text: 'Just a reminder about the upcoming appointment tomorrow at 2 PM.', sender: 'Nurse Michael Chen', timestamp: 'Yesterday' },
    ],
  },
  {
    id: 3,
    name: 'Sarah Lee',
    role: 'Insurance Agent',
    avatar: '/path/to/avatar3.jpg', // Replace with actual path
    messages: [
      { id: 1, text: 'We have approved the pre-authorization for the upcoming procedure.', sender: 'Sarah Lee', timestamp: '2 days ago' },
    ],
  },
];

const MessagesPage = () => {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);

  return (
    <CaregiverPageWrapper
      title="Messages"
      subtitle="Communicate with healthcare providers and support team"
      icon={<MessageIcon />}
    >
      <Grid container component={Paper} sx={{ 
        height: 'calc(100vh - 300px)', 
        m: 0,
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.8)',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1)',
      }}>
        <Grid item xs={4} sx={{ borderRight: '1px solid #ddd' }}>
          <List>
            {mockConversations.map((conv) => (
              <ListItem button key={conv.id} onClick={() => setSelectedConversation(conv)} selected={selectedConversation.id === conv.id}>
                <ListItemAvatar>
                  <Avatar alt={conv.name} src={conv.avatar} />
                </ListItemAvatar>
                <ListItemText primary={conv.name} secondary={conv.role} />
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item xs={8} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
            {selectedConversation.messages.map((msg) => (
              <Box key={msg.id} sx={{ mb: 2, textAlign: msg.sender === 'You' ? 'right' : 'left' }}>
                <Paper elevation={3} sx={{ p: 2, display: 'inline-block', bgcolor: msg.sender === 'You' ? 'primary.main' : 'grey.300', color: msg.sender === 'You' ? 'white' : 'black' }}>
                  <Typography variant="body1">{msg.text}</Typography>
                  <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>{msg.timestamp}</Typography>
                </Paper>
              </Box>
            ))}
          </Box>
          <Divider />
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            <TextField fullWidth variant="outlined" placeholder="Type a message..." />
            <Button variant="contained" endIcon={<SendIcon />} sx={{ ml: 2 }}>
              Send
            </Button>
          </Box>
        </Grid>
      </Grid>
    </CaregiverPageWrapper>
  );
};

export default MessagesPage;
