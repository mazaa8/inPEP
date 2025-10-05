import { Router } from 'express';
import { getProviders } from '../controllers/providerController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Get all providers (requires authentication)
router.get('/', authenticate, getProviders);

export default router;
