import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, children, actions }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
        {actions}
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        {children}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
