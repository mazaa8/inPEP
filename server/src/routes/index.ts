import { Router } from 'express';
import authRoutes from './authRoutes.js';
import appointmentRoutes from './appointmentRoutes.js';
import messageRoutes from './messageRoutes.js';
import providerRoutes from './providerRoutes.js';
import healthRoutes from './healthRoutes.js';
import insurerRoutes from './insurerRoutes.js';
import herediblesRoutes from './herediblesRoutes.js';
import medicationRoutes from './medications.js';
import prescriptionRoutes from './prescriptions.js';
import medicationStockRoutes from './medicationStock.js';
import adherenceRoutes from './adherenceRoutes.js';

const router = Router();

// Health check endpoint (before health routes to avoid conflict)
router.get('/healthcheck', (_req, res) => {
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
router.use('/insurer', insurerRoutes);
router.use('/heredibles', herediblesRoutes);
router.use('/medications', medicationRoutes);
router.use('/prescriptions', prescriptionRoutes);
router.use('/medication-stock', medicationStockRoutes);
router.use('/adherence', adherenceRoutes);

export default router;
