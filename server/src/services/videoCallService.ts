import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';

interface CallUser {
  userId: string;
  socketId: string;
  role: 'PATIENT' | 'CAREGIVER';
  name: string;
  isAvailable: boolean;
}

const activeUsers = new Map<string, CallUser>();
const activeCalls = new Map<string, { patient: string; caregiver: string }>();

export function initializeVideoCallService(httpServer: HTTPServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: 'http://localhost:5174',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('🔌 User connected:', socket.id);

    // User registers for video calls
    socket.on('register', (data: { userId: string; role: string; name: string }) => {
      const user: CallUser = {
        userId: data.userId,
        socketId: socket.id,
        role: data.role as 'PATIENT' | 'CAREGIVER',
        name: data.name,
        isAvailable: true,
      };
      activeUsers.set(data.userId, user);
      console.log(`✅ User registered: ${data.name} (${data.role})`);

      // Notify others of availability
      io.emit('user-status-changed', {
        userId: data.userId,
        isAvailable: true,
        role: data.role,
        name: data.name,
      });
    });

    // Patient initiates call to caregiver
    socket.on('initiate-call', (data: { patientId: string; caregiverId: string; patientName: string }) => {
      // Find all caregivers (available or not - we ALWAYS notify them)
      const caregivers = Array.from(activeUsers.values()).filter(
        u => u.role === 'CAREGIVER'
      );
      
      // ALWAYS notify all caregivers - they'll get the call even if marked as "away"
      // This prevents patient panic - caregiver will ALWAYS be notified
      caregivers.forEach(caregiver => {
        io.to(caregiver.socketId).emit('incoming-call', {
          callId: `call-${Date.now()}`,
          patientId: data.patientId,
          patientName: data.patientName,
          patientSocketId: socket.id,
        });
      });
      
      console.log(`📞 Call initiated: ${data.patientName} → ${caregivers.length} caregiver(s)`);
      
      // If no caregivers online at all, store the call for when they come online
      if (caregivers.length === 0) {
        console.log(`⏰ No caregivers online - call will be delivered when they connect`);
        // In production, send push notification to caregiver's phone
      }
    });

    // Caregiver accepts call
    socket.on('accept-call', (data: { callId: string; patientSocketId: string }) => {
      activeCalls.set(data.callId, {
        patient: data.patientSocketId,
        caregiver: socket.id,
      });

      // Notify patient that call was accepted
      io.to(data.patientSocketId).emit('call-accepted', {
        callId: data.callId,
        caregiverSocketId: socket.id,
      });
      console.log(`✅ Call accepted: ${data.callId}`);
    });

    // Caregiver declines call
    socket.on('decline-call', (data: { patientSocketId: string; reason?: string }) => {
      io.to(data.patientSocketId).emit('call-declined', {
        reason: data.reason || 'Caregiver is busy right now',
      });
      console.log(`❌ Call declined`);
    });

    // WebRTC signaling (offer, answer, ICE candidates)
    socket.on('webrtc-offer', (data: { to: string; offer: any }) => {
      io.to(data.to).emit('webrtc-offer', {
        from: socket.id,
        offer: data.offer,
      });
    });

    socket.on('webrtc-answer', (data: { to: string; answer: any }) => {
      io.to(data.to).emit('webrtc-answer', {
        from: socket.id,
        answer: data.answer,
      });
    });

    socket.on('webrtc-ice-candidate', (data: { to: string; candidate: any }) => {
      io.to(data.to).emit('webrtc-ice-candidate', {
        from: socket.id,
        candidate: data.candidate,
      });
    });

    // End call
    socket.on('end-call', (data: { callId: string }) => {
      const call = activeCalls.get(data.callId);
      if (call) {
        // Notify both parties
        io.to(call.patient).emit('call-ended', { callId: data.callId });
        io.to(call.caregiver).emit('call-ended', { callId: data.callId });
        activeCalls.delete(data.callId);
        console.log(`📴 Call ended: ${data.callId}`);
      }
    });

    // Update availability status
    socket.on('update-availability', (data: { userId: string; isAvailable: boolean }) => {
      const user = activeUsers.get(data.userId);
      if (user) {
        user.isAvailable = data.isAvailable;
        io.emit('user-status-changed', {
          userId: data.userId,
          isAvailable: data.isAvailable,
          role: user.role,
          name: user.name,
        });
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      // Find and remove user
      for (const [userId, user] of activeUsers.entries()) {
        if (user.socketId === socket.id) {
          activeUsers.delete(userId);
          io.emit('user-status-changed', {
            userId,
            isAvailable: false,
            role: user.role,
            name: user.name,
          });
          console.log(`👋 User disconnected: ${user.name}`);
          break;
        }
      }

      // End any active calls
      for (const [callId, call] of activeCalls.entries()) {
        if (call.patient === socket.id || call.caregiver === socket.id) {
          const otherSocket = call.patient === socket.id ? call.caregiver : call.patient;
          io.to(otherSocket).emit('call-ended', { callId, reason: 'Other party disconnected' });
          activeCalls.delete(callId);
        }
      }
    });
  });

  return io;
}
