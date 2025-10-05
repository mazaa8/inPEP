import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  TextField,
  IconButton,
  Divider,
  Badge,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Send as SendIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import Layout from '../../components/layout/Layout';
import { messageService, type Conversation, type Message } from '../../services/messageService';
import { useAuth } from '../../context/AuthContext';

const MessagesPage = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const data = await messageService.getConversations();
      setConversations(data);
      if (data.length > 0 && !selectedConversation) {
        setSelectedConversation(data[0]);
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const data = await messageService.getMessages(conversationId);
      setMessages(data);
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      setSending(true);
      const message = await messageService.sendMessage({
        conversationId: selectedConversation.id,
        content: newMessage,
        messageType: 'TEXT',
      });
      
      setMessages([...messages, message]);
      setNewMessage('');
      
      // Update conversation list
      fetchConversations();
    } catch (err) {
      console.error('Failed to send message:', err);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getOtherParticipantName = (conversation: Conversation) => {
    const otherParticipant = conversation.otherParticipants?.[0];
    return otherParticipant?.name || 'Unknown';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (loading) {
    return (
      <Layout title="Messages">
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Messages">
        <Alert severity="error">{error}</Alert>
      </Layout>
    );
  }

  if (conversations.length === 0) {
    return (
      <Layout title="Messages">
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No conversations yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Start a conversation with your healthcare provider or caregiver
          </Typography>
        </Paper>
      </Layout>
    );
  }

  return (
    <Layout title="Messages">
      <Paper sx={{ height: '70vh', display: 'flex' }}>
        <Grid container sx={{ height: '100%' }}>
          {/* Conversations List */}
          <Grid item xs={12} md={4} sx={{ borderRight: 1, borderColor: 'divider', height: '100%', overflow: 'auto' }}>
            <List sx={{ p: 0 }}>
              {conversations.map((conversation) => (
                <ListItem key={conversation.id} disablePadding>
                  <ListItemButton
                    selected={selectedConversation?.id === conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <ListItemAvatar>
                      <Badge badgeContent={conversation.unreadCount} color="primary">
                        <Avatar>
                          <PersonIcon />
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={getOtherParticipantName(conversation)}
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {conversation.lastMessageText || 'No messages yet'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(conversation.lastMessageAt).toLocaleDateString()}
                          </Typography>
                        </>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Grid>

          {/* Messages Area */}
          <Grid item xs={12} md={8} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {selectedConversation ? (
              <>
                {/* Header */}
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                  <Typography variant="h6">
                    {getOtherParticipantName(selectedConversation)}
                  </Typography>
                  {selectedConversation.subject && (
                    <Typography variant="caption" color="text.secondary">
                      {selectedConversation.subject}
                    </Typography>
                  )}
                </Box>

                {/* Messages */}
                <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                  {messages.map((message) => {
                    const isOwnMessage = message.senderId === user?.id;
                    return (
                      <Box
                        key={message.id}
                        sx={{
                          display: 'flex',
                          justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                          mb: 2,
                        }}
                      >
                        {!isOwnMessage && (
                          <Avatar sx={{ mr: 1 }}>
                            {getInitials(message.senderName)}
                          </Avatar>
                        )}
                        <Box
                          sx={{
                            maxWidth: '70%',
                            bgcolor: isOwnMessage ? 'primary.main' : 'grey.200',
                            color: isOwnMessage ? 'white' : 'text.primary',
                            borderRadius: 2,
                            p: 1.5,
                          }}
                        >
                          {!isOwnMessage && (
                            <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block' }}>
                              {message.senderName}
                            </Typography>
                          )}
                          <Typography variant="body2">{message.content}</Typography>
                          <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 0.5 }}>
                            {new Date(message.createdAt).toLocaleTimeString()}
                          </Typography>
                        </Box>
                        {isOwnMessage && (
                          <Avatar sx={{ ml: 1, bgcolor: 'primary.main' }}>
                            {getInitials(user?.name || '')}
                          </Avatar>
                        )}
                      </Box>
                    );
                  })}
                </Box>

                <Divider />

                {/* Input */}
                <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={sending}
                    multiline
                    maxRows={3}
                  />
                  <IconButton
                    color="primary"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || sending}
                  >
                    {sending ? <CircularProgress size={24} /> : <SendIcon />}
                  </IconButton>
                </Box>
              </>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <Typography variant="body1" color="text.secondary">
                  Select a conversation to start messaging
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Layout>
  );
};

export default MessagesPage;
