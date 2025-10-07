import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, children, actions }) => {
  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'rgba(255, 255, 255, 0.08)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 152, 0, 0.3)',
      borderRadius: '20px',
      boxShadow: '0 8px 32px rgba(255, 152, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 40px rgba(255, 152, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 152, 0, 0.5)',
      },
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        p: 2.5,
        borderBottom: '1px solid rgba(255, 152, 0, 0.2)',
        background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.05) 0%, rgba(255, 193, 7, 0.05) 100%)',
      }}>
        <Typography variant="h6" component="div" sx={{ 
          color: '#FFB74D',
          fontWeight: 700,
          textShadow: '0 2px 10px rgba(255, 152, 0, 0.3)',
        }}>
          {title}
        </Typography>
        {actions}
      </Box>
      <CardContent sx={{ 
        flexGrow: 1,
        color: 'rgba(255, 255, 255, 0.95)',
        p: 3,
      }}>
        {children}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
