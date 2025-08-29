import { Typography, List, ListItem, ListItemText, Divider, Avatar, ListItemAvatar } from '@mui/material';

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
      <Typography variant="h6" gutterBottom>Recent Messages</Typography>
      <List>
        {messages.map((message, index) => (
          <div key={message.id}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar>{message.avatar}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={message.subject}
                secondary={`From: ${message.from} — ${message.snippet}`}
              />
            </ListItem>
            {index < messages.length - 1 && <Divider variant="inset" component="li" />}
          </div>
        ))}
      </List>
    </>
  );
};

export default RecentMessages;
