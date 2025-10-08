import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVideoCall } from '../../context/VideoCallContext';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  LinearProgress,
  Avatar,
} from '@mui/material';
import {
  Close as CloseIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Message as MessageIcon,
  Phone as PhoneIcon,
  Flag as FlagIcon,
  VolunteerActivism,
  Medication as MedicationIcon,
  Restaurant as RestaurantIcon,
  MonitorHeart as VitalsIcon,
  Chat as ChatIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface CaregiverDetailModalProps {
  open: boolean;
  onClose: () => void;
  caregiver: any;
  onUpdate?: () => void;
}

const CaregiverDetailModal = ({ open, onClose, caregiver, onUpdate }: CaregiverDetailModalProps) => {
  const navigate = useNavigate();
  const { initiateCall } = useVideoCall();
  const [flagged, setFlagged] = useState(caregiver?.flagged || false);

  // Update flagged state when caregiver changes
  useEffect(() => {
    setFlagged(caregiver?.flagged || false);
  }, [caregiver]);

  if (!caregiver) return null;

  // Mock engagement trend data (last 4 weeks)
  const engagementTrend = [
    { week: 'Week 1', score: caregiver.engagementScore - 8 },
    { week: 'Week 2', score: caregiver.engagementScore - 4 },
    { week: 'Week 3', score: caregiver.engagementScore - 2 },
    { week: 'Week 4', score: caregiver.engagementScore },
  ];

  // Mock burnout risk factors
  const burnoutFactors = [
    { factor: 'Workload', value: caregiver.burnoutRisk > 60 ? 85 : 45 },
    { factor: 'Sleep Quality', value: caregiver.burnoutRisk > 60 ? 70 : 30 },
    { factor: 'Social Support', value: caregiver.burnoutRisk > 60 ? 40 : 80 },
    { factor: 'Self-Care', value: caregiver.burnoutRisk > 60 ? 35 : 75 },
    { factor: 'Stress Level', value: caregiver.burnoutRisk > 60 ? 80 : 40 },
  ];

  // Mock activity timeline
  const activities = [
    { type: 'medication', icon: <MedicationIcon />, action: 'Logged medication', time: '2 hours ago', color: '#2196f3' },
    { type: 'meal', icon: <RestaurantIcon />, action: 'Updated meal plan', time: '5 hours ago', color: '#4caf50' },
    { type: 'vitals', icon: <VitalsIcon />, action: 'Recorded vitals', time: '1 day ago', color: '#f44336' },
    { type: 'message', icon: <ChatIcon />, action: 'Sent message to provider', time: '1 day ago', color: '#ff9800' },
    { type: 'wellness', icon: <AssignmentIcon />, action: 'Updated wellness plan', time: '2 days ago', color: '#9c27b0' },
  ];

  const getBurnoutColor = (risk: number) => {
    if (risk >= 60) return '#f44336';
    if (risk >= 40) return '#ff9800';
    return '#4caf50';
  };

  const handleMessage = () => {
    // Navigate to messages page with caregiver pre-selected
    // Use caregiverId (actual user ID) not engagement record ID
    const caregiverUserId = caregiver.caregiverId || caregiver.id;
    
    navigate('/provider/messages', { 
      state: { 
        recipientId: caregiverUserId,
        recipientName: caregiver.caregiverName,
        recipientType: 'caregiver'
      } 
    });
    onClose();
  };

  const handleCall = () => {
    // Initiate video call using existing WebRTC system
    // Use caregiverId from the caregiver object (this is their user ID)
    const caregiverUserId = caregiver.caregiverId || caregiver.id;
    initiateCall(caregiverUserId, caregiver.caregiverName);
    onClose();
  };

  const handleFlag = async () => {
    const newFlaggedState = !flagged;
    setFlagged(newFlaggedState);
    
    // Save flag to backend
    try {
      const response = await fetch(`http://localhost:3000/api/caregiver-engagement/${caregiver.id}/flag`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ flagged: newFlaggedState }),
      });
      
      if (!response.ok) throw new Error('Failed to flag caregiver');
      
      console.log(`${newFlaggedState ? 'Flagged' : 'Unflagged'} for follow-up:`, caregiver.caregiverName);
      
      // Trigger parent refresh
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error flagging caregiver:', error);
      // Revert on error
      setFlagged(!newFlaggedState);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#1a1a1a',
          backgroundImage: 'linear-gradient(135deg, #1a1a1a 0%, #2d2416 50%, #3d2d1a 100%)',
          color: 'white',
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: '1px solid rgba(255, 152, 0, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ 
            width: 56, 
            height: 56, 
            bgcolor: 'rgba(255, 152, 0, 0.2)',
            color: '#FFA726',
            fontSize: 24,
            fontWeight: 700,
          }}>
            {caregiver.caregiverName.split(' ').map((n: string) => n[0]).join('')}
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#FFA726' }}>
              {caregiver.caregiverName}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Caring for {caregiver.patientName} • {caregiver.relationship || 'Family Caregiver'}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          {/* Quick Actions */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<MessageIcon />}
                onClick={handleMessage}
                sx={{
                  background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                  '&:hover': { background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)' },
                }}
              >
                Send Message
              </Button>
              <Button
                variant="contained"
                startIcon={<PhoneIcon />}
                onClick={handleCall}
                sx={{
                  background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
                  '&:hover': { background: 'linear-gradient(135deg, #388e3c 0%, #2e7d32 100%)' },
                }}
              >
                Start Call
              </Button>
              <Button
                variant={flagged ? 'contained' : 'outlined'}
                startIcon={<FlagIcon />}
                onClick={handleFlag}
                sx={{
                  borderColor: '#ff9800',
                  color: flagged ? 'white' : '#ff9800',
                  bgcolor: flagged ? '#ff9800' : 'transparent',
                  '&:hover': {
                    borderColor: '#f57c00',
                    bgcolor: flagged ? '#f57c00' : 'rgba(255, 152, 0, 0.1)',
                  },
                }}
              >
                {flagged ? 'Flagged for Follow-up' : 'Flag for Follow-up'}
              </Button>
            </Box>
          </Grid>

          {/* Engagement Overview */}
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 152, 0, 0.2)',
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#FFA726', mb: 2 }}>
                  Engagement Score
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Typography variant="h3" sx={{ color: '#FFA726', fontWeight: 700 }}>
                    {caregiver.engagementScore}%
                  </Typography>
                  {caregiver.trend === 'up' ? (
                    <TrendingUpIcon sx={{ fontSize: 40, color: '#4caf50' }} />
                  ) : (
                    <TrendingDownIcon sx={{ fontSize: 40, color: '#f44336' }} />
                  )}
                </Box>
                <Chip
                  label={caregiver.engagementLevel.toUpperCase()}
                  size="small"
                  sx={{
                    bgcolor: caregiver.engagementLevel === 'high' ? '#4caf50' : 
                             caregiver.engagementLevel === 'moderate' ? '#ff9800' : '#f44336',
                    color: 'white',
                    fontWeight: 600,
                  }}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 152, 0, 0.2)',
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#FFA726', mb: 2 }}>
                  Burnout Risk
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={caregiver.burnoutRisk}
                    sx={{
                      height: 12,
                      borderRadius: 6,
                      bgcolor: 'rgba(255,255,255,0.1)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: getBurnoutColor(caregiver.burnoutRisk),
                      },
                    }}
                  />
                </Box>
                <Typography variant="h4" sx={{ color: getBurnoutColor(caregiver.burnoutRisk), fontWeight: 700 }}>
                  {caregiver.burnoutRisk}%
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 1 }}>
                  {caregiver.burnoutRisk >= 60 ? 'High Risk - Immediate Support Needed' :
                   caregiver.burnoutRisk >= 40 ? 'Moderate Risk - Monitor Closely' :
                   'Low Risk - Doing Well'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 152, 0, 0.2)',
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#FFA726', mb: 2 }}>
                  Last Activity
                </Typography>
                <Typography variant="body1" sx={{ color: 'white', mb: 1 }}>
                  {caregiver.lastActivity}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  {activities[0]?.action || 'No recent activity'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Engagement Trend Chart */}
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 152, 0, 0.2)',
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#FFA726', mb: 2 }}>
                  Engagement Trend (4 Weeks)
                </Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={engagementTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="week" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: '1px solid rgba(255,152,0,0.3)',
                        borderRadius: '8px',
                      }}
                    />
                    <Line type="monotone" dataKey="score" stroke="#FFA726" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Burnout Risk Factors */}
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 152, 0, 0.2)',
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#FFA726', mb: 2 }}>
                  Burnout Risk Factors
                </Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={burnoutFactors}>
                    <PolarGrid stroke="rgba(255,255,255,0.2)" />
                    <PolarAngleAxis dataKey="factor" stroke="rgba(255,255,255,0.7)" />
                    <PolarRadiusAxis stroke="rgba(255,255,255,0.3)" />
                    <Radar name="Risk" dataKey="value" stroke="#f44336" fill="#f44336" fillOpacity={0.6} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Activity Timeline */}
          <Grid item xs={12}>
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 152, 0, 0.2)',
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#FFA726', mb: 3 }}>
                  Recent Activity Timeline
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {activities.map((activity, index) => (
                    <Box 
                      key={index}
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'rgba(255,255,255,0.03)',
                        borderLeft: `4px solid ${activity.color}`,
                      }}
                    >
                      <Box sx={{ 
                        width: 40, 
                        height: 40, 
                        borderRadius: '50%', 
                        bgcolor: activity.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                      }}>
                        {activity.icon}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                          {activity.action}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                          {activity.time}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* ReclaiMe Recommendations */}
          {caregiver.burnoutRisk >= 40 && (
            <Grid item xs={12}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.1) 0%, rgba(103, 58, 183, 0.1) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(156, 39, 176, 0.3)',
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <VolunteerActivism sx={{ fontSize: 32, color: '#9c27b0' }} />
                    <Typography variant="h6" sx={{ color: '#9c27b0', fontWeight: 700 }}>
                      ReclaiMe Recommendations
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                    Based on {caregiver.caregiverName}'s burnout risk of {caregiver.burnoutRisk}%, we recommend:
                  </Typography>
                  <Grid container spacing={2}>
                    {caregiver.burnoutRisk >= 60 && (
                      <>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ 
                            p: 2, 
                            borderRadius: 2, 
                            bgcolor: 'rgba(156, 39, 176, 0.1)',
                            border: '1px solid rgba(156, 39, 176, 0.2)',
                          }}>
                            <Typography variant="subtitle2" sx={{ color: '#ce93d8', fontWeight: 600, mb: 1 }}>
                              🧘 Immediate Self-Care
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                              Guided meditation sessions and breathing exercises to reduce stress
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ 
                            p: 2, 
                            borderRadius: 2, 
                            bgcolor: 'rgba(156, 39, 176, 0.1)',
                            border: '1px solid rgba(156, 39, 176, 0.2)',
                          }}>
                            <Typography variant="subtitle2" sx={{ color: '#ce93d8', fontWeight: 600, mb: 1 }}>
                              🤝 Respite Care Options
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                              Connect with local respite care services for temporary relief
                            </Typography>
                          </Box>
                        </Grid>
                      </>
                    )}
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ 
                        p: 2, 
                        borderRadius: 2, 
                        bgcolor: 'rgba(156, 39, 176, 0.1)',
                        border: '1px solid rgba(156, 39, 176, 0.2)',
                      }}>
                        <Typography variant="subtitle2" sx={{ color: '#ce93d8', fontWeight: 600, mb: 1 }}>
                          💬 Support Groups
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          Join Champion Corner to connect with other caregivers
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ 
                        p: 2, 
                        borderRadius: 2, 
                        bgcolor: 'rgba(156, 39, 176, 0.1)',
                        border: '1px solid rgba(156, 39, 176, 0.2)',
                      }}>
                        <Typography variant="subtitle2" sx={{ color: '#ce93d8', fontWeight: 600, mb: 1 }}>
                          📚 Educational Resources
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          Access caregiving tips and stress management strategies
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => {
                      navigate('/reclaime');
                      onClose();
                    }}
                    sx={{
                      mt: 2,
                      background: 'linear-gradient(135deg, #9c27b0 0%, #673ab7 100%)',
                      '&:hover': { background: 'linear-gradient(135deg, #7b1fa2 0%, #512da8 100%)' },
                    }}
                  >
                    View Full ReclaiMe Resources
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Activity Stats */}
          <Grid item xs={12}>
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 152, 0, 0.2)',
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#FFA726', mb: 2 }}>
                  Activity Summary (Last 7 Days)
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={2.4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <MedicationIcon sx={{ fontSize: 32, color: '#2196f3', mb: 1 }} />
                      <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                        {caregiver.activities?.medicationLogs || 0}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        Medication Logs
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={2.4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <RestaurantIcon sx={{ fontSize: 32, color: '#4caf50', mb: 1 }} />
                      <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                        {caregiver.activities?.mealUpdates || 0}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        Meal Updates
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={2.4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <VitalsIcon sx={{ fontSize: 32, color: '#f44336', mb: 1 }} />
                      <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                        {caregiver.activities?.vitalsRecorded || 0}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        Vitals Recorded
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={2.4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <ChatIcon sx={{ fontSize: 32, color: '#ff9800', mb: 1 }} />
                      <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                        {caregiver.activities?.messagesExchanged || 0}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        Messages
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={2.4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <AssignmentIcon sx={{ fontSize: 32, color: '#9c27b0', mb: 1 }} />
                      <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                        {caregiver.activities?.wellnessPlanUpdates || 0}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        Wellness Updates
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default CaregiverDetailModal;
