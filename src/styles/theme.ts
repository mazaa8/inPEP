import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4A7C6E',
      light: '#78A698',
      dark: '#2D4A43',
      contrastText: '#fff',
    },
    secondary: {
      main: '#5A9A9C',
      light: '#88c8cb',
      dark: '#3A6B6D',
      contrastText: '#fff',
    },
    background: {
      default: '#F4F7F6',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2D4A43',
      secondary: '#4A7C6E',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, letterSpacing: '0.5px' },
    h2: { fontWeight: 700, letterSpacing: '0.5px' },
    h3: { fontWeight: 700, letterSpacing: '0.5px' },
    h4: { fontWeight: 700, letterSpacing: '0.5px' },
    h5: { fontWeight: 600, letterSpacing: '0.5px' },
    h6: { fontWeight: 600, letterSpacing: '0.5px' },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 12px 32px rgba(0,0,0,0.1)',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FBFB 100%)',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #78A698 0%, #4A7C6E 100%)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        },
      },
    },
  },
});

export default theme;
