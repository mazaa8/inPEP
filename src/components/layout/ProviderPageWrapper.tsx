import { Box, Typography, Avatar } from '@mui/material';
import Layout from './Layout';
import { roleColors } from '../../styles/glassmorphism';

interface ProviderPageWrapperProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

/**
 * Unified wrapper for all Provider dashboard pages
 * Provides consistent dark glassmorphism styling with orange/yellow theme
 */
const ProviderPageWrapper = ({ children, title, subtitle, icon }: ProviderPageWrapperProps) => {
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2416 50%, #3d2d1a 100%)',
      p: 0,
    }}>
      <Layout title="" darkMode={true} themeColor="PROVIDER">
        {/* Hero Header */}
        <Box sx={{ 
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 152, 0, 0.3)',
          borderRadius: '24px',
          p: 4,
          mb: 4,
          boxShadow: '0 8px 32px 0 rgba(255, 152, 0, 0.2)',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {icon && (
              <Box sx={{
                width: 72,
                height: 72,
                borderRadius: '18px',
                background: roleColors.PROVIDER.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 8px 24px ${roleColors.PROVIDER.primary}60`,
              }}>
                <Avatar sx={{ 
                  width: 72, 
                  height: 72, 
                  bgcolor: 'transparent',
                  '& .MuiSvgIcon-root': {
                    fontSize: 40,
                    color: 'white',
                  },
                }}>
                  {icon}
                </Avatar>
              </Box>
            )}
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#FFA726', mb: 0.5 }}>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="body1" sx={{ color: 'rgba(255, 167, 38, 0.8)' }}>
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        {/* Content */}
        {children}
      </Layout>
    </Box>
  );
};

export default ProviderPageWrapper;
