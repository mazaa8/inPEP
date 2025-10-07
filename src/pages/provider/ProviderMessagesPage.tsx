import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
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
  Message as MessageIcon,
} from '@mui/icons-material';
import Layout from '../../components/layout/Layout';
import { messageService, type Conversation, type Message } from '../../services/messageService';
import { useAuth } from '../../context/AuthContext';
import { roleColors } from '../../styles/glassmorphism';

const ProviderMessagesPage = () => {
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
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f1419 0%, #1a1f2e 30%, #2d1f1a 70%, #3d2a1f 100%)', p: 0 }}>
        <Layout title="" darkMode={true} themeColor="PROVIDER">
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress sx={{ color: '#FFA726' }} />
          </Box>
        </Layout>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f1419 0%, #1a1f2e 30%, #2d1f1a 70%, #3d2a1f 100%)', p: 0 }}>
        <Layout title="" darkMode={true} themeColor="PROVIDER">
          <Alert severity="error">{error}</Alert>
        </Layout>
      </Box>
    );
  }

  if (conversations.length === 0) {
    return (
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f1419 0%, #1a1f2e 30%, #2d1f1a 70%, #3d2a1f 100%)', p: 0 }}>
        <Layout title="" darkMode={true} themeColor="PROVIDER">
          <Box sx={{ 
            p: 6, 
            textAlign: 'center',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '20px',
            border: '1px dashed rgba(255,255,255,0.2)',
          }}>
            <MessageIcon sx={{ fontSize: 80, color: 'rgba(255, 152, 0, 0.5)', mb: 2 }} />
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
              No Conversations Yet
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Start a conversation with your patients or caregivers
            </Typography>
          </Box>
        </Layout>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f1419 0%, #1a1f2e 30%, #2d1f1a 70%, #3d2a1f 100%)', p: 0 }}>
      <Layout title="" darkMode={true} themeColor="PROVIDER">
        {/* Hero Header */}
        <Box sx={{ 
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 152, 0, 0.3)',
          borderRadius: '24px',
          p: 4,
          mb: 4,
          boxShadow: '0 8px 32px 0 rgba(255, 152, 0, 0.2)',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              width: 64,
              height: 64,
              borderRadius: '16px',
              background: roleColors.PROVIDER.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 8px 24px ${roleColors.PROVIDER.primary}40`,
            }}>
              <MessageIcon sx={{ fontSize: 36, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: 'white', mb: 0.5 }}>
                Messages
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Communicate with your patients and care team
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ 
          height: '70vh', 
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 152, 0, 0.2)',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(255, 152, 0, 0.1)',
        }}>
          <Grid container sx={{ height: '100%' }}>
            {/* Conversations List */}
            <Grid item xs={12} md={4} sx={{ borderRight: '1px solid rgba(255, 152, 0, 0.2)', height: '100%', overflow: 'auto' }}>
            <List sx={{ p: 0 }}>
              {conversations.map((conversation) => (
                <ListItem key={conversation.id} disablePadding>
                  <ListItemButton
                    selected={selectedConversation?.id === conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    sx={{
                      py: 2,
                      px: 2,
                      '&.Mui-selected': {
                        bgcolor: 'rgba(255, 152, 0, 0.15)',
                        borderLeft: '4px solid #FFA726',
                      },
                      '&:hover': {
                        bgcolor: 'rgba(255, 152, 0, 0.08)',
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Badge 
                        badgeContent={conversation.unreadCount} 
                        sx={{
                          '& .MuiBadge-badge': {
                            bgcolor: roleColors.PROVIDER.primary,
                            color: 'white',
                          },
                        }}
                      >
                        <Avatar sx={{ background: roleColors.PROVIDER.gradient, fontWeight: 700 }}>
                          {getInitials(getOtherParticipantName(conversation))}
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography sx={{ fontWeight: 600, color: 'white' }}>
                          {getOtherParticipantName(conversation)}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }} noWrap>
                            {conversation.lastMessageText || 'No messages yet'}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
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
                <Box sx={{ p: 3, borderBottom: '1px solid rgba(255, 152, 0, 0.2)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ background: roleColors.PROVIDER.gradient, fontWeight: 700, width: 48, height: 48 }}>
                      {getInitials(getOtherParticipantName(selectedConversation))}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                        {getOtherParticipantName(selectedConversation)}
                      </Typography>
                      {selectedConversation.subject && (
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                          {selectedConversation.subject}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>

                {/* Messages */}
                <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
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
                          <Avatar sx={{ 
                            mr: 1.5,
                            background: 'rgba(255,255,255,0.1)',
                            color: '#FFA726',
                            fontWeight: 700,
                          }}>
                            {getInitials(message.senderName)}
                          </Avatar>
                        )}
                        <Box
                          sx={{
                            maxWidth: '70%',
                            background: isOwnMessage 
                              ? 'linear-gradient(135deg, #FF9800 0%, #FFC107 100%)' 
                              : 'rgba(255,255,255,0.08)',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            border: isOwnMessage ? 'none' : '1px solid rgba(255,255,255,0.15)',
                            color: 'white',
                            borderRadius: '16px',
                            p: 2,
                            boxShadow: isOwnMessage ? '0 4px 16px rgba(255, 152, 0, 0.3)' : 'none',
                          }}
                        >
                          {!isOwnMessage && (
                            <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5, color: '#FFA726' }}>
                              {message.senderName}
                            </Typography>
                          )}
                          <Typography variant="body2" sx={{ color: 'white' }}>{message.content}</Typography>
                          <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 0.5 }}>
                            {new Date(message.createdAt).toLocaleTimeString()}
                          </Typography>
                        </Box>
                        {isOwnMessage && (
                          <Avatar sx={{ 
                            ml: 1.5, 
                            background: roleColors.PROVIDER.gradient,
                            fontWeight: 700,
                          }}>
                            {getInitials(user?.name || '')}
                          </Avatar>
                        )}
                      </Box>
                    );
                  })}
                </Box>

                <Divider sx={{ bgcolor: 'rgba(255, 152, 0, 0.2)' }} />

                {/* Input */}
                <Box sx={{ p: 2, display: 'flex', gap: 1.5 }}>
                  <TextField
                    fullWidth
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={sending}
                    multiline
                    maxRows={3}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        bgcolor: 'rgba(255,255,255,0.05)',
                        borderRadius: '12px',
                        '& fieldset': {
                          borderColor: 'rgba(255, 152, 0, 0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 152, 0, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#FFA726',
                        },
                      },
                      '& .MuiInputBase-input::placeholder': {
                        color: 'rgba(255,255,255,0.5)',
                      },
                    }}
                  />
                  <IconButton
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || sending}
                    sx={{
                      background: roleColors.PROVIDER.gradient,
                      color: 'white',
                      width: 48,
                      height: 48,
                      boxShadow: '0 4px 16px rgba(255, 152, 0, 0.4)',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 8px 24px rgba(255, 152, 0, 0.5)',
                      },
                      '&:disabled': {
                        background: 'rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.3)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {sending ? <CircularProgress size={24} sx={{ color: 'white' }} /> : <SendIcon />}
                  </IconButton>
                </Box>
              </>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: 2 }}>
                <MessageIcon sx={{ fontSize: 64, color: 'rgba(255, 152, 0, 0.3)' }} />
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                  Select a conversation to start messaging
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
        </Box>
      </Layout>
    </Box>
  );
};

export default ProviderMessagesPage;
