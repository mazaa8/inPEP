import { Typography, List, ListItem, ListItemText, Divider, Avatar, ListItemAvatar } from '@mui/material';

const messages = [
  { id: 1, from: 'Dr. Smith', subject: 'Re: Your recent lab results', snippet: 'Everything looks good...', avatar: 'DS' },
  { id: 2, from: 'Clinic Admin', subject: 'Appointment Reminder', snippet: 'Your appointment is confirmed for...', avatar: 'CA' },
];

const RecentMessages = () => {
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
