import { Container, Typography, Paper } from '@mui/material';
import Layout from '../../components/layout/Layout';

const HelpCenter = () => {
  return (
    <Layout>
      <Container maxWidth="lg">
        <Paper sx={{ p: 4, my: 4 }}>
          <Typography variant="h4" gutterBottom>
            Help Center
          </Typography>
          <Typography variant="body1">
            Welcome to the Help Center. Here you will find answers to frequently asked questions and tutorials on how to use the platform.
          </Typography>
          {/* FAQ content will go here */}
        </Paper>
      </Container>
    </Layout>
  );
};

export default HelpCenter;
