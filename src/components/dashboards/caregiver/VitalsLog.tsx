import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import { ShowChart } from '@mui/icons-material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

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
    <Card sx={{ background: 'linear-gradient(135deg, #F4F7F6 0%, #E9EFEE 100%)', color: '#2D4A43', borderRadius: '16px', boxShadow: '0 12px 32px rgba(0,0,0,0.1)' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ background: 'linear-gradient(135deg, #78A698 0%, #4A7C6E 100%)', color: '#fff', mr: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
            <ShowChart />
          </Avatar>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', letterSpacing: '0.5px' }}>
            Vitals & Symptoms Log
          </Typography>
        </Box>
        <Box sx={{ height: 250, mt: 3 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <defs>
                <linearGradient id="colorHeartRate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4A7C6E" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#4A7C6E" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorBp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5A9A9C" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#5A9A9C" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#d0d9d6" />
              <XAxis dataKey="name" stroke="#4A7C6E" />
              <YAxis yAxisId="left" stroke="#4A7C6E" />
              <YAxis yAxisId="right" orientation="right" stroke="#5A9A9C" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(244, 247, 246, 0.9)',
                  borderColor: '#d0d9d6',
                  color: '#2D4A43',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Area yAxisId="left" type="monotone" dataKey="heartRate" name="Heart Rate" stroke="#4A7C6E" fillOpacity={1} fill="url(#colorHeartRate)" />
              <Area yAxisId="right" type="monotone" dataKey="bp" name="Blood Pressure" stroke="#5A9A9C" fillOpacity={1} fill="url(#colorBp)" />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default VitalsLog;
