import { Router } from 'express';
import authRoutes from './authRoutes.js';
import appointmentRoutes from './appointmentRoutes.js';
import messageRoutes from './messageRoutes.js';
import providerRoutes from './providerRoutes.js';
import healthRoutes from './healthRoutes.js';

const router = Router();

// Health check endpoint (before health routes to avoid conflict)
router.get('/healthcheck', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/messages', messageRoutes);
router.use('/providers', providerRoutes);
router.use('/health', healthRoutes);

export default router;
