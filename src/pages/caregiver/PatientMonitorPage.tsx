import { useEffect } from 'react';
import { Typography, Box, Button, Grid } from '@mui/material';
import CaregiverPageWrapper from '../../components/layout/CaregiverPageWrapper';
import { MonitorHeart as MonitorIcon } from '@mui/icons-material';
import { useVideoCall } from '../../context/VideoCallContext';
import VideoCall from '../../components/video/VideoCall';
import { glassStyles, roleColors } from '../../styles/glassmorphism';

const PatientMonitorPage = () => {
  const { 
    incomingCall, 
    callState, 
    acceptCall, 
    declineCall, 
    endCall,
    sendOffer,
    sendAnswer,
    sendIceCandidate,
    remoteOffer,
    remoteAnswer,
    remoteIceCandidate,
    updateAvailability,
  } = useVideoCall();

  // Set caregiver as available when patient monitor loads
  useEffect(() => {
    console.log('🟢 Patient Monitor loaded - Nora is ready for calls');
    updateAvailability(true);
    return () => {
      updateAvailability(false);
    };
  }, []);

  // Log when incoming call changes
  useEffect(() => {
    if (incomingCall) {
      console.log('📞 INCOMING CALL on Patient Monitor:', incomingCall);
    }
  }, [incomingCall]);

  return (
    <CaregiverPageWrapper
      title="Patient Monitor"
      subtitle="Real-time monitoring and video calls with Abdeen White"
      icon={<MonitorIcon />}
    >
        {/* PERMANENT CALL BANNER - ALWAYS VISIBLE */}
        <Box
          sx={{ 
            ...glassStyles.solidCard('CAREGIVER'),
            mb: 3,
            p: 3,
            animation: incomingCall ? 'pulse 1s infinite' : 'none',
            '@keyframes pulse': {
              '0%': { boxShadow: `0 0 0 0 ${roleColors.CAREGIVER.primary}70` },
              '50%': { boxShadow: `0 0 0 15px ${roleColors.CAREGIVER.primary}00` },
              '100%': { boxShadow: `0 0 0 0 ${roleColors.CAREGIVER.primary}00` },
            },
            opacity: incomingCall ? 1 : 0.8,
          }}
        >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <Box>
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 0.5 }}>
              {incomingCall ? (
                <>📹 {incomingCall.patientName} is calling you!</>
              ) : (
                <>📞 Video Call Status</>
              )}
            </Typography>
            <Typography variant="h6" sx={{ color: 'white' }}>
              {incomingCall ? (
                <>Incoming call - Click to answer</>
              ) : (
                <>Waiting for calls from Abdeen...</>
              )}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {incomingCall ? (
              <>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => declineCall('Nora is busy right now')}
                  sx={{
                    bgcolor: '#d32f2f',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    px: 3,
                    '&:hover': { bgcolor: '#b71c1c' },
                  }}
                >
                  Decline
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  onClick={acceptCall}
                  sx={{
                    bgcolor: 'white',
                    color: '#4CAF50',
                    fontWeight: 'bold',
                    fontSize: '1.5rem',
                    px: 8,
                    py: 2,
                    '&:hover': { bgcolor: '#f1f8f4', transform: 'scale(1.05)' },
                    transition: 'all 0.2s',
                  }}
                >
                  ✅ ANSWER CALL
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                size="large"
                disabled
                sx={{
                  bgcolor: 'rgba(255,255,255,0.3)',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                  px: 6,
                  py: 2,
                }}
              >
                No Incoming Calls
              </Button>
            )}
          </Box>
        </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ 
              ...glassStyles.cardWithTint('CAREGIVER', 0.2),
              p: 3,
            }}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: roleColors.CAREGIVER.primary }}>
                Patient Monitor
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.8 }}>
                Monitor Abdeen's health status, activities, and well-being in real-time.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ 
              ...glassStyles.cardWithTint('CAREGIVER', 0.15),
              p: 3,
            }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: roleColors.CAREGIVER.primary }}>
                📊 Real-Time Monitoring
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
                Patient monitoring features will be displayed here, including:
              </Typography>
              <Box component="ul" sx={{ mt: 2 }}>
                <li>Live health metrics</li>
                <li>Activity tracking</li>
                <li>Medication adherence</li>
                <li>Meal completion status</li>
                <li>Sleep patterns</li>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Video Call Dialog */}
        {callState.isInCall && (
          <VideoCall
            open={callState.isInCall}
            isInitiator={callState.isInitiator}
            remoteName={callState.remoteName || 'Abdeen'}
            onEndCall={endCall}
            onOffer={sendOffer}
            onAnswer={sendAnswer}
            onIceCandidate={sendIceCandidate}
            remoteOffer={remoteOffer}
            remoteAnswer={remoteAnswer}
            remoteIceCandidate={remoteIceCandidate}
          />
        )}
    </CaregiverPageWrapper>
  );
};

export default PatientMonitorPage;
