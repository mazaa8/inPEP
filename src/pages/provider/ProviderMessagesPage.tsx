import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Avatar,
  TextField,
  Button,
} from '@mui/material';
import { Message as MessageIcon, Send } from '@mui/icons-material';
import ProviderPageWrapper from '../../components/layout/ProviderPageWrapper';
import { messageService } from '../../services/messageService';
import { useAuth } from '../../context/AuthContext';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
}

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
}

const ProviderMessagesPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>({});
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      console.log('📥 Loading conversations...');
      const data = await messageService.getConversations();
      console.log('✅ Received conversations:', data);
      
      const formatted = data.map(conv => {
        // Get the other participant's name (not the current user)
        const otherParticipantName = conv.participantNames?.find((name: string) => name !== user?.name) || 'Unknown';
        
        return {
          id: conv.id,
          name: otherParticipantName,
          lastMessage: conv.lastMessageText || 'No messages yet',
        };
      });
      
      console.log('📋 Formatted conversations:', formatted);
      setConversations(formatted);
      
      // Select first conversation by default
      if (formatted.length > 0 && !selectedConversation) {
        setSelectedConversation(formatted[0]);
        loadMessages(formatted[0].id);
      }
      
      // Handle pre-selected recipient from navigation
      if (location.state) {
        const { recipientId, recipientName } = location.state as any;
        console.log('🎯 Pre-selected recipient:', recipientName, recipientId);
        
        if (recipientId && recipientName) {
          // Check if conversation exists
          const existing = formatted.find(c => c.name === recipientName);
          if (existing) {
            console.log('✅ Found existing conversation');
            setSelectedConversation(existing);
            loadMessages(existing.id);
          } else {
            console.log('🆕 Creating new conversation placeholder');
            // Create new conversation placeholder
            const newConv = {
              id: 'new-' + recipientId,
              name: recipientName,
              lastMessage: 'Start a new conversation',
            };
            setConversations([newConv, ...formatted]);
            setSelectedConversation(newConv);
            setMessages({ [newConv.id]: [] });
          }
        }
      }
    } catch (error) {
      console.error('❌ Failed to load conversations:', error);
    }
  };

  const loadMessages = async (conversationId: string) => {
    if (conversationId.startsWith('new-')) {
      setMessages({ ...messages, [conversationId]: [] });
      return;
    }
    
    try {
      const data = await messageService.getMessages(conversationId);
      setMessages({ ...messages, [conversationId]: data });
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      console.log('📤 Sending message...');
      
      // If it's a new conversation
      if (selectedConversation.id.startsWith('new-')) {
        const recipientId = selectedConversation.id.replace('new-', '');
        console.log('🆕 Creating new conversation with recipient:', recipientId);
        console.log('👤 Current user ID:', user?.id);
        
        const newConv = await messageService.createConversation({
          participantIds: [user?.id || '', recipientId], // Include BOTH provider and recipient
          subject: `Conversation with ${selectedConversation.name}`,
          initialMessage: newMessage,
        });
        
        console.log('✅ Conversation created:', newConv);
        
        // Reload conversations
        await loadConversations();
        setSelectedConversation({
          id: newConv.id,
          name: selectedConversation.name,
          lastMessage: newMessage,
        });
      } else {
        console.log('📨 Sending to existing conversation:', selectedConversation.id);
        
        // Send to existing conversation
        const message = await messageService.sendMessage({
          conversationId: selectedConversation.id,
          content: newMessage,
          messageType: 'TEXT',
        });
        
        console.log('✅ Message sent:', message);
        
        // Update messages
        const currentMessages = messages[selectedConversation.id] || [];
        setMessages({
          ...messages,
          [selectedConversation.id]: [...currentMessages, message],
        });
      }
      
      setNewMessage('');
    } catch (error: any) {
      console.error('❌ Failed to send message:', error);
      console.error('Error details:', error.message, error.response);
      alert(`Failed to send message: ${error.message || 'Unknown error'}`);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <ProviderPageWrapper 
      title="Message Center" 
      subtitle="Communicate with caregivers and care team"
      icon={<MessageIcon />}
    >
      <Box sx={{ 
        display: 'flex', 
        height: 'calc(100vh - 280px)', 
        background: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 152, 0, 0.2)',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 8px 32px 0 rgba(255, 152, 0, 0.1)',
      }}>
        {/* LEFT SIDE - Conversations List */}
        <Box sx={{ 
          width: '35%', 
          borderRight: '1px solid rgba(255, 152, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <Box sx={{ 
            p: 3, 
            borderBottom: '1px solid rgba(255, 152, 0, 0.2)',
            background: 'rgba(0, 0, 0, 0.4)',
          }}>
            <Typography variant="h6" sx={{ color: '#FFA726', fontWeight: 600 }}>
              Conversations
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              {conversations.length} active
            </Typography>
          </Box>
          <List sx={{ overflowY: 'auto', flexGrow: 1 }}>
            {conversations.map((convo) => (
              <ListItem
                button
                key={convo.id}
                onClick={() => {
                  setSelectedConversation(convo);
                  loadMessages(convo.id);
                }}
                sx={{
                  py: 2,
                  px: 3,
                  borderBottom: '1px solid rgba(255, 152, 0, 0.1)',
                  backgroundColor: selectedConversation?.id === convo.id 
                    ? 'rgba(255, 152, 0, 0.15)' 
                    : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 152, 0, 0.1)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <Avatar sx={{ 
                  mr: 2, 
                  bgcolor: '#FFA726',
                  width: 48,
                  height: 48,
                  fontWeight: 600,
                }}>
                  {getInitials(convo.name)}
                </Avatar>
                <ListItemText 
                  primary={
                    <Typography sx={{ 
                      color: 'rgba(255, 255, 255, 0.95)', 
                      fontWeight: selectedConversation?.id === convo.id ? 600 : 400,
                    }}>
                      {convo.name}
                    </Typography>
                  }
                  secondary={
                    <Typography sx={{ 
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '0.875rem',
                      mt: 0.5,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {convo.lastMessage}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* RIGHT SIDE - Message View */}
        <Box sx={{ 
          width: '65%', 
          display: 'flex', 
          flexDirection: 'column',
        }}>
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <Box sx={{ 
                p: 3, 
                borderBottom: '1px solid rgba(255, 152, 0, 0.2)',
                background: 'rgba(0, 0, 0, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}>
                <Avatar sx={{ bgcolor: '#FFA726', width: 48, height: 48 }}>
                  {getInitials(selectedConversation.name)}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ color: '#FFA726', fontWeight: 600 }}>
                    {selectedConversation.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    Caregiver
                  </Typography>
                </Box>
              </Box>

              {/* Messages */}
              <Box sx={{ 
                flexGrow: 1, 
                p: 3, 
                overflowY: 'auto',
                background: 'rgba(0, 0, 0, 0.2)',
              }}>
                {(messages[selectedConversation.id] || []).length === 0 ? (
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    height: '100%',
                    flexDirection: 'column',
                    gap: 2,
                  }}>
                    <MessageIcon sx={{ fontSize: 64, color: 'rgba(255, 152, 0, 0.3)' }} />
                    <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                      No messages yet. Start the conversation!
                    </Typography>
                  </Box>
                ) : (
                  (messages[selectedConversation.id] || []).map((msg) => {
                    const isOwnMessage = msg.senderId === user?.id;
                    return (
                      <Box
                        key={msg.id}
                        sx={{
                          mb: 2,
                          display: 'flex',
                          justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                        }}
                      >
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            maxWidth: '70%',
                            backgroundColor: isOwnMessage 
                              ? 'rgba(255, 152, 0, 0.9)' 
                              : 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                            border: isOwnMessage 
                              ? 'none' 
                              : '1px solid rgba(255, 152, 0, 0.2)',
                            borderRadius: isOwnMessage 
                              ? '20px 20px 4px 20px' 
                              : '20px 20px 20px 4px',
                          }}
                        >
                          <Typography variant="body1" sx={{ 
                            color: isOwnMessage ? 'white' : 'rgba(255, 255, 255, 0.9)',
                            wordWrap: 'break-word',
                          }}>
                            {msg.content}
                          </Typography>
                          <Typography variant="caption" sx={{ 
                            display: 'block', 
                            mt: 0.5,
                            color: isOwnMessage 
                              ? 'rgba(255, 255, 255, 0.8)' 
                              : 'rgba(255, 255, 255, 0.5)',
                          }}>
                            {new Date(msg.createdAt).toLocaleTimeString()}
                          </Typography>
                        </Paper>
                      </Box>
                    );
                  })
                )}
              </Box>

              {/* Message Input */}
              <Box sx={{ 
                p: 3, 
                borderTop: '1px solid rgba(255, 152, 0, 0.2)',
                background: 'rgba(0, 0, 0, 0.4)',
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: 'rgba(255, 255, 255, 0.9)',
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
                        color: 'rgba(255, 255, 255, 0.5)',
                        opacity: 1,
                      },
                    }}
                  />
                  <Button 
                    variant="contained" 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    startIcon={<Send />}
                    sx={{ 
                      bgcolor: '#FFA726',
                      color: 'white',
                      px: 3,
                      py: 1.5,
                      borderRadius: '12px',
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': { 
                        bgcolor: '#FF9800',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 24px rgba(255, 152, 0, 0.4)',
                      },
                      '&:disabled': {
                        bgcolor: 'rgba(255, 152, 0, 0.3)',
                        color: 'rgba(255, 255, 255, 0.5)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Send
                  </Button>
                </Box>
              </Box>
            </>
          ) : (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '100%',
              flexDirection: 'column',
              gap: 2,
            }}>
              <MessageIcon sx={{ fontSize: 80, color: 'rgba(255, 152, 0, 0.3)' }} />
              <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                Select a conversation to start messaging
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </ProviderPageWrapper>
  );
};

export default ProviderMessagesPage;
