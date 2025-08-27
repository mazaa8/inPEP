import { Typography } from '@mui/material';
import Layout from '../../components/layout/Layout';

const MessagesPage = () => {
  return (
    <Layout title="Messages">
      <Typography variant="h4">Messages Page</Typography>
      <Typography>This is where the user's messages will be displayed.</Typography>
    </Layout>
  );
};

export default MessagesPage;
