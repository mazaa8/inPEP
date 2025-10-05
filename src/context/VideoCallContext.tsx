import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface CallState {
  isInCall: boolean;
  callId: string | null;
  remoteName: string | null;
  remoteSocketId: string | null;
  isInitiator: boolean;
}

interface IncomingCall {
  callId: string;
  patientId: string;
  patientName: string;
  patientSocketId: string;
}

interface VideoCallContextType {
  socket: Socket | null;
  callState: CallState;
  incomingCall: IncomingCall | null;
  caregiverAvailable: boolean;
  initiateCall: (caregiverId: string, caregiverName: string) => void;
  acceptCall: () => void;
  declineCall: (reason?: string) => void;
  endCall: () => void;
  sendOffer: (offer: RTCSessionDescriptionInit) => void;
  sendAnswer: (answer: RTCSessionDescriptionInit) => void;
  sendIceCandidate: (candidate: RTCIceCandidate) => void;
  remoteOffer: RTCSessionDescriptionInit | null;
  remoteAnswer: RTCSessionDescriptionInit | null;
  remoteIceCandidate: RTCIceCandidate | null;
  updateAvailability: (isAvailable: boolean) => void;
}

const VideoCallContext = createContext<VideoCallContextType | undefined>(undefined);

export const VideoCallProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [callState, setCallState] = useState<CallState>({
    isInCall: false,
    callId: null,
    remoteName: null,
    remoteSocketId: null,
    isInitiator: false,
  });
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const [caregiverAvailable, setCaregiverAvailable] = useState(false);
  const [remoteOffer, setRemoteOffer] = useState<RTCSessionDescriptionInit | null>(null);
  const [remoteAnswer, setRemoteAnswer] = useState<RTCSessionDescriptionInit | null>(null);
  const [remoteIceCandidate, setRemoteIceCandidate] = useState<RTCIceCandidate | null>(null);

  useEffect(() => {
    if (!user) return;

    // Connect to Socket.io server
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('✅ Socket.io connected! Socket ID:', newSocket.id);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Socket.io disconnected');
    });

    // Register user
    console.log('📝 Registering user:', { userId: user.id, role: user.role, name: user.name });
    newSocket.emit('register', {
      userId: user.id,
      role: user.role,
      name: user.name,
    });

    // Listen for user status changes
    newSocket.on('user-status-changed', (data: { userId: string; isAvailable: boolean; role: string }) => {
      if (data.role === 'CAREGIVER' && data.isAvailable) {
        // If ANY caregiver comes online, set available to true
        setCaregiverAvailable(true);
      }
    });

    // Listen for incoming calls (caregiver only)
    newSocket.on('incoming-call', (data: IncomingCall) => {
      console.log('📞 INCOMING CALL EVENT RECEIVED:', data);
      setIncomingCall(data);
    });

    // Listen for call accepted (patient only)
    newSocket.on('call-accepted', (data: { callId: string; caregiverSocketId: string }) => {
      setCallState({
        isInCall: true,
        callId: data.callId,
        remoteName: 'Nora', // TODO: Get from data
        remoteSocketId: data.caregiverSocketId,
        isInitiator: true,
      });
    });

    // Listen for call declined
    newSocket.on('call-declined', (data: { reason: string }) => {
      alert(data.reason);
      setCallState({
        isInCall: false,
        callId: null,
        remoteName: null,
        remoteSocketId: null,
        isInitiator: false,
      });
    });

    // Listen for call ended
    newSocket.on('call-ended', () => {
      setCallState({
        isInCall: false,
        callId: null,
        remoteName: null,
        remoteSocketId: null,
        isInitiator: false,
      });
      setIncomingCall(null);
    });

    // WebRTC signaling
    newSocket.on('webrtc-offer', (data: { from: string; offer: RTCSessionDescriptionInit }) => {
      setRemoteOffer(data.offer);
    });

    newSocket.on('webrtc-answer', (data: { from: string; answer: RTCSessionDescriptionInit }) => {
      setRemoteAnswer(data.answer);
    });

    newSocket.on('webrtc-ice-candidate', (data: { from: string; candidate: RTCIceCandidate }) => {
      setRemoteIceCandidate(data.candidate);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  const initiateCall = (_caregiverId: string, caregiverName: string) => {
    if (!socket || !user) return;

    console.log('📞 Patient initiating call to:', caregiverName);

    // Immediately show calling state (no waiting)
    setCallState({
      isInCall: true, // Show calling dialog immediately
      callId: `call-${Date.now()}`,
      remoteName: caregiverName,
      remoteSocketId: null,
      isInitiator: true,
    });

    // Broadcast call to ALL caregivers
    // They will receive notification immediately
    console.log('📤 Emitting initiate-call event');
    socket.emit('initiate-call', {
      patientId: user.id,
      caregiverId: 'ANY_CAREGIVER',
      patientName: user.name,
    });
  };

  const acceptCall = () => {
    if (!socket || !incomingCall) return;

    socket.emit('accept-call', {
      callId: incomingCall.callId,
      patientSocketId: incomingCall.patientSocketId,
    });

    setCallState({
      isInCall: true,
      callId: incomingCall.callId,
      remoteName: incomingCall.patientName,
      remoteSocketId: incomingCall.patientSocketId,
      isInitiator: false,
    });

    setIncomingCall(null);
  };

  const declineCall = (reason?: string) => {
    if (!socket || !incomingCall) return;

    socket.emit('decline-call', {
      patientSocketId: incomingCall.patientSocketId,
      reason,
    });

    setIncomingCall(null);
  };

  const endCall = () => {
    if (!socket || !callState.callId) return;

    socket.emit('end-call', { callId: callState.callId });

    setCallState({
      isInCall: false,
      callId: null,
      remoteName: null,
      remoteSocketId: null,
      isInitiator: false,
    });
  };

  const sendOffer = (offer: RTCSessionDescriptionInit) => {
    if (!socket || !callState.remoteSocketId) return;
    socket.emit('webrtc-offer', { to: callState.remoteSocketId, offer });
  };

  const sendAnswer = (answer: RTCSessionDescriptionInit) => {
    if (!socket || !callState.remoteSocketId) return;
    socket.emit('webrtc-answer', { to: callState.remoteSocketId, answer });
  };

  const sendIceCandidate = (candidate: RTCIceCandidate) => {
    if (!socket || !callState.remoteSocketId) return;
    socket.emit('webrtc-ice-candidate', { to: callState.remoteSocketId, candidate });
  };

  const updateAvailability = (isAvailable: boolean) => {
    if (!socket || !user) return;
    socket.emit('update-availability', { userId: user.id, isAvailable });
  };

  return (
    <VideoCallContext.Provider
      value={{
        socket,
        callState,
        incomingCall,
        caregiverAvailable,
        initiateCall,
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
      }}
    >
      {children}
    </VideoCallContext.Provider>
  );
};

export const useVideoCall = () => {
  const context = useContext(VideoCallContext);
  if (!context) {
    throw new Error('useVideoCall must be used within VideoCallProvider');
  }
  return context;
};
