import { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  Box,
  IconButton,
  Typography,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  CallEnd as EndCallIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Videocam as VideocamIcon,
  VideocamOff as VideocamOffIcon,
} from '@mui/icons-material';

interface VideoCallProps {
  open: boolean;
  isInitiator: boolean; // true if patient calling, false if caregiver answering
  remoteName: string;
  onEndCall: () => void;
  onOffer?: (offer: RTCSessionDescriptionInit) => void;
  onAnswer?: (answer: RTCSessionDescriptionInit) => void;
  onIceCandidate?: (candidate: RTCIceCandidate) => void;
  remoteOffer?: RTCSessionDescriptionInit | null;
  remoteAnswer?: RTCSessionDescriptionInit | null;
  remoteIceCandidate?: RTCIceCandidate | null;
}

const VideoCall = ({
  open,
  isInitiator,
  remoteName,
  onEndCall,
  onOffer,
  onAnswer,
  onIceCandidate,
  remoteOffer,
  remoteAnswer,
  remoteIceCandidate,
}: VideoCallProps) => {
  const [isConnecting, setIsConnecting] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (open) {
      initializeCall();
    } else {
      cleanup();
    }

    return () => cleanup();
  }, [open]);

  useEffect(() => {
    if (remoteOffer && peerConnectionRef.current && !isInitiator) {
      handleRemoteOffer(remoteOffer);
    }
  }, [remoteOffer]);

  useEffect(() => {
    if (remoteAnswer && peerConnectionRef.current && isInitiator) {
      handleRemoteAnswer(remoteAnswer);
    }
  }, [remoteAnswer]);

  useEffect(() => {
    if (remoteIceCandidate && peerConnectionRef.current) {
      handleRemoteIceCandidate(remoteIceCandidate);
    }
  }, [remoteIceCandidate]);

  const initializeCall = async () => {
    try {
      // Get local media stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStreamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Create peer connection
      const peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ],
      });

      peerConnectionRef.current = peerConnection;

      // Add local stream to peer connection
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream);
      });

      // Handle remote stream
      peerConnection.ontrack = (event) => {
        if (remoteVideoRef.current && event.streams[0]) {
          remoteVideoRef.current.srcObject = event.streams[0];
          setIsConnected(true);
          setIsConnecting(false);
        }
      };

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate && onIceCandidate) {
          onIceCandidate(event.candidate);
        }
      };

      // Handle connection state
      peerConnection.onconnectionstatechange = () => {
        console.log('Connection state:', peerConnection.connectionState);
        if (peerConnection.connectionState === 'connected') {
          setIsConnected(true);
          setIsConnecting(false);
        } else if (peerConnection.connectionState === 'disconnected' || 
                   peerConnection.connectionState === 'failed') {
          setIsConnected(false);
        }
      };

      // If initiator, create offer
      if (isInitiator) {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        if (onOffer) {
          onOffer(offer);
        }
      }
    } catch (error) {
      console.error('Failed to initialize call:', error);
      setIsConnecting(false);
    }
  };

  const handleRemoteOffer = async (offer: RTCSessionDescriptionInit) => {
    try {
      const peerConnection = peerConnectionRef.current;
      if (!peerConnection) return;

      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      
      if (onAnswer) {
        onAnswer(answer);
      }
    } catch (error) {
      console.error('Failed to handle remote offer:', error);
    }
  };

  const handleRemoteAnswer = async (answer: RTCSessionDescriptionInit) => {
    try {
      const peerConnection = peerConnectionRef.current;
      if (!peerConnection) return;

      await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (error) {
      console.error('Failed to handle remote answer:', error);
    }
  };

  const handleRemoteIceCandidate = async (candidate: RTCIceCandidate) => {
    try {
      const peerConnection = peerConnectionRef.current;
      if (!peerConnection) return;

      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error('Failed to add ICE candidate:', error);
    }
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  const cleanup = () => {
    // Stop all tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    setIsConnecting(true);
    setIsConnected(false);
  };

  const handleEndCall = () => {
    cleanup();
    onEndCall();
  };

  return (
    <Dialog open={open} maxWidth="md" fullWidth PaperProps={{ sx: { height: '80vh' } }}>
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#000' }}>
        {/* Header */}
        <Box sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.8)', color: 'white', zIndex: 10 }}>
          <Typography variant="h6">
            {isConnecting ? '📞 Connecting...' : isConnected ? `📹 Call with ${remoteName}` : '❌ Connection Failed'}
          </Typography>
        </Box>

        {/* Video Container */}
        <Box sx={{ flex: 1, position: 'relative', bgcolor: '#000' }}>
          {/* Remote Video (Large) */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              backgroundColor: '#1a1a1a',
            }}
          />

          {/* Connecting Indicator */}
          {isConnecting && (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                color: 'white',
              }}
            >
              <CircularProgress sx={{ color: 'white', mb: 2 }} />
              <Typography variant="body1">Connecting to {remoteName}...</Typography>
            </Box>
          )}

          {/* Local Video (Small, Picture-in-Picture) */}
          <Paper
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              width: 200,
              height: 150,
              overflow: 'hidden',
              borderRadius: 2,
              border: '2px solid white',
            }}
          >
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: 'scaleX(-1)', // Mirror effect
              }}
            />
            {isVideoOff && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  bgcolor: '#1a1a1a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                }}
              >
                <VideocamOffIcon sx={{ fontSize: 48 }} />
              </Box>
            )}
          </Paper>
        </Box>

        {/* Controls */}
        <Box
          sx={{
            p: 3,
            bgcolor: 'rgba(0,0,0,0.9)',
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <IconButton
            onClick={toggleMute}
            sx={{
              bgcolor: isMuted ? '#d32f2f' : 'rgba(255,255,255,0.2)',
              color: 'white',
              '&:hover': { bgcolor: isMuted ? '#b71c1c' : 'rgba(255,255,255,0.3)' },
              width: 56,
              height: 56,
            }}
          >
            {isMuted ? <MicOffIcon /> : <MicIcon />}
          </IconButton>

          <IconButton
            onClick={toggleVideo}
            sx={{
              bgcolor: isVideoOff ? '#d32f2f' : 'rgba(255,255,255,0.2)',
              color: 'white',
              '&:hover': { bgcolor: isVideoOff ? '#b71c1c' : 'rgba(255,255,255,0.3)' },
              width: 56,
              height: 56,
            }}
          >
            {isVideoOff ? <VideocamOffIcon /> : <VideocamIcon />}
          </IconButton>

          <IconButton
            onClick={handleEndCall}
            sx={{
              bgcolor: '#d32f2f',
              color: 'white',
              '&:hover': { bgcolor: '#b71c1c' },
              width: 56,
              height: 56,
            }}
          >
            <EndCallIcon />
          </IconButton>
        </Box>
      </Box>
    </Dialog>
  );
};

export default VideoCall;
