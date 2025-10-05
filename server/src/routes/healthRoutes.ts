import { Router } from 'express';
import {
  getHealthMetrics,
  addHealthMetric,
  generateInsights,
  getHealthInsights,
  markInsightRead,
  dismissInsight,
} from '../controllers/healthController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Health Metrics
router.get('/metrics', getHealthMetrics);
router.post('/metrics', addHealthMetric);

// AI Insights
router.post('/insights/generate/:patientId?', generateInsights);
router.get('/insights', getHealthInsights);
router.patch('/insights/:id/read', markInsightRead);
router.patch('/insights/:id/dismiss', dismissInsight);

export default router;
