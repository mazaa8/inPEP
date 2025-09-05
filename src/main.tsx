import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import theme from './styles/theme';
import { AuthProvider } from './context/AuthContext';
import { MealPlanProvider } from './context/MealPlanContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <MealPlanProvider>
          <App />
        </MealPlanProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
