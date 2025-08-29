import { Box, Container, Typography, Link as MuiLink, Grid, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { CheckCircleOutline } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Quick Links */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <MuiLink component={RouterLink} to="/help-center" variant="body2" display="block">Help Center</MuiLink>
            <MuiLink component={RouterLink} to="/terms-of-service" variant="body2" display="block">Terms of Service</MuiLink>
            <MuiLink component={RouterLink} to="/privacy-policy" variant="body2" display="block">Privacy Policy</MuiLink>
          </Grid>

          {/* Contact Support */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Support
            </Typography>
            <MuiLink component={RouterLink} to="/help-center" variant="body2" display="block">Contact Support</MuiLink>
          </Grid>

          {/* System Health Status */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              System Status
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CheckCircleOutline color="success" sx={{ mr: 1 }} />
              <Typography variant="body2">All systems operational</Typography>
            </Box>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3 }} />
        <Typography variant="body2" color="text.secondary" align="center">
          {'Copyright © '}
          <MuiLink color="inherit" href="#">
            Indigo International inPEP
          </MuiLink>{' '}
          {new Date().getFullYear()}
          {'.'}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
