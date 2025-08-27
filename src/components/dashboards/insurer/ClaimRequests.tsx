import { Typography, List, ListItem, ListItemText, Chip } from '@mui/material';

const claims = [
  { id: 1, patient: 'John Doe', amount: '$500', status: 'Pending' },
  { id: 2, patient: 'Jane Smith', amount: '$1200', status: 'Approved' },
  { id: 3, patient: 'Peter Jones', amount: '$300', status: 'Rejected' },
];

const ClaimRequests = () => {
  const getStatusChip = (status: string) => {
    let color: 'warning' | 'success' | 'error' = 'warning';
    if (status === 'Approved') color = 'success';
    if (status === 'Rejected') color = 'error';
    return <Chip label={status} color={color} size="small" />;
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>Recent Claim Requests</Typography>
      <List>
        {claims.map((claim) => (
          <ListItem key={claim.id}>
            <ListItemText 
              primary={`Claim from ${claim.patient} for ${claim.amount}`}
              secondary={getStatusChip(claim.status)}
            />
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default ClaimRequests;
