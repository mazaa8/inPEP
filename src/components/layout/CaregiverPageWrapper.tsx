import { Box, Typography, Avatar } from '@mui/material';
import Layout from './Layout';
import { roleColors } from '../../styles/glassmorphism';

interface CaregiverPageWrapperProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

/**
 * Unified wrapper for all Caregiver dashboard pages
 * Provides consistent glassmorphism styling and layout
 */
const CaregiverPageWrapper = ({ children, title, subtitle, icon }: CaregiverPageWrapperProps) => {
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f1f8f4 0%, #e8f5e9 50%, #dcedc8 100%)',
      p: 0,
    }}>
      <Layout title="" darkMode={false} themeColor="CAREGIVER">
        {/* Hero Header */}
        <Box sx={{ 
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          borderRadius: '24px',
          p: 4,
          mb: 4,
          boxShadow: '0 8px 32px 0 rgba(76, 175, 80, 0.15)',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {icon && (
              <Box sx={{
                width: 72,
                height: 72,
                borderRadius: '18px',
                background: roleColors.CAREGIVER.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 8px 24px ${roleColors.CAREGIVER.primary}40`,
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
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#1b5e20', mb: 0.5 }}>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="body1" sx={{ color: 'rgba(27, 94, 32, 0.7)' }}>
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

export default CaregiverPageWrapper;
