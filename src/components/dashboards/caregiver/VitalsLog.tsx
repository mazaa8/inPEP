import { Typography, Box, Avatar } from '@mui/material';
import { ShowChart } from '@mui/icons-material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { roleColors } from '../../../styles/glassmorphism';

export interface VitalsData {
  name: string;
  heartRate: number;
  bp: number;
}

interface VitalsLogProps {
  data: VitalsData[];
}

const VitalsLog = ({ data }: VitalsLogProps) => {
  return (
    <Box sx={{ 
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.8)',
      borderRadius: '20px',
      p: 3,
      boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1)',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 32px rgba(76, 175, 80, 0.15)',
      },
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar sx={{ 
          background: roleColors.CAREGIVER.gradient,
          color: '#fff', 
          mr: 2,
          width: 48,
          height: 48,
          boxShadow: `0 4px 16px ${roleColors.CAREGIVER.primary}40`,
        }}>
          <ShowChart />
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1b5e20' }}>
          Vitals & Symptoms Log
        </Typography>
      </Box>
      <Box sx={{ height: 250, mt: 2 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="colorHeartRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={roleColors.CAREGIVER.primary} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={roleColors.CAREGIVER.primary} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorBp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={roleColors.CAREGIVER.secondary} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={roleColors.CAREGIVER.secondary} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(76, 175, 80, 0.2)" />
            <XAxis dataKey="name" stroke="#1b5e20" />
            <YAxis yAxisId="left" stroke={roleColors.CAREGIVER.primary} />
            <YAxis yAxisId="right" orientation="right" stroke={roleColors.CAREGIVER.secondary} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderColor: 'rgba(76, 175, 80, 0.3)',
                color: '#1b5e20',
                borderRadius: '12px',
                border: '1px solid rgba(76, 175, 80, 0.3)',
              }}
            />
            <Legend />
            <Area yAxisId="left" type="monotone" dataKey="heartRate" name="Heart Rate" stroke={roleColors.CAREGIVER.primary} fillOpacity={1} fill="url(#colorHeartRate)" />
            <Area yAxisId="right" type="monotone" dataKey="bp" name="Blood Pressure" stroke={roleColors.CAREGIVER.secondary} fillOpacity={1} fill="url(#colorBp)" />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default VitalsLog;
