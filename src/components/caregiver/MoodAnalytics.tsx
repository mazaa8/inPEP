import { useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
} from '@mui/material';
import {
  SentimentVerySatisfied,
  SentimentNeutral,
  SentimentDissatisfied,
  Warning,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { JournalEntry } from '../../services/journalService';

interface MoodAnalyticsProps {
  entries: JournalEntry[];
}

const MOOD_COLORS: Record<string, string> = {
  happy: '#4caf50',
  neutral: '#2196f3',
  sad: '#ff9800',
  angry: '#f44336',
  anxious: '#9c27b0',
};

const MOOD_ICONS: Record<string, React.ReactNode> = {
  happy: <SentimentVerySatisfied sx={{ color: MOOD_COLORS.happy }} />,
  neutral: <SentimentNeutral sx={{ color: MOOD_COLORS.neutral }} />,
  sad: <SentimentDissatisfied sx={{ color: MOOD_COLORS.sad }} />,
  angry: <Warning sx={{ color: MOOD_COLORS.angry }} />,
  anxious: <Warning sx={{ color: MOOD_COLORS.anxious }} />,
};

const MOOD_LABELS: Record<string, string> = {
  happy: 'Happy',
  neutral: 'Neutral',
  sad: 'Sad',
  angry: 'Angry',
  anxious: 'Anxious',
};

const MoodAnalytics = ({ entries }: MoodAnalyticsProps) => {
  // Filter entries with mood data
  const moodEntries = useMemo(() => {
    return entries.filter(entry => entry.mood);
  }, [entries]);

  // Calculate mood distribution
  const moodDistribution = useMemo(() => {
    const distribution: Record<string, number> = {};
    moodEntries.forEach(entry => {
      const mood = entry.mood?.toLowerCase() || '';
      distribution[mood] = (distribution[mood] || 0) + 1;
    });
    return Object.entries(distribution).map(([mood, count]) => ({
      name: MOOD_LABELS[mood] || mood,
      value: count,
      color: MOOD_COLORS[mood] || '#999',
    }));
  }, [moodEntries]);

  // Calculate mood trends over time (last 30 days)
  const moodTrends = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const recentEntries = moodEntries.filter(entry => 
      new Date(entry.entryDate) >= thirtyDaysAgo
    );

    // Group by date
    const dateMap: Record<string, Record<string, number>> = {};
    recentEntries.forEach(entry => {
      const date = new Date(entry.entryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const mood = entry.mood?.toLowerCase() || '';
      if (!dateMap[date]) dateMap[date] = {};
      dateMap[date][mood] = (dateMap[date][mood] || 0) + 1;
    });

    return Object.entries(dateMap).map(([date, moods]) => ({
      date,
      happy: moods.happy || 0,
      neutral: moods.neutral || 0,
      sad: moods.sad || 0,
      angry: moods.angry || 0,
      anxious: moods.anxious || 0,
    })).slice(-14); // Last 14 days
  }, [moodEntries]);

  // Calculate mood score (0-100)
  const moodScore = useMemo(() => {
    if (moodEntries.length === 0) return 0;
    const weights: Record<string, number> = {
      happy: 100,
      neutral: 70,
      sad: 40,
      angry: 20,
      anxious: 30,
    };
    const totalScore = moodEntries.reduce((sum, entry) => {
      const mood = entry.mood?.toLowerCase() || '';
      return sum + (weights[mood] || 50);
    }, 0);
    return Math.round(totalScore / moodEntries.length);
  }, [moodEntries]);

  // Detect mood patterns with events
  const moodEventCorrelations = useMemo(() => {
    const correlations: Array<{ eventType: string; mood: string; count: number }> = [];
    const correlationMap: Record<string, Record<string, number>> = {};

    moodEntries.forEach(entry => {
      const eventType = entry.eventType;
      const mood = entry.mood?.toLowerCase() || '';
      if (!correlationMap[eventType]) correlationMap[eventType] = {};
      correlationMap[eventType][mood] = (correlationMap[eventType][mood] || 0) + 1;
    });

    Object.entries(correlationMap).forEach(([eventType, moods]) => {
      Object.entries(moods).forEach(([mood, count]) => {
        correlations.push({ eventType, mood, count });
      });
    });

    return correlations.sort((a, b) => b.count - a.count).slice(0, 5);
  }, [moodEntries]);

  // Calculate trend direction
  const moodTrend = useMemo(() => {
    if (moodTrends.length < 2) return 'stable';
    const recent = moodTrends.slice(-7);
    const older = moodTrends.slice(0, 7);
    
    const recentPositive = recent.reduce((sum, day) => sum + day.happy, 0);
    const olderPositive = older.reduce((sum, day) => sum + day.happy, 0);
    
    if (recentPositive > olderPositive * 1.2) return 'improving';
    if (recentPositive < olderPositive * 0.8) return 'declining';
    return 'stable';
  }, [moodTrends]);

  if (moodEntries.length === 0) {
    return (
      <Paper sx={{ 
        p: 3, 
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        textAlign: 'center',
      }}>
        <Typography variant="body1" color="text.secondary">
          No mood data available yet. Start tracking patient mood in journal entries.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      {/* Mood Score Overview */}
      <Paper sx={{ 
        p: 3, 
        mb: 3,
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        border: '1px solid rgba(76, 175, 80, 0.2)',
      }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h2" sx={{ 
                fontWeight: 700, 
                color: moodScore >= 70 ? '#4caf50' : moodScore >= 50 ? '#ff9800' : '#f44336',
                mb: 1,
              }}>
                {moodScore}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Overall Mood Score
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                {moodTrend === 'improving' && (
                  <>
                    <TrendingUp sx={{ color: '#4caf50', mr: 0.5 }} />
                    <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600 }}>
                      Improving
                    </Typography>
                  </>
                )}
                {moodTrend === 'declining' && (
                  <>
                    <TrendingDown sx={{ color: '#f44336', mr: 0.5 }} />
                    <Typography variant="body2" sx={{ color: '#f44336', fontWeight: 600 }}>
                      Declining
                    </Typography>
                  </>
                )}
                {moodTrend === 'stable' && (
                  <Typography variant="body2" sx={{ color: '#2196f3', fontWeight: 600 }}>
                    Stable
                  </Typography>
                )}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Mood Distribution
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {moodDistribution.map(({ name, value, color }) => (
                <Chip
                  key={name}
                  label={`${name}: ${value}`}
                  sx={{ 
                    bgcolor: color + '20',
                    color: color,
                    fontWeight: 600,
                    border: `1px solid ${color}`,
                  }}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {/* Mood Trends Chart */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ 
            p: 3,
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(76, 175, 80, 0.2)',
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1b5e20' }}>
              Mood Trends (Last 14 Days)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={moodTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis dataKey="date" style={{ fontSize: '12px' }} />
                <YAxis style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid rgba(76, 175, 80, 0.3)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="happy" stackId="1" stroke={MOOD_COLORS.happy} fill={MOOD_COLORS.happy} fillOpacity={0.6} name="Happy" />
                <Area type="monotone" dataKey="neutral" stackId="1" stroke={MOOD_COLORS.neutral} fill={MOOD_COLORS.neutral} fillOpacity={0.6} name="Neutral" />
                <Area type="monotone" dataKey="anxious" stackId="1" stroke={MOOD_COLORS.anxious} fill={MOOD_COLORS.anxious} fillOpacity={0.6} name="Anxious" />
                <Area type="monotone" dataKey="sad" stackId="1" stroke={MOOD_COLORS.sad} fill={MOOD_COLORS.sad} fillOpacity={0.6} name="Sad" />
                <Area type="monotone" dataKey="angry" stackId="1" stroke={MOOD_COLORS.angry} fill={MOOD_COLORS.angry} fillOpacity={0.6} name="Angry" />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Mood Distribution Pie Chart */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ 
            p: 3,
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(76, 175, 80, 0.2)',
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1b5e20' }}>
              Mood Breakdown
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={moodDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {moodDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Mood-Event Correlations */}
        <Grid item xs={12}>
          <Paper sx={{ 
            p: 3,
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(76, 175, 80, 0.2)',
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1b5e20' }}>
              🔍 Mood-Event Correlations
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Understanding how different events affect patient mood
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {moodEventCorrelations.map(({ eventType, mood, count }, index) => (
                <Box 
                  key={index}
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    p: 2,
                    background: 'rgba(76, 175, 80, 0.05)',
                    borderRadius: '12px',
                    border: '1px solid rgba(76, 175, 80, 0.1)',
                  }}
                >
                  <Box sx={{ mr: 2 }}>
                    {MOOD_ICONS[mood] || <SentimentNeutral />}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {eventType} events
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Associated with <strong>{MOOD_LABELS[mood] || mood}</strong> mood
                    </Typography>
                  </Box>
                  <Chip 
                    label={`${count} times`}
                    sx={{ 
                      bgcolor: MOOD_COLORS[mood] + '20',
                      color: MOOD_COLORS[mood],
                      fontWeight: 600,
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MoodAnalytics;
