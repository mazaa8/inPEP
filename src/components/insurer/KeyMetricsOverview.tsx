import { Grid, Typography, Box, CircularProgress } from '@mui/material';
import {
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  HourglassEmpty as PendingIcon,
} from '@mui/icons-material';
import { type DashboardOverview } from '../../services/insurerService';
import { roleColors } from '../../styles/glassmorphism';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  trend?: string;
}

const MetricCard = ({ title, value, subtitle, icon, color, trend }: MetricCardProps) => (
  <Box sx={{ 
    p: 3, 
    height: '100%',
    background: 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.8)',
    borderRadius: '20px',
    boxShadow: '0 4px 20px rgba(156, 39, 176, 0.08)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 32px rgba(156, 39, 176, 0.15)',
      border: `1px solid ${color}40`,
    },
  }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <Box>
        <Typography variant="body2" sx={{ color: 'rgba(74, 20, 140, 0.7)', fontWeight: 600, mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#4a148c', mb: 0.5 }}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="body2" sx={{ color: 'rgba(74, 20, 140, 0.6)' }}>
            {subtitle}
          </Typography>
        )}
        {trend && (
          <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', mt: 1, color: '#4CAF50', fontWeight: 700 }}>
            <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5 }} />
            {trend}
          </Typography>
        )}
      </Box>
      <Box
        sx={{
          background: `${color}20`,
          borderRadius: '14px',
          p: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </Box>
    </Box>
  </Box>
);

interface KeyMetricsOverviewProps {
  data: DashboardOverview | null;
  loading: boolean;
}

const KeyMetricsOverview = ({ data, loading }: KeyMetricsOverviewProps) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress sx={{ color: roleColors.INSURER.primary }} />
      </Box>
    );
  }

  if (!data) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Total Members"
          value={data.totalMembers.toLocaleString()}
          subtitle="Active patients"
          icon={<PeopleIcon sx={{ fontSize: 32, color: '#1976d2' }} />}
          color="#1976d2"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Total Claims"
          value={data.totalClaims.toLocaleString()}
          subtitle={`${data.pendingClaims} pending review`}
          icon={<PendingIcon sx={{ fontSize: 32, color: '#f57c00' }} />}
          color="#f57c00"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Approved Claims"
          value={data.approvedClaims.toLocaleString()}
          subtitle={`${formatCurrency(data.totalApprovedAmount)} paid`}
          icon={<CheckIcon sx={{ fontSize: 32, color: '#388e3c' }} />}
          color="#388e3c"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Cost Savings"
          value={formatCurrency(data.costSavings)}
          subtitle="From claim reviews"
          icon={<MoneyIcon sx={{ fontSize: 32, color: '#7b1fa2' }} />}
          color="#7b1fa2"
          trend="+12% vs last month"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="High-Risk Patients"
          value={data.highRiskPatients}
          subtitle="Require intervention"
          icon={<WarningIcon sx={{ fontSize: 32, color: '#d32f2f' }} />}
          color="#d32f2f"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Active Providers"
          value={data.activeProviders}
          subtitle="In network"
          icon={<PeopleIcon sx={{ fontSize: 32, color: '#0097a7' }} />}
          color="#0097a7"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Avg Claim Amount"
          value={formatCurrency(data.averageClaimAmount)}
          subtitle="Per claim"
          icon={<MoneyIcon sx={{ fontSize: 32, color: '#5d4037' }} />}
          color="#5d4037"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Total Claimed"
          value={formatCurrency(data.totalClaimedAmount)}
          subtitle="All claims"
          icon={<TrendingUpIcon sx={{ fontSize: 32, color: '#c2185b' }} />}
          color="#c2185b"
        />
      </Grid>
    </Grid>
  );
};

export default KeyMetricsOverview;
