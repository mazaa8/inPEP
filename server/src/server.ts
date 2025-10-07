import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { config } from './config/env.js';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import prisma from './config/database.js';
import { initializeVideoCallService } from './services/videoCallService.js';
import { scheduleAggregation } from './services/adherenceAggregationService.js';

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (config.nodeEnv === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Initialize video call service
    initializeVideoCallService(httpServer);
    console.log('✅ Video call service initialized');

    // Start AI adherence tracking aggregation service
    scheduleAggregation();
    console.log('✅ AI Adherence Tracking service started (runs every 24 hours)');

    httpServer.listen(config.port, () => {
      console.log(`🚀 Server running on http://localhost:${config.port}`);
      console.log(`📝 Environment: ${config.nodeEnv}`);
      console.log(`🔗 Frontend URL: ${config.frontendUrl}`);
      console.log(`📹 WebRTC signaling enabled`);
      console.log(`\n📚 API Endpoints:`);
      console.log(`   GET  /api/health                          - Health check`);
      console.log(`   POST /api/auth/register                   - Register new user`);
      console.log(`   POST /api/auth/login                      - Login user`);
      console.log(`   GET  /api/auth/profile                    - Get user profile (protected)`);
      console.log(`   GET  /api/appointments                    - Get appointments (protected)`);
      console.log(`   POST /api/appointments                    - Create appointment (protected)`);
      console.log(`   GET  /api/messages/conversations          - Get conversations (protected)`);
      console.log(`   POST /api/messages/conversations          - Create conversation (protected)`);
      console.log(`   GET  /api/messages/conversations/:id/messages - Get messages (protected)`);
      console.log(`   POST /api/messages/messages               - Send message (protected)`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
