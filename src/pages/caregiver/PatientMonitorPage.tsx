import { useEffect } from 'react';
import { Typography, Box, Button, Alert, Grid, Card, CardContent } from '@mui/material';
import Layout from '../../components/layout/Layout';
import { useVideoCall } from '../../context/VideoCallContext';
import VideoCall from '../../components/video/VideoCall';

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
    <Layout title="Patient Monitor">
      {/* PERMANENT CALL BANNER - ALWAYS VISIBLE */}
      <Alert
        severity={incomingCall ? "success" : "info"}
        sx={{ 
          mb: 3, 
          bgcolor: incomingCall ? '#4CAF50' : '#2196F3',
          color: 'white',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          animation: incomingCall ? 'pulse 1s infinite' : 'none',
          '@keyframes pulse': {
            '0%': { boxShadow: '0 0 0 0 rgba(76, 175, 80, 0.7)' },
            '50%': { boxShadow: '0 0 0 10px rgba(76, 175, 80, 0)' },
            '100%': { boxShadow: '0 0 0 0 rgba(76, 175, 80, 0)' },
          },
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
      </Alert>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ bgcolor: '#e3f2fd' }}>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                Patient Monitor
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Monitor Abdeen's health status, activities, and well-being in real-time.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📊 Real-Time Monitoring
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Patient monitoring features will be displayed here, including:
              </Typography>
              <Box component="ul" sx={{ mt: 2 }}>
                <li>Live health metrics</li>
                <li>Activity tracking</li>
                <li>Medication adherence</li>
                <li>Meal completion status</li>
                <li>Sleep patterns</li>
              </Box>
            </CardContent>
          </Card>
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
    </Layout>
  );
};

export default PatientMonitorPage;
