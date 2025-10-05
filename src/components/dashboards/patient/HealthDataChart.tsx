import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export interface HealthData {
  name: string;
  weight: number;
}

interface HealthDataChartProps {
  data: HealthData[];
}

const HealthDataChart = ({ data }: HealthDataChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis 
          dataKey="name" 
          stroke="rgba(255,255,255,0.7)"
          style={{ fontSize: '0.875rem', fontWeight: 600 }}
        />
        <YAxis 
          stroke="rgba(255,255,255,0.7)"
          style={{ fontSize: '0.875rem', fontWeight: 600 }}
        />
        <Tooltip 
          contentStyle={{ 
            background: 'rgba(15, 32, 39, 0.95)',
            border: '1px solid rgba(33, 150, 243, 0.3)',
            borderRadius: '12px',
            color: 'white',
          }}
        />
        <Legend 
          wrapperStyle={{ color: 'white' }}
        />
        <Line 
          type="monotone" 
          dataKey="weight" 
          stroke="#21CBF3" 
          strokeWidth={3}
          dot={{ fill: '#2196F3', r: 5 }}
          activeDot={{ r: 8, fill: '#21CBF3' }} 
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default HealthDataChart;
