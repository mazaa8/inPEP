import { Router } from 'express';
import {
  getDashboardOverview,
  getClaims,
  getRiskAssessments,
  getPopulationHealth,
  getCostAnalytics,
} from '../controllers/insurerController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Dashboard overview
router.get('/dashboard/overview', getDashboardOverview);

// Claims
router.get('/claims', getClaims);

// Risk assessments
router.get('/risk-assessments', getRiskAssessments);

// Population health
router.get('/population-health', getPopulationHealth);

// Cost analytics
router.get('/cost-analytics', getCostAnalytics);

export default router;
