import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  IconButton,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Message as MessageIcon,
  Phone as PhoneIcon,
  Search as SearchIcon,
  VolunteerActivism as CaregiverIcon,
} from '@mui/icons-material';
import Layout from '../../components/layout/Layout';
import { roleColors } from '../../styles/glassmorphism';

// Mock data - 101 caregivers with realistic names and relationships
const generateMockCaregivers = () => {
  const relationships = ['Daughter', 'Son', 'Spouse', 'Professional Caregiver', 'Sibling', 'Parent'];
  const firstNames = ['Nora', 'James', 'Sarah', 'Michael', 'Emily', 'David', 'Lisa', 'Robert', 'Maria', 'John'];
  const lastNames = ['White', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  
  const caregivers = [];
  
  // First entry: Nora White caring for Abdeen White
  caregivers.push({
    id: '1',
    caregiverName: 'Nora White',
    patientName: 'Abdeen White',
    relationship: 'Daughter',
    engagementScore: 92,
    engagementLevel: 'high',
    lastActivity: '2 hours ago',
    burnoutRisk: 15,
    trend: 'up',
    activities: {
      medicationLogs: 28,
      mealUpdates: 21,
      vitalsRecorded: 14,
      messagesExchanged: 45,
      wellnessPlanUpdates: 8,
    },
  });

  // Generate remaining 100 caregivers
  for (let i = 2; i <= 101; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const patientFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const relationship = relationships[Math.floor(Math.random() * relationships.length)];
    
    // Varied engagement scores
    let engagementScore;
    let engagementLevel;
    let burnoutRisk;
    
    if (i <= 45) { // 45 highly engaged
      engagementScore = Math.floor(Math.random() * 20) + 80; // 80-100
      engagementLevel = 'high';
      burnoutRisk = Math.floor(Math.random() * 30); // 0-30
    } else if (i <= 85) { // 40 moderately engaged
      engagementScore = Math.floor(Math.random() * 30) + 50; // 50-80
      engagementLevel = 'moderate';
      burnoutRisk = Math.floor(Math.random() * 40) + 20; // 20-60
    } else { // 16 low engagement
      engagementScore = Math.floor(Math.random() * 30) + 20; // 20-50
      engagementLevel = 'low';
      burnoutRisk = Math.floor(Math.random() * 40) + 60; // 60-100
    }

    const trend = Math.random() > 0.5 ? 'up' : 'down';
    const hoursAgo = Math.floor(Math.random() * 72) + 1;
    const lastActivity = hoursAgo < 24 ? `${hoursAgo} hours ago` : `${Math.floor(hoursAgo / 24)} days ago`;

    caregivers.push({
      id: String(i),
      caregiverName: `${firstName} ${lastName}`,
      patientName: `${patientFirstName} ${lastName}`,
      relationship,
      engagementScore,
      engagementLevel,
      lastActivity,
      burnoutRisk,
      trend,
      activities: {
        medicationLogs: Math.floor(Math.random() * 30),
        mealUpdates: Math.floor(Math.random() * 25),
        vitalsRecorded: Math.floor(Math.random() * 20),
        messagesExchanged: Math.floor(Math.random() * 50),
        wellnessPlanUpdates: Math.floor(Math.random() * 10),
      },
    });
  }

  return caregivers;
};

const CaregiverEngagementPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [caregivers, setCaregivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalCaregivers: 0,
    avgEngagement: 0,
    atRiskCount: 0,
    activeThisWeek: 0,
  });

  useEffect(() => {
    const fetchCaregiverEngagement = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/api/caregiver-engagement', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        setCaregivers(data.caregivers);
        setSummary(data.summary);
      } catch (error) {
        console.error('Error fetching caregiver engagement:', error);
        // Fallback to mock data
        const mockCaregivers = generateMockCaregivers();
        setCaregivers(mockCaregivers);
      } finally {
        setLoading(false);
      }
    };

    fetchCaregiverEngagement();
  }, []);

  // Filter caregivers based on search
  const filteredCaregivers = caregivers.filter(
    (c) =>
      c.caregiverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.patientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Use summary from API or calculate from caregivers
  const totalCaregivers = summary.totalCaregivers || caregivers.length;
  const avgEngagement = summary.avgEngagement || (caregivers.length > 0 
    ? Math.round(caregivers.reduce((sum, c) => sum + c.engagementScore, 0) / caregivers.length)
    : 0);
  const atRiskCount = summary.atRiskCount || caregivers.filter((c) => c.burnoutRisk >= 60).length;
  const activeThisWeek = summary.activeThisWeek || caregivers.filter((c) => c.lastActivity?.includes('hours') || c.lastActivity?.includes('1 day')).length;

  const getEngagementColor = (level: string) => {
    switch (level) {
      case 'high':
        return '#4caf50';
      case 'moderate':
        return '#ff9800';
      case 'low':
        return '#f44336';
      default:
        return '#9e9e9e';
    }
  };

  const getBurnoutColor = (risk: number) => {
    if (risk >= 60) return '#f44336';
    if (risk >= 40) return '#ff9800';
    return '#4caf50';
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f1419 0%, #1a1f2e 30%, #2d1f1a 70%, #3d2a1f 100%)', p: 0 }}>
      <Layout title="" darkMode={true} themeColor="PROVIDER">
        {/* Hero Header */}
        <Box sx={{ 
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 152, 0, 0.3)',
          borderRadius: '24px',
          p: 4,
          mb: 4,
          boxShadow: '0 8px 32px 0 rgba(255, 152, 0, 0.2)',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box sx={{
              width: 64,
              height: 64,
              borderRadius: '16px',
              background: roleColors.PROVIDER.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 8px 24px ${roleColors.PROVIDER.primary}40`,
            }}>
              <CaregiverIcon sx={{ fontSize: 36, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: 'white', mb: 0.5 }}>
                Caregiver Engagement
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Monitor and support family caregivers post-discharge
              </Typography>
            </Box>
          </Box>

          {/* Overview Cards */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                background: 'rgba(255, 255, 255, 0.05)', 
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 152, 0, 0.2)',
              }}>
                <CardContent>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                    Total Caregivers
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#FFA726', fontWeight: 700 }}>
                    {totalCaregivers}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                background: 'rgba(255, 255, 255, 0.05)', 
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 152, 0, 0.2)',
              }}>
                <CardContent>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                    Avg Engagement
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 700 }}>
                    {avgEngagement}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                background: 'rgba(255, 255, 255, 0.05)', 
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(244, 67, 54, 0.3)',
              }}>
                <CardContent>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                    At Burnout Risk
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#f44336', fontWeight: 700 }}>
                    {atRiskCount}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                background: 'rgba(255, 255, 255, 0.05)', 
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 152, 0, 0.2)',
              }}>
                <CardContent>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                    Active This Week
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#2196f3', fontWeight: 700 }}>
                    {activeThisWeek}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Search Bar */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search by caregiver or patient name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                bgcolor: 'rgba(255,255,255,0.05)',
                '& fieldset': { borderColor: 'rgba(255, 152, 0, 0.3)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 152, 0, 0.5)' },
                '&.Mui-focused fieldset': { borderColor: '#FFA726' },
              },
            }}
          />
        </Box>

        {/* Caregivers Table */}
        <TableContainer sx={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 152, 0, 0.2)',
          borderRadius: '20px',
        }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#FFB74D', fontWeight: 700 }}>Caregiver</TableCell>
                <TableCell sx={{ color: '#FFB74D', fontWeight: 700 }}>Patient</TableCell>
                <TableCell sx={{ color: '#FFB74D', fontWeight: 700 }}>Relationship</TableCell>
                <TableCell sx={{ color: '#FFB74D', fontWeight: 700 }}>Engagement</TableCell>
                <TableCell sx={{ color: '#FFB74D', fontWeight: 700 }}>Burnout Risk</TableCell>
                <TableCell sx={{ color: '#FFB74D', fontWeight: 700 }}>Last Activity</TableCell>
                <TableCell sx={{ color: '#FFB74D', fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCaregivers.map((caregiver) => (
                <TableRow 
                  key={caregiver.id}
                  sx={{
                    '&:hover': { bgcolor: 'rgba(255, 152, 0, 0.1)' },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <TableCell sx={{ color: 'white' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {caregiver.caregiverName}
                      {caregiver.trend === 'up' ? (
                        <TrendingUpIcon sx={{ fontSize: 16, color: '#4caf50' }} />
                      ) : (
                        <TrendingDownIcon sx={{ fontSize: 16, color: '#f44336' }} />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    {caregiver.patientName}
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    {caregiver.relationship}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={caregiver.engagementScore}
                        sx={{
                          width: 100,
                          height: 8,
                          borderRadius: 4,
                          bgcolor: 'rgba(255,255,255,0.1)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: getEngagementColor(caregiver.engagementLevel),
                          },
                        }}
                      />
                      <Typography variant="body2" sx={{ color: 'white', minWidth: 40 }}>
                        {caregiver.engagementScore}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={caregiver.burnoutRisk >= 60 ? <WarningIcon /> : <CheckCircleIcon />}
                      label={`${caregiver.burnoutRisk}%`}
                      size="small"
                      sx={{
                        bgcolor: `${getBurnoutColor(caregiver.burnoutRisk)}20`,
                        color: getBurnoutColor(caregiver.burnoutRisk),
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    {caregiver.lastActivity}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton size="small" sx={{ color: '#2196f3' }} title="Send Message">
                        <MessageIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" sx={{ color: '#4caf50' }} title="Schedule Call">
                        <PhoneIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Layout>
    </Box>
  );
};

export default CaregiverEngagementPage;
