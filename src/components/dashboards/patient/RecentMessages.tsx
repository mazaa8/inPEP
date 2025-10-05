import { Typography, List, ListItem, ListItemText, Divider, Avatar, ListItemAvatar, Box } from '@mui/material';
import { Message as MessageIcon } from '@mui/icons-material';

export interface Message {
  id: number;
  from: string;
  subject: string;
  snippet: string;
  avatar: string;
}

interface RecentMessagesProps {
  messages: Message[];
}

const RecentMessages = ({ messages }: RecentMessagesProps) => {
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <MessageIcon sx={{ color: '#21CBF3', mr: 1 }} />
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
          Recent Messages
        </Typography>
      </Box>
      <List sx={{ p: 0 }}>
        {messages.map((message, index) => (
          <div key={message.id}>
            <ListItem 
              alignItems="flex-start"
              sx={{
                px: 0,
                py: 2,
                '&:hover': {
                  bgcolor: 'rgba(33, 150, 243, 0.05)',
                  borderRadius: '8px',
                },
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ 
                  background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
                  fontWeight: 700,
                }}>
                  {message.avatar}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography sx={{ fontWeight: 600, color: 'white', mb: 0.5 }}>
                    {message.subject}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                    From: {message.from} — {message.snippet}
                  </Typography>
                }
              />
            </ListItem>
            {index < messages.length - 1 && <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />}
          </div>
        ))}
      </List>
    </>
  );
};

export default RecentMessages;
