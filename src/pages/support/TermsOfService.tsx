import { Container, Typography, Paper } from '@mui/material';
import Layout from '../../components/layout/Layout';

const TermsOfService = () => {
  return (
    <Layout>
      <Container maxWidth="lg">
        <Paper sx={{ p: 4, my: 4 }}>
          <Typography variant="h4" gutterBottom>
            Terms of Service
          </Typography>
          <Typography variant="body1">
            Please read these Terms of Service carefully before using our platform. Your access to and use of the service is conditioned on your acceptance of and compliance with these Terms.
          </Typography>
          {/* Full ToS text will go here */}
        </Paper>
      </Container>
    </Layout>
  );
};

export default TermsOfService;
