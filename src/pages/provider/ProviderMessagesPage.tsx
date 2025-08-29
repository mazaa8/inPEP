import { useState } from 'react';
import { Box, Paper, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, TextField, IconButton } from '@mui/material';
import { Send as SendIcon, MoreVert as MoreVertIcon } from '@mui/icons-material';
import Layout from '../../components/layout/Layout';

const conversations = [
  { id: 1, name: 'John Doe', lastMessage: 'I have a question about my medication.', timestamp: '10:30 AM' },
  { id: 2, name: 'Jane Smith', lastMessage: 'Can you please send me my test results?', timestamp: 'Yesterday' },
  { id: 3, name: 'Bob Johnson', lastMessage: 'I need to reschedule my appointment.', timestamp: '2 days ago' },
];

const messages = [
  { id: 1, sender: 'John Doe', text: 'I have a question about my medication.' },
  { id: 2, sender: 'Dr. Smith', text: 'Of course, what is your question?' },
  { id: 3, sender: 'John Doe', text: 'I am not sure if I should take it with food or not.' },
];

const ProviderMessagesPage = () => {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);

  return (
    <Layout>
      <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
        <Paper sx={{ width: '30%', p: 2, borderRight: '1px solid #ddd' }}>
          <Typography variant="h6" gutterBottom>Conversations</Typography>
          <List>
            {conversations.map((conversation) => (
              <ListItem
                key={conversation.id}
                button
                selected={selectedConversation?.id === conversation.id}
                onClick={() => setSelectedConversation(conversation)}
              >
                <ListItemAvatar>
                  <Avatar />
                </ListItemAvatar>
                <ListItemText
                  primary={conversation.name}
                  secondary={conversation.lastMessage}
                />
                <Typography variant="caption">{conversation.timestamp}</Typography>
              </ListItem>
            ))}
          </List>
        </Paper>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {selectedConversation && (
            <>
              <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', borderBottom: '1px solid #ddd' }}>
                <Typography variant="h6" sx={{ flex: 1 }}>{selectedConversation.name}</Typography>
                <IconButton>
                  <MoreVertIcon />
                </IconButton>
              </Paper>
              <Box sx={{ flex: 1, p: 2, overflowY: 'auto' }}>
                {messages.map((message) => (
                  <Box
                    key={message.id}
                    sx={{
                      mb: 2,
                      p: 2,
                      borderRadius: '10px',
                      backgroundColor: message.sender === 'Dr. Smith' ? '#e0f7fa' : '#f1f1f1',
                      alignSelf: message.sender === 'Dr. Smith' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <Typography variant="body1">{message.text}</Typography>
                  </Box>
                ))}
              </Box>
              <Paper sx={{ p: 2, borderTop: '1px solid #ddd' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TextField fullWidth placeholder="Type a message..." />
                  <IconButton color="primary">
                    <SendIcon />
                  </IconButton>
                </Box>
              </Paper>
            </>
          )}
        </Box>
      </Box>
    </Layout>
  );
};

export default ProviderMessagesPage;
