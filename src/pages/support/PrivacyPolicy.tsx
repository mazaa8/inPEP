import { Container, Typography, Paper } from '@mui/material';
import Layout from '../../components/layout/Layout';

const PrivacyPolicy = () => {
  return (
    <Layout>
      <Container maxWidth="lg">
        <Paper sx={{ p: 4, my: 4 }}>
          <Typography variant="h4" gutterBottom>
            Privacy Policy
          </Typography>
          <Typography variant="body1">
            Our Privacy Policy describes how we collect, use, and share information about you when you use our platform. We are committed to protecting your privacy.
          </Typography>
          {/* Full privacy policy text will go here */}
        </Paper>
      </Container>
    </Layout>
  );
};

export default PrivacyPolicy;
