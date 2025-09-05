import { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Avatar,
  TextField,
  Button,
  Divider,
} from '@mui/material';
import Layout from '../../components/layout/Layout';

// Type Definitions
interface Message {
  id: number;
  sender: string;
  text: string;
  timestamp: string;
}

interface Conversation {
  id: number;
  name: string;
  lastMessage: string;
  avatar: string;
}

// Mock Data
const conversations: Conversation[] = [
  { id: 1, name: 'Dr. Emily Carter', lastMessage: 'The patient records are ready for your review.', avatar: '/path/to/avatar1.jpg' },
  { id: 2, name: 'John Smith (Caregiver)', lastMessage: 'Can you confirm the coverage for the upcoming physical therapy sessions?', avatar: '/path/to/avatar2.jpg' },
  { id: 3, name: 'Oakwood Medical Center', lastMessage: 'Invoice #INV-00123 has been sent.', avatar: '/path/to/avatar3.jpg' },
];

const messages: { [key: number]: Message[] } = {
  1: [
    { id: 1, sender: 'Dr. Emily Carter', text: 'The patient records are ready for your review.', timestamp: '10:30 AM' },
    { id: 2, sender: 'You', text: 'Thank you, I will review them shortly.', timestamp: '10:32 AM' },
  ],
  2: [
    { id: 1, sender: 'John Smith (Caregiver)', text: 'Can you confirm the coverage for the upcoming physical therapy sessions?', timestamp: 'Yesterday' },
  ],
  3: [],
};

const InsurerMessagesPage = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation>(conversations[0]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, you'd send this message to a backend.
      console.log(`Sending message to ${selectedConversation.name}: ${newMessage}`);
      setNewMessage('');
    }
  };

  return (
    <Layout title="Message Center">
      <Paper sx={{ display: 'flex', height: 'calc(100vh - 120px)', overflow: 'hidden' }}>
        {/* Conversations List */}
        <Grid item xs={12} md={4} sx={{ borderRight: '1px solid #ddd' }}>
          <Box sx={{ p: 2, borderBottom: '1px solid #ddd' }}>
            <Typography variant="h6">Conversations</Typography>
          </Box>
          <List>
            {conversations.map((convo) => (
              <ListItem
                button
                key={convo.id}
                onClick={() => setSelectedConversation(convo)}
                selected={selectedConversation.id === convo.id}
              >
                <Avatar src={convo.avatar} sx={{ mr: 2 }} />
                <ListItemText primary={convo.name} secondary={convo.lastMessage} />
              </ListItem>
            ))}
          </List>
        </Grid>

        {/* Message View */}
        <Grid item xs={12} md={8} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 2, borderBottom: '1px solid #ddd' }}>
            <Typography variant="h6">{selectedConversation.name}</Typography>
          </Box>

          {/* Messages */}
          <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto' }}>
            {(messages[selectedConversation.id] || []).map((msg) => (
              <Box
                key={msg.id}
                sx={{
                  mb: 2,
                  textAlign: msg.sender === 'You' ? 'right' : 'left',
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    p: 1.5,
                    display: 'inline-block',
                    backgroundColor: msg.sender === 'You' ? 'primary.main' : 'grey.200',
                    color: msg.sender === 'You' ? 'primary.contrastText' : 'text.primary',
                  }}
                >
                  <Typography variant="body1">{msg.text}</Typography>
                  <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                    {msg.timestamp}
                  </Typography>
                </Paper>
              </Box>
            ))}
          </Box>

          <Divider />

          {/* Message Input */}
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button variant="contained" sx={{ ml: 2 }} onClick={handleSendMessage}>
              Send
            </Button>
          </Box>
        </Grid>
      </Paper>
    </Layout>
  );
};

export default InsurerMessagesPage;
